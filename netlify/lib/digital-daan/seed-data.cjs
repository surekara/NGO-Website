// Launch campaign (real) + clearly-flagged DEMO content so the platform looks complete
// during development. Demo rows have is_demo = true and can be removed from the admin
// console ("Remove demo content") once real resources are published.
const { query, one } = require('./db.cjs');

const CAMPAIGN = {
  slug: 'october-2026',
  name: 'Prachetas × Microsoft — Digital Daan | October 2026',
  short_name: 'October 2026',
  tagline: 'Give a Skill. Create an Opportunity.',
  description:
    'The launch campaign of Digital Daan. Throughout October 2026, volunteers from Microsoft join Prachetas Foundation to teach, create, mentor and share practical digital knowledge — building a library that keeps helping long after the month ends.',
  partner: 'Microsoft',
  start_date: '2026-10-01',
  end_date: '2026-10-31',
  status: 'published',
  featured: true,
};

const all = { name: true, photo: true, designation: true, organisation: true, linkedin: true, bio: true };

const CONTRIBUTORS = [
  { key: 'ananya', name: 'Ananya Kulkarni', designation: 'Software Engineer', expertise: 'AI tools, learning technology', bio: 'Builds learning software and loves showing students how to use AI as a study partner rather than a shortcut.', public_fields: all },
  { key: 'rohan', name: 'Rohan Deshpande', designation: 'Cloud Solutions Architect', expertise: 'Productivity, cloud, Microsoft 365', bio: 'Helps teams work smarter with simple tools. Believes most productivity problems are solved with three good habits.', public_fields: { ...all, linkedin: false } },
  { key: 'priya', name: 'Priya Nair', designation: 'Talent Acquisition Partner', expertise: 'Resumes, interviews, career planning', bio: 'Has reviewed thousands of resumes and wants every first-time job seeker to know what recruiters actually look for.', public_fields: all },
  { key: 'vikram', name: 'Vikram Joshi', designation: 'Security Analyst', expertise: 'Cyber safety, fraud awareness', bio: 'Spends his days investigating scams — and his weekends teaching families how to avoid them.', public_fields: { ...all, photo: false } },
  { key: 'sneha', name: 'Sneha Patil', designation: 'Program Manager', expertise: 'Community learning, Marathi content', bio: 'Creates learning content in Marathi so that language is never a barrier to digital confidence.', public_fields: all },
  { key: 'private', name: 'Anonymous Volunteer', designation: 'Product Designer', expertise: 'Digital basics', bio: null, public_fields: { name: false, photo: false, designation: false, organisation: false, linkedin: false, bio: false } },
];

const R = (o) => ({ campaign: true, audiences: [], tags: [], language: 'en', ...o });

