-- Leaderboard: lets a user compare their exam-mode performance against
-- other people currently training on the same certification. Ranked by
-- each user's best exam-mode score (%) for that certification.

create table if not exists public.exam_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  certification_id uuid not null references public.certifications (id) on delete cascade,
  correct_count integer not null check (correct_count >= 0),
  total_count integer not null check (total_count > 0),
  completed_at timestamptz not null default now()
);

create index if not exists exam_results_certification_id_idx
  on public.exam_results (certification_id);
create index if not exists exam_results_user_id_idx
  on public.exam_results (user_id);

alter table public.exam_results enable row level security;

-- Users can only ever see/write their own raw rows directly. The
-- leaderboard itself is served exclusively through
-- get_certification_leaderboard below (security definer), which exposes
-- only first_name + best score + rank for other users - never raw rows,
-- emails, or user ids.
drop policy if exists "users insert own exam results" on public.exam_results;
create policy "users insert own exam results"
  on public.exam_results for insert
  with check (auth.uid() = user_id);

drop policy if exists "users read own exam results" on public.exam_results;
create policy "users read own exam results"
  on public.exam_results for select
  using (auth.uid() = user_id);

-- For each user who has completed at least one exam-mode run on this
-- certification, returns their BEST score (%), ranked, with first name
-- (falling back to "Anonyme" if unset) and whether the row is the caller's
-- own. security definer so it can join profiles/exam_results across users
-- without needing broad RLS read policies on either table.
drop function if exists public.get_certification_leaderboard(uuid);
create function public.get_certification_leaderboard(p_certification_id uuid)
returns table (rank bigint, first_name text, ratio numeric, is_you boolean)
language sql
security definer set search_path = public
stable
as $$
  select
    row_number() over (order by best.ratio desc, best.completed_at asc) as rank,
    coalesce(p.first_name, 'Anonyme') as first_name,
    best.ratio,
    best.user_id = auth.uid() as is_you
  from (
    select distinct on (er.user_id)
      er.user_id,
      er.correct_count::numeric / er.total_count as ratio,
      er.completed_at
    from public.exam_results er
    where er.certification_id = p_certification_id
    order by er.user_id, (er.correct_count::numeric / er.total_count) desc, er.completed_at asc
  ) best
  join public.profiles p on p.id = best.user_id
  order by rank
  limit 500;
$$;

revoke all on function public.get_certification_leaderboard(uuid) from public, anon;
grant execute on function public.get_certification_leaderboard(uuid) to authenticated;
