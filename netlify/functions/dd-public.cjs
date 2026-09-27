// Digital Daan — public read API. Only published content is ever returned.
const { query, one } = require('../lib/digital-daan/db.cjs');
const { ensureSchema } = require('../lib/digital-daan/schema.cjs');
const { cached, json, noStore, handle, fail } = require('../lib/digital-daan/http.cjs');
const { FORMATS, AUDIENCES, LANGUAGES } = require('../lib/digital-daan/taxonomy.cjs');
const S = require('../lib/digital-daan/serialize.cjs');
const Q = require('../lib/digital-daan/queries.cjs');

const SITE = 'https://prachetasfoundation.com';

const activityRow = (a) => ({
  slug: a.slug, number: a.number, name: a.name, tagline: a.tagline, description: a.description,
  formats: a.formats || [], topics: a.topics || [], icon: a.icon, color: a.color, resource_count: a.resource_count ?? undefined,
});

const categoryRow = (c) => ({
  slug: c.slug, name: c.name, description: c.description, intro: c.intro, icon: c.icon, color: c.color, resource_count: c.resource_count ?? undefined,
});

const taxonomy = async () => {
  const [categories, activities, campaigns, collections, langCounts] = await Promise.all([
    query(`SELECT c.*, (SELECT COUNT(*)::int FROM dd_resources r WHERE r.category_id = c.id AND r.status = 'published') AS resource_count
           FROM dd_categories c WHERE c.is_active ORDER BY c.sort_order, c.name`),
    query(`SELECT a.*, (SELECT COUNT(*)::int FROM dd_resources r WHERE r.activity_id = a.id AND r.status = 'published') AS resource_count
           FROM dd_activities a WHERE a.is_active ORDER BY a.number`),
    query(`SELECT * FROM dd_campaigns WHERE status = 'published' ORDER BY start_date DESC NULLS LAST`),
    query(`SELECT co.slug, co.name, co.description,
             (SELECT COUNT(*)::int FROM dd_collection_resources cr JOIN dd_resources r ON r.id = cr.resource_id AND r.status = 'published' WHERE cr.collection_id = co.id) AS resource_count
           FROM dd_collections co WHERE co.is_active ORDER BY co.sort_order, co.name`),
    query(`SELECT language, COUNT(*)::int AS n FROM dd_resources WHERE status = 'published' GROUP BY language`),
  ]);
  const counts = Object.fromEntries(langCounts.map((l) => [l.language, l.n]));
  return {
    categories: categories.map(categoryRow),
    activities: activities.map(activityRow),
    campaigns: campaigns.map(S.campaign),
    collections: collections.filter((c) => c.resource_count > 0),
    formats: FORMATS,
    audiences: AUDIENCES,
    languages: LANGUAGES.map((l) => ({ ...l, resource_count: counts[l.slug] || 0 })),
  };
};

const home = async () => {
  const [featured, recent, stats, contributors, campaignRow, collections] = await Promise.all([
    Q.featuredResources(5),
    Q.searchResources({ sort: 'latest', limit: 8 }),
    Q.computeStats(),
    Q.publicContributors(8),
    one(`SELECT * FROM dd_campaigns WHERE status = 'published' ORDER BY featured DESC, (end_date >= CURRENT_DATE) DESC, start_date DESC NULLS LAST LIMIT 1`),
    query(`SELECT co.id, co.slug, co.name, co.description FROM dd_collections co WHERE co.is_active ORDER BY co.sort_order, co.name LIMIT 4`),
  ]);
  const withItems = await Promise.all(
    collections.map(async (co) => {
      const rows = await query(
        `SELECT ${S.CARD_COLUMNS} ${S.JOINS} JOIN dd_collection_resources cr ON cr.resource_id = r.id AND cr.collection_id = $1
         WHERE r.status = 'published' ORDER BY cr.position, r.published_at DESC LIMIT 4`,
        [co.id],
      );
      return { slug: co.slug, name: co.name, description: co.description, resources: rows.map(S.card) };
    }),
  );
  return {
    featured,
    recent: recent.items,
    stats,
    contributors,
    campaign: campaignRow ? S.campaign(campaignRow) : null,
    collections: withItems.filter((c) => c.resources.length),
  };
};

