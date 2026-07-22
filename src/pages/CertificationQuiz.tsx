import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { loadQuestions } from "../lib/quizData";
import type { LocalizedText, Question } from "../data/types";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n";
import { localize } from "../lib/i18nText";
import {
  FREE_QUESTION_LIMIT,
  getAnonymousUsage,
  incrementAnonymousUsage,
} from "../lib/freeQuota";
import { supabase } from "../lib/supabase";
import AuthPanel from "../components/AuthPanel";
import ProUpsell from "../components/ProUpsell";
import BackLink from "../components/BackLink";

const POINTS_PER_CORRECT = 10;

function sameAnswers(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((v, i) => v === sortedB[i]);
}

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function CertificationQuiz() {
  const { slug = "" } = useParams();
  const { user, profile, refreshProfile } = useAuth();
  const { lang, t } = useLanguage();

  const [cert, setCert] = useState<{ name: LocalizedText; questions: Question[] } | null>(
    null
  );

  // Quiz session state
  const [queue, setQueue] = useState<number[]>([]);
  const [pos, setPos] = useState(0);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [picked, setPicked] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [anonUsed, setAnonUsed] = useState(getAnonymousUsage());
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    loadQuestions(slug).then((data) => {
      if (data) {
        setCert({ name: data.name, questions: data.questions });
        setQueue(data.questions.map((_, i) => i));
        setPos(0);
        setFlagged(new Set());
        setResults({});
        startedAt.current = Date.now();
        setElapsed(0);
      }
    });
  }, [slug]);

  const answeredCount = Object.keys(results).length;
  const total = cert?.questions.length ?? 0;
  const finished = cert !== null && total > 0 && answeredCount >= total;

  useEffect(() => {
    if (!cert || finished) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [cert, finished]);

  if (!cert) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-muted">
        Chargement…
      </section>
    );
  }

  const isPro = profile?.plan === "pro";
  const used = user ? profile?.free_questions_used ?? 0 : anonUsed;
  const quotaExhausted = !isPro && used >= FREE_QUESTION_LIMIT && !finished;
  const currentScore = Object.values(results).filter(Boolean).length;

  if (quotaExhausted) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24">
        <BackLink to="/formations" label={t.quiz.back} />
        <div className="mt-8">
          {user ? <ProUpsell certName={localize(cert.name, lang)} /> : <AuthPanel />}
        </div>
      </section>
    );
  }

  if (finished) {
    const points = currentScore * POINTS_PER_CORRECT;
    return (
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="rounded-2xl border border-black/8 bg-white p-10 shadow-sm">
          <h1 className="font-display text-2xl font-semibold text-ink">
            {t.quiz.finishedTitle}
          </h1>
          <div className={`mt-8 grid gap-4 ${isPro ? "grid-cols-3" : "grid-cols-2"}`}>
            <div>
              <p className="font-display text-2xl font-semibold text-ink">
                {currentScore}/{total}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-muted">
                {t.quiz.finishedScore}
              </p>
            </div>
            {isPro && (
              <div>
                <p className="font-display text-2xl font-semibold text-ink">
                  {formatTime(elapsed)}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted">
                  {t.quiz.finishedTime}
                </p>
              </div>
            )}
            <div>
              <p className="brand-gradient-text font-display text-2xl font-semibold">
                {points}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-muted">
                {t.quiz.finishedPoints}
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setQueue(cert.questions.map((_, i) => i));
                setPos(0);
                setFlagged(new Set());
                setResults({});
                setPicked([]);
                setSubmitted(false);
                startedAt.current = Date.now();
                setElapsed(0);
              }}
              className="brand-gradient rounded-full px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              {t.quiz.restart}
            </button>
            <div className="flex justify-center">
              <BackLink to="/formations" label={t.quiz.backToFormations} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const qIndex = queue[pos];
  const question = cert.questions[qIndex];
  const isMulti = question.correctIndexes.length > 1;
  const isFlagged = flagged.has(qIndex);
  const remainingFlagged = flagged.size;

  function toggleOption(i: number) {
    if (submitted) return;
    if (isMulti) {
      setPicked((prev) =>
        prev.includes(i) ? prev.filter((v) => v !== i) : [...prev, i]
      );
    } else {
      setPicked([i]);
      commitAnswer([i]);
    }
  }

  async function commitAnswer(answer: number[]) {
    setSubmitted(true);
    const correct = sameAnswers(answer, question.correctIndexes);
    setResults((prev) => ({ ...prev, [qIndex]: correct }));

    if (user && supabase) {
      await supabase.from("attempts").insert({
        user_id: user.id,
        question_id: question.id,
        is_correct: correct,
      });
      await supabase
        .from("profiles")
        .update({ free_questions_used: (profile?.free_questions_used ?? 0) + 1 })
        .eq("id", user.id);
      await refreshProfile();
    } else {
      setAnonUsed(incrementAnonymousUsage());
    }
  }

  function goToNextInQueue() {
    setPicked([]);
    setSubmitted(false);
    setPos((p) => (p + 1 < queue.length ? p + 1 : p));
  }

  function handleNext() {
    // The answered question stays behind; advance the pointer.
    goToNextInQueue();
  }

  function handleSkip() {
    // Move the current question to the end of the queue and flag it for review.
    setFlagged((prev) => new Set(prev).add(qIndex));
    setQueue((prev) => {
      const next = [...prev];
      const [current] = next.splice(pos, 1);
      next.push(current);
      return next;
    });
    setPicked([]);
    setSubmitted(false);
  }

  function toggleFlag() {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(qIndex)) next.delete(qIndex);
      else next.add(qIndex);
      return next;
    });
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <BackLink to="/formations" label={t.quiz.back} />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-ink">
          {localize(cert.name, lang)}
        </h1>

        <div className="flex items-center gap-3">
          <div className="brand-gradient flex items-center gap-2 rounded-full px-4 py-2 text-white shadow-sm">
            <span className="font-display text-lg font-semibold leading-none">
              {currentScore}
            </span>
            <span className="text-xs font-medium uppercase tracking-wide opacity-90">
              {t.quiz.score}
            </span>
          </div>
          {isPro && (
            <span className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm text-muted shadow-sm">
              {formatTime(elapsed)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span>
          {answeredCount}/{total} · {Math.max(FREE_QUESTION_LIMIT - used, 0)} {t.quiz.remainingFree}
        </span>
        {remainingFlagged > 0 && (
          <span className="font-medium text-amber">{t.quiz.reviewFlagged(remainingFlagged)}</span>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-black/8 bg-white p-7 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <p className="font-display text-lg font-medium text-ink">
            {localize(question.question, lang)}
          </p>
          <button
            type="button"
            onClick={toggleFlag}
            title={isFlagged ? t.quiz.unflag : t.quiz.flag}
            aria-pressed={isFlagged}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition ${
              isFlagged
                ? "border-amber/40 bg-amber/10 text-amber"
                : "border-black/10 text-muted hover:border-black/20 hover:text-ink"
            }`}
          >
            <span className="text-lg leading-none">{isFlagged ? "🚩" : "⚑"}</span>
          </button>
        </div>
        {isFlagged && (
          <p className="mt-1 text-xs font-medium text-amber">{t.quiz.flaggedNotice}</p>
        )}
        {isMulti && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/[0.08] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-dark">
            <span className="text-sm">☑</span>
            {t.quiz.selectAnswers} {question.correctIndexes.length}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {question.options.map((option, i) => {
            const isCorrect = question.correctIndexes.includes(i);
            const isPicked = picked.includes(i);
            const label = localize(option, lang);

            return (
              <button
                key={label}
                type="button"
                onClick={() => toggleOption(i)}
                disabled={submitted}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                  submitted && isCorrect
                    ? "border-green/40 bg-green/10 text-green"
                    : submitted && isPicked
                      ? "border-red-400/50 bg-red-50 text-red-600"
                      : !submitted && isPicked
                        ? "border-teal/50 bg-teal/10 text-ink"
                        : "border-black/10 bg-white text-ink/80 hover:border-teal/30 hover:bg-black/[0.02]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {isMulti && !submitted && (
            <button
              type="button"
              onClick={() => commitAnswer(picked)}
              disabled={picked.length === 0}
              className="brand-gradient rounded-full px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40"
            >
              {t.quiz.validate}
            </button>
          )}
          {!submitted && (
            <button
              type="button"
              onClick={handleSkip}
              className="rounded-full border border-black/10 px-6 py-2.5 text-sm font-medium text-ink transition hover:border-black/20"
            >
              {t.quiz.skip}
            </button>
          )}
        </div>

        {submitted && (
          <div className="mt-6">
            {question.explanation && (
              <p className="text-sm leading-relaxed text-muted">
                {localize(question.explanation, lang)}
              </p>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="brand-gradient mt-4 rounded-full px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              {t.quiz.next}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
