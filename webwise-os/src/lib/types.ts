export type Role = "owner" | "manager" | "staff" | "webwise_admin";
export type TenantStatus = "activation" | "live" | "paused" | "churn_risk";
export type Channel = "whatsapp" | "instagram" | "site" | "voice" | "maps";
export type LeadStage = "new" | "qualified" | "booked" | "showed" | "won" | "lost" | "no_show";
export type AppointmentStatus = "booked" | "showed" | "no_show" | "cancelled";
export type OutcomeResult = "won" | "lost" | "pending";
export type MessageSender = "ai" | "human";

export type DateRangeKey = "7d" | "30d" | "90d";

export interface Tenant {
  id: string;
  name: string;
  niche: string;
  plan: string;
  status: TenantStatus;
  createdAt: string;
  avgCaseValueInr: number | null;
  aiPaused: boolean;
  mrrInr: number;
  daysLive: number;
  timezone: string;
}

export interface Location {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  timezone: string;
  phone: string;
}

export interface User {
  id: string;
  tenantId: string | null;
  email: string;
  name: string;
  role: Role;
  locationScope: string | "all";
  password: string;
  totpEnabled: boolean;
}

export interface Lead {
  id: string;
  tenantId: string;
  locationId: string;
  name: string;
  phone: string;
  source: string;
  channel: Channel;
  intent: string;
  score: number;
  scoreReasons: string[];
  stage: LeadStage;
  ownerUserId: string | null;
  createdAt: string;
  tags: string[];
}

export interface Conversation {
  id: string;
  leadId: string;
  tenantId: string;
  channel: Channel;
  aiHandled: boolean;
  escalated: boolean;
  humanTakeover: boolean;
  sentiment: "positive" | "neutral" | "negative";
}

export interface Message {
  id: string;
  conversationId: string;
  tenantId: string;
  direction: "in" | "out";
  body: string;
  sentBy: MessageSender;
  latencyMs: number | null;
  templateId: string | null;
  flaggedWrong: boolean;
  createdAt: string;
}

export interface Appointment {
  id: string;
  leadId: string;
  tenantId: string;
  slot: string;
  status: AppointmentStatus;
  valueInr: number | null;
  recordedBy: string;
}

export interface Outcome {
  id: string;
  leadId: string;
  tenantId: string;
  result: OutcomeResult;
  valueInr: number | null;
  note: string;
  recordedAt: string;
}

export interface Rule {
  id: string;
  tenantId: string;
  trigger: string;
  condition: string;
  response: string;
  approvedBy: string | null;
  version: number;
  active: boolean;
}

export interface Review {
  id: string;
  tenantId: string;
  locationId: string;
  platform: string;
  rating: number;
  text: string;
  requestedAt: string;
  respondedAt: string | null;
  aiDraft: string | null;
}

export interface Asset {
  id: string;
  tenantId: string;
  type: "page" | "post" | "creative";
  name: string;
  status: "draft" | "live" | "paused" | "pending_approval";
  url: string;
  views: number;
  conversionRate: number;
  leads: number;
  publishedAt: string | null;
}

export interface UsageMeter {
  tenantId: string;
  meter: "wa_conversations" | "voice_minutes" | "ai_calls";
  period: string;
  consumed: number;
  included: number;
}

export interface Invoice {
  id: string;
  tenantId: string;
  razorpayId: string;
  amountInr: number;
  status: "paid" | "due" | "overdue";
  pdfUrl: string;
  period: string;
}

export interface AuditEntry {
  id: string;
  tenantId: string | null;
  actor: string;
  action: string;
  entity: string;
  before: unknown;
  after: unknown;
  ts: string;
  reason?: string;
}

export interface Consent {
  id: string;
  leadId: string;
  tenantId: string;
  basis: string;
  capturedAt: string;
  source: string;
  revokedAt: string | null;
}

export interface OnboardingStep {
  id: string;
  tenantId: string;
  title: string;
  owner: "client" | "webwise";
  dueAt: string;
  done: boolean;
}

export interface SessionUser {
  userId: string;
  email: string;
  name: string;
  role: Role;
  tenantId: string | null;
  locationScope: string | "all";
  impersonating: boolean;
  impersonateWrite: boolean;
  demoMode: boolean;
}

export interface ActionItem {
  id: string;
  tenantId: string;
  kind: "escalated_chat" | "unconfirmed_appt" | "negative_review" | "failed_integration" | "flagged_ai" | "edit_request" | "upsell";
  title: string;
  href: string;
  createdAt: string;
}

export interface CallRecord {
  id: string;
  tenantId: string;
  leadId: string | null;
  who: string;
  at: string;
  outcome: string;
  missed: boolean;
  recovered: boolean;
  transcript: string;
  minutes: number;
}

export interface NichePreset {
  id: string;
  name: string;
  kpiDefaults: string[];
  rules: Pick<Rule, "trigger" | "condition" | "response">[];
  pageTemplate: string;
  reviewFlow: string;
}
