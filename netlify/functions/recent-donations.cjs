const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.NETLIFY_DATABASE_URL)

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' }

  try {
    const rows = await sql`
      SELECT donor_name, amount, created_at
      FROM donations
      WHERE status = 'completed'
        AND donor_name IS NOT NULL
        AND donor_name NOT IN ('Anonymous', 'One-time Donation')
      ORDER BY created_at DESC
      LIMIT 20
    `

    const donations = rows.map(r => ({
      name: r.donor_name.trim(),
      amount: Number(r.amount),
      time: r.created_at,
    }))

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, donations }) }
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: err.message }) }
  }
}
