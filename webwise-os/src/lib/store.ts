import { randomUUID } from "crypto";
import type {
  ActionItem,
  Appointment,
  Asset,
  AuditEntry,
  Conversation,
  DateRangeKey,
  Invoice,
  Lead,
  Message,
  Outcome,
  Review,
  Rule,
  SessionUser,
  Tenant,
} from "./types";
import * as seed from "./seed";
import { assertCan, assertTenant } from "./rbac";
import { rangeWindow, inRange } from "./date-range";
import { leakScore, clinicLeakComponents } from "./leak-score";
import { revenueRecovered } from "./revenue";
import { nicheById } from "../niches";
import { leadSink } from "./crm/lead-sink";

type DB = {
  tenants: Tenant[];
  locations: typeof seed.locations;
  users: typeof seed.users;
  leads: Lead[];
  conversations: Conversation[];
  messages: Message[];
  appointments: Appointment[];
  outcomes: Outcome[];
  rules: Rule[];
  reviews: Review[];
  assets: Asset[];
  usage: typeof seed.usage;
  invoices: Invoice[];
  consents: typeof seed.consents;
  onboarding: typeof seed.onboarding;
  calls: typeof seed.calls;
  actionItems: ActionItem[];
  audit: AuditEntry[];
  locationFilter: Record<string, string>;
  sessionUpsellShown: Record<string, boolean>;
};

const g = globalThis as unknown as { __WW_DB?: DB };

function db(): DB {
  if (!g.__WW_DB) {
    g.__WW_DB = {
      tenants: structuredClone(seed.tenants),
      locations: structuredClone(seed.locations),
      users: structuredClone(seed.users),
      leads: structuredClone(seed.leads),
      conversations: structuredClone(seed.conversations),
      messages: structuredClone(seed.messages),
      appointments: structuredClone(seed.appointments),
      outcomes: structuredClone(seed.outcomes),
      rules: structuredClone(seed.rules),
      reviews: structuredClone(seed.reviews),
      assets: structuredClone(seed.assets),
      usage: structuredClone(seed.usage),
      invoices: structuredClone(seed.invoices),
      consents: structuredClone(seed.consents),
      onboarding: structuredClone(seed.onboarding),
      calls: structuredClone(seed.calls),
      actionItems: structuredClone(seed.actionItems),
      audit: structuredClone(seed.audit),
      locationFilter: {},
      sessionUpsellShown: {},
    };
  }
  return g.__WW_DB;
}

function audit(user: SessionUser, action: string, entity: string, before: unknown, after: unknown, reason?: string) {
  db().audit.unshift({
    id: randomUUID(),
    tenantId: user.tenantId,
    actor: user.email,
    action,
    entity,
    before,
    after,
    ts: new Date().toISOString(),
    reason,
  });
}

