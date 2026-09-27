const crypto = require('crypto');
const { one } = require('./db.cjs');

const baseHeaders = { 'Content-Type': 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff' };

const json = (statusCode, body, extra = {}) => ({ statusCode, headers: { ...baseHeaders, ...extra }, body: JSON.stringify(body) });

// Public, cacheable responses: short browser cache, slightly longer CDN cache with background revalidation.
const cached = (body, seconds = 60) =>
  json(200, body, {
    'Cache-Control': `public, max-age=${seconds}`,
    'Netlify-CDN-Cache-Control': `public, s-maxage=${seconds * 2}, stale-while-revalidate=600`,
  });

const noStore = { 'Cache-Control': 'no-store' };

const parseBody = (event) => {
  if (!event.body) return {};
  const raw = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
  if (raw.length > 200000) throw Object.assign(new Error('Request too large'), { status: 413 });
  try {
    return JSON.parse(raw);
  } catch {
    throw Object.assign(new Error('Invalid JSON'), { status: 400 });
  }
};

const clientIp = (event) =>
  (event.headers['x-nf-client-connection-ip'] || event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown').split(',')[0].trim();

const secret = () => process.env.DIGITAL_DAAN_SESSION_SECRET || process.env.JWT_SECRET || '';

// IPs are never stored in plain text — only a keyed hash, used for rate limiting.
const ipKey = (event, scope) => `${scope}:${crypto.createHmac('sha256', secret() || 'dd').update(clientIp(event)).digest('hex').slice(0, 32)}`;

// Fixed-window rate limit stored in Postgres (works across serverless instances).
const rateLimit = async (event, scope, limit, windowMinutes) => {
  const key = ipKey(event, scope);
  const row = await one(
    `INSERT INTO dd_rate_limits (key, bucket, count)
     VALUES ($1, to_timestamp(floor(extract(epoch FROM NOW()) / ($2 * 60)) * ($2 * 60)), 1)
     ON CONFLICT (key, bucket) DO UPDATE SET count = dd_rate_limits.count + 1
     RETURNING count`,
    [key, windowMinutes],
  );
  if (Math.random() < 0.02) await one(`DELETE FROM dd_rate_limits WHERE bucket < NOW() - INTERVAL '1 day'`);
  return row.count <= limit;
};

const handle = (fn) => async (event) => {
  try {
    return await fn(event);
  } catch (e) {
    const status = e.status || 500;
    if (status >= 500) console.error('[digital-daan]', e);
    return json(status, { error: status >= 500 ? 'Something went wrong. Please try again.' : e.message }, noStore);
  }
};

const fail = (status, message) => Object.assign(new Error(message), { status });

module.exports = { json, cached, noStore, parseBody, rateLimit, handle, fail, secret };
