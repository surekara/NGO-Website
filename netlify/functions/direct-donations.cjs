const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.NETLIFY_DATABASE_URL)

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, x-direct-password',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method Not Allowed' }),
    }
  }

  try {
    const incomingPassword =
      event.headers?.['x-direct-password'] ||
      event.headers?.['X-Direct-Password'] ||
      ''

    const expectedPassword = process.env.DIRECT_DONATIONS_PASSWORD || ''

    if (!expectedPassword) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ success: false, error: 'Server password not configured' }),
      }
    }

    if (incomingPassword !== expectedPassword) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, error: 'Invalid password' }),
      }
    }

    const rows = await sql`
      SELECT donor_name, amount, subscription_id, created_at, referred_by
      FROM donations
      WHERE status = 'completed'
      ORDER BY created_at DESC
    `

    const donors = rows.map((row) => ({
      name: row.donor_name || 'Anonymous',
      amount: Number(row.amount),
      date: new Date(row.created_at).toISOString().split('T')[0],
      type: row.subscription_id ? 'SIP' : 'One-time',
      referredBy: row.referred_by || null,
    }))

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, donors }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message }),
    }
  }
}
