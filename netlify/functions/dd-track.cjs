// Digital Daan — lightweight, privacy-friendly analytics events (no personal data).
const { query } = require('../lib/digital-daan/db.cjs');
const { ensureSchema } = require('../lib/digital-daan/schema.cjs');
const { json, noStore, parseBody, rateLimit, handle } = require('../lib/digital-daan/http.cjs');
const { cleanText } = require('../lib/digital-daan/validate.cjs');

const TYPES = ['view', 'video_open', 'download', 'share', 'search', 'quiz_complete'];

exports.handler = handle(async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' }, noStore);
  const body = parseBody(event);
  if (!TYPES.includes(body.type)) return json(202, { ok: true }, noStore);
  await ensureSchema();
  if (!(await rateLimit(event, 'track', 120, 10))) return json(202, { ok: true }, noStore);

  const meta = {};
  if (body.channel) meta.channel = cleanText(body.channel, 30);
  if (body.term) meta.term = cleanText(body.term, 100);
  if (body.score !== undefined) meta.score = Number(body.score) || 0;

  const slug = cleanText(body.slug, 120);
  await query(
    `INSERT INTO dd_events (event_type, resource_id, meta)
     VALUES ($1, (SELECT id FROM dd_resources WHERE slug = $2 AND status = 'published'), $3)`,
    [body.type, slug, JSON.stringify(meta)],
  );
  if (slug && (body.type === 'view' || body.type === 'share')) {
    const col = body.type === 'view' ? 'view_count' : 'share_count';
    await query(`UPDATE dd_resources SET ${col} = ${col} + 1 WHERE slug = $1 AND status = 'published'`, [slug]);
  }
  return json(202, { ok: true }, noStore);
});
