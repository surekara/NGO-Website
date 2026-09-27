// Structural vocabularies for Digital Daan. Categories, activities, campaigns and
// collections live in the database; these lists describe *kinds* of content and
// are shared with the frontend through the public `taxonomy` API.

const FORMATS = [
  { slug: 'video', label: 'Video', verb: 'Watch' },
  { slug: 'reel', label: 'Short Video', verb: 'Watch' },
  { slug: 'article', label: 'Article', verb: 'Read' },
  { slug: 'guide', label: 'Guide', verb: 'Follow' },
  { slug: 'pdf', label: 'PDF', verb: 'Open' },
  { slug: 'quiz', label: 'Quiz', verb: 'Take quiz' },
  { slug: 'session', label: 'Session', verb: 'Watch' },
  { slug: 'mentor-story', label: 'Mentor Story', verb: 'Read' },
  { slug: 'resource', label: 'Resource', verb: 'Open' },
];

const AUDIENCES = [
  { slug: 'school-students', label: 'School Students' },
  { slug: 'college-students', label: 'College Students' },
  { slug: 'parents', label: 'Parents' },
  { slug: 'teachers', label: 'Teachers' },
  { slug: 'community', label: 'Community' },
  { slug: 'beginners', label: 'Beginners' },
  { slug: 'job-seekers', label: 'Job Seekers' },
];

const LANGUAGES = [
  { slug: 'en', label: 'English', native: 'English' },
  { slug: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { slug: 'mr', label: 'Marathi', native: 'मराठी' },
  { slug: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { slug: 'bn', label: 'Bengali', native: 'বাংলা' },
  { slug: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { slug: 'te', label: 'Telugu', native: 'తెలుగు' },
  { slug: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { slug: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { slug: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { slug: 'other', label: 'Other', native: 'Other' },
];

const RESOURCE_STATUSES = ['draft', 'under_review', 'published', 'archived', 'rejected'];

const DEFAULT_CATEGORIES = [
  ['ai', 'AI', 'Understand artificial intelligence and use it well — for learning, work and everyday life.', 'sparkles', '#8B5CF6'],
  ['cyber-safety', 'Cyber Safety', 'Recognise scams, protect your accounts and help your family stay safe online.', 'shield', '#EF4444'],
  ['careers', 'Careers', 'Resumes, interviews, first jobs and honest career advice from working professionals.', 'briefcase', '#0EA5E9'],
  ['digital-basics', 'Digital Basics', 'The essential skills for getting comfortable with phones, computers and the internet.', 'smartphone', '#10B981'],
  ['productivity', 'Productivity', 'Practical tools and habits to organise work, study and time.', 'zap', '#F59E0B'],
  ['learning', 'Learning', 'Smarter ways to study, research and keep growing.', 'graduation-cap', '#6366F1'],
  ['technology', 'Technology', 'How everyday technology works, explained simply.', 'cpu', '#14B8A6'],
  ['responsible-ai', 'Responsible AI', 'Using AI fairly, safely and with good judgement.', 'scale', '#A855F7'],
  ['digital-payments', 'Digital Payments', 'UPI, wallets and online banking — used confidently and safely.', 'wallet', '#22C55E'],
  ['online-safety', 'Online Safety', 'Privacy, social media and healthy digital habits for all ages.', 'lock', '#F43F5E'],
  ['communication', 'Communication', 'Write, speak and present with clarity and confidence.', 'message-circle', '#3B82F6'],
  ['other', 'Other', 'More useful knowledge shared by our contributors.', 'layers', '#64748B'],
];

const DEFAULT_ACTIVITIES = [
  {
    slug: 'digital-dost-live', number: 1, name: 'Digital Dost Live', tagline: 'Share what you know. Teach what matters.', icon: 'radio', color: '#F59E0B',
    description: 'Live sessions, workshops, talks, demonstrations and Q&A — knowledge shared in real time and recorded so it keeps helping.',
    formats: ['Live sessions', 'Workshops', 'Talks', 'Demonstrations', 'Q&A sessions'],
    topics: ['Digital basics', 'Internet literacy', 'AI for everyday life', 'Digital payments', 'Microsoft tools', 'Productivity', 'Career skills'],
  },
  {
    slug: 'digital-dost-creates', number: 2, name: 'Digital Dost Creates', tagline: 'Turn knowledge into content that keeps helping.', icon: 'clapperboard', color: '#EC4899',
    description: 'Short videos, reels, explainers and how-to guides that make one idea easy to understand — and easy to share.',
    formats: ['Short videos', 'Reels', 'Explainers', 'How-to guides', 'Educational posts', 'Visual learning resources'],
    topics: [],
  },
  {
    slug: 'digital-dost-mentors', number: 3, name: 'Digital Dost Mentors', tagline: "Your experience can become someone's direction.", icon: 'compass', color: '#0EA5E9',
    description: 'Career conversations, resume and interview guidance, and honest stories from people who have walked the path.',
    formats: ['Career conversations', 'Resume guidance', 'Mock interviews', 'LinkedIn guidance', 'Industry insights', 'Workplace skills', 'Career stories'],
    topics: [],
  },
  {
    slug: 'digital-dost-cyber', number: 4, name: 'Digital Dost Cyber', tagline: 'Help someone stay safe in the digital world.', icon: 'shield-check', color: '#EF4444',
    description: 'Clear, practical guidance to spot scams and protect personal information — for students, parents and elders.',
    formats: [],
    topics: ['Phishing', 'Fake links', 'OTP scams', 'UPI safety', 'Password safety', 'Fake job offers', 'Social media privacy', 'Personal information', 'Responsible AI'],
  },
  {
    slug: 'digital-dost-ai', number: 5, name: 'Digital Dost AI', tagline: 'Make AI simple, useful and accessible.', icon: 'brain', color: '#8B5CF6',
    description: 'AI explained without jargon — what it is, how to prompt it, and how to use it responsibly for learning and careers.',
    formats: [],
    topics: ['AI fundamentals', 'AI for students', 'Prompting', 'AI for learning', 'AI for careers', 'AI creativity', 'Responsible AI'],
  },
];

const DEFAULT_METRICS = [
  ['resources', 'Resources Created', 'auto', '', 1],
  ['contributors', 'Contributors', 'auto', '', 2],
  ['learning_hours', 'Learning Hours', 'auto', '+', 3],
  ['learners_reached', 'Learners Reached', 'manual', '+', 4],
  ['languages', 'Languages', 'auto', '', 5],
  ['communities', 'Communities Served', 'manual', '+', 6],
];

const DEFAULT_STORAGE_FOLDERS = [
  ['root', 'Digital Daan — Root Drive folder', 1],
  ['ai', 'AI', 2],
  ['cyber-safety', 'Cyber Safety', 3],
  ['careers', 'Careers', 4],
  ['digital-basics', 'Digital Basics', 5],
  ['mentoring', 'Mentoring', 6],
  ['other', 'Other', 7],
];

const labelOf = (list, slug) => (list.find((x) => x.slug === slug) || {}).label || slug;

module.exports = {
  FORMATS, AUDIENCES, LANGUAGES, RESOURCE_STATUSES,
  DEFAULT_CATEGORIES, DEFAULT_ACTIVITIES, DEFAULT_METRICS, DEFAULT_STORAGE_FOLDERS,
  labelOf,
};
