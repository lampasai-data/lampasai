-- Exam vouchers: admin-generated single-use codes that unlock exam mode for
-- one certification for 30 days, without granting PDF export (unlike a real
-- purchase). Redeeming a voucher writes a certification_purchases row with
-- source='voucher' and pdf_allowed=false, so all existing exam-mode gating
-- (hasProAccess/purchasedIds) picks it up for free.

alter table public.certification_purchases
  drop constraint if exists certification_purchases_source_check;
alter table public.certification_purchases
  add constraint certification_purchases_source_check
  check (source in ('stripe', 'gumroad', 'voucher'));

alter table public.certification_purchases
  add column if not exists pdf_allowed boolean not null default true;

create table if not exists public.exam_vouchers (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  certification_id uuid not null references public.certifications (id) on delete cascade,
  created_by text not null,
  created_at timestamptz not null default now(),
  -- Deadline to redeem the code; null means it never expires unredeemed.
  expires_at timestamptz,
  redeemed_by uuid references auth.users (id) on delete set null,
  redeemed_at timestamptz
);

create index if not exists exam_vouchers_certification_id_idx
  on public.exam_vouchers (certification_id);

alter table public.exam_vouchers enable row level security;

-- Only the admin lists vouchers (via the admin page); redemption and
-- creation happen exclusively through Edge Functions using the service role
-- key, which bypasses RLS, so there is no insert/update policy here.
drop policy if exists "admin reads exam vouchers" on public.exam_vouchers;
create policy "admin reads exam vouchers"
  on public.exam_vouchers for select
  using (auth.jwt() ->> 'email' = 'mbairo.allatessem@gmail.com');
