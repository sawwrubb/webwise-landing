const { createClient } = require("@supabase/supabase-js");

function admin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service credentials are not set");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function anon() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase public credentials are not set");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function userFromRequest(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return null;
  const { data, error } = await anon().auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

function json(res, status, body) {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = status;
  res.end(JSON.stringify(body));
}

module.exports = { admin, anon, userFromRequest, json };
