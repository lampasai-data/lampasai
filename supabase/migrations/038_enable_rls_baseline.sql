-- Captures the row level security of the four tables that predate this
-- migrations folder: profiles, certifications, quiz_questions and attempts.
--
-- All of it is already live - verified by probing the REST API with the public
-- anon key (reads return only what is meant to be public, every insert is
-- rejected with 42501) and by dumping pg_policies. But it was set up through
-- the dashboard, so nothing in this repository recorded it.
--
-- That gap has exactly one failure mode, and it is severe: rebuilding the
-- database from these migrations - a fresh project, a restore, a staging copy
-- - brings the four tables back with RLS OFF. Every profile, every attempt and
-- the whole question bank, correct answers included, would then be readable by
-- anyone holding the anon key, which ships inside the JS bundle.
--
-- Enabling RLS on an already-enabled table is a no-op, and each policy below
-- is recreated exactly as it runs in production, so this is safe to apply to
-- the live database as-is.
--
-- Not repeated here, to keep a single owner per policy:
--   * quiz_questions' two policies  -> 011_quiz_questions_rls.sql
--   * "admin reads all profiles"    -> 014_admin_reads_profiles.sql
--
-- Note there is deliberately no INSERT/UPDATE/DELETE policy on profiles: the
-- client only ever reads them, and every mutation goes through an Edge
-- Function using the service role key, which bypasses RLS. Adding a write
-- policy here would widen that surface for no reason.

alter table public.profiles enable row level security;
alter table public.certifications enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.attempts enable row level security;

-- profiles: a signed-in user sees their own row and nothing else.
drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- certifications: the public catalogue (name, slug, description). No secrets,
-- and the marketing pages need it before anyone signs in.
drop policy if exists "certifications are publicly readable" on public.certifications;
create policy "certifications are publicly readable"
  on public.certifications for select
  using (true);

-- attempts: own rows only, both ways. No update or delete policy - an answer
-- history is append-only, and letting a user rewrite it would corrupt the
-- progress stats the dashboard reads back.
drop policy if exists "users read own attempts" on public.attempts;
create policy "users read own attempts"
  on public.attempts for select
  using (auth.uid() = user_id);

drop policy if exists "users insert own attempts" on public.attempts;
create policy "users insert own attempts"
  on public.attempts for insert
  with check (auth.uid() = user_id);
