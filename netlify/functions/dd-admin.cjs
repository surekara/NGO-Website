// Digital Daan — admin API. Every action except `login` requires a valid admin session token.
const { query, one } = require('../lib/digital-daan/db.cjs');
const { ensureSchema, refreshSearchText } = require('../lib/digital-daan/schema.cjs');
const { json, noStore, parseBody, rateLimit, handle, fail } = require('../lib/digital-daan/http.cjs');
const { login, requireAdmin } = require('../lib/digital-daan/auth.cjs');
const { FORMATS, AUDIENCES, LANGUAGES, RESOURCE_STATUSES } = require('../lib/digital-daan/taxonomy.cjs');
const V = require('../lib/digital-daan/validate.cjs');
const { uniqueSlug } = require('../lib/digital-daan/slugs.cjs');
const { dateOnly } = require('../lib/digital-daan/serialize.cjs');

const ok = (body) => json(200, body, noStore);
const PUBLIC_FIELDS = ['name', 'photo', 'designation', 'organisation', 'linkedin', 'bio'];
const ids = (v) => (Array.isArray(v) ? [...new Set(v.map((x) => parseInt(x, 10)).filter(Number.isFinite))] : []);
const urlOrFail = (value, check, label) => {
  if (!value) return null;
  const clean = check(value);
  if (!clean) throw fail(400, `${label} is not a valid link`);
  return clean;
};

const options = async () => {
  const [categories, activities, campaigns, collections, contributors, storage] = await Promise.all([
    query(`SELECT id, slug, name, is_active FROM dd_categories ORDER BY sort_order, name`),
    query(`SELECT id, slug, name, number FROM dd_activities ORDER BY number`),
    query(`SELECT id, slug, name, short_name, status FROM dd_campaigns ORDER BY start_date DESC NULLS LAST`),
    query(`SELECT id, slug, name FROM dd_collections ORDER BY sort_order, name`),
    query(`SELECT id, name, email, status FROM dd_contributors ORDER BY name`),
    query(`SELECT key, label, drive_url FROM dd_storage_folders ORDER BY sort_order`),
  ]);
  return { categories, activities, campaigns, collections, contributors, storage, formats: FORMATS, audiences: AUDIENCES, languages: LANGUAGES, statuses: RESOURCE_STATUSES };
};

const overview = async () => {
  const [counts, recentSubmissions, views, topSearches, topResources, demo] = await Promise.all([
    query(`SELECT status, COUNT(*)::int AS n FROM dd_resources GROUP BY status`),
    query(`SELECT r.id, r.title, r.created_at, ct.name AS contributor_name FROM dd_resources r LEFT JOIN dd_contributors ct ON ct.id = r.contributor_id
           WHERE r.status = 'under_review' ORDER BY r.created_at DESC LIMIT 8`),
    one(`SELECT COUNT(*) FILTER (WHERE event_type = 'view')::int AS views, COUNT(*) FILTER (WHERE event_type = 'share')::int AS shares,
                COUNT(*) FILTER (WHERE event_type = 'video_open')::int AS video_opens, COUNT(*) FILTER (WHERE event_type = 'search')::int AS searches
         FROM dd_events WHERE created_at > NOW() - INTERVAL '30 days'`),
    query(`SELECT LOWER(meta->>'term') AS term, COUNT(*)::int AS n FROM dd_events WHERE event_type = 'search' AND created_at > NOW() - INTERVAL '30 days'
           AND meta->>'term' IS NOT NULL GROUP BY 1 ORDER BY n DESC LIMIT 8`),
    query(`SELECT slug, title, view_count, share_count FROM dd_resources WHERE status = 'published' ORDER BY view_count DESC LIMIT 5`),
    one(`SELECT COUNT(*)::int AS n FROM dd_resources WHERE is_demo`),
  ]);
  return { counts: Object.fromEntries(counts.map((c) => [c.status, c.n])), recentSubmissions, activity: views, topSearches, topResources, demoCount: demo.n };
};

