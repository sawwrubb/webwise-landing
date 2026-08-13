-- Enable RLS. Application still must send tenant_id; policies enforce it.

alter table tenants enable row level security;
alter table locations enable row level security;
alter table users enable row level security;
alter table leads enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table appointments enable row level security;
alter table outcomes enable row level security;
alter table rules enable row level security;
alter table reviews enable row level security;
alter table assets enable row level security;
alter table usage enable row level security;
alter table invoices enable row level security;
alter table audit_log enable row level security;
alter table consents enable row level security;

-- jwt claims: tenant_id, role
create or replace function current_tenant_id() returns uuid as $$
  select nullif(current_setting('request.jwt.claims', true)::json->>'tenant_id','')::uuid;
$$ language sql stable;

create or replace function current_role() returns text as $$
  select coalesce(current_setting('request.jwt.claims', true)::json->>'role','');
$$ language sql stable;

create policy tenant_isolation on leads
  using (tenant_id = current_tenant_id() or current_role() = 'webwise_admin')
  with check (tenant_id = current_tenant_id() or current_role() = 'webwise_admin');

-- Repeat the same using/check pattern for every tenant-scoped table in production.
