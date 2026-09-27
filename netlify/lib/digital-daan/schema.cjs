const { query, one } = require('./db.cjs');
const { DEFAULT_CATEGORIES, DEFAULT_ACTIVITIES, DEFAULT_METRICS, DEFAULT_STORAGE_FOLDERS, LANGUAGES, FORMATS } = require('./taxonomy.cjs');

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS dd_categories (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(80) UNIQUE NOT NULL,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    intro TEXT,
    icon VARCHAR(40),
    color VARCHAR(20),
    sort_order INT DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS dd_activities (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(80) UNIQUE NOT NULL,
    number INT NOT NULL,
    name VARCHAR(120) NOT NULL,
    tagline TEXT,
    description TEXT,
    formats TEXT[] DEFAULT '{}',
    topics TEXT[] DEFAULT '{}',
    icon VARCHAR(40),
    color VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS dd_campaigns (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(80) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    short_name VARCHAR(120),
    tagline TEXT,
    description TEXT,
    partner VARCHAR(160),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    featured BOOLEAN DEFAULT false,
    hero_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS dd_contributors (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(160) NOT NULL,
    email VARCHAR(200),
    organisation VARCHAR(160),
    designation VARCHAR(160),
    expertise VARCHAR(240),
    bio TEXT,
    photo_url TEXT,
    linkedin_url TEXT,
    public_fields JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    is_demo BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS dd_contributors_email_idx ON dd_contributors (LOWER(email))`,
  `CREATE TABLE IF NOT EXISTS dd_resources (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(120) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    short_description VARCHAR(400),
    detailed_description TEXT,
    body TEXT,
    quiz JSONB,
    transcript TEXT,
    category_id INT REFERENCES dd_categories(id) ON DELETE SET NULL,
    activity_id INT REFERENCES dd_activities(id) ON DELETE SET NULL,
    content_type VARCHAR(30) NOT NULL DEFAULT 'resource',
    audiences TEXT[] NOT NULL DEFAULT '{}',
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    duration_minutes INT,
    thumbnail_url TEXT,
    drive_url TEXT,
    youtube_url TEXT,
    external_url TEXT,
    storage_folder VARCHAR(60),
    contributor_id INT REFERENCES dd_contributors(id) ON DELETE SET NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    featured BOOLEAN NOT NULL DEFAULT false,
    featured_rank INT DEFAULT 100,
    view_count INT NOT NULL DEFAULT 0,
    share_count INT NOT NULL DEFAULT 0,
    submission JSONB,
    review_notes TEXT,
    is_demo BOOLEAN DEFAULT false,
    search_text TEXT,
    search_vector TSVECTOR GENERATED ALWAYS AS (to_tsvector('simple', COALESCE(search_text, ''))) STORED,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS dd_resources_search_idx ON dd_resources USING GIN (search_vector)`,
  `CREATE INDEX IF NOT EXISTS dd_resources_status_pub_idx ON dd_resources (status, published_at DESC)`,
  `CREATE INDEX IF NOT EXISTS dd_resources_category_idx ON dd_resources (category_id)`,
  `CREATE INDEX IF NOT EXISTS dd_resources_activity_idx ON dd_resources (activity_id)`,
  `CREATE INDEX IF NOT EXISTS dd_resources_contributor_idx ON dd_resources (contributor_id)`,
  `CREATE INDEX IF NOT EXISTS dd_resources_audiences_idx ON dd_resources USING GIN (audiences)`,
  `CREATE INDEX IF NOT EXISTS dd_resources_tags_idx ON dd_resources USING GIN (tags)`,
  `CREATE TABLE IF NOT EXISTS dd_resource_campaigns (
    resource_id INT REFERENCES dd_resources(id) ON DELETE CASCADE,
    campaign_id INT REFERENCES dd_campaigns(id) ON DELETE CASCADE,
    PRIMARY KEY (resource_id, campaign_id)
  )`,
  `CREATE TABLE IF NOT EXISTS dd_collections (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(80) UNIQUE NOT NULL,
    name VARCHAR(160) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS dd_collection_resources (
    collection_id INT REFERENCES dd_collections(id) ON DELETE CASCADE,
    resource_id INT REFERENCES dd_resources(id) ON DELETE CASCADE,
    position INT DEFAULT 100,
    PRIMARY KEY (collection_id, resource_id)
  )`,
  `CREATE TABLE IF NOT EXISTS dd_metrics (
    key VARCHAR(60) PRIMARY KEY,
    label VARCHAR(120) NOT NULL,
    mode VARCHAR(10) NOT NULL DEFAULT 'manual',
    value NUMERIC DEFAULT 0,
    suffix VARCHAR(10) DEFAULT '',
    is_visible BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 100
  )`,
  `CREATE TABLE IF NOT EXISTS dd_storage_folders (
    key VARCHAR(60) PRIMARY KEY,
    label VARCHAR(160) NOT NULL,
    drive_url TEXT,
    notes TEXT,
    sort_order INT DEFAULT 100
  )`,
  `CREATE TABLE IF NOT EXISTS dd_events (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(30) NOT NULL,
    resource_id INT REFERENCES dd_resources(id) ON DELETE SET NULL,
    meta JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS dd_events_type_time_idx ON dd_events (event_type, created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS dd_rate_limits (
    key VARCHAR(120) NOT NULL,
    bucket TIMESTAMPTZ NOT NULL,
    count INT NOT NULL DEFAULT 0,
    PRIMARY KEY (key, bucket)
  )`,
];

// Builds the searchable text for a resource from its own fields plus related names.
// Contributor names are only indexed when the contributor allowed their name to be public.
const languageCase = `CASE r.language ${LANGUAGES.map((l) => `WHEN '${l.slug}' THEN '${l.label} ${l.native}'`).join(' ')} ELSE '' END`;
const formatCase = `CASE r.content_type ${FORMATS.map((f) => `WHEN '${f.slug}' THEN '${f.label}'`).join(' ')} ELSE '' END`;

const refreshSearchText = async (where = 'TRUE', params = []) => {
  await query(
    `UPDATE dd_resources r SET search_text = concat_ws(' ',
        r.title, r.short_description, r.detailed_description,
        array_to_string(r.tags, ' '), replace(array_to_string(r.audiences, ' '), '-', ' '),
        c.name, a.name, ${languageCase}, ${formatCase},
        r.submission->>'topic',
        CASE WHEN COALESCE((ct.public_fields->>'name')::boolean, false) THEN ct.name END,
        CASE WHEN COALESCE((ct.public_fields->>'organisation')::boolean, false) THEN ct.organisation END)
      FROM dd_resources r2
      LEFT JOIN dd_categories c ON c.id = r2.category_id
      LEFT JOIN dd_activities a ON a.id = r2.activity_id
      LEFT JOIN dd_contributors ct ON ct.id = r2.contributor_id
      WHERE r2.id = r.id AND (${where})`,
    params,
  );
};

const seedTaxonomy = async () => {
  for (const [i, [slug, name, description, icon, color]] of DEFAULT_CATEGORIES.entries()) {
    await query(
      `INSERT INTO dd_categories (slug, name, description, icon, color, sort_order) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (slug) DO NOTHING`,
      [slug, name, description, icon, color, (i + 1) * 10],
    );
  }
  for (const a of DEFAULT_ACTIVITIES) {
    await query(
      `INSERT INTO dd_activities (slug, number, name, tagline, description, formats, topics, icon, color)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (slug) DO NOTHING`,
      [a.slug, a.number, a.name, a.tagline, a.description, a.formats, a.topics, a.icon, a.color],
    );
  }
  for (const [key, label, mode, suffix, sort] of DEFAULT_METRICS) {
    await query(
      `INSERT INTO dd_metrics (key, label, mode, suffix, sort_order) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (key) DO NOTHING`,
      [key, label, mode, suffix, sort],
    );
  }
  for (const [key, label, sort] of DEFAULT_STORAGE_FOLDERS) {
    await query(`INSERT INTO dd_storage_folders (key, label, sort_order) VALUES ($1,$2,$3) ON CONFLICT (key) DO NOTHING`, [key, label, sort]);
  }
};

let ready = null;

const ensureSchema = () => {
  if (!ready) {
    ready = (async () => {
      const exists = await one(`SELECT to_regclass('public.dd_resources') AS t`);
      const seeded = await one(`SELECT to_regclass('public.dd_rate_limits') AS t`);
      if (exists && exists.t && seeded && seeded.t) return;
      for (const s of STATEMENTS) await query(s);
      await seedTaxonomy();
      const count = await one(`SELECT COUNT(*)::int AS n FROM dd_campaigns`);
      if (!count.n) await require('./seed-data.cjs').seedDemo();
      await refreshSearchText();
    })().catch((e) => {
      ready = null;
      throw e;
    });
  }
  return ready;
};

module.exports = { ensureSchema, refreshSearchText };
