import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence, Reorder } from "motion/react";
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
import lampasLogo from "../assets/Logo_Lampas_AI_flavicon.png";
import { CERT_LOGOS } from "../data/certLogos";

const POINTS_PER_CORRECT = 10;
const EXAM_SECONDS_PER_QUESTION = 90;
const PASS_THRESHOLD = 0.7;

function sameAnswers(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((v, i) => v === sortedB[i]);
}

function arraysEqualInOrder(a: number[], b: number[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function shuffledIndexes(length: number) {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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
  const [orderArrangement, setOrderArrangement] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [anonUsed, setAnonUsed] = useState(getAnonymousUsage());
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef<number>(Date.now());

  const [mode, setMode] = useState<"training" | "exam" | null>(null);
  const [examEndsAt, setExamEndsAt] = useState<number | null>(null);
  const [examRemaining, setExamRemaining] = useState(0);
  const [examEnded, setExamEnded] = useState(false);

  useEffect(() => {
    loadQuestions(slug).then((data) => {
      if (data) {
        setCert({ name: data.name, questions: data.questions });
        setQueue(shuffledIndexes(data.questions.length));
        setPos(0);
        setFlagged(new Set());
        setResults({});
        startedAt.current = Date.now();
        setElapsed(0);
        setMode(null);
        setExamEndsAt(null);
        setExamEnded(false);
      }
    });
  }, [slug]);

  const answeredCount = Object.keys(results).length;
  const total = cert?.questions.length ?? 0;
  const finished = (cert !== null && total > 0 && answeredCount >= total) || examEnded;

  useEffect(() => {
    if (!cert || finished || mode === null) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [cert, finished, mode]);

  useEffect(() => {
    if (mode !== "exam" || examEnded || finished || !examEndsAt) return;
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.round((examEndsAt - Date.now()) / 1000));
      setExamRemaining(remaining);
      if (remaining <= 0) setExamEnded(true);
    }, 1000);
    return () => clearInterval(id);
  }, [mode, examEndsAt, examEnded, finished]);

  useEffect(() => {
    const activeQuestion = cert?.questions[queue[pos]];
    if (activeQuestion?.type === "order") {
      setOrderArrangement(shuffledIndexes(activeQuestion.options.length));
    }
  }, [cert, queue, pos]);

  function startTraining() {
    setMode("training");
  }

  function startExam() {
    const duration = total * EXAM_SECONDS_PER_QUESTION;
    setExamEndsAt(Date.now() + duration * 1000);
    setExamRemaining(duration);
    setExamEnded(false);
    startedAt.current = Date.now();
    setElapsed(0);
    setMode("exam");
  }

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
    const scoreRatio = FREE_QUESTION_LIMIT > 0 ? currentScore / FREE_QUESTION_LIMIT : 0;
    const doingWell = scoreRatio >= 0.7;
    return (
      <section className="mx-auto max-w-3xl px-6 py-24">
        <BackLink to="/formations" label={t.quiz.back} />
        <div className="mt-8 rounded-2xl border border-black/8 bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            {t.quiz.quotaScoreLabel}
          </p>
          <motion.p
            className="brand-gradient-text mt-2 font-display text-5xl font-bold"
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.1, repeat: 2, ease: "easeInOut" }}
          >
            {currentScore}/{FREE_QUESTION_LIMIT}
          </motion.p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink/80">
            {doingWell ? t.quiz.quotaCongrats : t.quiz.quotaEncourage}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium text-teal-dark">
            {t.quiz.quotaUnlockHint}
          </p>
        </div>
        <div className="mt-6">
          {user ? <ProUpsell certName={localize(cert.name, lang)} /> : <AuthPanel />}
        </div>
      </section>
    );
  }

  if (mode === null) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24">
        <BackLink to="/formations" label={t.quiz.back} />
        <h1 className="mt-6 font-display text-2xl font-semibold text-ink">
          {t.quiz.modeSelectTitle}
        </h1>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex h-full flex-col rounded-2xl border border-black/8 bg-white p-6 shadow-sm">
            <h3 className="font-display text-lg font-medium text-ink">
              {t.quiz.modeTrainingTitle}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              {t.quiz.modeTrainingDesc}
            </p>
            <button
              type="button"
              onClick={startTraining}
              className="brand-gradient mt-5 rounded-full px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              {t.quiz.startTraining}
            </button>
          </div>

          <div className="flex h-full flex-col rounded-2xl border border-teal/25 bg-white p-6 shadow-sm">
            <h3 className="font-display text-lg font-medium text-ink">{t.quiz.modeExamTitle}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              {t.quiz.modeExamDesc}
            </p>
            {isPro ? (
              <button
                type="button"
                onClick={startExam}
                className="mt-5 rounded-full border border-teal/40 px-5 py-2.5 text-sm font-medium text-teal-dark transition hover:bg-teal/5"
              >
                {t.quiz.startExam}
              </button>
            ) : (
              <p className="mt-5 rounded-xl border border-amber/30 bg-amber/10 px-4 py-2.5 text-xs text-amber">
                {t.quiz.modeExamLocked}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (finished) {
    const points = currentScore * POINTS_PER_CORRECT;
    const passed = mode === "exam" && total > 0 && currentScore / total >= PASS_THRESHOLD;
    return (
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="rounded-2xl border border-black/8 bg-white p-10 shadow-sm">
          <h1 className="font-display text-2xl font-semibold text-ink">
            {t.quiz.finishedTitle}
          </h1>
          {mode === "exam" && (
            <div className="mt-4">
              <span
                className={`inline-flex rounded-full px-4 py-1.5 text-sm font-medium ${
                  passed
                    ? "border border-green/30 bg-green/10 text-green"
                    : "border border-red-300 bg-red-50 text-red-600"
                }`}
              >
                {passed ? t.quiz.passResult : t.quiz.failResult}
              </span>
              <p className="mt-2 text-xs text-muted">{t.quiz.passThresholdNote}</p>
            </div>
          )}
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
                setQueue(shuffledIndexes(cert.questions.length));
                setPos(0);
                setFlagged(new Set());
                setResults({});
                setPicked([]);
                setSubmitted(false);
                startedAt.current = Date.now();
                setElapsed(0);
                setMode(null);
                setExamEndsAt(null);
                setExamEnded(false);
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
    const correct =
      question.type === "order"
        ? arraysEqualInOrder(answer, question.correctOrder ?? [])
        : sameAnswers(answer, question.correctIndexes);
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
        <div className="flex items-center gap-3">
          <img
            src={CERT_LOGOS[slug] ?? lampasLogo}
            alt=""
            className="h-9 w-9 object-contain"
          />
          <h1 className="font-display text-2xl font-semibold text-ink">
            {localize(cert.name, lang)}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="brand-gradient flex items-center gap-2 rounded-full px-4 py-2 text-white shadow-sm">
            <span className="font-display text-lg font-semibold leading-none">
              {currentScore}
            </span>
            <span className="text-xs font-medium uppercase tracking-wide opacity-90">
              {t.quiz.score}
            </span>
          </div>
          {mode === "exam" ? (
            <span
              className={`rounded-full border px-3 py-2 text-sm shadow-sm ${
                examRemaining <= 60
                  ? "border-red-300 bg-red-50 text-red-600"
                  : "border-black/10 bg-white text-muted"
              }`}
              title={t.quiz.examTimeLeft}
            >
              {formatTime(examRemaining)}
            </span>
          ) : (
            isPro && (
              <span className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm text-muted shadow-sm">
                {formatTime(elapsed)}
              </span>
            )
          )}
          {mode === "exam" && (
            <button
              type="button"
              onClick={() => setExamEnded(true)}
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-ink transition hover:border-black/20"
            >
              {t.quiz.endExam}
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span>
          {isPro
            ? `${answeredCount}/${total}`
            : `${Math.min(used, FREE_QUESTION_LIMIT)}/${FREE_QUESTION_LIMIT}`}{" "}
          · {Math.max(FREE_QUESTION_LIMIT - used, 0)} {t.quiz.remainingFree}
        </span>
        {remainingFlagged > 0 && (
          <span className="font-medium text-amber">{t.quiz.reviewFlagged(remainingFlagged)}</span>
        )}
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/5">
        <motion.div
          className="brand-gradient h-full rounded-full"
          animate={{
            width: `${
              isPro
                ? total > 0
                  ? (answeredCount / total) * 100
                  : 0
                : (Math.min(used, FREE_QUESTION_LIMIT) / FREE_QUESTION_LIMIT) * 100
            }%`,
          }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={qIndex}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mt-6 rounded-2xl border border-black/8 bg-white p-7 shadow-sm"
        >
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
          {question.type === "order" && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/[0.08] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-dark">
              <span className="text-sm">⇅</span>
              {t.quiz.dragHint}
            </div>
          )}

          {question.type === "order" ? (
            <Reorder.Group
              axis="y"
              values={orderArrangement}
              onReorder={setOrderArrangement}
              className="mt-6 flex flex-col gap-3"
            >
              {orderArrangement.map((optIdx, position) => {
                const isCorrectPos = submitted && question.correctOrder?.[position] === optIdx;
                const isWrongPos = submitted && !isCorrectPos;
                const label = localize(question.options[optIdx], lang);

                return (
                  <Reorder.Item
                    key={optIdx}
                    value={optIdx}
                    drag={!submitted}
                    whileDrag={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                      submitted
                        ? isCorrectPos
                          ? "border-green/40 bg-green/10 text-green"
                          : "border-red-400/50 bg-red-50 text-red-600"
                        : "cursor-grab border-black/10 bg-white text-ink/80 active:cursor-grabbing"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        isWrongPos ? "bg-red-100 text-red-600" : "bg-black/5 text-ink/60"
                      }`}
                    >
                      {position + 1}
                    </span>
                    <span className="flex-1">{label}</span>
                    {!submitted && (
                      <span className="text-muted" aria-hidden="true">
                        ⠿
                      </span>
                    )}
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          ) : (
            <div className="mt-6 flex flex-col gap-3">
              {question.options.map((option, i) => {
                const isCorrect = question.correctIndexes.includes(i);
                const isPicked = picked.includes(i);
                const label = localize(option, lang);

                return (
                  <motion.button
                    key={label}
                    type="button"
                    whileTap={{ scale: 0.98 }}
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
                  </motion.button>
                );
              })}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {(isMulti || question.type === "order") && !submitted && (
              <button
                type="button"
                onClick={() =>
                  commitAnswer(question.type === "order" ? orderArrangement : picked)
                }
                disabled={question.type !== "order" && picked.length === 0}
                className="brand-gradient rounded-full px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40"
              >
                {question.type === "order" ? t.quiz.validateOrder : t.quiz.validate}
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
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              {question.explanation && (
                <div className="rounded-2xl border border-teal/25 bg-teal/[0.06] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-dark">
                    {t.quiz.explanationLabel}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/80">
                    {localize(question.explanation, lang)}
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="brand-gradient mt-4 rounded-full px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
              >
                {t.quiz.next}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
