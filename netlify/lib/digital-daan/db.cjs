const { neon } = require('@neondatabase/serverless');

let impl = null;

const getImpl = () => {
  if (impl) return impl;
  const url = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) throw new Error('Database is not configured (NETLIFY_DATABASE_URL missing)');
  const sql = neon(url);
  impl = (text, params = []) => sql(text, params);
  return impl;
};

const query = async (text, params = []) => {
  const result = await getImpl()(text, params);
  return Array.isArray(result) ? result : result.rows;
};

const one = async (text, params = []) => (await query(text, params))[0] || null;

// Allows local tooling/tests to plug in a different driver (e.g. node-postgres).
const setQueryImpl = (fn) => { impl = fn; };

module.exports = { query, one, setQueryImpl };
