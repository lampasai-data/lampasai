-- Lampas AI - Certifications module schema
-- Run this once in the Supabase SQL editor (or via `supabase db push`) on a fresh project.

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  certification_id uuid not null references public.certifications (id) on delete cascade,
  position integer not null,
  question text not null,
  options jsonb not null, -- array of strings, e.g. ["A", "B", "C", "D"]
  correct_indexes integer[] not null, -- indexes of correct option(s), e.g. [1] or [1,3] for "select two"
  explanation text,
  created_at timestamptz not null default now()
);

create index if not exists quiz_questions_certification_id_idx
  on public.quiz_questions (certification_id, position);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  free_questions_used integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id uuid not null references public.quiz_questions (id) on delete cascade,
  is_correct boolean not null,
  answered_at timestamptz not null default now()
);

create index if not exists attempts_user_id_idx on public.attempts (user_id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.certifications enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.profiles enable row level security;
alter table public.attempts enable row level security;

-- Certifications & questions are public read (the free/pro gate is enforced in the app).
create policy "certifications are publicly readable"
  on public.certifications for select
  using (true);

create policy "quiz questions are publicly readable"
  on public.quiz_questions for select
  using (true);

-- Profiles: users can only read/update their own row.
create policy "users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Attempts: users can only read/insert their own attempts.
create policy "users read own attempts"
  on public.attempts for select
  using (auth.uid() = user_id);

create policy "users insert own attempts"
  on public.attempts for insert
  with check (auth.uid() = user_id);

-- Seed the two certifications.
insert into public.certifications (slug, name, description) values
  ('power-bi', 'Microsoft Power BI (PL-300)', 'Entraînement à la certification Microsoft Power BI Data Analyst.'),
  ('snowflake', 'Snowflake SnowPro Core COF-C03', 'Entraînement à la certification SnowPro Core de Snowflake.')
on conflict (slug) do nothing;
