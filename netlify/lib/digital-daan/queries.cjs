const { query, one } = require('./db.cjs');
const S = require('./serialize.cjs');
const { toInt } = require('./validate.cjs');

const list = (v) => (v ? String(v).split(',').map((x) => x.trim()).filter(Boolean).slice(0, 12) : []);

const searchTerms = (q) =>
  String(q || '')
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.replace(/[^\p{L}\p{N}\p{M}]/gu, ''))
    .filter(Boolean)
    .slice(0, 8);

// Builds a parameterised WHERE clause for published resources from public filter params.
const buildFilters = (p) => {
  const where = [`r.status = 'published'`];
  const values = [];
  const add = (sql, v) => {
    values.push(v);
    where.push(sql.replace(/\$\?/g, `$${values.length}`));
  };
  const terms = searchTerms(p.q);
  let rankExpr = null;
  if (terms.length) {
    values.push(terms.map((t) => `${t}:*`).join(' & '));
    const tsIdx = values.length;
    values.push(terms.map((t) => `%${t}%`));
    where.push(`(r.search_vector @@ to_tsquery('simple', $${tsIdx}) OR r.search_text ILIKE ALL($${values.length}))`);
    rankExpr = `ts_rank(r.search_vector, to_tsquery('simple', $${tsIdx})) + CASE WHEN r.title ILIKE ALL($${values.length}) THEN 1 ELSE 0 END`;
  }
  if (list(p.category).length) add(`c.slug = ANY($?)`, list(p.category));
  if (list(p.activity).length) add(`a.slug = ANY($?)`, list(p.activity));
  if (list(p.format).length) add(`r.content_type = ANY($?)`, list(p.format));
  if (list(p.audience).length) add(`r.audiences && $?::text[]`, list(p.audience));
  if (list(p.language).length) add(`r.language = ANY($?)`, list(p.language));
  if (p.tag) add(`$? = ANY(r.tags)`, String(p.tag).toLowerCase());
  if (p.contributor) add(`ct.slug = $? AND ct.status = 'approved' AND COALESCE((ct.public_fields->>'name')::boolean, false)`, String(p.contributor));
  if (p.campaign) add(`EXISTS (SELECT 1 FROM dd_resource_campaigns rc JOIN dd_campaigns cp ON cp.id = rc.campaign_id WHERE rc.resource_id = r.id AND cp.slug = $? AND cp.status = 'published')`, String(p.campaign));
  if (p.collection) add(`EXISTS (SELECT 1 FROM dd_collection_resources cr JOIN dd_collections co ON co.id = cr.collection_id WHERE cr.resource_id = r.id AND co.slug = $? AND co.is_active)`, String(p.collection));
  if (p.featured === 'true') where.push('r.featured');
  return { where: where.join(' AND '), values, rankExpr };
};

const ORDER = {
  latest: 'r.published_at DESC NULLS LAST, r.id DESC',
  popular: 'r.view_count DESC, r.published_at DESC',
  shortest: 'r.duration_minutes ASC NULLS LAST, r.published_at DESC',
};

