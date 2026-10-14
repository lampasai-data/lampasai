-- Prepares two things for the admin Users table:
--   * profiles.avatar_url  - where a user's profile picture will live once the
--     profile page lets people upload one (the storage bucket and the upload
--     come with that page). Empty for everybody today: the admin table then
--     shows the initials of the first name instead.
--   * admin_user_last_sign_in() - the last sign-in time of every account, read
--     from the auth schema, which the browser cannot read itself.
--
-- Safe for existing users: purely additive. One nullable column (no default,
-- no rewrite, nothing reads it yet but the admin table) and one new function
-- that returns no rows unless the caller's JWT e-mail is the admin's. No
-- policy, purchase or access rule is touched. Existing profile policies still
-- apply to the new column as to the others.
alter table public.profiles add column if not exists avatar_url text;

create or replace function public.admin_user_last_sign_in()
returns table (user_id uuid, last_sign_in_at timestamptz)
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select u.id, u.last_sign_in_at
  from auth.users u
  where (auth.jwt() ->> 'email') = 'mbairo.allatessem@gmail.com';
$$;

revoke all on function public.admin_user_last_sign_in() from public, anon;
grant execute on function public.admin_user_last_sign_in() to authenticated;
