const { admin, userFromRequest, json } = require("../lib/supabase");

const TEMPLATES = [
  { day: 0, template: "e0", subject: "Your Webwise Digital Health Check is ready", body: "Your one-pager is in the portal. Download it anytime from your dashboard." },
  { day: 1, template: "e1", subject: "Case study: the clinic that stopped missing night enquiries", body: "I'M Dental went live with Smart Site + WhatsApp + reviews. After-hours implant enquiries now get a reply in seconds." },
  { day: 3, template: "e2", subject: "What owners tell us after week two", body: "We did not need more ads. We needed the system that never drops a lead. Your leak is still open until onboarding is finished." },
  { day: 5, template: "e3", subject: "Your competitor pack (₹1,999) — 24-hour TAT", body: "See two domestic competitors + one global benchmark. Order from the report page." },
  { day: 7, template: "e4", subject: "72 hours left on the partner rate window", body: "DIY to rebuild website, chat, landing and reviews typically crosses ₹2L+. Finish setup in the portal." }
];

module.exports = async (req, res) => {
  if (req.method !== "POST") return json(res, 405, { error: "POST only" });
  const user = await userFromRequest(req);
  if (!user || !user.email) return json(res, 401, { error: "Sign in with an email account" });
  const sb = admin();
  const now = Date.now();
  const rows = TEMPLATES.map((e) => ({
    user_id: user.id,
    to_email: user.email,
    template: e.template,
    subject: e.subject,
    body: e.body,
    status: e.day === 0 ? "queued" : "queued",
    scheduled_for: new Date(now + e.day * 86400000).toISOString()
  }));
  await sb.from("outbound_emails").insert(rows);
  json(res, 200, { ok: true, queued: rows.length });
};