const searchResources = async (p) => {
  const pageSize = toInt(p.limit, 12, 1, 48);
  const page = toInt(p.page, 1, 1, 1000);
  const { where, values, rankExpr } = buildFilters(p);
  const sort = p.sort && (ORDER[p.sort] || p.sort === 'relevance') ? p.sort : rankExpr ? 'relevance' : 'latest';
  const order = sort === 'relevance' && rankExpr ? `${rankExpr} DESC, r.published_at DESC` : ORDER[sort] || ORDER.latest;
  values.push(pageSize, (page - 1) * pageSize);
  const rows = await query(
    `SELECT ${S.CARD_COLUMNS}, COUNT(*) OVER() AS total_count ${S.JOINS}
     WHERE ${where} ORDER BY ${order} LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values,
  );
  const total = rows.length ? Number(rows[0].total_count) : 0;
  return { items: rows.map(S.card), total, page, pageSize, hasMore: page * pageSize < total, sort };
};

const featuredResources = async (limit = 5, extraWhere = 'TRUE', params = []) => {
  const rows = await query(
    `SELECT ${S.CARD_COLUMNS} ${S.JOINS}
     WHERE r.status = 'published' AND ${extraWhere}
     ORDER BY r.featured DESC, r.featured_rank ASC, r.published_at DESC LIMIT ${Number(limit)}`,
    params,
  );
  return rows.map(S.card);
};

const campaignsForResource = async (id) =>
  (await query(
    `SELECT cp.* FROM dd_campaigns cp JOIN dd_resource_campaigns rc ON rc.campaign_id = cp.id
     WHERE rc.resource_id = $1 AND cp.status = 'published' ORDER BY cp.start_date DESC NULLS LAST`,
    [id],
  )).map(S.campaign).map(({ slug, name, short_name, partner, phase }) => ({ slug, name, short_name, partner, phase }));

const getResource = async (slug, { includeUnpublished = false } = {}) => {
  const row = await one(
    `SELECT ${S.DETAIL_COLUMNS}, r.category_id, r.activity_id ${S.JOINS}
     WHERE r.slug = $1 ${includeUnpublished ? '' : `AND r.status = 'published'`}`,
    [slug],
  );
  if (!row) return null;
  return { row, resource: S.detail(row, await campaignsForResource(row.id)) };
};

const relatedResources = async (row, limit = 6) => {
  const rows = await query(
    `SELECT ${S.CARD_COLUMNS},
       (CASE WHEN r.category_id = $2 THEN 3 ELSE 0 END
        + CASE WHEN r.activity_id = $3 THEN 2 ELSE 0 END
        + cardinality(ARRAY(SELECT unnest(r.tags) INTERSECT SELECT unnest($4::text[])))
        + CASE WHEN r.audiences && $5::text[] THEN 1 ELSE 0 END
        + CASE WHEN r.language = $6 THEN 1 ELSE 0 END) AS score
     ${S.JOINS}
     WHERE r.status = 'published' AND r.id <> $1
     ORDER BY score DESC, r.published_at DESC LIMIT ${Number(limit)}`,
    [row.id, row.category_id, row.activity_id, row.tags || [], row.audiences || [], row.language],
  );
  return rows.map(S.card);
};

const computeStats = async (campaignSlug = null) => {
  const filter = campaignSlug
    ? `AND EXISTS (SELECT 1 FROM dd_resource_campaigns rc JOIN dd_campaigns cp ON cp.id = rc.campaign_id WHERE rc.resource_id = r.id AND cp.slug = $1)`
    : '';
  const auto = await one(
    `SELECT COUNT(*)::int AS resources, COUNT(DISTINCT r.contributor_id)::int AS contributors,
            COALESCE(SUM(r.duration_minutes), 0)::int AS minutes, COUNT(DISTINCT r.language)::int AS languages
     FROM dd_resources r WHERE r.status = 'published' ${filter}`,
    campaignSlug ? [campaignSlug] : [],
  );
  const autoValues = { resources: auto.resources, contributors: auto.contributors, learning_hours: Math.ceil(auto.minutes / 60), languages: auto.languages };
  const metrics = await query(`SELECT * FROM dd_metrics WHERE is_visible ORDER BY sort_order`);
  return metrics
    .map((m) => ({ key: m.key, label: m.label, suffix: m.suffix || '', value: m.mode === 'auto' && m.key in autoValues ? autoValues[m.key] : Number(m.value) || 0 }))
    .filter((m) => m.value > 0 || m.key in autoValues);
};

const publicContributors = async (limit = 200, campaignSlug = null) => {
  const rows = await query(
    `SELECT ct.*, COUNT(r.id)::int AS resource_count,
            ARRAY_REMOVE(ARRAY_AGG(DISTINCT c.name), NULL) AS categories
     FROM dd_contributors ct
     JOIN dd_resources r ON r.contributor_id = ct.id AND r.status = 'published'
     LEFT JOIN dd_categories c ON c.id = r.category_id
     WHERE ct.status = 'approved' AND COALESCE((ct.public_fields->>'name')::boolean, false)
     ${campaignSlug ? `AND EXISTS (SELECT 1 FROM dd_resource_campaigns rc JOIN dd_campaigns cp ON cp.id = rc.campaign_id WHERE rc.resource_id = r.id AND cp.slug = $1)` : ''}
     GROUP BY ct.id ORDER BY resource_count DESC, ct.name ASC LIMIT ${Number(limit)}`,
    campaignSlug ? [campaignSlug] : [],
  );
  return rows.map((row) => ({ ...S.publicContributor(row), resource_count: row.resource_count, categories: row.categories }));
};

module.exports = { searchResources, featuredResources, getResource, relatedResources, computeStats, publicContributors, campaignsForResource };
