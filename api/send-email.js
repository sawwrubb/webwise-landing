const { admin, userFromRequest, json } = require("../lib/supabase");
const { sendMail } = require("../lib/mail");
const { readBody } = require("../lib/body");

module.exports = async (req, res) => {
  if (req.method !== "POST") return json(res, 405, { error: "POST only" });
  const user = await userFromRequest(req);
  if (!user) return json(res, 401, { error: "Sign in required" });

  const body = readBody(req);
  const to = body.to || user.email;
  if (!to) return json(res, 400, { error: "No recipient email" });

  const subject = body.subject || "Your Webwise Digital Health Check is ready";
  const text = body.text || "Your report is in the client portal.";
  await sendMail({ to, subject, text });
  await admin().from("outbound_emails").insert({
    user_id: user.id,
    to_email: to,
    template: body.template || "manual",
    subject,
    body: text,
    status: "sent",
    sent_at: new Date().toISOString()
  });
  json(res, 200, { ok: true });
};
