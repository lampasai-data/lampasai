-- The previous "quiz questions are publicly readable" policy (qual: true)
-- let anyone query the Supabase REST API directly (URL + anon key are public
-- in the built JS bundle) and read every exam-only question's full content,
-- including its correct answer(s) - bypassing the free/paid split entirely,
-- since gating only happened client-side (examOnly filtering in
-- CertificationQuiz.tsx). This replaces it with real server-side gating:
-- non-exam rows stay public, exam rows require either profiles.plan='pro'
-- or a valid, unexpired certification_purchases row for that certification.
drop policy if exists "quiz questions are publicly readable" on public.quiz_questions;

create policy "non-exam questions are publicly readable"
  on public.quiz_questions for select
  using (exam_only = false);

create policy "exam questions readable by pro or purchased users"
  on public.quiz_questions for select
  using (
    exam_only = true
    and auth.uid() is not null
    and (
      exists (
        select 1 from public.profiles
        where id = auth.uid() and plan = 'pro'
      )
      or exists (
        select 1 from public.certification_purchases
        where user_id = auth.uid()
          and certification_id = quiz_questions.certification_id
          and status = 'paid'
          and expires_at >= now()
      )
    )
  );
