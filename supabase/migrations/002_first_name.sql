-- Store the user's first name (collected at signup) for personalized greetings.
alter table public.profiles
  add column if not exists first_name text;

-- Pick up the first name from the auth user's metadata on signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'first_name')
  on conflict (id) do nothing;
  return new;
end;
$$;
