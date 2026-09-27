// Digital Daan — contributor submissions. Everything submitted here is stored as
// `under_review` and is NEVER publicly visible until an admin publishes it.
const nodemailer = require('nodemailer');
const { query, one } = require('../lib/digital-daan/db.cjs');
const { ensureSchema, refreshSearchText } = require('../lib/digital-daan/schema.cjs');
const { json, noStore, parseBody, rateLimit, handle, fail } = require('../lib/digital-daan/http.cjs');
const { FORMATS, AUDIENCES, LANGUAGES } = require('../lib/digital-daan/taxonomy.cjs');
const V = require('../lib/digital-daan/validate.cjs');
const { uniqueSlug } = require('../lib/digital-daan/slugs.cjs');

const PUBLIC_FIELDS = ['name', 'photo', 'designation', 'organisation', 'linkedin', 'bio'];

const notifyAdmin = async (title, name) => {
  const to = process.env.DIGITAL_DAAN_NOTIFY_EMAIL;
  if (!to || !process.env.SMTP_USER || !process.env.SMTP_PASS) return;
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: `"Prachetas Digital Daan" <${process.env.SMTP_USER}>`,
      to,
      subject: `New Digital Daan submission: ${title}`,
      text: `${name} submitted "${title}" to Digital Daan.\n\nReview it in the admin console: ${process.env.URL || 'https://prachetasfoundation.com'}/digital-daan/admin`,
    });
  } catch (e) {
    console.error('[digital-daan] notify failed', e.message);
  }
};

exports.handler = handle(async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' }, noStore);
  const body = parseBody(event);

  // Honeypot: bots fill hidden fields. Pretend success without storing anything.
  if (body.website) return json(200, { ok: true }, noStore);

  await ensureSchema();
  if (!(await rateLimit(event, 'submit', 5, 60))) throw fail(429, 'Too many submissions. Please try again in an hour.');

  const person = body.contributor || {};
  const c = body.contribution || {};
  const src = body.source || {};
  const consent = body.consent || {};
  const kind = body.kind === 'idea' ? 'idea' : 'content';

  const name = V.cleanText(person.name, 160);
  const email = V.isEmail(person.email) ? person.email.trim().toLowerCase() : null;
  const title = V.cleanText(c.title, 200);
  const shortDescription = V.cleanText(c.short_description, 400);
  if (!name) throw fail(400, 'Please enter your name');
  if (!email) throw fail(400, 'Please enter a valid email address');
  if (!title) throw fail(400, 'Please add a title');
  if (!shortDescription) throw fail(400, 'Please add a short description');
  if (!consent.permission || !consent.publish) throw fail(400, 'Please confirm the publishing permissions');

  const activity = c.activity ? await one(`SELECT id FROM dd_activities WHERE slug = $1`, [String(c.activity)]) : null;
  const category = c.category ? await one(`SELECT id FROM dd_categories WHERE slug = $1 AND is_active`, [String(c.category)]) : null;
  const contentType = FORMATS.some((f) => f.slug === c.content_type) ? c.content_type : 'resource';
  const language = LANGUAGES.some((l) => l.slug === c.language) ? c.language : 'en';

  const driveUrl = src.drive_url ? V.driveUrl(src.drive_url) : null;
  const youtubeUrl = src.youtube_url ? V.youtubeUrl(src.youtube_url) : null;
  const externalUrl = src.external_url ? V.httpsUrl(src.external_url) : null;
  if (src.drive_url && !driveUrl) throw fail(400, 'Please enter a valid Google Drive link');
  if (src.youtube_url && !youtubeUrl) throw fail(400, 'Please enter a valid YouTube link');
  if (src.external_url && !externalUrl) throw fail(400, 'Please enter a valid https:// link');
  if (kind === 'content' && !driveUrl && !youtubeUrl && !externalUrl) throw fail(400, 'Please add at least one link to your content');

  const publicFields = Object.fromEntries(PUBLIC_FIELDS.map((f) => [f, !!(body.public_fields && body.public_fields[f])]));
  const profile = {
    name,
    organisation: V.cleanText(person.organisation, 160),
    designation: V.cleanText(person.designation, 160),
    expertise: V.cleanText(person.expertise, 240),
    bio: V.cleanText(person.bio, 1200),
    photo_url: person.photo_url ? V.httpsUrl(person.photo_url) : null,
    linkedin_url: person.linkedin_url ? V.linkedinUrl(person.linkedin_url) : null,
  };
  if (person.linkedin_url && !profile.linkedin_url) throw fail(400, 'Please enter a valid LinkedIn profile link');

  // Reuse an existing contributor with the same email. Approved profiles are never
  // overwritten by a new submission — the submitted details are kept for admin review.
  let contributor = await one(`SELECT id, status FROM dd_contributors WHERE LOWER(email) = $1 ORDER BY id LIMIT 1`, [email]);
  if (!contributor) {
    const slug = await uniqueSlug('dd_contributors', name, null, 'volunteer');
    contributor = await one(
      `INSERT INTO dd_contributors (slug, name, email, organisation, designation, expertise, bio, photo_url, linkedin_url, public_fields, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'pending') RETURNING id, status`,
      [slug, name, email, profile.organisation, profile.designation, profile.expertise, profile.bio, profile.photo_url, profile.linkedin_url, JSON.stringify(publicFields)],
    );
  } else if (contributor.status === 'pending') {
    await query(
      `UPDATE dd_contributors SET name=$2, organisation=$3, designation=$4, expertise=$5, bio=$6, photo_url=$7, linkedin_url=$8, public_fields=$9, updated_at=NOW() WHERE id=$1`,
      [contributor.id, name, profile.organisation, profile.designation, profile.expertise, profile.bio, profile.photo_url, profile.linkedin_url, JSON.stringify(publicFields)],
    );
  }

  const slug = await uniqueSlug('dd_resources', title, null, 'resource');
  const submission = {
    kind,
    topic: V.cleanText(c.topic, 160),
    consent: { permission: true, publish: true, promote: !!consent.promote, at: new Date().toISOString() },
    profile,
    public_fields: publicFields,
    submitted_at: new Date().toISOString(),
  };
  const row = await one(
    `INSERT INTO dd_resources (slug, title, short_description, detailed_description, category_id, activity_id, content_type, audiences, language,
        duration_minutes, drive_url, youtube_url, external_url, contributor_id, tags, status, submission)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'under_review',$16) RETURNING id`,
    [slug, title, shortDescription, V.cleanLongText(c.detailed_description, 5000), category && category.id, activity && activity.id, contentType,
      V.cleanList(c.audiences, AUDIENCES.map((a) => a.slug)), language, V.toInt(c.duration_minutes, null, 0, 600),
      driveUrl, youtubeUrl, externalUrl, contributor.id, V.cleanTags(c.tags), JSON.stringify(submission)],
  );
  await refreshSearchText('r.id = $1', [row.id]);
  await notifyAdmin(title, name);

  return json(201, { ok: true }, noStore);
});
