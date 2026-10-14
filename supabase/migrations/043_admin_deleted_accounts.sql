-- Minimal trace of accounts deleted from the admin area ("clean up" tool).
--
-- Deliberately keeps NO e-mail, name or other personal data: once an account
-- is deleted its data must really be gone. Only what is needed to remember
-- that a clean-up happened and roughly what it removed.
--
-- Safe for existing users: purely additive (one new table). The deletion
-- itself is done by the admin-delete-accounts function, which refuses the
-- admin account, any account with a paid/refunded purchase and any account
-- with an active access.
create table if not exists public.admin_deleted_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  account_created_at timestamptz,
  had_voucher boolean not null default false,
  answers integer not null default 0,
  exams integer not null default 0,
  deleted_at timestamptz not null default now()
);
alter table public.admin_deleted_accounts enable row level security;

drop policy if exists "admin reads deleted accounts" on public.admin_deleted_accounts;
create policy "admin reads deleted accounts"
  on public.admin_deleted_accounts for select
  using (auth.jwt() ->> 'email' = 'mbairo.allatessem@gmail.com');
