-- Lets the site ask "is the signed-in person the admin?" instead of comparing
-- against an address written into the JavaScript every visitor downloads.
-- Only answers true/false for the caller's own session; the address itself
-- stays server-side. Real protection is unchanged: every admin table policy
-- and admin function keeps its own check.
create or replace function public.am_i_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'mbairo.allatessem@gmail.com';
$$;

revoke all on function public.am_i_admin() from public, anon;
grant execute on function public.am_i_admin() to authenticated;
