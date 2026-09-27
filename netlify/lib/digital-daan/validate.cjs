const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

// Strips control characters and angle brackets; content is always rendered as text on the client.
const cleanText = (v, max = 500) => {
  if (v === undefined || v === null) return null;
  const s = String(v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').replace(/<[^>]*>/g, '').replace(/[<>]/g, '').trim();
  return s ? s.slice(0, max) : null;
};

const cleanLongText = (v, max = 20000) => {
  if (v === undefined || v === null) return null;
  const s = String(v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').replace(/<[^>]*>/g, '').trim();
  return s ? s.slice(0, max) : null;
};

const cleanList = (v, allowed, max = 20) => {
  const arr = Array.isArray(v) ? v : typeof v === 'string' ? v.split(',') : [];
  const out = [...new Set(arr.map((x) => cleanText(x, 60)).filter(Boolean))];
  return (allowed ? out.filter((x) => allowed.includes(x)) : out).slice(0, max);
};

const cleanTags = (v) => cleanList(v, null, 15).map((t) => t.toLowerCase());

const parseUrl = (v) => {
  if (!v) return null;
  try {
    const u = new URL(String(v).trim());
    return u.protocol === 'https:' || u.protocol === 'http:' ? u : null;
  } catch {
    return null;
  }
};

const isHost = (u, hosts) => hosts.some((h) => u.hostname === h || u.hostname.endsWith(`.${h}`));

const httpsUrl = (v) => {
  const u = parseUrl(v);
  return u && u.protocol === 'https:' ? u.toString() : null;
};

const driveUrl = (v) => {
  const u = parseUrl(v);
  return u && isHost(u, ['drive.google.com', 'docs.google.com']) ? u.toString() : null;
};

const youtubeUrl = (v) => {
  const u = parseUrl(v);
  return u && isHost(u, ['youtube.com', 'youtu.be', 'youtube-nocookie.com']) ? u.toString() : null;
};

const linkedinUrl = (v) => {
  const u = parseUrl(v);
  return u && isHost(u, ['linkedin.com']) ? u.toString() : null;
};

const youtubeId = (v) => {
  const u = parseUrl(v);
  if (!u) return null;
  let id = null;
  if (u.hostname.endsWith('youtu.be')) id = u.pathname.slice(1);
  else if (u.searchParams.get('v')) id = u.searchParams.get('v');
  else {
    const m = u.pathname.match(/\/(embed|shorts|live)\/([^/?#]+)/);
    if (m) id = m[2];
  }
  return id && /^[A-Za-z0-9_-]{6,20}$/.test(id) ? id : null;
};

// Only individual Drive *files* are ever exposed publicly (as preview embeds), never folders.
const driveFileId = (v) => {
  const u = parseUrl(v);
  if (!u || !isHost(u, ['drive.google.com', 'docs.google.com'])) return null;
  const m = u.pathname.match(/\/(?:file|document|presentation|spreadsheets)\/d\/([A-Za-z0-9_-]{10,})/);
  const id = m ? m[1] : u.pathname.startsWith('/open') ? u.searchParams.get('id') : null;
  return id && /^[A-Za-z0-9_-]{10,}$/.test(id) ? id : null;
};

const drivePreviewUrl = (v) => {
  const u = parseUrl(v);
  const id = driveFileId(v);
  if (!id) return null;
  if (u.pathname.startsWith('/document/')) return `https://docs.google.com/document/d/${id}/preview`;
  if (u.pathname.startsWith('/presentation/')) return `https://docs.google.com/presentation/d/${id}/preview`;
  if (u.pathname.startsWith('/spreadsheets/')) return `https://docs.google.com/spreadsheets/d/${id}/preview`;
  return `https://drive.google.com/file/d/${id}/preview`;
};

const driveThumbnail = (v) => {
  const id = driveFileId(v);
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1200` : null;
};

const isEmail = (v) => typeof v === 'string' && /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(v.trim());

const toInt = (v, def = null, min = 0, max = 100000) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def;
};

const cleanQuiz = (v) => {
  if (!Array.isArray(v)) return null;
  const qs = v
    .slice(0, 30)
    .map((q) => ({
      q: cleanText(q && q.q, 400),
      options: Array.isArray(q && q.options) ? q.options.map((o) => cleanText(o, 200)).filter(Boolean).slice(0, 6) : [],
      answer: toInt(q && q.answer, 0, 0, 5),
      explain: cleanText(q && q.explain, 600),
    }))
    .filter((q) => q.q && q.options.length >= 2 && q.answer < q.options.length);
  return qs.length ? qs : null;
};

module.exports = {
  slugify, cleanText, cleanLongText, cleanList, cleanTags, httpsUrl, driveUrl, youtubeUrl, linkedinUrl,
  youtubeId, driveFileId, drivePreviewUrl, driveThumbnail, isEmail, toInt, cleanQuiz,
};
