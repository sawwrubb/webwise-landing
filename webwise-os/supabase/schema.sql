create extension if not exists pgcrypto;

create table tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  niche text not null,
  plan text not null,
  status text not null,
  created_at timestamptz not null default now(),
  avg_case_value_inr integer,
  ai_paused boolean not null default false,
  mrr_inr integer not null default 0,
  days_live integer not null default 0,
  timezone text not null default 'Asia/Kolkata'
);

create table locations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  name text not null,
  address text not null,
  timezone text not null,
  phone text not null
);

create table users (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id),
  email text unique not null,
  role text not null check (role in ('owner','manager','staff','webwise_admin')),
  location_scope text not null default 'all'
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  location_id uuid not null references locations(id),
  name text not null,
  phone text not null,
  source text not null,
  channel text not null,
  intent text,
  score integer not null default 0,
  stage text not null,
  owner_user_id uuid references users(id),
  created_at timestamptz not null default now()
);
create index leads_tenant_created on leads (tenant_id, created_at desc);

create table conversations (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id),
  tenant_id uuid not null references tenants(id),
  channel text not null,
  transcript jsonb,
  ai_handled boolean not null default true,
  escalated boolean not null default false,
  sentiment text
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id),
  tenant_id uuid not null references tenants(id),
  direction text not null,
  body text not null,
  sent_by text not null check (sent_by in ('ai','human')),
  latency_ms integer,
  template_id text,
  created_at timestamptz not null default now()
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id),
  tenant_id uuid not null references tenants(id),
  slot timestamptz not null,
  status text not null,
  value_inr integer,
  recorded_by text not null
);

create table outcomes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id),
  tenant_id uuid not null references tenants(id),
  result text not null,
  value_inr integer,
  note text,
  recorded_at timestamptz not null default now()
);

create table rules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  trigger text not null,
  condition text not null,
  response text not null,
  approved_by uuid,
  version integer not null default 1,
  active boolean not null default true
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  location_id uuid not null references locations(id),
  platform text not null,
  rating integer not null,
  text text,
  requested_at timestamptz,
  responded_at timestamptz
);

create table assets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  type text not null,
  status text not null,
  url text,
  published_at timestamptz
);

create table usage (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  meter text not null,
  period text not null,
  consumed integer not null,
  included integer not null
);

create table invoices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  razorpay_id text,
  amount_inr integer not null,
  status text not null,
  pdf_url text
);

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  actor text not null,
  action text not null,
  entity text not null,
  before jsonb,
  after jsonb,
  ts timestamptz not null default now()
);

create table consents (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id),
  tenant_id uuid not null references tenants(id),
  basis text not null,
  captured_at timestamptz not null default now(),
  source text not null,
  revoked_at timestamptz
);
