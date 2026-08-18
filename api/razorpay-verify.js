const crypto = require("crypto");
const { admin, userFromRequest, json } = require("../lib/supabase");
const { readBody } = require("../lib/body");

module.exports = async (req, res) => {
  if (req.method !== "POST") return json(res, 405, { error: "POST only" });
  const user = await userFromRequest(req);
  if (!user) return json(res, 401, { error: "Sign in required" });
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return json(res, 503, { error: "Razorpay is not configured" });

  const body = readBody(req);
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return json(res, 400, { error: "Missing payment fields" });
  }
  const expected = crypto.createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  if (expected !== razorpay_signature) return json(res, 400, { error: "Invalid signature" });

  await admin().from("payments").update({
    razorpay_payment_id,
    status: "paid"
  }).eq("razorpay_order_id", razorpay_order_id).eq("user_id", user.id);

  const sb = admin();
  const { data } = await sb.from("portal_accounts").select("state").eq("user_id", user.id).maybeSingle();
  const state = data?.state || {};
  state.competitorOrder = {
    id: razorpay_order_id,
    paymentId: razorpay_payment_id,
    at: new Date().toLocaleDateString("en-IN"),
    amount: 1999,
    status: "paid"
  };
  await sb.from("portal_accounts").upsert({ user_id: user.id, state, updated_at: new Date().toISOString() });
  json(res, 200, { ok: true, order: state.competitorOrder });
};