const resourceDetail = async (slug) => {
  const found = await Q.getResource(slug);
  if (!found) throw fail(404, 'Resource not found');
  return { resource: found.resource, related: await Q.relatedResources(found.row) };
};

const contributorDetail = async (slug) => {
  const row = await one(
    `SELECT * FROM dd_contributors WHERE slug = $1 AND status = 'approved' AND COALESCE((public_fields->>'name')::boolean, false)`,
    [slug],
  );
  if (!row) throw fail(404, 'Contributor not found');
  const resources = await Q.searchResources({ contributor: slug, limit: 48 });
  if (!resources.total) throw fail(404, 'Contributor not found');
  const categories = [...new Set(resources.items.map((r) => r.category && r.category.name).filter(Boolean))];
  return { contributor: { ...S.publicContributor(row), resource_count: resources.total, categories }, resources: resources.items };
};

const campaignDetail = async (slug) => {
  const row = await one(`SELECT * FROM dd_campaigns WHERE slug = $1 AND status = 'published'`, [slug]);
  if (!row) throw fail(404, 'Campaign not found');
  const inCampaign = `EXISTS (SELECT 1 FROM dd_resource_campaigns rc WHERE rc.resource_id = r.id AND rc.campaign_id = $1)`;
  const [featured, recent, stats, contributors] = await Promise.all([
    Q.featuredResources(4, inCampaign, [row.id]),
    Q.searchResources({ campaign: slug, limit: 8 }),
    Q.computeStats(slug),
    Q.publicContributors(12, slug),
  ]);
  return { campaign: S.campaign(row), featured, recent: recent.items, total: recent.total, stats, contributors };
};

const topicDetail = async (type, slug) => {
  const table = type === 'activity' ? 'dd_activities' : 'dd_categories';
  const col = type === 'activity' ? 'activity_id' : 'category_id';
  const row = await one(`SELECT * FROM ${table} WHERE slug = $1 AND is_active`, [slug]);
  if (!row) throw fail(404, 'Topic not found');
  const [featured, related] = await Promise.all([
    Q.featuredResources(3, `r.${col} = $1`, [row.id]),
    query(
      `SELECT c.slug, c.name, c.icon, c.color, COUNT(r.id)::int AS resource_count
       FROM dd_categories c JOIN dd_resources r ON r.category_id = c.id AND r.status = 'published'
       WHERE c.is_active AND c.id <> $1
       GROUP BY c.id ORDER BY resource_count DESC, c.sort_order LIMIT 6`,
      [type === 'activity' ? -1 : row.id],
    ),
  ]);
  return { type, topic: type === 'activity' ? activityRow(row) : categoryRow(row), featured, related };
};

