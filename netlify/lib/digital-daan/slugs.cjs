const { one } = require('./db.cjs');
const { slugify } = require('./validate.cjs');

// Returns a slug that is unique in `table`, ignoring the row with id `exceptId`.
const uniqueSlug = async (table, base, exceptId = null, fallback = 'item') => {
  const root = slugify(base) || `${fallback}-${Date.now().toString(36)}`;
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? root : `${root}-${i + 1}`;
    const row = await one(`SELECT id FROM ${table} WHERE slug = $1 AND ($2::int IS NULL OR id <> $2)`, [candidate, exceptId]);
    if (!row) return candidate;
  }
  return `${root}-${Date.now().toString(36)}`;
};

module.exports = { uniqueSlug };
