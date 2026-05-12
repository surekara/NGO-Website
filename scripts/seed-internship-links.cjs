/**
 * Seed script: inserts all 184 COEP Social Internship students into the
 * fundraiser_links table in the Neon DB.
 *
 * Usage:
 *   NETLIFY_DATABASE_URL="your-neon-connection-string" node scripts/seed-internship-links.js
 *
 * Or set NETLIFY_DATABASE_URL in a local .env and run with:
 *   node -r dotenv/config scripts/seed-internship-links.js
 */

const { neon } = require('@neondatabase/serverless')

const DB_URL = process.env.NETLIFY_DATABASE_URL
if (!DB_URL) {
  console.error('❌  Set NETLIFY_DATABASE_URL before running this script.')
  process.exit(1)
}

const sql = neon(DB_URL)

const toSlug = (name) =>
  name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

const rawBatches = [
  /* Batch 1 */ [
    'Ishaan Mudkhedkar','Sharwil Shimpi','Yuvraj Shingate','Chaitanya Sankpal',
    'Aryan Khairkhar','Shambhavi Sachin Jagtap','Supriya Kumari','Amruta Shriramjwar',
    'Sayali Vishwanath Pukale','Vignesh Yogesh Jadhav','Arnav Tejas Padhye',
    'Hanmant Nagnath Hembade','Abhinav Wadhwa','Devaashish Pranav Vaidya',
    'Gandhar Prashant Tawade','Harshwardhan Jagtap','Diya Mehul Metha',
    'Janak Sharad Rahudkar','Meet Vinay Gupta','Sujal Eknath Jadhao',
    'Ashutosh Amit Saxena','Prajwal Ravindra Bendre','Nehal Gandhi',
    'Ishwari Vijay Patil','Ashvin Vishnu Wanjare','Devansh Dwivedi',
    'Shalaka Kudale','Yash Ramprasad Ambhure','Mukul Manohar Bhosale',
    'Chinmay Vikas Chavan','Binitmani Umeshmani Tripathi','Prathmesh Shrikant Darokar',
    'Nihal Rajesh Bhatia','Aaditya Mahesh Narkhedkar','Dipali Balaji Lokhande',
    'Aditi Satish Sawant','Alina Wadhwani','Kalyani Gajanan Jaybhaye',
    'Astha Gupta','Isha Trikutkar','Niraj Kailas Jadhao',
    'Nayan Daulat Suryawanshi','Savari Vishwas Satav','Yash Bhavale',
    'Atharva Nilesh Mohite','Nikhil Shripad Patankar','Vijay Shivram Prajapati',
    'Anvi Pravin Mokal','Vinita Dattatray Kulkarni','Aadya Shah','Aaditya Ashok Ghule',
  ],
  /* Batch 2 */ [
    'Yash Kaloni','Yugal Sandip Bhortake','Akshit Rajesh','Hrucha Sandeshkumar Shinde',
    'Suryansh Pandey','Vishal Venkatesh Bhat','Harsh Pravin Gosavi','Parth Patil',
    'Prajwal Gautam Narwade','Siya Powar','Adwait Prasad Zanjurne','Parshad Sachin Nale',
    'Nehal Deepak Chaudhari','Parth Sachin Nale','Priyesh Sunil Patil',
    'Riddhi Sachin Bendale','Anannya Mirkute','Aman Vinayak Nirmal',
    'Sanjana Anand Ijeri','Soha Dnyaneshwar Borchate','Mayank Singh Bhadouria',
    'Shravan Jitendra More','Rohak Prashant Zalke','Shital Mallinath Pujari',
    'Antara Mukherjee','Samarth Samarth Galande','Saksham Nilesh Patil',
    'Aryan Prashant Gore','Sai Rajeev Hotha','Darsheel Dhammanand Nagrale',
    'Sarthak Neeraj Bhaskar','Ronnit Kasat','Suhani Pratapsinh More',
    'Keshav Pazhayannur','Tanvi Pawar','Aditya Kedar Bavadekar',
    'Sanaa Vikram Joshi','Shruti Santosh Lonkar','Swaraali Jaydeep Joshi',
    'Shravani Dhorey','Himanshu Rushiraj Chouhan','Avaneesh Sudhir Muthal',
    'Janhavi Ghose','Mrudula Vinay Nisal','Vaishnavi Gorakhnath Misal',
    'Hasnain Bohari','Rupak Shivdarshan Ambekar','Mrunmayi Anandkumar Londhe',
    'Shirley Daulatkar','Rushabh Bhairavnath Varule','Khushi Bansal',
  ],
  /* Batch 3 */ [
    'Rohit Manish Jain','Arnav M Katepallewar','Lakshya Mahesh Mithapalli',
    'Parag Navnit Patil','Aryan Sanjay Pol','Anaya Sandeep Gore',
    'Rishabh Manish Rathi','Ishaan Sonawane','Hrida Pattanshetti',
    'Preesha Manoj Motwani','Archit Manoj Deshpande','Ranjeet Jeevan Wakde',
    'Sanchit Baburao Farakate','Aastha Rajesh Patange','Aalap Talegaonkar',
    'Burhanuddin Yusuf Dalal','Rohan Ramdas Dome','Saket Anand Joshi',
    'Sai S Heralgi','Hayyan Hayyur Rehman Shaikh','Megharani Rajendra Gore',
    'Harsh Jaising Yadav','Soham Rajkumar Vibhute','Divij Sandeep Banavali',
    'Atharva Sharma','Saish Vijay Sargar','Charvi Vijaykumar Mulay',
    'Areen Yatin Valsangkar','Tanishk Amit Badal','Divya Baban Sambherao',
    'Shrinivas Digambar Pande','Ashutosh Kumar','Aditya Uddhav Tekale',
    'Redekar Savani Vijay','Krishna Nitin Khilare','Rucha Ganesh Dasnam',
    'Aditya Ramchandra Deshpande','Janhvi Mukund Sahare','Abhinav Kokate',
    'Ayush Adesh Kamble','Purva Mahesh Joshi',
  ],
  /* Batch 4 */ [
    'Sanika Vishnu Awatade','Aarya Paresh Nimkar','Chaitanya Vaishampayan',
    'Himanshu Ramesh Pujari','Vedant Makarand Ranmale','Keshav Ganesh Miniyar',
    'Dhruva Satpute','Atharva Kamble','Aryan Khairkhar','Pranjal Dattatray Hile',
    'Shourya Mohite','Nidhi Vishwakarma','Bhargav Gorane','Aryan Santosh Divekar',
    'Manav Dhanraj Rachetti','Utkarsh Umashankar Gupta','Amogh Abhay Kulkarni',
    'Shreyak Girish Kadam','Shrihan Kedar Kulkarni','Ashish Arwade',
    'Raj Desai','Yashwardhan Bhame','Prathamesh Santosh More','Arush Ashish Kalawar',
    'Atharva Hemant Desai','Paritosh Prasanna Arkadi','Swapnali Santosh Mali',
    'Dnyaneshwari Jalindar Jadhav','Shivam Santosh Gole','Amol Mahesh Bhoye',
    'Parth Prashant Baride','Karan Mahadev Kadam','Alok Madhav Kadam',
    'Atharv S Jadhav','Harshit Ramesh Shirol','Harshit Sandip Gahukar',
    'Mitali Rohan Bhindwale','Aryan Ganesh Kale','Ruturaj Rushikesh Dhotre',
    'Avishkar Karande','Pransh Govind Chandak',
  ],
]