const listResources = async (p) => {
  const values = [];
  const where = ['TRUE'];
  if (p.status && RESOURCE_STATUSES.includes(p.status)) { values.push(p.status); where.push(`r.status = $${values.length}`); }
  if (p.q) { values.push(`%${String(p.q).slice(0, 100)}%`); where.push(`(r.title ILIKE $${values.length} OR ct.name ILIKE $${values.length} OR ct.email ILIKE $${values.length})`); }
  if (p.featured) where.push('r.featured');
  const page = V.toInt(p.page, 1, 1, 1000);
  values.push(25, (page - 1) * 25);
  const rows = await query(
    `SELECT r.id, r.slug, r.title, r.status, r.featured, r.content_type, r.language, r.is_demo, r.updated_at, r.published_at, r.created_at,
            r.submission->>'kind' AS submission_kind, c.name AS category_name, a.name AS activity_name, ct.name AS contributor_name,
            COUNT(*) OVER() AS total_count
     FROM dd_resources r LEFT JOIN dd_categories c ON c.id = r.category_id LEFT JOIN dd_activities a ON a.id = r.activity_id
     LEFT JOIN dd_contributors ct ON ct.id = r.contributor_id
     WHERE ${where.join(' AND ')} ORDER BY r.updated_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values,
  );
  const total = rows.length ? Number(rows[0].total_count) : 0;
  return { items: rows.map(({ total_count, ...r }) => r), total, page, hasMore: page * 25 < total };
};

const getResource = async (id) => {
  const row = await one(`SELECT r.*, NULL AS search_vector FROM dd_resources r WHERE r.id = $1`, [id]);
  if (!row) throw fail(404, 'Resource not found');
  const [campaigns, collections, contributor] = await Promise.all([
    query(`SELECT campaign_id FROM dd_resource_campaigns WHERE resource_id = $1`, [id]),
    query(`SELECT collection_id FROM dd_collection_resources WHERE resource_id = $1`, [id]),
    row.contributor_id ? one(`SELECT * FROM dd_contributors WHERE id = $1`, [row.contributor_id]) : null,
  ]);
  delete row.search_vector;
  delete row.search_text;
  return { resource: { ...row, campaign_ids: campaigns.map((c) => c.campaign_id), collection_ids: collections.map((c) => c.collection_id) }, contributor };
};

const saveResource = async (input) => {
  const id = input.id ? V.toInt(input.id) : null;
  const existing = id ? await one(`SELECT id, status, published_at FROM dd_resources WHERE id = $1`, [id]) : null;
  if (id && !existing) throw fail(404, 'Resource not found');

  const title = V.cleanText(input.title, 200);
  if (!title) throw fail(400, 'Title is required');
  const status = RESOURCE_STATUSES.includes(input.status) ? input.status : 'draft';
  const shortDescription = V.cleanText(input.short_description, 400);
  const categoryId = V.toInt(input.category_id);
  if (status === 'published' && (!shortDescription || !categoryId)) throw fail(400, 'A short description and category are required before publishing');

  const slug = await uniqueSlug('dd_resources', input.slug || title, id, 'resource');
  const quiz = V.cleanQuiz(input.quiz);
  const values = [
    slug, title, shortDescription, V.cleanLongText(input.detailed_description, 5000), V.cleanLongText(input.body, 50000),
    quiz ? JSON.stringify(quiz) : null, V.cleanLongText(input.transcript, 50000),
    categoryId, V.toInt(input.activity_id), FORMATS.some((f) => f.slug === input.content_type) ? input.content_type : 'resource',
    V.cleanList(input.audiences, AUDIENCES.map((a) => a.slug)), LANGUAGES.some((l) => l.slug === input.language) ? input.language : 'en',
    V.toInt(input.duration_minutes, null, 0, 600),
    urlOrFail(input.thumbnail_url, V.httpsUrl, 'Thumbnail URL'), urlOrFail(input.drive_url, V.driveUrl, 'Google Drive URL'),
    urlOrFail(input.youtube_url, V.youtubeUrl, 'YouTube URL'), urlOrFail(input.external_url, V.httpsUrl, 'External URL'),
    V.cleanText(input.storage_folder, 60), V.toInt(input.contributor_id), V.cleanTags(input.tags), status, !!input.featured,
    V.toInt(input.featured_rank, 100, 0, 1000), V.cleanLongText(input.review_notes, 2000),
  ];
  const cols = `slug, title, short_description, detailed_description, body, quiz, transcript, category_id, activity_id, content_type, audiences, language,
    duration_minutes, thumbnail_url, drive_url, youtube_url, external_url, storage_folder, contributor_id, tags, status, featured, featured_rank, review_notes`;
  let resourceId = id;
  if (id) {
    const sets = cols.split(',').map((c, i) => `${c.trim()} = $${i + 2}`).join(', ');
    await query(
      `UPDATE dd_resources SET ${sets}, updated_at = NOW(),
         published_at = CASE WHEN $22::varchar = 'published' AND published_at IS NULL THEN NOW() ELSE published_at END
       WHERE id = $1`,
      [id, ...values],
    );
  } else {
    const row = await one(
      `INSERT INTO dd_resources (${cols}, published_at) VALUES (${values.map((_, i) => `$${i + 1}`).join(',')}, CASE WHEN $21::varchar = 'published' THEN NOW() END) RETURNING id`,
      values,
    );
    resourceId = row.id;
  }

  const campaignIds = ids(input.campaign_ids);
  await query(`DELETE FROM dd_resource_campaigns WHERE resource_id = $1 AND NOT (campaign_id = ANY($2::int[]))`, [resourceId, campaignIds]);
  for (const cid of campaignIds) await query(`INSERT INTO dd_resource_campaigns VALUES ($1,$2) ON CONFLICT DO NOTHING`, [resourceId, cid]);
  const collectionIds = ids(input.collection_ids);
  await query(`DELETE FROM dd_collection_resources WHERE resource_id = $1 AND NOT (collection_id = ANY($2::int[]))`, [resourceId, collectionIds]);
  for (const cid of collectionIds) await query(`INSERT INTO dd_collection_resources (collection_id, resource_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [cid, resourceId]);

  if (status === 'published') await approveContributorOf(resourceId);
  await refreshSearchText('r.id = $1', [resourceId]);
  return getResource(resourceId);
};

// Publishing a contribution approves the contributor's profile (with the permissions they chose).
const approveContributorOf = (resourceId) =>
  query(`UPDATE dd_contributors SET status = 'approved', updated_at = NOW() WHERE status = 'pending' AND id = (SELECT contributor_id FROM dd_resources WHERE id = $1)`, [resourceId]);

const setStatus = async ({ id, status, review_notes }) => {
  if (!RESOURCE_STATUSES.includes(status)) throw fail(400, 'Invalid status');
  const row = await one(`SELECT id, short_description, category_id FROM dd_resources WHERE id = $1`, [V.toInt(id)]);
  if (!row) throw fail(404, 'Resource not found');
  if (status === 'published' && (!row.short_description || !row.category_id)) throw fail(400, 'Add a short description and category before publishing');
  await query(
    `UPDATE dd_resources SET status = $2::varchar, review_notes = COALESCE($3::text, review_notes), updated_at = NOW(),
       published_at = CASE WHEN $2::varchar = 'published' AND published_at IS NULL THEN NOW() ELSE published_at END
     WHERE id = $1`,
    [row.id, status, V.cleanLongText(review_notes, 2000)],
  );
  if (status === 'published') await approveContributorOf(row.id);
  return { ok: true };
};

const deleteResource = async ({ id }) => {
  const row = await one(`SELECT status FROM dd_resources WHERE id = $1`, [V.toInt(id)]);
  if (!row) throw fail(404, 'Resource not found');
  if (row.status === 'published') throw fail(400, 'Unpublish or archive a resource before deleting it');
  await query(`DELETE FROM dd_resources WHERE id = $1`, [V.toInt(id)]);
  return { ok: true };
};

const listContributors = async (p) => {
  const values = [];
  let where = 'TRUE';
  if (p.q) { values.push(`%${String(p.q).slice(0, 100)}%`); where = `(ct.name ILIKE $1 OR ct.email ILIKE $1 OR ct.organisation ILIKE $1)`; }
  const rows = await query(
    `SELECT ct.*, COUNT(r.id)::int AS resource_count, COUNT(r.id) FILTER (WHERE r.status = 'published')::int AS published_count
     FROM dd_contributors ct LEFT JOIN dd_resources r ON r.contributor_id = ct.id
     WHERE ${where} GROUP BY ct.id ORDER BY ct.created_at DESC LIMIT 200`,
    values,
  );
  return { items: rows };
};

const saveContributor = async (input) => {
  const id = input.id ? V.toInt(input.id) : null;
  const name = V.cleanText(input.name, 160);
  if (!name) throw fail(400, 'Name is required');
  const email = input.email ? (V.isEmail(input.email) ? input.email.trim().toLowerCase() : null) : null;
  if (input.email && !email) throw fail(400, 'Email is not valid');
  const publicFields = Object.fromEntries(PUBLIC_FIELDS.map((f) => [f, !!(input.public_fields && input.public_fields[f])]));
  const slug = await uniqueSlug('dd_contributors', input.slug || name, id, 'volunteer');
  const values = [
    slug, name, email, V.cleanText(input.organisation, 160), V.cleanText(input.designation, 160), V.cleanText(input.expertise, 240),
    V.cleanText(input.bio, 1200), urlOrFail(input.photo_url, V.httpsUrl, 'Photo URL'), urlOrFail(input.linkedin_url, V.linkedinUrl, 'LinkedIn URL'),
    JSON.stringify(publicFields), ['pending', 'approved', 'hidden'].includes(input.status) ? input.status : 'approved',
  ];
  let row;
  if (id) {
    row = await one(
      `UPDATE dd_contributors SET slug=$2, name=$3, email=$4, organisation=$5, designation=$6, expertise=$7, bio=$8, photo_url=$9, linkedin_url=$10,
         public_fields=$11, status=$12, updated_at=NOW() WHERE id=$1 RETURNING *`,
      [id, ...values],
    );
    if (!row) throw fail(404, 'Contributor not found');
    await refreshSearchText('r.contributor_id = $1', [id]);
  } else {
    row = await one(
      `INSERT INTO dd_contributors (slug, name, email, organisation, designation, expertise, bio, photo_url, linkedin_url, public_fields, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      values,
    );
  }
  return { contributor: row };
};

const saveCampaign = async (input) => {
  const id = input.id ? V.toInt(input.id) : null;
  const name = V.cleanText(input.name, 200);
  if (!name) throw fail(400, 'Campaign name is required');
  const date = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null);
  const slug = await uniqueSlug('dd_campaigns', input.slug || name, id, 'campaign');
  const values = [
    slug, name, V.cleanText(input.short_name, 120), V.cleanText(input.tagline, 300), V.cleanLongText(input.description, 5000), V.cleanText(input.partner, 160),
    date(input.start_date), date(input.end_date), input.status === 'published' ? 'published' : 'draft', !!input.featured,
    urlOrFail(input.hero_image_url, V.httpsUrl, 'Hero image URL'),
  ];
  const row = id
    ? await one(
        `UPDATE dd_campaigns SET slug=$2, name=$3, short_name=$4, tagline=$5, description=$6, partner=$7, start_date=$8, end_date=$9, status=$10,
           featured=$11, hero_image_url=$12, updated_at=NOW() WHERE id=$1 RETURNING *`,
        [id, ...values],
      )
    : await one(
        `INSERT INTO dd_campaigns (slug, name, short_name, tagline, description, partner, start_date, end_date, status, featured, hero_image_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
        values,
      );
  return { campaign: { ...row, start_date: dateOnly(row.start_date), end_date: dateOnly(row.end_date) } };
};

const saveCollection = async (input) => {
  const id = input.id ? V.toInt(input.id) : null;
  const name = V.cleanText(input.name, 160);
  if (!name) throw fail(400, 'Collection name is required');
  const slug = await uniqueSlug('dd_collections', input.slug || name, id, 'collection');
  const values = [slug, name, V.cleanText(input.description, 600), V.toInt(input.sort_order, 100), input.is_active !== false];
  const row = id
    ? await one(`UPDATE dd_collections SET slug=$2, name=$3, description=$4, sort_order=$5, is_active=$6 WHERE id=$1 RETURNING *`, [id, ...values])
    : await one(`INSERT INTO dd_collections (slug, name, description, sort_order, is_active) VALUES ($1,$2,$3,$4,$5) RETURNING *`, values);
  if (Array.isArray(input.resource_ids)) {
    const list = ids(input.resource_ids);
    await query(`DELETE FROM dd_collection_resources WHERE collection_id = $1`, [row.id]);
    for (const [pos, rid] of list.entries()) await query(`INSERT INTO dd_collection_resources VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`, [row.id, rid, pos]);
  }
  return { collection: row };
};

const saveCategory = async (input) => {
  const id = input.id ? V.toInt(input.id) : null;
  const name = V.cleanText(input.name, 120);
  if (!name) throw fail(400, 'Category name is required');
  const slug = await uniqueSlug('dd_categories', input.slug || name, id, 'category');
  const color = /^#[0-9a-fA-F]{6}$/.test(input.color || '') ? input.color : '#64748B';
  const values = [slug, name, V.cleanText(input.description, 400), V.cleanLongText(input.intro, 2000), V.cleanText(input.icon, 40) || 'layers', color, V.toInt(input.sort_order, 100), input.is_active !== false];
  const row = id
    ? await one(`UPDATE dd_categories SET slug=$2, name=$3, description=$4, intro=$5, icon=$6, color=$7, sort_order=$8, is_active=$9 WHERE id=$1 RETURNING *`, [id, ...values])
    : await one(`INSERT INTO dd_categories (slug, name, description, intro, icon, color, sort_order, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, values);
  await refreshSearchText('r.category_id = $1', [row.id]);
  return { category: row };
};

const saveMetrics = async ({ metrics }) => {
  for (const m of Array.isArray(metrics) ? metrics.slice(0, 20) : []) {
    const key = V.slugify(m.key).replace(/-/g, '_');
    const label = V.cleanText(m.label, 120);
    if (!key || !label) continue;
    await query(
      `INSERT INTO dd_metrics (key, label, mode, value, suffix, is_visible, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (key) DO UPDATE SET label=$2, mode=$3, value=$4, suffix=$5, is_visible=$6, sort_order=$7`,
      [key, label, m.mode === 'auto' ? 'auto' : 'manual', Number(m.value) || 0, V.cleanText(m.suffix, 10) || '', m.is_visible !== false, V.toInt(m.sort_order, 100)],
    );
  }
  return { metrics: await query(`SELECT * FROM dd_metrics ORDER BY sort_order`) };
};

const saveStorage = async ({ folders }) => {
  for (const f of Array.isArray(folders) ? folders.slice(0, 50) : []) {
    const key = V.slugify(f.key);
    const label = V.cleanText(f.label, 160);
    if (!key || !label) continue;
    await query(
      `INSERT INTO dd_storage_folders (key, label, drive_url, notes, sort_order) VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (key) DO UPDATE SET label=$2, drive_url=$3, notes=$4, sort_order=$5`,
      [key, label, urlOrFail(f.drive_url, V.driveUrl, `Drive link for "${label}"`), V.cleanText(f.notes, 400), V.toInt(f.sort_order, 100)],
    );
  }
  return { folders: await query(`SELECT * FROM dd_storage_folders ORDER BY sort_order`) };
};

const removeDemo = async () => {
  await query(`DELETE FROM dd_resources WHERE is_demo`);
  await query(`DELETE FROM dd_contributors WHERE is_demo AND NOT EXISTS (SELECT 1 FROM dd_resources r WHERE r.contributor_id = dd_contributors.id)`);
  return { ok: true };
};

const ACTIONS = {
  overview, options, listResources, listContributors, saveResource, setStatus, deleteResource, saveContributor, saveCampaign,
  saveCollection, saveCategory, saveMetrics, saveStorage, removeDemo,
  getResource: (p) => getResource(V.toInt(p.id)),
  getContributor: async (p) => ({ contributor: await one(`SELECT * FROM dd_contributors WHERE id = $1`, [V.toInt(p.id)]) }),
  listCampaigns: async () => ({
    items: (await query(`SELECT cp.*, (SELECT COUNT(*)::int FROM dd_resource_campaigns rc WHERE rc.campaign_id = cp.id) AS resource_count FROM dd_campaigns cp ORDER BY start_date DESC NULLS LAST`))
      .map((c) => ({ ...c, start_date: dateOnly(c.start_date), end_date: dateOnly(c.end_date) })),
  }),
  listCollections: async () => ({ items: await query(`SELECT co.*, COALESCE((SELECT ARRAY_AGG(resource_id ORDER BY position) FROM dd_collection_resources WHERE collection_id = co.id), '{}') AS resource_ids FROM dd_collections co ORDER BY sort_order, name`) }),
  listCategories: async () => ({ items: await query(`SELECT c.*, (SELECT COUNT(*)::int FROM dd_resources r WHERE r.category_id = c.id) AS resource_count FROM dd_categories c ORDER BY sort_order, name`) }),
  listMetrics: async () => ({ metrics: await query(`SELECT * FROM dd_metrics ORDER BY sort_order`) }),
  listStorage: async () => ({ folders: await query(`SELECT * FROM dd_storage_folders ORDER BY sort_order`) }),
};

exports.handler = handle(async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' }, noStore);
  const body = parseBody(event);
  await ensureSchema();

  if (body.action === 'login') {
    if (!(await rateLimit(event, 'admin-login', 10, 15))) throw fail(429, 'Too many attempts. Please wait 15 minutes.');
    return ok(login(body.password));
  }

  requireAdmin(event);
  const fn = ACTIONS[body.action];
  if (!fn) throw fail(400, 'Unknown action');
  return ok(await fn(body.payload || {}));
});
