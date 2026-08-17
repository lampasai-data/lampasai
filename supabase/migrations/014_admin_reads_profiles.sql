-- Lets the admin see who redeemed an exam voucher (email/name) from
-- /admin/vouchers, the same way other admin pages already read
-- cross-user data (pending_gumroad_purchases, gumroad_webhook_logs).
drop policy if exists "admin reads all profiles" on public.profiles;
create policy "admin reads all profiles"
  on public.profiles for select
  using (auth.jwt() ->> 'email' = 'mbairo.allatessem@gmail.com');
