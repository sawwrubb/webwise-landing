const { admin, json } = require("../lib/supabase");
const { sendMail } = require("../lib/mail");

module.exports = async (req, res) => {
  if (req.method !== "GET" && req.method !== "POST") return json(res, 405, { error: "GET or POST" });
  const cron = req.headers.authorization === `Bearer ${process.env.CRON_SECRET || ""}`;
  if (process.env.CRON_SECRET && !cron && req.headers["x-vercel-cron"] !== "1") {
    return json(res, 401, { error: "Unauthorized" });
  }
  const sb = admin();
  const { data: rows, error } = await sb.from("outbound_emails")
    .select("*")
    .eq("status", "queued")
    .lte("scheduled_for", new Date().toISOString())
    .limit(25);
  if (error) return json(res, 500, { error: error.message });
  const sent = [];
  for (const row of rows || []) {
    try {
      await sendMail({ to: row.to_email, subject: row.subject, text: row.body });
      await sb.from("outbound_emails").update({ status: "sent", sent_at: new Date().toISOString() }).eq("id", row.id);
      sent.push(row.id);
    } catch (err) {
      await sb.from("outbound_emails").update({ status: "failed" }).eq("id", row.id);
    }
  }
  json(res, 200, { sent: sent.length });
};
