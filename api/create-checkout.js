const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://www.chemicalcreature.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, shippingRates } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
            maximum: 99,
          },
        },
      ],
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: [
          'AC','AD','AE','AF','AG','AI','AL','AM','AO','AQ','AR','AT','AU','AW','AX','AZ',
          'BA','BB','BD','BE','BF','BG','BH','BI','BJ','BL','BM','BN','BO','BQ','BR','BS',
          'BT','BV','BW','BZ','CA','CD','CF','CG','CH','CI','CK','CL','CM','CN','CO','CR',
          'CV','CW','CY','CZ','DE','DJ','DK','DM','DO','DZ','EC','EE','EG','EH','ER','ES',
          'ET','FI','FJ','FK','FO','FR','GA','GB','GD','GE','GF','GG','GH','GI','GL','GM',
          'GN','GP','GQ','GR','GS','GT','GU','GW','GY','HK','HN','HR','HT','HU','ID','IE',
          'IL','IM','IN','IO','IQ','IS','IT','JE','JM','JO','JP','KE','KG','KH','KI','KM',
          'KN','KR','KW','KY','KZ','LA','LB','LC','LI','LK','LR','LS','LT','LU','LV','LY',
          'MA','MC','MD','ME','MF','MG','MK','ML','MM','MN','MO','MQ','MR','MS','MT','MU',
          'MV','MW','MX','MY','MZ','NA','NC','NE','NG','NI','NL','NO','NP','NR','NU','NZ',
          'OM','PA','PE','PF','PG','PH','PK','PL','PM','PN','PR','PS','PT','PW','PY','QA',
          'RE','RO','RS','RW','SA','SB','SC','SE','SG','SH','SI','SJ','SK','SL','SM','SN',
          'SO','SR','SS','ST','SV','SX','SZ','TA','TC','TD','TF','TG','TH','TJ','TK','TL',
          'TM','TN','TO','TR','TT','TV','TW','TZ','UA','UG','US','UY','UZ','VA','VC','VE',
          'VG','VN','VU','WF','WS','XK','YT','ZA','ZM','ZW'
        ],
      },
      shipping_options: [
        { shipping_rate: 'shr_1TjL02BmqEv1Ht4RrrjfDGDC' }, // US Standard
        { shipping_rate: 'shr_1TjL0rBmqEv1Ht4Rtqtss9qg' }, // Canada
        { shipping_rate: 'shr_1TjL1oBmqEv1Ht4Rdp0KfZXo' }, // International
      ],
      automatic_tax: { enabled: true },
      phone_number_collection: { enabled: true },
      billing_address_collection: 'required',
      success_url: 'https://www.chemicalcreature.com/success.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://www.chemicalcreature.com/merch.html',
      metadata: {
        price_id: priceId,
      },
    });

    return res.status(200).json({ url: session.url });

  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({ error: error.message });
  }
};
