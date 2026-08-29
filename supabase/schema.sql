-- Run this in the Supabase SQL editor once.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  method text,
  created_at timestamptz not null default now()
);

create table if not exists public.portal_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  razorpay_order_id text unique,
  razorpay_payment_id text,
  amount integer not null,
  status text not null default 'created',
  created_at timestamptz not null default now()
);

create table if not exists public.outbound_emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  to_email text not null,
  template text not null,
  subject text not null,
  body text not null,
  status text not null default 'queued',
  scheduled_for timestamptz not null default now(),
  sent_at timestamptz
);

alter table public.profiles enable row level security;
alter table public.portal_accounts enable row level security;
alter table public.payments enable row level security;
alter table public.outbound_emails enable row level security;

drop policy if exists profiles_own on public.profiles;
create policy profiles_own on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists accounts_own on public.portal_accounts;
create policy accounts_own on public.portal_accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists payments_own on public.payments;
create policy payments_own on public.payments
  for select using (auth.uid() = user_id);

drop policy if exists emails_own on public.outbound_emails;
create policy emails_own on public.outbound_emails
  for select using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, phone, method)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(coalesce(new.email, ''), '@', 1)),
    coalesce(new.phone, new.raw_user_meta_data->>'phone'),
    coalesce(new.raw_user_meta_data->>'method', 'email')
  )
  on conflict (id) do nothing;
  insert into public.portal_accounts (user_id, state)
  values (new.id, jsonb_build_object('userId', new.id, 'createdAt', (extract(epoch from now())*1000)::bigint))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into storage.buckets (id, name, public)
values ('kyc', 'kyc', false)
on conflict (id) do nothing;

drop policy if exists kyc_own_read on storage.objects;
create policy kyc_own_read on storage.objects
  for select using (bucket_id = 'kyc' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists kyc_own_write on storage.objects;
create policy kyc_own_write on storage.objects
  for insert with check (bucket_id = 'kyc' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists kyc_own_update on storage.objects;
create policy kyc_own_update on storage.objects
  for update using (bucket_id = 'kyc' and auth.uid()::text = (storage.foldername(name))[1]);
