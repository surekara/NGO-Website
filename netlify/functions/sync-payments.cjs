const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.NETLIFY_DATABASE_URL)

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Razorpay credentials not configured' }) }
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')

  try {
    // Fetch last 100 captured payments from Razorpay (from last 7 days)
    const from = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60
    const rzpRes = await fetch(
      `https://api.razorpay.com/v1/payments?count=100&from=${from}&status=captured`,
      { headers: { Authorization: `Basic ${auth}` } }
    )
    const rzpData = await rzpRes.json()

    if (!rzpData.items) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Razorpay API error', detail: rzpData }) }
    }

    let synced = 0
    let skipped = 0

    for (const payment of rzpData.items) {
      const paymentId = payment.id
      const amount = payment.amount / 100
      const notes = payment.notes || {}
      const donorName = notes.donorName || payment.description || 'Anonymous'
      const donorEmail = notes.donorEmail || payment.email || 'sync@razorpay.com'
      const referredBy = notes.referredBy || notes.referred_by || null
      const message = notes.message || ''

      // Check if already in DB
      const existing = await sql`
        SELECT id FROM donations WHERE payment_id = ${paymentId} LIMIT 1
      `

      if (existing.length > 0) {
        // Update status to completed if it's not already
        await sql`
          UPDATE donations SET status = 'completed'
          WHERE payment_id = ${paymentId} AND status != 'completed'
        `
        skipped++
      } else {
        // Insert new record
        await sql`
          INSERT INTO donations (
            donor_name, donor_email, amount, currency,
            payment_type, payment_id, status,
            message, referred_by, created_at
          ) VALUES (
            ${donorName}, ${donorEmail}, ${amount}, 'INR',
            'one-time', ${paymentId}, 'completed',
            ${message}, ${referredBy}, to_timestamp(${payment.created_at})
          )
        `
        synced++
        console.log(`[sync] Inserted: ${paymentId} amount=${amount} referred_by=${referredBy}`)
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Sync complete. ${synced} new payments added, ${skipped} already existed.`,
        synced,
        skipped,
        total: rzpData.items.length,
      }),
    }
  } catch (err) {
    console.error('[sync] Error:', err)
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) }
  }
}
