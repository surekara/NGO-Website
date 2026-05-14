const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.NETLIFY_DATABASE_URL)

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' }
  if (event.httpMethod !== 'GET')
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, error: 'Method not allowed' }) }

  try {
    const rows = await sql`
      SELECT
        referred_by,
        COUNT(*)                                                             AS donors_count,
        COUNT(CASE WHEN subscription_id IS NOT NULL THEN 1 END)             AS sip_count,
        COALESCE(SUM(CASE WHEN subscription_id IS NULL     THEN amount ELSE 0 END), 0) AS onetime_amount,
        COALESCE(SUM(CASE WHEN subscription_id IS NOT NULL THEN amount ELSE 0 END), 0) AS sip_amount
      FROM donations
      WHERE referred_by IS NOT NULL
        AND status = 'completed'
      GROUP BY referred_by
    `

    const donorRows = await sql`
      SELECT
        referred_by,
        donor_name,
        amount,
        subscription_id,
        subscription_amount,
        created_at
      FROM donations
      WHERE referred_by IS NOT NULL
        AND status = 'completed'
      ORDER BY created_at DESC
    `

    const stats = {}
    for (const row of rows) {
      stats[row.referred_by] = {
        donorsCollected:      Number(row.donors_count),
        sipConversions:       Number(row.sip_count),
        totalAmountCollected: Number(row.onetime_amount),
        sipMonthlyAmount:     Number(row.sip_amount),
      }
    }

    const donors = {}
    for (const row of donorRows) {
      if (!donors[row.referred_by]) {
        donors[row.referred_by] = []
      }
      donors[row.referred_by].push({
        name: row.donor_name || 'Anonymous',
        amount: Number(row.amount),
        date: new Date(row.created_at).toISOString().split('T')[0],
        type: row.subscription_id ? 'SIP' : 'One-time',
        sipAmount: row.subscription_amount ? Number(row.subscription_amount) : null,
      })
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, stats, donors }) }
  } catch (err) {
    console.error('student-stats error:', err)
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: err.message }) }
  }
}
