// The ONLY place where database rows are turned into public API objects.
// Private fields (emails, submission data, review notes, storage folders, non-public
// profile fields) are never included here.
const { youtubeId, drivePreviewUrl, driveThumbnail } = require('./validate.cjs');

const ANONYMOUS_NAME = 'Digital Daan Volunteer';

const isPublic = (pf, field) => !!(pf && pf[field]);

const publicContributor = (row, prefix = '') => {
  const g = (k) => row[`${prefix}${k}`];
  if (!g('id') && !g('slug')) return null;
  const pf = g('public_fields') || {};
  const hasProfile = isPublic(pf, 'name') && g('status') === 'approved';
  return {
    slug: hasProfile ? g('slug') : null,
    name: isPublic(pf, 'name') ? g('name') : ANONYMOUS_NAME,
    photo_url: isPublic(pf, 'photo') ? g('photo_url') || null : null,
    designation: isPublic(pf, 'designation') ? g('designation') || null : null,
    expertise: isPublic(pf, 'designation') ? g('expertise') || null : null,
    organisation: isPublic(pf, 'organisation') ? g('organisation') || null : null,
    linkedin_url: isPublic(pf, 'linkedin') ? g('linkedin_url') || null : null,
    bio: isPublic(pf, 'bio') ? g('bio') || null : null,
    has_profile: hasProfile,
    is_demo: !!g('is_demo'),
  };
};

const CARD_COLUMNS = `
  r.id, r.slug, r.title, r.short_description, r.content_type, r.audiences, r.language, r.duration_minutes,
  r.thumbnail_url, r.youtube_url, r.drive_url, r.tags, r.featured, r.published_at, r.is_demo, r.view_count,
  c.slug AS category_slug, c.name AS category_name, c.color AS category_color, c.icon AS category_icon,
  a.slug AS activity_slug, a.name AS activity_name, a.number AS activity_number, a.color AS activity_color,
  ct.id AS ct_id, ct.slug AS ct_slug, ct.name AS ct_name, ct.designation AS ct_designation, ct.organisation AS ct_organisation,
  ct.expertise AS ct_expertise, ct.photo_url AS ct_photo_url, ct.linkedin_url AS ct_linkedin_url, ct.bio AS ct_bio,
  ct.public_fields AS ct_public_fields, ct.status AS ct_status, ct.is_demo AS ct_is_demo`;

const DETAIL_COLUMNS = `${CARD_COLUMNS}, r.detailed_description, r.body, r.quiz, r.transcript, r.external_url`;

const JOINS = `
  FROM dd_resources r
  LEFT JOIN dd_categories c ON c.id = r.category_id
  LEFT JOIN dd_activities a ON a.id = r.activity_id
  LEFT JOIN dd_contributors ct ON ct.id = r.contributor_id`;

const thumbnailFor = (row) =>
  row.thumbnail_url ||
  (youtubeId(row.youtube_url) ? `https://i.ytimg.com/vi/${youtubeId(row.youtube_url)}/hqdefault.jpg` : null) ||
  driveThumbnail(row.drive_url);

const card = (row) => ({
  slug: row.slug,
  title: row.title,
  short_description: row.short_description,
  content_type: row.content_type,
  audiences: row.audiences || [],
  language: row.language,
  duration_minutes: row.duration_minutes,
  thumbnail_url: thumbnailFor(row),
  tags: row.tags || [],
  featured: row.featured,
  published_at: row.published_at,
  is_demo: !!row.is_demo,
  category: row.category_slug ? { slug: row.category_slug, name: row.category_name, color: row.category_color, icon: row.category_icon } : null,
  activity: row.activity_slug ? { slug: row.activity_slug, name: row.activity_name, number: row.activity_number, color: row.activity_color } : null,
  contributor: row.ct_id ? publicContributor(row, 'ct_') : null,
});

const detail = (row, campaigns = []) => ({
  ...card(row),
  detailed_description: row.detailed_description,
  body: row.body,
  quiz: row.quiz,
  transcript: row.transcript,
  media: {
    youtube_id: youtubeId(row.youtube_url),
    drive_preview_url: drivePreviewUrl(row.drive_url),
    external_url: row.external_url || null,
  },
  campaigns,
});

// DATE columns are parsed by the driver as local-midnight Date objects; format them back without timezone shifts.
const dateOnly = (d) => {
  if (!d) return null;
  if (!(d instanceof Date)) return String(d).slice(0, 10);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const campaign = (row) => {
  const today = new Date().toISOString().slice(0, 10);
  const start = dateOnly(row.start_date);
  const end = dateOnly(row.end_date);
  const phase = start && today < start ? 'upcoming' : end && today > end ? 'completed' : 'active';
  return {
    slug: row.slug, name: row.name, short_name: row.short_name, tagline: row.tagline, description: row.description,
    partner: row.partner, start_date: start, end_date: end, featured: row.featured, hero_image_url: row.hero_image_url, phase,
  };
};

module.exports = { publicContributor, card, detail, campaign, dateOnly, CARD_COLUMNS, DETAIL_COLUMNS, JOINS, ANONYMOUS_NAME };
