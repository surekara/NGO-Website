const crypto = require('crypto')
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.NETLIFY_DATABASE_URL)

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const rawBody = event.body
  const signature = event.headers['x-razorpay-signature']
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET

  // Verify webhook signature
  if (secret && signature) {
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex')
    if (expectedSig !== signature) {
      console.error('[Webhook] Invalid signature')
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid signature' }) }
    }
  }

  let payload
  try {
    payload = JSON.parse(rawBody)
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const event_type = payload.event
  console.log('[Webhook] Event received:', event_type)

  // Handle payment captured (one-time)
  if (event_type === 'payment.captured') {
    const payment = payload.payload?.payment?.entity
    if (!payment) return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) }

    const paymentId = payment.id
    const amount = payment.amount / 100 // paise to rupees
    const notes = payment.notes || {}
    const donorName = notes.donorName || payment.description || 'Anonymous'
    const donorEmail = notes.donorEmail || payment.email || 'webhook@razorpay.com'
    const referredBy = notes.referredBy || notes.referred_by || null
    const message = notes.message || ''

    try {
      // Check if donation already exists with this payment_id
      const existing = await sql`
        SELECT id, status FROM donations WHERE payment_id = ${paymentId} LIMIT 1
      `

      if (existing.length > 0) {
        // Update existing record to completed
        await sql`
          UPDATE donations
          SET status = 'completed', payment_id = ${paymentId}
          WHERE payment_id = ${paymentId}
        `
        console.log('[Webhook] Updated existing donation:', paymentId)
      } else {
        // Create new donation record
        await sql`
          INSERT INTO donations (
            donor_name, donor_email, amount, currency,
            payment_type, payment_id, status,
            message, referred_by, created_at
          ) VALUES (
            ${donorName}, ${donorEmail}, ${amount}, 'INR',
            'one-time', ${paymentId}, 'completed',
            ${message}, ${referredBy}, NOW()
          )
        `
        console.log('[Webhook] Created new donation:', paymentId, 'referred_by:', referredBy)
      }
    } catch (err) {
      console.error('[Webhook] DB error:', err.message)
      return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) }
    }
  }

  // Handle subscription payment (SIP)
  if (event_type === 'subscription.charged') {
    const payment = payload.payload?.payment?.entity
    const subscription = payload.payload?.subscription?.entity
    if (!payment || !subscription) return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) }

    const paymentId = payment.id
    const subscriptionId = subscription.id
    const amount = payment.amount / 100
    const notes = subscription.notes || payment.notes || {}
    const donorName = notes.donorName || 'Anonymous'
    const donorEmail = notes.donorEmail || payment.email || 'webhook@razorpay.com'
    const referredBy = notes.referredBy || notes.referred_by || null
    const message = notes.message || ''

    try {
      const existing = await sql`
        SELECT id FROM donations WHERE payment_id = ${paymentId} LIMIT 1
      `

      if (existing.length === 0) {
        await sql`
          INSERT INTO donations (
            donor_name, donor_email, amount, currency,
            payment_type, payment_id, subscription_id, status,
            message, referred_by, created_at
          ) VALUES (
            ${donorName}, ${donorEmail}, ${amount}, 'INR',
            'monthly', ${paymentId}, ${subscriptionId}, 'completed',
            ${message}, ${referredBy}, NOW()
          )
        `
        console.log('[Webhook] Created SIP donation:', paymentId, 'sub:', subscriptionId)
      }
    } catch (err) {
      console.error('[Webhook] DB error:', err.message)
      return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) }
    }
  }

  return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) }
}
