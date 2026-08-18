const { json } = require("../lib/supabase");

module.exports = async (req, res) => {
  const cloud = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
  json(res, 200, {
    cloud,
    supabaseUrl: process.env.SUPABASE_URL || "",
    supabaseAnon: process.env.SUPABASE_ANON_KEY || "",
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
    siteUrl: process.env.SITE_URL || "",
    payments: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    mail: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS)
  });
};