/* Build student list with unique slugs (same logic as studentsData.js) */
const rawList = rawBatches.flatMap((names, bi) =>
  names.map(name => ({ name, batch: bi + 1 }))
)
const slugCount = {}
rawList.forEach(s => {
  const base = toSlug(s.name)
  slugCount[base] = (slugCount[base] || 0) + 1
})
const slugUsed = {}
const students = rawList.map((s, i) => {
  const base = toSlug(s.name)
  let slug = slugCount[base] > 1 ? `${base}-b${s.batch}` : base
  if (slugUsed[slug]) slug = `${slug}-2`
  slugUsed[slug] = true
  return { name: s.name, batch: s.batch, slug }
})

async function seed () {
  /* Ensure table exists */
  await sql`
    CREATE TABLE IF NOT EXISTS fundraiser_links (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(100) UNIQUE NOT NULL,
      student_name VARCHAR(200) NOT NULL,
      roll_no VARCHAR(50),
      batch VARCHAR(50),
      is_active BOOLEAN DEFAULT true,
      show_on_dashboard BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `

  let inserted = 0, skipped = 0
  for (const s of students) {
    const batchLabel = `COEP Social Internship - Batch ${s.batch}`
    const result = await sql`
      INSERT INTO fundraiser_links (slug, student_name, batch)
      VALUES (${s.slug}, ${s.name}, ${batchLabel})
      ON CONFLICT (slug) DO NOTHING
      RETURNING id
    `
    if (result.length > 0) inserted++
    else skipped++
    process.stdout.write(`\r  ✅ ${inserted} inserted, ⏭️  ${skipped} skipped (${inserted + skipped}/${students.length})`)
  }

  console.log(`\n\n✅ Done! ${inserted} new records inserted, ${skipped} already existed.`)
}

seed().catch(err => {
  console.error('\n❌ Seed failed:', err.message)
  process.exit(1)
})
