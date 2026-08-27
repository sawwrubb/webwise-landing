const { admin, userFromRequest, json } = require("../lib/supabase");
const { readBody } = require("../lib/body");

const PRODUCTS = {
  competitor_pack: { amount: 199900, label: "competitor_pack" },
  engagement: { amount: 1180000, label: "engagement" } // ₹10,000 + 18% GST
};

module.exports = async (req, res) => {
  if (req.method !== "POST") return json(res, 405, { error: "POST only" });
  const user = await userFromRequest(req);
  if (!user) return json(res, 401, { error: "Sign in required" });
  const key = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key || !secret) return json(res, 503, { error: "Razorpay is not configured" });

  const body = readBody(req);
  const product = PRODUCTS[body.product] ? body.product : "engagement";
  const AMOUNT = PRODUCTS[product].amount;

  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  const rzp = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: AMOUNT,
      currency: "INR",
      receipt: `${product.slice(0, 8)}_${user.id.slice(0, 8)}_${Date.now()}`,
      notes: { user_id: user.id, product }
    })
  });
  const order = await rzp.json();
  if (!rzp.ok) return json(res, 502, { error: order.error?.description || "Razorpay order failed" });

  await admin().from("payments").insert({
    user_id: user.id,
    razorpay_order_id: order.id,
    amount: AMOUNT,
    status: "created"
  });
  json(res, 200, { orderId: order.id, amount: AMOUNT, keyId: key, currency: "INR", product });
};
