-- Google OAuth signups populate raw_user_meta_data with Google's own claims
-- (given_name / name / full_name), not "first_name" like the email signup
-- form does. The trigger only read "first_name", so Google users ended up
-- with profiles.first_name = null and never saw the dashboard greeting.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'first_name',
      new.raw_user_meta_data ->> 'given_name',
      split_part(new.raw_user_meta_data ->> 'name', ' ', 1),
      split_part(new.raw_user_meta_data ->> 'full_name', ' ', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Backfill existing profiles created before this fix (e.g. via Google) that
-- are missing a first name but have it available on the auth user record.
update public.profiles p
set first_name = coalesce(
  u.raw_user_meta_data ->> 'given_name',
  split_part(u.raw_user_meta_data ->> 'name', ' ', 1),
  split_part(u.raw_user_meta_data ->> 'full_name', ' ', 1)
)
from auth.users u
where u.id = p.id
  and p.first_name is null;
