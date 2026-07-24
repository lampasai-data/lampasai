-- Per-certification paid access (Stripe), independent from the legacy
-- account-wide profiles.plan flag (kept as an admin override).
create table if not exists public.certification_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  certification_id uuid not null references public.certifications (id) on delete cascade,
  stripe_checkout_session_id text,
  amount_cents integer not null,
  status text not null default 'paid' check (status in ('paid', 'refunded')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (user_id, certification_id, stripe_checkout_session_id)
);

create index if not exists certification_purchases_user_id_idx
  on public.certification_purchases (user_id);

alter table public.certification_purchases enable row level security;

-- Only the user can read their own purchases. Rows are written exclusively
-- by the Edge Functions using the service role key, which bypasses RLS, so
-- there is no insert/update policy here.
create policy "users read own purchases"
  on public.certification_purchases for select
  using (auth.uid() = user_id);
