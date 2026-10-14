-- The first name stored when an account is created came straight from the
-- sign-up metadata, which anyone can set by calling Supabase's sign-up API
-- directly (bypassing signup-with-custom-email). It is shown to every
-- signed-in user on the leaderboard, so a link, an address or a 200-character
-- name could land there.
--
-- Same rule as update_my_first_name (047) and cleanFirstName in the e-mail
-- layout: 1-40 characters, no link, no "@", no markup. A name that fails is
-- stored as null (the account is still created; the person can set a first
-- name from their profile). Only the name changes: the trigger still always
-- creates the profile, so sign-up itself cannot fail on it.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
begin
  v_name := nullif(btrim(coalesce(
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'given_name',
    split_part(new.raw_user_meta_data ->> 'name', ' ', 1),
    split_part(new.raw_user_meta_data ->> 'full_name', ' ', 1)
  )), '');

  if v_name is not null and (length(v_name) > 40 or v_name ~* '(https?:|www\.|@|<|>)') then
    v_name := null;
  end if;

  insert into public.profiles (id, email, first_name)
  values (new.id, new.email, v_name)
  on conflict (id) do nothing;
  return new;
end;
$$;
