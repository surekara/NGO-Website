const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.NETLIFY_DATABASE_URL);

// Updated to support GET endpoint for fetching donors by slug
const ensureReferredByColumn = async () => {
  try {
    await sql`ALTER TABLE donations ADD COLUMN IF NOT EXISTS referred_by VARCHAR(100)`;
  } catch (_) {}
};

exports.handler = async (event, context) => {
  console.log('💾 Donations function called:', event.httpMethod);
  await ensureReferredByColumn();

  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, PATCH, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'GET') {
    try {
      const params = event.queryStringParameters || {};
      if (params.slug) {
        const rows = await sql`
          SELECT
            donor_name,
            amount,
            subscription_id,
            subscription_amount,
            created_at
          FROM donations
          WHERE referred_by = ${params.slug}
            AND status = 'completed'
          ORDER BY created_at DESC
        `;
        const donors = rows.map(row => ({
          name: row.donor_name || 'Anonymous',
          amount: Number(row.amount),
          date: new Date(row.created_at).toISOString().split('T')[0],
          type: row.subscription_id ? 'SIP' : 'One-time',
          sipAmount: row.subscription_amount ? Number(row.subscription_amount) : null,
        }));
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, donors })
        };
      }
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Missing slug parameter' })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ success: false, error: error.message })
      };
    }
  }

  if (event.httpMethod === 'POST') {
    try {
      const donationData = JSON.parse(event.body);
      console.log('📝 Creating donation:', donationData);

      if (!donationData.donorName || !donationData.donorEmail || !donationData.amount) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Missing required fields' })
        };
      }

      const result = await sql`
        INSERT INTO donations (
          donor_name, donor_email, donor_phone, address, pan_card,
          amount, currency, payment_type, payment_id, subscription_id,
          status, message, receive_updates, payment_method, created_at, referred_by
        ) VALUES (
          ${donationData.donorName},
          ${donationData.donorEmail},
          ${donationData.donorPhone || ''},
          ${donationData.address || ''},
          ${donationData.panCard || ''},
          ${donationData.amount},
          ${donationData.currency || 'INR'},
          ${donationData.paymentType || 'one_time'},
          ${donationData.paymentId || null},
          ${donationData.subscriptionId || null},
          ${donationData.status || 'completed'},
          ${donationData.message || ''},
          ${donationData.receiveUpdates || true},
          ${donationData.paymentMethod || 'razorpay'},
          ${donationData.createdAt || new Date().toISOString()},
          ${donationData.referredBy || null}
        ) RETURNING id, payment_id;
      `;

      console.log('✅ Donation saved:', result[0]);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          donation: result[0],
          message: 'Donation saved successfully'
        })
      };

    } catch (error) {
      console.error('❌ Error saving donation:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: error.message || 'Failed to save donation'
        })
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ success: false, error: 'Method Not Allowed' })
  };
};
