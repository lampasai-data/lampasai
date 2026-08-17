-- Gumroad payment integration (coexists with Stripe; Stripe stays wired and
-- untouched, just unused from the UI for now).

-- 1. Track which payment provider produced a certification_purchases row,
--    and store Gumroad's sale id for webhook idempotency.
alter table public.certification_purchases
  add column if not exists source text not null default 'stripe',
  add column if not exists gumroad_sale_id text unique;

alter table public.certification_purchases
  drop constraint if exists certification_purchases_source_check;
alter table public.certification_purchases
  add constraint certification_purchases_source_check
  check (source in ('stripe', 'gumroad'));

-- 2. Gumroad sales that couldn't be matched to an existing account by email
--    at webhook time (e.g. bought before signing up, or a typo'd/different
--    email). Reconciled automatically on next login/signup by email match,
--    or manually via the admin catch-up page.
create table if not exists public.pending_gumroad_purchases (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  certification_id uuid not null references public.certifications (id) on delete cascade,
  gumroad_sale_id text not null unique,
  amount_cents integer not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_user_id uuid references auth.users (id) on delete set null
);

create index if not exists pending_gumroad_purchases_email_idx
  on public.pending_gumroad_purchases (email)
  where resolved_at is null;

alter table public.pending_gumroad_purchases enable row level security;

-- No public policies: only the service role (Edge Functions) reads/writes
-- this table directly, except the admin read/update policies below.
drop policy if exists "admin reads pending gumroad purchases" on public.pending_gumroad_purchases;
create policy "admin reads pending gumroad purchases"
  on public.pending_gumroad_purchases for select
  using (auth.jwt() ->> 'email' = 'mbairo.allatessem@gmail.com');

drop policy if exists "admin resolves pending gumroad purchases" on public.pending_gumroad_purchases;
create policy "admin resolves pending gumroad purchases"
  on public.pending_gumroad_purchases for update
  using (auth.jwt() ->> 'email' = 'mbairo.allatessem@gmail.com');

-- 3. Full audit trail of every Gumroad webhook event received, so a silent
--    email-matching failure is always visible after the fact.
create table if not exists public.gumroad_webhook_logs (
  id uuid primary key default gen_random_uuid(),
  received_at timestamptz not null default now(),
  payload jsonb not null,
  verification_result text not null,
  match_result text not null,
  gumroad_sale_id text,
  error_message text
);

alter table public.gumroad_webhook_logs enable row level security;

drop policy if exists "admin reads gumroad webhook logs" on public.gumroad_webhook_logs;
create policy "admin reads gumroad webhook logs"
  on public.gumroad_webhook_logs for select
  using (auth.jwt() ->> 'email' = 'mbairo.allatessem@gmail.com');