const RESOURCES = [
  R({
    slug: '5-ways-students-can-use-ai', title: '5 Ways Students Can Use AI for Better Learning', category: 'ai', activity: 'digital-dost-ai', type: 'video', duration: 5, contributor: 'ananya', featured: true, rank: 1, days: 2,
    audiences: ['school-students', 'college-students'], tags: ['ai for students', 'study skills', 'research'],
    short: 'A practical introduction to using AI for research, learning, study planning and creativity.',
    detailed: 'AI can be a brilliant study partner — if you use it to think better, not to think less. This short video walks through five everyday ways students can use AI tools to understand topics, plan their studies and get feedback on their own work.',
    body: `## What you will learn
- How to ask AI to explain a difficult topic at your level
- How to turn a syllabus into a realistic weekly study plan
- How to use AI to quiz yourself before an exam
- How to get feedback on your writing without letting AI write it for you
- How to check AI answers so you don't learn something wrong

## The five ways
### 1. Explain it simply
Ask: **"Explain photosynthesis as if I am in Class 8, then give me one real-life example."** Then ask a follow-up question about the part you still don't understand.

### 2. Build a study plan
Share your exam date and chapters, and ask for a plan with short daily sessions and revision days.

### 3. Quiz yourself
Ask for five questions on a chapter — and answer them yourself before looking at the answers.

### 4. Get feedback, not answers
Paste your own paragraph and ask: "What is unclear here? Don't rewrite it — just point out problems."

### 5. Always verify
AI can be confidently wrong. Cross-check important facts with your textbook or a trusted source.

> The goal is not to finish homework faster. The goal is to understand more.`,
  }),
  R({
    slug: 'how-to-spot-a-fake-job-offer', title: 'How to Spot a Fake Job Offer', category: 'cyber-safety', activity: 'digital-dost-cyber', type: 'guide', duration: 7, contributor: 'vikram', featured: true, rank: 2, days: 4,
    audiences: ['job-seekers', 'college-students'], tags: ['job scams', 'fraud', 'whatsapp scams'],
    short: 'Seven warning signs of job scams — and exactly what to do if you receive a suspicious offer.',
    detailed: 'Job scams target people when they are most hopeful. This step-by-step guide explains how fake recruiters operate, the red flags to look for, and how to verify an offer safely.',
    body: `## Why job scams work
Scammers know that job seekers are eager and often under pressure. They create urgency, promise easy money and ask for small payments that quickly grow.

## Seven red flags
1. **You never applied.** An "offer" arrives on WhatsApp or Telegram out of nowhere.
2. **They ask you to pay.** Registration fees, training fees or "security deposits" are never part of a genuine job.
3. **Too good to be true.** ₹50,000 a month for liking videos or rating products is a scam.
4. **No real interview.** Genuine employers talk to you properly before hiring.
5. **Personal email or chat only.** Recruiters use official company email addresses.
6. **Pressure to decide now.** "Only 2 seats left, pay today" is a classic tactic.
7. **They want your documents or OTP.** Never share Aadhaar, PAN, bank details or OTPs early.

## How to verify an offer
- Search the company's official website and careers page
- Call the company using the number on its official website — not the one in the message
- Look up the recruiter on LinkedIn and check their history

## If you have been targeted
- Stop all communication and do not pay anything more
- Report it at **cybercrime.gov.in** or call **1930** (National Cyber Crime Helpline)
- Tell a friend or family member — scammers rely on silence`,
  }),
  R({
    slug: 'understanding-upi-safely', title: 'Understanding UPI Safely', category: 'digital-payments', activity: 'digital-dost-live', type: 'session', duration: 25, contributor: 'rohan', days: 6,
    audiences: ['community', 'parents', 'beginners'], tags: ['upi', 'payments', 'fraud prevention'],
    short: 'A recorded community session on paying, receiving and staying safe with UPI.',
    detailed: 'UPI has made payments effortless — and made scammers busier. In this recorded session, we cover how UPI works, the difference between paying and receiving, and the common tricks fraudsters use.',
    body: `## Session highlights
- How a UPI payment actually works
- **You never need your PIN to receive money.** If someone asks you to enter a PIN to "receive" a payment, it is a scam.
- Why you should never scan a QR code sent by a stranger to receive money
- How to check the name before you confirm a payment
- What to do immediately if money is taken from your account

## Quick safety checklist
- Keep your UPI PIN private — not even bank staff need it
- Turn on app lock for your payment apps
- Check transaction alerts regularly
- Report fraud quickly: call **1930** or visit **cybercrime.gov.in**`,
  }),
  R({
    slug: 'what-i-wish-i-knew-before-my-first-job', title: 'What I Wish I Knew Before My First Job', category: 'careers', activity: 'digital-dost-mentors', type: 'mentor-story', duration: 6, contributor: 'priya', days: 8,
    audiences: ['college-students', 'job-seekers'], tags: ['first job', 'career advice', 'workplace skills'],
    short: 'Honest lessons from a hiring professional on the things nobody tells you before you start working.',
    detailed: 'A personal story about the first year at work — the mistakes, the surprises, and the small habits that made the biggest difference.',
    body: `I joined my first company convinced that my marks would speak for me. They didn't. Here is what I learned — some of it the hard way.

## 1. Asking questions is a skill, not a weakness
In my first month, I stayed stuck on a task for two days because I didn't want to look inexperienced. My manager later told me she would have helped in ten minutes. **Try for a reasonable time, then ask — clearly and with what you have already tried.**

## 2. Communication matters as much as the work
A short update — "Done with X, starting Y, blocked on Z" — builds more trust than silent hard work.

## 3. Your first job is a classroom
You will not stay in your first role forever. Learn how teams work, how decisions are made and what you enjoy.

## 4. Find one mentor
It doesn't need to be formal. One person you can ask "Is this normal?" is incredibly valuable.

## 5. Look after yourself
Late nights feel productive but rarely are. Consistency beats heroics.

> Nobody expects you to know everything on day one. They expect you to be curious, reliable and willing to learn.`,
  }),
  R({
    slug: 'work-smarter-with-microsoft-tools', title: '5 Simple Ways to Work Smarter with Microsoft Tools', category: 'productivity', activity: 'digital-dost-live', type: 'video', duration: 12, contributor: 'rohan', featured: true, rank: 4, days: 10,
    audiences: ['college-students', 'teachers', 'job-seekers'], tags: ['microsoft 365', 'productivity', 'word', 'excel', 'onenote'],
    short: 'Everyday features in Word, Excel, OneNote and Outlook that save real time.',
    detailed: 'You don’t need to be a power user to save hours each week. This session covers five simple features that most people never discover.',
    body: `## The five tips
1. **Word — Styles and Navigation Pane.** Use Heading styles and jump around long documents instantly.
2. **Excel — Tables and Filters.** Turn any range into a Table (Ctrl + T) for instant sorting, filtering and totals.
3. **OneNote — One notebook per subject.** Keep class notes, links and screenshots in one searchable place.
4. **Outlook — Rules and Focused Inbox.** Let important emails rise to the top automatically.
5. **Search everything.** Use the search bar at the top of any Microsoft 365 app to find commands you don't know the location of.`,
  }),
  R({
    slug: 'building-your-first-resume', title: 'Building Your First Resume', category: 'careers', activity: 'digital-dost-mentors', type: 'guide', duration: 10, contributor: 'priya', days: 12,
    audiences: ['college-students', 'job-seekers'], tags: ['resume', 'cv', 'job search'],
    short: 'A step-by-step guide to a clear, honest one-page resume — even with no work experience.',
    detailed: 'Recruiters spend less than a minute on a first look at a resume. This guide shows you how to make that minute count.',
    body: `## Step 1: Keep it to one page
For students and freshers, one clear page is ideal.

## Step 2: Start with the basics
Name, phone, professional email, city and LinkedIn profile. No photo, date of birth or full address is needed.

## Step 3: Write a two-line summary
Example: **"Final-year B.Com student with strong Excel skills and experience organising college events. Looking for an entry-level accounts role."**

## Step 4: Show what you did, not just what you were
Instead of "Member of NSS", write "Organised a blood donation camp with 120 donors as part of NSS".

## Step 5: Add skills you can prove
List tools and skills you could demonstrate in an interview.

## Step 6: Check before you send
- Spelling and grammar
- Consistent formatting
- Save as PDF with a clear file name: FirstName-LastName-Resume.pdf`,
  }),
  R({
    slug: 'cyber-safety-quiz-spot-the-scam', title: 'Cyber Safety Quiz: Can You Spot the Scam?', category: 'cyber-safety', activity: 'digital-dost-cyber', type: 'quiz', duration: 4, contributor: 'vikram', featured: true, rank: 3, days: 3,
    audiences: ['school-students', 'college-students', 'parents', 'community'], tags: ['quiz', 'scams', 'phishing', 'otp'],
    short: 'Six quick real-life situations. Can you tell what is safe and what is a scam?',
    detailed: 'Test your instincts with everyday situations that people across India face. Each answer comes with a short explanation.',
    quiz: [
      { q: 'You get an SMS: "Your electricity will be disconnected tonight. Call this number immediately." What should you do?', options: ['Call the number right away', 'Ignore it and check with your electricity provider through its official app or website', 'Reply with your account number'], answer: 1, explain: 'Urgent disconnection messages from unknown numbers are a common scam. Always verify through official channels.' },
      { q: 'Someone says they sent you money by mistake and asks you to enter your UPI PIN to accept it. Is this safe?', options: ['Yes, that is how you receive money', 'No — you never need a PIN to receive money'], answer: 1, explain: 'A UPI PIN is only needed to send money. Entering it means you are paying.' },
      { q: 'A "bank officer" calls and asks for the OTP you just received. What do you do?', options: ['Share it — they are from the bank', 'Never share it and hang up'], answer: 1, explain: 'No genuine bank employee will ever ask for your OTP.' },
      { q: 'Which password is the strongest?', options: ['Rahul@123', 'mango-bicycle-river-42', '12345678'], answer: 1, explain: 'Long passphrases made of random words are strong and easy to remember.' },
      { q: 'An offer says you can earn ₹3,000 a day by liking YouTube videos after paying a ₹500 joining fee. This is…', options: ['A great opportunity', 'A task scam'], answer: 1, explain: 'Genuine jobs never ask you to pay to join. "Task" scams start small and then take much more.' },
      { q: 'Where can you report cyber fraud in India?', options: ['cybercrime.gov.in or helpline 1930', 'Only at your bank branch', 'Nowhere'], answer: 0, explain: 'Report quickly at cybercrime.gov.in or call 1930 — speed improves the chance of recovering money.' },
    ],
  }),
  R({
    slug: 'prompting-101-ask-ai-better-questions', title: 'Prompting 101: How to Ask AI Better Questions', category: 'ai', activity: 'digital-dost-ai', type: 'guide', duration: 8, contributor: 'ananya', days: 5,
    audiences: ['beginners', 'college-students', 'teachers'], tags: ['prompting', 'ai basics', 'chatbots'],
    short: 'A simple framework to get clearer, more useful answers from AI assistants.',
    detailed: 'Better questions give better answers. Learn the four ingredients of a good prompt with before-and-after examples.',
    body: `## The four ingredients of a good prompt
1. **Role** — who should the AI act as? ("You are a patient maths teacher…")
2. **Task** — what exactly do you want? ("Explain fractions…")
3. **Context** — who is it for and why? ("…for a Class 5 student who finds maths scary")
4. **Format** — how should the answer look? ("Use 3 short steps and one example with food")

## Before and after
**Weak:** "Tell me about budgeting."

**Better:** "You are a friendly finance coach. Explain how a college student living on ₹8,000 a month can make a simple budget. Give a table with 5 categories and one saving tip."

## Keep the conversation going
- "Make it simpler."
- "Give me an example from everyday life in India."
- "What are the limitations of this advice?"

## Remember
Never share passwords, OTPs, Aadhaar numbers or private information in a prompt.`,
  }),
  R({
    slug: 'strong-passwords-you-can-remember', title: 'Creating Strong Passwords You Can Remember', category: 'online-safety', activity: 'digital-dost-creates', type: 'reel', duration: 1, contributor: 'sneha', days: 1,
    audiences: ['school-students', 'parents', 'beginners'], tags: ['passwords', 'account security'],
    short: 'A 60-second explainer on passphrases — the easiest way to a strong password.',
    detailed: 'Short, memorable and practical: why length beats complexity, and how to build a passphrase in seconds.',
    body: `## Key points
- **Length beats complexity.** Four random words are stronger than a short password with symbols.
- Use a different password for your email — it unlocks everything else.
- Turn on two-step verification wherever you can.`,
  }),
  R({
    slug: 'using-ai-responsibly-students-parents', title: 'Using AI Responsibly: A Guide for Students and Parents', category: 'responsible-ai', activity: 'digital-dost-ai', type: 'article', duration: 6, contributor: 'ananya', days: 9,
    audiences: ['parents', 'school-students', 'teachers'], tags: ['responsible ai', 'ethics', 'parenting'],
    short: 'How families can talk about AI honestly — covering accuracy, privacy, fairness and schoolwork.',
    detailed: 'AI tools are already in our children’s lives. This article gives parents and students a shared, simple set of principles.',
    body: `AI tools can help children learn — but only when they are used thoughtfully. Here are five conversations worth having at home.

## 1. AI can be wrong
AI tools sometimes produce answers that sound confident but are incorrect. Encourage checking important facts.

## 2. Privacy first
Personal details, photos and school information should not be shared with AI tools.

## 3. Learning, not copying
Using AI to understand a topic is great. Submitting AI-written work as your own is not. Many schools now have clear rules — read them together.

## 4. AI can be unfair
AI learns from data, and data can carry bias. Talk about why an answer might not be fair to everyone.

## 5. Humans stay in charge
AI is a tool. Decisions — especially important ones — should be made by people.

> A good rule for families: **if you wouldn't be comfortable explaining how you used AI, don't use it that way.**`,
  }),
  R({
    slug: 'otp-kabhi-share-na-karein', title: 'OTP कभी किसी से साझा न करें', category: 'cyber-safety', activity: 'digital-dost-cyber', type: 'article', duration: 3, contributor: 'vikram', language: 'hi', days: 7,
    audiences: ['community', 'parents', 'beginners'], tags: ['otp', 'बैंक धोखाधड़ी', 'cyber safety'],
    short: 'OTP आपकी डिजिटल चाबी है। जानिए धोखेबाज़ इसे कैसे माँगते हैं और खुद को कैसे बचाएँ।',
    detailed: 'बैंक, डिलीवरी या KYC के नाम पर आने वाले कॉल और मैसेज से सावधान रहें। यह छोटा लेख हर परिवार के लिए है।',
    body: `## OTP क्या है?
OTP (वन-टाइम पासवर्ड) एक बार इस्तेमाल होने वाला कोड है जो आपके पैसे और खातों की सुरक्षा करता है।

## धोखेबाज़ कैसे माँगते हैं?
- "मैं बैंक से बोल रहा हूँ, आपका KYC अपडेट करना है"
- "आपका पार्सल अटका है, OTP बताइए"
- "आपको इनाम मिला है, OTP से पुष्टि कीजिए"

## याद रखें
- **कोई भी बैंक कर्मचारी कभी OTP नहीं माँगता।**
- OTP माँगे जाने पर तुरंत फ़ोन काट दें।
- धोखाधड़ी होने पर तुरंत **1930** पर कॉल करें या **cybercrime.gov.in** पर शिकायत करें।`,
  }),
  R({
    slug: 'online-fasavnuk-kashi-olkhavi', title: 'ऑनलाइन फसवणूक कशी ओळखावी', category: 'online-safety', activity: 'digital-dost-cyber', type: 'article', duration: 4, contributor: 'sneha', language: 'mr', days: 11,
    audiences: ['community', 'parents'], tags: ['फसवणूक', 'online safety', 'marathi'],
    short: 'फसव्या लिंक, बनावट कॉल आणि खोट्या ऑफर्स ओळखण्यासाठी सोपे उपाय.',
    detailed: 'घरातील प्रत्येकासाठी — ऑनलाइन फसवणुकीची सर्वसाधारण लक्षणे आणि सुरक्षित राहण्याचे मार्ग.',
    body: `## फसवणुकीची लक्षणे
- **घाई करायला लावणे:** "आत्ताच पैसे भरा, नाहीतर खाते बंद होईल"
- **खूप चांगली ऑफर:** "मोफत iPhone जिंकला आहात!"
- **अनोळखी लिंक:** SMS किंवा WhatsApp वरील संशयास्पद लिंक

## सुरक्षित राहण्यासाठी
- अनोळखी लिंकवर क्लिक करू नका
- OTP, PIN किंवा पासवर्ड कोणालाही सांगू नका
- शंका असल्यास कुटुंबातील व्यक्तीशी बोला
- फसवणूक झाल्यास **1930** वर कॉल करा किंवा **cybercrime.gov.in** वर तक्रार नोंदवा`,
  }),
  R({
    slug: 'linkedin-profile-that-gets-noticed', title: 'How to Write a LinkedIn Profile That Gets Noticed', category: 'careers', activity: 'digital-dost-mentors', type: 'article', duration: 7, contributor: 'priya', days: 13,
    audiences: ['college-students', 'job-seekers'], tags: ['linkedin', 'personal branding', 'networking'],
    short: 'Headline, About section and skills — a simple checklist for a profile recruiters actually read.',
    detailed: 'Your LinkedIn profile is often the first thing a recruiter sees. Small changes make a big difference.',
    body: `## Your headline
Go beyond "Student". Try: **"Computer Science student | Python & data analysis | Looking for internships"**.

## Your About section
Three short paragraphs: who you are, what you're good at, and what you're looking for.

## Skills and proof
Add projects, certificates and volunteering. Link to your work wherever possible.

## Be active
Share what you are learning once a week. Consistency builds visibility.`,
  }),
  R({
    slug: 'getting-started-with-email', title: "Getting Started with Email: A Beginner's Guide", category: 'digital-basics', activity: 'digital-dost-live', type: 'guide', duration: 10, contributor: 'private', days: 14,
    audiences: ['beginners', 'community', 'parents'], tags: ['email', 'digital basics', 'getting started'],
    short: 'Create an account, send your first email and keep your inbox safe — explained step by step.',
    detailed: 'Email is the key to jobs, government services and online accounts. This guide is for anyone starting from zero.',
    body: `## Step 1: Create your account
Choose a professional address, such as **firstname.lastname@…**. Avoid nicknames.

## Step 2: Write your first email
- **To:** the person's email address
- **Subject:** a short summary, like "Application for Data Entry Role"
- **Message:** greeting, a few clear lines, and your name

## Step 3: Attach a file
Use the paperclip icon to attach documents such as your resume.

## Step 4: Stay safe
- Never open attachments from people you don't know
- Check the sender's address carefully
- Turn on two-step verification`,
  }),
  R({
    slug: 'ai-quiz-how-well-do-you-know-ai', title: 'AI Quiz: How Well Do You Know AI?', category: 'ai', activity: 'digital-dost-ai', type: 'quiz', duration: 3, contributor: 'ananya', days: 0,
    audiences: ['school-students', 'college-students', 'beginners'], tags: ['quiz', 'ai basics'],
    short: 'Five quick questions to test your understanding of what AI can — and can’t — do.',
    detailed: 'A light, friendly quiz on AI fundamentals and responsible use.',
    quiz: [
      { q: 'Can AI tools make mistakes even when they sound confident?', options: ['No, AI is always correct', 'Yes, AI can be confidently wrong'], answer: 1, explain: 'AI generates likely-sounding answers. Always verify important facts.' },
      { q: 'Which of these is safe to share with an AI chatbot?', options: ['Your bank password', 'A general question about a science topic', 'Your Aadhaar number'], answer: 1, explain: 'Never share passwords or personal identity details.' },
      { q: 'What makes a prompt better?', options: ['Being vague', 'Giving role, task, context and format', 'Typing in capital letters'], answer: 1, explain: 'Clear instructions lead to clearer answers.' },
      { q: 'Using AI to explain a difficult chapter is…', options: ['A good way to learn', 'Always cheating'], answer: 0, explain: 'Using AI to understand is great — submitting AI work as your own is not.' },
      { q: 'Who should make important decisions?', options: ['AI alone', 'People, using AI as one input'], answer: 1, explain: 'Humans stay responsible for decisions.' },
    ],
  }),
];