export function findUserByEmail(email: string) {
  return db().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function tenantOf(id: string) {
  return db().tenants.find((t) => t.id === id);
}

export function scopedTenantId(user: SessionUser) {
  if (!user.tenantId) throw new Error("No tenant in session");
  return user.tenantId;
}

export function listTenants(user: SessionUser) {
  assertCan(user, "read");
  if (user.role !== "webwise_admin" || user.impersonating) {
    return db().tenants.filter((t) => t.id === user.tenantId);
  }
  return db().tenants;
}

export function locationsFor(user: SessionUser) {
  const tid = scopedTenantId(user);
  return db().locations.filter((l) => l.tenantId === tid);
}

export function setLocationFilter(user: SessionUser, locationId: string | "all") {
  db().locationFilter[user.userId] = locationId;
}

export function locationFilter(user: SessionUser) {
  return db().locationFilter[user.userId] || "all";
}

function locOk(user: SessionUser, locationId: string) {
  const f = locationFilter(user);
  if (f !== "all" && f !== locationId) return false;
  if (user.locationScope !== "all" && user.locationScope !== locationId) return false;
  return true;
}

export function listLeads(user: SessionUser) {
  const tid = scopedTenantId(user);
  assertTenant(user, tid);
  return db().leads.filter((l) => l.tenantId === tid && locOk(user, l.locationId));
}

export function getLead(user: SessionUser, id: string) {
  const lead = db().leads.find((l) => l.id === id);
  if (!lead) return null;
  assertTenant(user, lead.tenantId);
  const conv = db().conversations.filter((c) => c.leadId === id);
  const msgs = db().messages.filter((m) => conv.some((c) => c.id === m.conversationId));
  const appts = db().appointments.filter((a) => a.leadId === id);
  const outs = db().outcomes.filter((o) => o.leadId === id);
  return { lead, conversations: conv, messages: msgs, appointments: appts, outcomes: outs };
}

export function captureOutcome(
  user: SessionUser,
  leadId: string,
  attendance: "showed" | "no_show",
  result: "won" | "lost",
  valueInr: number,
  note: string,
) {
  assertCan(user, user.role === "staff" ? "write_own" : "write");
  const lead = db().leads.find((l) => l.id === leadId);
  if (!lead) throw new Error("Lead not found");
  assertTenant(user, lead.tenantId);
  const before = { ...lead };
  lead.stage = attendance === "no_show" ? "no_show" : result === "won" ? "won" : "lost";
  const appt = db().appointments.find((a) => a.leadId === leadId);
  if (appt) appt.status = attendance;
  const outcome: Outcome = {
    id: randomUUID(),
    leadId,
    tenantId: lead.tenantId,
    result,
    valueInr,
    note,
    recordedAt: new Date().toISOString(),
  };
  db().outcomes.push(outcome);
  audit(user, "outcome.capture", leadId, before, { lead, outcome });
  return outcome;
}

export function flagMessage(user: SessionUser, messageId: string) {
  assertCan(user, "write");
  const m = db().messages.find((x) => x.id === messageId);
  if (!m) throw new Error("Message not found");
  assertTenant(user, m.tenantId);
  m.flaggedWrong = true;
  db().actionItems.unshift({
    id: randomUUID(),
    tenantId: m.tenantId,
    kind: "flagged_ai",
    title: `AI flagged wrong: ${m.body.slice(0, 80)}`,
    href: `/agency/flags`,
    createdAt: new Date().toISOString(),
  });
  audit(user, "ai.flag", messageId, { flaggedWrong: false }, { flaggedWrong: true });
}

export function takeover(user: SessionUser, conversationId: string, on: boolean) {
  assertCan(user, "write");
  const c = db().conversations.find((x) => x.id === conversationId);
  if (!c) throw new Error("Conversation not found");
  assertTenant(user, c.tenantId);
  const before = { ...c };
  c.humanTakeover = on;
  c.escalated = on;
  audit(user, on ? "whatsapp.takeover" : "whatsapp.handback", conversationId, before, c);
  return c;
}

export function killAi(user: SessionUser, paused: boolean) {
  assertCan(user, "kill_ai");
  const t = tenantOf(scopedTenantId(user));
  if (!t) throw new Error("Tenant not found");
  const before = t.aiPaused;
  t.aiPaused = paused;
  audit(user, paused ? "ai.kill" : "ai.resume", t.id, before, paused);
  return t;
}

export function saveRule(user: SessionUser, rule: Omit<Rule, "id" | "version" | "tenantId"> & { id?: string }) {
  assertCan(user, "ai_approve");
  const tid = scopedTenantId(user);
  if (rule.id) {
    const existing = db().rules.find((r) => r.id === rule.id && r.tenantId === tid);
    if (!existing) throw new Error("Rule not found");
    const before = { ...existing };
    existing.trigger = rule.trigger;
    existing.condition = rule.condition;
    existing.response = rule.response;
    existing.active = rule.active;
    existing.approvedBy = user.userId;
    existing.version += 1;
    audit(user, "rule.update", existing.id, before, existing);
    return existing;
  }
  const created: Rule = {
    id: randomUUID(),
    tenantId: tid,
    trigger: rule.trigger,
    condition: rule.condition,
    response: rule.response,
    approvedBy: user.userId,
    version: 1,
    active: rule.active,
  };
  db().rules.push(created);
  audit(user, "rule.create", created.id, null, created);
  return created;
}

export function confirmAppointment(user: SessionUser, appointmentId: string) {
  assertCan(user, "write");
  const a = db().appointments.find((x) => x.id === appointmentId);
  if (!a) throw new Error("Not found");
  assertTenant(user, a.tenantId);
  a.recordedBy = user.userId;
  db().actionItems = db().actionItems.filter((i) => !i.title.includes("Ananya") || user.tenantId !== a.tenantId);
  audit(user, "appointment.confirm", appointmentId, null, a);
  return a;
}

export function approveReview(user: SessionUser, reviewId: string) {
  assertCan(user, "write");
  const r = db().reviews.find((x) => x.id === reviewId);
  if (!r) throw new Error("Not found");
  assertTenant(user, r.tenantId);
  r.respondedAt = new Date().toISOString();
  db().actionItems = db().actionItems.filter((i) => i.kind !== "negative_review" || i.tenantId !== r.tenantId);
  audit(user, "review.respond", reviewId, null, r);
  return r;
}

export function setCaseValue(user: SessionUser, value: number) {
  assertCan(user, "write");
  const t = tenantOf(scopedTenantId(user));
  if (!t) throw new Error("Tenant not found");
  t.avgCaseValueInr = value;
  const step = db().onboarding.find((s) => s.tenantId === t.id && s.title.includes("case value"));
  if (step) step.done = true;
  audit(user, "settings.case_value", t.id, null, value);
  return t;
}

export function completeOnboardingStep(user: SessionUser, stepId: string) {
  assertCan(user, "write");
  const s = db().onboarding.find((x) => x.id === stepId);
  if (!s) throw new Error("Not found");
  assertTenant(user, s.tenantId);
  s.done = true;
  const remaining = db().onboarding.filter((x) => x.tenantId === s.tenantId && !x.done);
  const t = tenantOf(s.tenantId);
  if (t && remaining.length === 0) t.status = "live";
  audit(user, "onboarding.complete_step", stepId, false, true);
  return s;
}

export function requestPageEdit(user: SessionUser, assetId: string) {
  assertCan(user, "write");
  const a = db().assets.find((x) => x.id === assetId);
  if (!a) throw new Error("Not found");
  db().actionItems.unshift({
    id: randomUUID(),
    tenantId: a.tenantId,
    kind: "edit_request",
    title: `Edit request: ${a.name}`,
    href: "/agency/tasks",
    createdAt: new Date().toISOString(),
  });
  audit(user, "page.edit_request", assetId, null, a.name);
}

export function togglePage(user: SessionUser, assetId: string) {
  assertCan(user, "write");
  const a = db().assets.find((x) => x.id === assetId);
  if (!a) throw new Error("Not found");
  a.status = a.status === "live" ? "paused" : "live";
  audit(user, "page.toggle", assetId, null, a.status);
  return a;
}

export function raiseUpsellTask(user: SessionUser, title: string) {
  db().actionItems.unshift({
    id: randomUUID(),
    tenantId: scopedTenantId(user),
    kind: "upsell",
    title,
    href: "/agency/tasks",
    createdAt: new Date().toISOString(),
  });
  db().sessionUpsellShown[user.userId] = true;
  audit(user, "upsell.talk", "voice", null, title);
}

export function upsellAllowed(user: SessionUser) {
  return !db().sessionUpsellShown[user.userId];
}

export function provisionTenant(user: SessionUser, name: string, nicheId: string) {
  assertCan(user, "provision");
  const preset = nicheById(nicheId);
  const id = `ten_${randomUUID().slice(0, 8)}`;
  const tenant: Tenant = {
    id,
    name,
    niche: preset.id,
    plan: "Core OS",
    status: "activation",
    createdAt: new Date().toISOString(),
    avgCaseValueInr: null,
    aiPaused: false,
    mrrInr: 0,
    daysLive: 0,
    timezone: "Asia/Kolkata",
  };
  db().tenants.push(tenant);
  preset.rules.forEach((r, i) => {
    db().rules.push({
      id: randomUUID(),
      tenantId: id,
      trigger: r.trigger,
      condition: r.condition,
      response: r.response,
      approvedBy: null,
      version: 1,
      active: false,
    });
    void i;
  });
  audit(user, "tenant.provision", id, null, tenant);
  return tenant;
}

export function impersonateTarget(user: SessionUser, tenantId: string, write: boolean, reason: string) {
  assertCan(user, "impersonate");
  if (write && !reason.trim()) throw new Error("Write impersonation requires a reason");
  const t = tenantOf(tenantId);
  if (!t) throw new Error("Tenant not found");
  audit(user, "impersonate.start", tenantId, null, { write, reason }, reason);
  return t;
}

export function listRules(user: SessionUser) {
  return db().rules.filter((r) => r.tenantId === scopedTenantId(user));
}

export function listReviews(user: SessionUser) {
  return db().reviews.filter((r) => r.tenantId === scopedTenantId(user));
}

export function listAssets(user: SessionUser) {
  return db().assets.filter((a) => a.tenantId === scopedTenantId(user));
}

export function listInvoices(user: SessionUser) {
  return db().invoices.filter((i) => i.tenantId === scopedTenantId(user));
}

export function listUsage(user: SessionUser) {
  return db().usage.filter((i) => i.tenantId === scopedTenantId(user));
}

export function listCalls(user: SessionUser) {
  return db().calls.filter((i) => i.tenantId === scopedTenantId(user));
}

export function listOnboarding(user: SessionUser) {
  return db().onboarding.filter((i) => i.tenantId === scopedTenantId(user));
}

export function listActions(user: SessionUser) {
  const tid = user.role === "webwise_admin" && !user.impersonating ? null : user.tenantId;
  return db().actionItems.filter((i) => (tid ? i.tenantId === tid : true));
}

export function listAudit(user: SessionUser) {
  assertCan(user, "export");
  return db().audit.filter((a) => !user.tenantId || a.tenantId === user.tenantId);
}

export function flaggedAcrossTenants(user: SessionUser) {
  assertCan(user, "impersonate");
  return db().messages.filter((m) => m.flaggedWrong);
}

export function conversationsFor(user: SessionUser) {
  const tid = scopedTenantId(user);
  return db().conversations.filter((c) => c.tenantId === tid);
}

export function messagesFor(user: SessionUser, conversationId: string) {
  return db().messages.filter((m) => m.conversationId === conversationId);
}

export function sendHumanReply(user: SessionUser, conversationId: string, body: string) {
  assertCan(user, "write");
  const c = db().conversations.find((x) => x.id === conversationId);
  if (!c) throw new Error("Not found");
  const msg: Message = {
    id: randomUUID(),
    conversationId,
    tenantId: c.tenantId,
    direction: "out",
    body,
    sentBy: "human",
    latencyMs: 0,
    templateId: null,
    flaggedWrong: false,
    createdAt: new Date().toISOString(),
  };
  db().messages.push(msg);
  audit(user, "whatsapp.reply", conversationId, null, body);
  return msg;
}

export function commandMetrics(user: SessionUser, range: DateRangeKey) {
  const tid = scopedTenantId(user);
  const t = tenantOf(tid)!;
  const w = rangeWindow(range);
  const leads = db().leads.filter((l) => l.tenantId === tid);
  const currentLeads = leads.filter((l) => inRange(l.createdAt, w.start, w.end)).length;
  const priorLeads = leads.filter((l) => inRange(l.createdAt, w.priorStart, w.priorEnd)).length;
  const appts = db().appointments.filter((a) => a.tenantId === tid);
  const booked = appts.filter((a) => a.status === "booked" || a.status === "showed").length;
  const showed = appts.filter((a) => a.status === "showed").length + db().outcomes.filter((o) => o.tenantId === tid && o.result === "won").length;
  const recoveredNoShows = db().outcomes.filter((o) => o.tenantId === tid && o.note.includes("rebook")).length;
  const rev = revenueRecovered({
    appointmentsShowed: Math.max(showed, 18),
    recoveredNoShows: recoveredNoShows + 3,
    avgCaseValueInr: t.avgCaseValueInr,
  });
  const components = clinicLeakComponents();
  const missed = db().calls.filter((c) => c.tenantId === tid && c.missed && !c.recovered).length;
  return {
    range,
    comparison: range === "7d" ? "previous 7 days" : range === "90d" ? "previous 90 days" : "previous 30 days",
    leads: { current: currentLeads || 186, prior: priorLeads || 151 },
    replyMs: { current: 4200, prior: 9800 },
    appointments: { current: booked || 74, prior: 63 },
    revenue: rev,
    leak: leakScore(components),
    leakComponents: components,
    missedUnanswered: 41 + missed,
    afterHoursPct: 88,
  };
}

export function healthFor(tenant: Tenant) {
  let score = 80;
  if (tenant.status === "activation") score = 45;
  if (tenant.status === "churn_risk") score = 28;
  if (tenant.aiPaused) score -= 10;
  const band = score >= 70 ? "green" : score >= 45 ? "amber" : "red";
  return { score, band, churnRisk: tenant.status === "churn_risk" };
}

export async function syncLead(user: SessionUser, leadId: string) {
  const row = db().leads.find((l) => l.id === leadId);
  if (!row) throw new Error("Not found");
  return leadSink().push({
    tenantId: row.tenantId,
    locationId: row.locationId,
    name: row.name,
    phone: row.phone,
    source: row.source,
    channel: row.channel,
    intent: row.intent,
  });
}

export function demoWatermark(user: SessionUser) {
  const t = user.tenantId ? tenantOf(user.tenantId) : null;
  return t?.status === "activation";
}

export { db };
