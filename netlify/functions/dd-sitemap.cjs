// Digital Daan sitemap — lists published (non-sample) resources, topics, activities, contributors and campaigns.
const { query } = require('../lib/digital-daan/db.cjs');
const { ensureSchema } = require('../lib/digital-daan/schema.cjs');
const { handle } = require('../lib/digital-daan/http.cjs');

const SITE = 'https://prachetasfoundation.com';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

exports.handler = handle(async () => {
  await ensureSchema();
  const [resources, categories, activities, contributors, campaigns] = await Promise.all([
    query(`SELECT slug, updated_at FROM dd_resources WHERE status = 'published' AND NOT is_demo ORDER BY published_at DESC LIMIT 5000`),
    query(`SELECT slug FROM dd_categories WHERE is_active`),
    query(`SELECT slug FROM dd_activities WHERE is_active`),
    query(`SELECT DISTINCT ct.slug FROM dd_contributors ct JOIN dd_resources r ON r.contributor_id = ct.id AND r.status = 'published'
           WHERE ct.status = 'approved' AND NOT ct.is_demo AND COALESCE((ct.public_fields->>'name')::boolean, false)`),
    query(`SELECT slug FROM dd_campaigns WHERE status = 'published'`),
  ]);
  const urls = [
    ['/digital-daan', 'daily'], ['/digital-daan/explore', 'daily'], ['/digital-daan/contributors', 'weekly'], ['/digital-daan/about', 'monthly'], ['/digital-daan/contribute', 'monthly'],
    ...categories.map((c) => [`/digital-daan/${c.slug}`, 'weekly']),
    ...activities.map((a) => [`/digital-daan/activities/${a.slug}`, 'weekly']),
    ...campaigns.map((c) => [`/digital-daan/campaigns/${c.slug}`, 'weekly']),
    ...contributors.map((c) => [`/digital-daan/contributors/${c.slug}`, 'monthly']),
    ...resources.map((r) => [`/digital-daan/resources/${r.slug}`, 'monthly', r.updated_at]),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([loc, freq, mod]) => `  <url><loc>${esc(SITE + loc)}</loc><changefreq>${freq}</changefreq>${mod ? `<lastmod>${new Date(mod).toISOString().slice(0, 10)}</lastmod>` : ''}</url>`).join('\n')}
</urlset>`;
  return { statusCode: 200, headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }, body };
});
