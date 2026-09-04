-- Powers a new /admin/stats overview page (signups, exam activity, revenue)
-- with the same "admin reads everything via a direct client-side query"
-- pattern already used for profiles/exam_vouchers/gumroad tables (see
-- 014_admin_reads_profiles.sql) - a hardcoded admin-email RLS policy,
-- rather than routing every read through a new Edge Function.

drop policy if exists "admin reads exam results" on public.exam_results;
create policy "admin reads exam results"
  on public.exam_results for select
  using (auth.jwt() ->> 'email' = 'mbairo.allatessem@gmail.com');

drop policy if exists "admin reads certification purchases" on public.certification_purchases;
create policy "admin reads certification purchases"
  on public.certification_purchases for select
  using (auth.jwt() ->> 'email' = 'mbairo.allatessem@gmail.com');