const COLLECTIONS = [
  { slug: 'start-your-digital-journey', name: 'Start Your Digital Journey', description: 'Beginner-friendly resources for getting confident online.', items: ['getting-started-with-email', 'understanding-upi-safely', 'strong-passwords-you-can-remember', 'otp-kabhi-share-na-karein'] },
  { slug: 'ai-for-students', name: 'AI for Students', description: 'Use AI to learn better — thoughtfully and responsibly.', items: ['5-ways-students-can-use-ai', 'prompting-101-ask-ai-better-questions', 'using-ai-responsibly-students-parents', 'ai-quiz-how-well-do-you-know-ai'] },
  { slug: 'stay-safe-online', name: 'Stay Safe Online', description: 'Recognise scams and protect yourself and your family.', items: ['how-to-spot-a-fake-job-offer', 'cyber-safety-quiz-spot-the-scam', 'strong-passwords-you-can-remember', 'otp-kabhi-share-na-karein', 'online-fasavnuk-kashi-olkhavi'] },
  { slug: 'build-your-career', name: 'Build Your Career', description: 'Resumes, profiles and honest advice for your first job.', items: ['building-your-first-resume', 'what-i-wish-i-knew-before-my-first-job', 'linkedin-profile-that-gets-noticed'] },
];

const seedDemo = async () => {
  const campaign = await one(
    `INSERT INTO dd_campaigns (slug, name, short_name, tagline, description, partner, start_date, end_date, status, featured)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     ON CONFLICT (slug) DO UPDATE SET slug = EXCLUDED.slug RETURNING id`,
    [CAMPAIGN.slug, CAMPAIGN.name, CAMPAIGN.short_name, CAMPAIGN.tagline, CAMPAIGN.description, CAMPAIGN.partner, CAMPAIGN.start_date, CAMPAIGN.end_date, CAMPAIGN.status, CAMPAIGN.featured],
  );

  const contributorIds = {};
  for (const c of CONTRIBUTORS) {
    const slug = c.public_fields.name ? c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `volunteer-demo-${c.key}`;
    const row = await one(
      `INSERT INTO dd_contributors (slug, name, designation, expertise, bio, public_fields, status, is_demo)
       VALUES ($1,$2,$3,$4,$5,$6,'approved',true)
       ON CONFLICT (slug) DO UPDATE SET slug = EXCLUDED.slug RETURNING id`,
      [slug, c.name, c.designation, c.expertise, c.bio, JSON.stringify(c.public_fields)],
    );
    contributorIds[c.key] = row.id;
  }

  const cats = Object.fromEntries((await query(`SELECT id, slug FROM dd_categories`)).map((r) => [r.slug, r.id]));
  const acts = Object.fromEntries((await query(`SELECT id, slug FROM dd_activities`)).map((r) => [r.slug, r.id]));

  const resourceIds = {};
  for (const r of RESOURCES) {
    const row = await one(
      `INSERT INTO dd_resources (slug, title, short_description, detailed_description, body, quiz, category_id, activity_id, content_type,
          audiences, language, duration_minutes, contributor_id, tags, status, featured, featured_rank, is_demo, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'published',$15,$16,true, NOW() - ($17 || ' days')::interval)
       ON CONFLICT (slug) DO UPDATE SET slug = EXCLUDED.slug RETURNING id`,
      [r.slug, r.title, r.short, r.detailed, r.body || null, r.quiz ? JSON.stringify(r.quiz) : null, cats[r.category], acts[r.activity], r.type,
        r.audiences, r.language, r.duration, contributorIds[r.contributor], r.tags, !!r.featured, r.rank || 100, String(r.days)],
    );
    resourceIds[r.slug] = row.id;
    if (r.campaign) {
      await query(`INSERT INTO dd_resource_campaigns (resource_id, campaign_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [row.id, campaign.id]);
    }
  }

  for (const [i, c] of COLLECTIONS.entries()) {
    const row = await one(
      `INSERT INTO dd_collections (slug, name, description, sort_order) VALUES ($1,$2,$3,$4)
       ON CONFLICT (slug) DO UPDATE SET slug = EXCLUDED.slug RETURNING id`,
      [c.slug, c.name, c.description, (i + 1) * 10],
    );
    for (const [pos, s] of c.items.entries()) {
      if (resourceIds[s]) {
        await query(`INSERT INTO dd_collection_resources (collection_id, resource_id, position) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`, [row.id, resourceIds[s], pos]);
      }
    }
  }
};

module.exports = { seedDemo };
