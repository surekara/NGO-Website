const crypto = require('crypto');
const { secret, fail } = require('./http.cjs');

const SESSION_HOURS = 12;

const b64 = (s) => Buffer.from(s).toString('base64url');
const sign = (payload) => crypto.createHmac('sha256', secret()).update(payload).digest('base64url');

const sameDigest = (a, b) => {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};

const assertConfigured = () => {
  if (!process.env.DIGITAL_DAAN_ADMIN_PASSWORD || secret().length < 16) {
    throw fail(503, 'Admin access is not configured. Set DIGITAL_DAAN_ADMIN_PASSWORD and DIGITAL_DAAN_SESSION_SECRET (16+ characters) in Netlify.');
  }
};

const login = (password) => {
  assertConfigured();
  if (!password || !sameDigest(password, process.env.DIGITAL_DAAN_ADMIN_PASSWORD)) throw fail(401, 'Incorrect password');
  const payload = b64(JSON.stringify({ role: 'admin', exp: Date.now() + SESSION_HOURS * 3600 * 1000 }));
  return { token: `${payload}.${sign(payload)}`, expiresInHours: SESSION_HOURS };
};

const requireAdmin = (event) => {
  assertConfigured();
  const header = event.headers.authorization || event.headers.Authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const [payload, sig] = token.split('.');
  if (!payload || !sig || !sameDigest(sig, sign(payload))) throw fail(401, 'Please sign in again');
  const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  if (data.role !== 'admin' || data.exp < Date.now()) throw fail(401, 'Your session has expired. Please sign in again');
  return data;
};

module.exports = { login, requireAdmin };