// Metadata for the edge function that injects SEO / Open Graph tags into the SPA shell.
const meta = async (path) => {
  const base = { site: SITE, image: `${SITE}/digital-daan-og.png`, type: 'website' };
  const parts = String(path || '').replace(/^\/+|\/+$/g, '').split('/');
  if (parts[0] !== 'digital-daan') return null;
  const [, section, slug] = parts;
  const STATIC = {
    '': ['Digital Daan — Give a Skill. Create an Opportunity. | Prachetas Foundation', 'Free, practical learning resources on AI, cyber safety, careers and digital skills — shared by volunteers through Prachetas Foundation\'s Digital Daan.'],
    explore: ['Explore Digital Daan — Free Learning Library | Prachetas Foundation', 'Discover practical knowledge created by people who chose to share what they know — videos, guides, articles, quizzes and sessions.'],
    contributors: ['Meet the Contributors | Digital Daan — Prachetas Foundation', 'The professionals and volunteers sharing practical knowledge through Prachetas Digital Daan.'],
    contribute: ['Become a Contributor | Digital Daan — Prachetas Foundation', 'Share a skill, a guide, a video or your career experience with students and communities through Prachetas Digital Daan.'],
    about: ['About Digital Daan | Prachetas Foundation', 'Digital Daan is Prachetas Foundation\'s long-term learning platform where volunteers share practical digital knowledge with students and communities.'],
    campaigns: ['Digital Daan Campaigns | Prachetas Foundation', 'Campaigns and partnerships that grow the Digital Daan learning library.'],
  };
  if (!slug && STATIC[section || ''] ) {
    const [title, description] = STATIC[section || ''];
    return { ...base, title, description };
  }
  if (section === 'resources' && slug) {
    const found = await Q.getResource(slug);
    if (!found) return null;
    const r = found.resource;
    return {
      ...base, type: 'article', noindex: r.is_demo,
      title: `${r.title} | Digital Daan — Prachetas Foundation`,
      description: r.short_description || r.detailed_description || '',
      image: r.thumbnail_url || base.image,
      jsonld: {
        '@context': 'https://schema.org',
        '@type': ['video', 'reel', 'session'].includes(r.content_type) ? 'LearningResource' : r.content_type === 'quiz' ? 'Quiz' : 'Article',
        name: r.title, headline: r.title, description: r.short_description, inLanguage: r.language,
        datePublished: r.published_at, url: `${SITE}/digital-daan/resources/${r.slug}`,
        educationalLevel: r.audiences, keywords: (r.tags || []).join(', '),
        timeRequired: r.duration_minutes ? `PT${r.duration_minutes}M` : undefined,
        author: r.contributor && r.contributor.has_profile ? { '@type': 'Person', name: r.contributor.name } : { '@type': 'Organization', name: 'Prachetas Foundation' },
        publisher: { '@type': 'Organization', name: 'Prachetas Foundation', url: SITE },
        isAccessibleForFree: true,
      },
    };
  }
  if (section === 'contributors' && slug) {
    const row = await one(`SELECT * FROM dd_contributors WHERE slug = $1 AND status = 'approved' AND COALESCE((public_fields->>'name')::boolean, false)`, [slug]);
    if (!row) return null;
    const c = S.publicContributor(row);
    return { ...base, type: 'profile', title: `${c.name} — Digital Daan Contributor | Prachetas Foundation`, description: c.bio || `Learning resources shared by ${c.name} on Prachetas Digital Daan.`, image: c.photo_url || base.image };
  }
  if (section === 'campaigns' && slug) {
    const row = await one(`SELECT * FROM dd_campaigns WHERE slug = $1 AND status = 'published'`, [slug]);
    if (!row) return null;
    return { ...base, title: `${row.name} | Prachetas Foundation`, description: row.tagline ? `${row.tagline} ${row.description || ''}`.trim() : row.description || '', image: row.hero_image_url || base.image };
  }
  if (section === 'activities' && slug) {
    const row = await one(`SELECT * FROM dd_activities WHERE slug = $1`, [slug]);
    if (!row) return null;
    return { ...base, title: `${row.name} — ${row.tagline} | Digital Daan`, description: row.description };
  }
  if (section && !slug && !['explore', 'contributors', 'campaigns', 'contribute', 'about', 'admin'].includes(section)) {
    const row = await one(`SELECT * FROM dd_categories WHERE slug = $1 AND is_active`, [section]);
    if (!row) return null;
    return { ...base, title: `${row.name} — Free Learning Resources | Digital Daan`, description: row.intro || row.description };
  }
  return null;
};

exports.handler = handle(async (event) => {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' }, noStore);
  await ensureSchema();
  const p = event.queryStringParameters || {};
  switch (p.action) {
    case 'taxonomy': return cached(await taxonomy(), 300);
    case 'home': return cached(await home());
    case 'resources': return cached(await Q.searchResources(p), 30);
    case 'resource': return cached(await resourceDetail(p.slug));
    case 'contributors': return cached({ contributors: await Q.publicContributors() });
    case 'contributor': return cached(await contributorDetail(p.slug));
    case 'campaign': return cached(await campaignDetail(p.slug));
    case 'topic': return cached(await topicDetail(p.type === 'activity' ? 'activity' : 'category', p.slug), 120);
    case 'meta': return cached({ meta: await meta(p.path) }, 120);
    default: throw fail(400, 'Unknown action');
  }
});
