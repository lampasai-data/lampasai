import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, Reorder } from "motion/react";
import { loadQuestions, getPurchasedCertificationIds } from "../lib/quizData";
import type { LocalizedText, Question } from "../data/types";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n";
import { localize } from "../lib/i18nText";
import { FREE_QUESTION_LIMIT } from "../lib/freeQuota";
import { supabase } from "../lib/supabase";
import AuthPanel from "../components/AuthPanel";
import ProUpsell from "../components/ProUpsell";
import BackLink from "../components/BackLink";
import lampasLogo from "../assets/Logo_Lampas_AI_flavicon.png";
import { CERT_LOGOS } from "../data/certLogos";
import CustomSelect from "../components/CustomSelect";

function ClockIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.12" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const POINTS_PER_CORRECT = 10;
const EXAM_SECONDS_PER_QUESTION = 60;
const PASS_THRESHOLD = 0.7;
// SnowPro Core's real exam scores out of 1000 with a 750 pass mark (75%),
// vs. PL-300's ~700/1000 (70%). Reflect the real threshold per certification.
const PASS_THRESHOLD_BY_SLUG: Record<string, number> = {
  snowflake: 0.75,
};

function getPassThreshold(slug: string) {
  return PASS_THRESHOLD_BY_SLUG[slug] ?? PASS_THRESHOLD;
}

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

type AnswerLog = {
  picked?: number[];
  order?: number[];
  match?: (number | null)[];
  hotspot?: (number | null)[];
};

interface PersistedRun {
  slug: string;
  totalQuestions: number;
  mode: "training" | "exam" | null;
  quickExamSetup: boolean;
  customCount: number | null;
  queue: number[];
  pos: number;
  flagged: number[];
  results: Record<number, boolean>;
  picked: number[];
  orderArrangement: number[];
  matchAssign: (number | null)[];
  hotspotPicks: (number | null)[];
  submitted: boolean;
  answerLog: Record<number, AnswerLog>;
  examEndsAt: number | null;
  examEnded: boolean;
  elapsed: number;
}

function runStorageKey(slug: string) {
  return `lampasai_quiz_run:${slug}`;
}

function loadPersistedRun(slug: string, totalQuestions: number): PersistedRun | null {
  try {
    const raw = sessionStorage.getItem(runStorageKey(slug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedRun;
    if (parsed.slug !== slug || parsed.totalQuestions !== totalQuestions || parsed.mode === null) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function savePersistedRun(run: PersistedRun) {
  try {
    sessionStorage.setItem(runStorageKey(run.slug), JSON.stringify(run));
  } catch {
    // ignore storage errors (private browsing, quota, etc.)
  }
}

function clearPersistedRun(slug: string) {
  try {
    sessionStorage.removeItem(runStorageKey(slug));
  } catch {
    // ignore
  }
}

// Options that look like code/formula snippets (DAX, SQL, ...) read much
// better in a monospace font than the default prose font.
function looksLikeCode(text: string) {
  // A bare type/length token like "VARCHAR(25)" or "CHARACTER(25)" isn't a
  // real code snippet - it reads better in the normal font than monospace.
  if (/^[A-Z_]+\(\d+\)$/.test(text.trim())) return false;
  // Square/curly brackets ([Column], {values}) or an UPPERCASE function call
  // (USERNAME(), CALCULATE(...)) are strong DAX/SQL signals. Plain
  // parenthesised words like "(ribbon)" or "(scatter)" are not.
  return /[[\]{}]/.test(text) || /\b[A-Z][A-Z0-9_]*\(/.test(text);
}

// Renders question/blank text line by line, switching to monospace only for
// lines that look like an actual DAX/SQL snippet (e.g. a formula on its own
// line), so a prose question with an embedded formula doesn't render as one
// uniform font.
// Circled-digit glyphs (①②③...) render illegibly small/inconsistent across
// fonts (especially monospace). Replace each with a proper styled badge
// instead of relying on the glyph.
const CIRCLED_DIGIT_RE = /([①-⑳])/;

function withCircledNumbers(text: string) {
  return text.split(CIRCLED_DIGIT_RE).map((part, i) => {
    const cp = part.codePointAt(0);
    if (part.length === 1 && cp !== undefined && cp >= 0x2460 && cp <= 0x2473) {
      return (
        <span
          key={i}
          className="mx-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal/15 align-middle text-[10px] font-semibold text-teal-dark"
        >
          {cp - 0x2460 + 1}
        </span>
      );
    }
    return part;
  });
}

function renderQuestionText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <span key={i} className={looksLikeCode(line) ? "font-mono text-[13px] tracking-tight" : undefined}>
      {withCircledNumbers(line)}
      {i < lines.length - 1 ? "\n" : ""}
    </span>
  ));
}

function formatTime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(h > 0 ? 2 : 1, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
}

export default function CertificationQuiz() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { user, profile, openAuthModalForUpgrade, openUpgradeModal } = useAuth();
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [cert, setCert] = useState<{ id: string; name: LocalizedText; questions: Question[] } | null>(
    null
  );
  const [purchasedIds, setPurchasedIds] = useState<Map<string, string>>(new Map());
  // Pro users can cap how many questions a run draws from; null = use them all.
  const [customCount, setCustomCount] = useState<number | null>(null);

  // Quiz session state
  const [queue, setQueue] = useState<number[]>([]);
  const [pos, setPos] = useState(0);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [picked, setPicked] = useState<number[]>([]);
  const [orderArrangement, setOrderArrangement] = useState<number[]>([]);
  // "match" (drag-drop): matchAssign[targetIndex] = pool index dropped there (or null).
  const [matchAssign, setMatchAssign] = useState<(number | null)[]>([]);
  const [dragPool, setDragPool] = useState<number | null>(null);
  // "hotspot": hotspotPicks[blankIndex] = chosen option index for that dropdown (or null).
  const [hotspotPicks, setHotspotPicks] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [answerLog, setAnswerLog] = useState<Record<number, AnswerLog>>({});
  const [expandedReview, setExpandedReview] = useState<Set<number>>(new Set());
  const [reviewErrorsOnly, setReviewErrorsOnly] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef<number>(Date.now());
  const qIndexRef = useRef<number | undefined>(undefined);

  const [mode, setMode] = useState<"training" | "exam" | null>(null);
  const [quickExamSetup, setQuickExamSetup] = useState(false);
  const [launching, setLaunching] = useState<"training" | "exam" | null>(null);
  const [examEndsAt, setExamEndsAt] = useState<number | null>(null);
  const [examRemaining, setExamRemaining] = useState(0);
  const [examEnded, setExamEnded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadQuestions(slug).then((data) => {
      if (cancelled || !data) return;
      setCert({ id: data.id, name: data.name, questions: data.questions });

      // An explicit ?mode=exam link (e.g. the Dashboard's quick-start button)
      // always wins over a stale in-progress run for this slug - otherwise a
      // forgotten training session would silently resume instead of opening
      // the exam quick-start screen the user just clicked into.
      const wantsFreshExam = searchParams.get("mode") === "exam";
      const saved = wantsFreshExam ? null : loadPersistedRun(slug, data.questions.length);
      if (saved) {
        setQueue(saved.queue);
        setPos(saved.pos);
        setFlagged(new Set(saved.flagged));
        setResults(saved.results);
        setPicked(saved.picked);
        setOrderArrangement(saved.orderArrangement);
        setMatchAssign(saved.matchAssign);
        setHotspotPicks(saved.hotspotPicks);
        setSubmitted(saved.submitted);
        setAnswerLog(saved.answerLog);
        setCustomCount(saved.customCount);
        qIndexRef.current = saved.queue[saved.pos];
        startedAt.current = Date.now() - saved.elapsed * 1000;
        setElapsed(saved.elapsed);
        setExamEndsAt(saved.examEndsAt);
        setExamEnded(saved.examEnded);
        setQuickExamSetup(saved.quickExamSetup);
        setMode(saved.mode);
        return;
      }

      setQueue(shuffledIndexes(data.questions.length));
      setPos(0);
      setFlagged(new Set());
      setResults({});
      startedAt.current = Date.now();
      setElapsed(0);
      setMode(null);
      setQuickExamSetup(false);
      setExamEndsAt(null);
      setExamEnded(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Persist the in-progress run so a page refresh (or accidental tab close)
  // resumes exactly where the user left off instead of dropping back to the
  // training/exam choice screen.
  useEffect(() => {
    if (!cert) return;
    if (mode === null) {
      clearPersistedRun(slug);
      return;
    }
    savePersistedRun({
      slug,
      totalQuestions: cert.questions.length,
      mode,
      quickExamSetup,
      customCount,
      queue,
      pos,
      flagged: Array.from(flagged),
      results,
      picked,
      orderArrangement,
      matchAssign,
      hotspotPicks,
      submitted,
      answerLog,
      examEndsAt,
      examEnded,
      elapsed,
    });
  }, [
    cert,
    slug,
    mode,
    quickExamSetup,
    customCount,
    queue,
    pos,
    flagged,
    results,
    picked,
    orderArrangement,
    matchAssign,
    hotspotPicks,
    submitted,
    answerLog,
    examEndsAt,
    examEnded,
    elapsed,
  ]);

  useEffect(() => {
    if (user) getPurchasedCertificationIds(user.id).then(setPurchasedIds);
  }, [user]);

  // Direct-to-exam entry point (e.g. from the Dashboard's "Démarrer l'examen"
  // card button, which links here with ?mode=exam): skip the training/exam
  // choice screen, but still let the user pick the question count.
  useEffect(() => {
    if (!cert || mode !== null || searchParams.get("mode") !== "exam") return;
    if (!hasProAccess()) return;
    setQuickExamSetup(true);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("mode");
      return next;
    }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cert, mode, profile, purchasedIds, searchParams]);

  useEffect(() => {
    if (!user || searchParams.get("checkout") !== "success") return;
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      const ids = await getPurchasedCertificationIds(user.id);
      setPurchasedIds(ids);
      if (attempts >= 5) clearInterval(interval);
    }, 2000);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("checkout");
      return next;
    }, { replace: true });
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const answeredCount = Object.keys(results).length;
  const total = cert?.questions.length ?? 0;
  // The number of questions in the current run: capped to the free quota for
  // non-Pro users, full bank for Pro. Free runs are repeatable and reshuffled.
  const runSize = queue.length;
  const finished = (runSize > 0 && answeredCount >= runSize) || examEnded;

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

  // Pro access is granted either by the legacy account-wide admin override
  // (profile.plan) or by a per-certification Stripe purchase.
  function hasProAccess() {
    return profile?.plan === "pro" || (cert ? purchasedIds.has(cert.id) : false);
  }

  // Build a fresh, reshuffled run. Training/free runs never draw questions
  // flagged "exam only"; exam runs draw from the full bank. Non-Pro users get
  // a repeatable subset capped to the free quota; Pro users get the full
  // eligible pool, optionally capped to their chosen question count.
  function buildRunQueue(targetMode: "training" | "exam") {
    const eligible = (cert?.questions ?? [])
      .map((_, i) => i)
      .filter((i) => targetMode === "exam" || !cert?.questions[i].examOnly);
    const shuffled = eligible
      .map((i) => ({ i, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map(({ i }) => i);
    if (!hasProAccess()) return shuffled.slice(0, FREE_QUESTION_LIMIT);
    return customCount ? shuffled.slice(0, customCount) : shuffled;
  }

  function resetRun(targetMode: "training" | "exam") {
    setQueue(buildRunQueue(targetMode));
    setPos(0);
    setFlagged(new Set());
    setResults({});
    setPicked([]);
    setSubmitted(false);
    setAnswerLog({});
    setExpandedReview(new Set());
    setReviewErrorsOnly(false);
    startedAt.current = Date.now();
    setElapsed(0);
  }

  function logAnswer(qi: number, data: AnswerLog) {
    setAnswerLog((prev) => ({ ...prev, [qi]: data }));
  }

  function startTraining() {
    resetRun("training");
    setQuickExamSetup(false);
    setMode("training");
  }

  function startExam() {
    const queueLength = hasProAccess() ? (customCount ?? total) : FREE_QUESTION_LIMIT;
    const duration = queueLength * EXAM_SECONDS_PER_QUESTION;
    resetRun("exam");
    setExamEndsAt(Date.now() + duration * 1000);
    setExamRemaining(duration);
    setExamEnded(false);
    setQuickExamSetup(false);
    setMode("exam");
  }

  // Show a brief loading modal before the quiz view appears, so the switch
  // from the setup screen to question 1 doesn't feel like an abrupt jump cut.
  function launchTraining() {
    setLaunching("training");
    setTimeout(() => {
      startTraining();
      setLaunching(null);
    }, 450);
  }

  function launchExam() {
    setLaunching("exam");
    setTimeout(() => {
      startExam();
      setLaunching(null);
    }, 450);
  }

  const loadingModal = launching && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-8 py-6 shadow-xl">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal/30 border-t-teal" />
        <p className="text-sm font-medium text-ink">
          {launching === "exam" ? t.quiz.preparingExam : t.quiz.preparingTraining}
        </p>
      </div>
    </div>
  );

  if (!cert) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-muted">
        Chargement…
      </section>
    );
  }

  const isPro = hasProAccess();
  const currentScore = Object.values(results).filter(Boolean).length;
  // Logged-in users land back on their Dashboard at /formations, not the
  // public marketing page, so the back link should say so.
  const backLabel = user ? t.quiz.backDashboard : t.quiz.back;

  function renderAnswerSummary(q: Question, log: AnswerLog | undefined) {
    const rowClass = (isRight: boolean) =>
      `rounded-lg border px-3 py-2 ${
        isRight ? "border-green/30 bg-green/5 text-ink/80" : "border-red-300 bg-red-50 text-red-600"
      }`;

    if (q.type === "order") {
      const order = log?.order ?? [];
      return (
        <div className="mt-3 space-y-1.5 text-sm">
          {(q.correctOrder ?? []).map((correctOptIdx, i) => {
            const userOptIdx = order[i];
            const isRight = userOptIdx === correctOptIdx;
            return (
              <div key={i} className={rowClass(isRight)}>
                <span className="font-medium text-ink/60">{i + 1}.</span>{" "}
                {userOptIdx !== undefined ? localize((q.options ?? [])[userOptIdx], lang) : "-"}
                {!isRight && (
                  <span className="mt-1 block text-xs font-medium text-green">
                    ✓ {localize((q.options ?? [])[correctOptIdx], lang)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    if (q.type === "match") {
      return (
        <div className="mt-3 space-y-1.5 text-sm">
          {(q.targets ?? []).map((target, ti) => {
            const assigned = log?.match?.[ti] ?? null;
            const isRight = assigned === target.correctPoolIndex;
            return (
              <div key={ti} className={rowClass(isRight)}>
                <span className="font-medium text-ink/70">
                  {withCircledNumbers(localize(target.label, lang))}
                </span>
                {" -> "}
                {assigned !== null ? localize((q.pool ?? [])[assigned], lang) : t.quiz.dropHere}
                {!isRight && (
                  <span className="mt-1 block text-xs font-medium text-green">
                    ✓ {localize((q.pool ?? [])[target.correctPoolIndex], lang)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    if (q.type === "hotspot") {
      return (
        <div className="mt-3 space-y-1.5 text-sm">
          {(q.blanks ?? []).map((blank, bi) => {
            const pick = log?.hotspot?.[bi] ?? null;
            const isRight = pick === blank.correctIndex;
            const labelText = blank.label ? localize(blank.label, lang) : "";
            const answerText = pick !== null ? localize(blank.options[pick], lang) : "…";
            const filled = labelText.includes("⬚")
              ? labelText.replace("⬚", answerText)
              : `${labelText} ${answerText}`.trim();
            return (
              <div key={bi} className={`${rowClass(isRight)} ${looksLikeCode(labelText) ? "font-mono text-[13px]" : ""}`}>
                {withCircledNumbers(filled)}
                {!isRight && (
                  <span className="mt-1 block text-xs font-medium text-green">
                    ✓ {localize(blank.options[blank.correctIndex], lang)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    const picked = log?.picked ?? [];
    return (
      <div className="mt-3 space-y-1.5 text-sm">
        {(q.options ?? []).map((option, i) => {
          const isCorrect = (q.correctIndexes ?? []).includes(i);
          const isPicked = picked.includes(i);
          return (
            <div
              key={i}
              className={`rounded-lg border px-3 py-2 ${
                isCorrect
                  ? "border-green/30 bg-green/5 text-green"
                  : isPicked
                    ? "border-red-300 bg-red-50 text-red-600"
                    : "border-black/10 text-ink/70"
              }`}
            >
              {localize(option, lang)}
            </div>
          );
        })}
      </div>
    );
  }

  const questionCountSlider = isPro
    ? (() => {
        const stepValues = Array.from(
          { length: Math.ceil(total / 20) },
          (_, i) => Math.min((i + 1) * 20, total)
        );
        if (stepValues.length <= 1) return null;
        const sliderIndex =
          customCount === null
            ? stepValues.length - 1
            : Math.max(0, stepValues.findIndex((v) => v === customCount));
        return (
          <div className="mt-5 max-w-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted">{t.quiz.questionCountLabel}</span>
              <span className="text-sm font-semibold text-ink">
                {customCount === null ? total : customCount}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={stepValues.length - 1}
              step={1}
              value={sliderIndex}
              onChange={(e) => {
                const v = stepValues[Number(e.target.value)];
                setCustomCount(v >= total ? null : v);
              }}
              className="w-full accent-teal"
            />
          </div>
        );
      })()
    : null;

  if (mode === null && quickExamSetup) {
    const previewQuestion = cert.questions[queue[0] ?? 0];
    return (
      <>
        <section className="mx-auto max-w-3xl px-6 py-24">
          <BackLink to="/formations" label={backLabel} />
          <div className="mt-6 flex items-center gap-3">
            <img src={CERT_LOGOS[slug] ?? lampasLogo} alt="" className="h-9 w-9 object-contain" />
            <h1 className="font-display text-2xl font-semibold text-ink">
              {localize(cert.name, lang)}
            </h1>
          </div>

          {previewQuestion && (
            <div className="mt-6 rounded-2xl border border-black/8 bg-white p-7 shadow-sm">
              <p className="whitespace-pre-line text-justify font-display text-base font-medium text-ink">
                {renderQuestionText(localize(previewQuestion.question, lang))}
              </p>
              {(previewQuestion.options ?? []).length > 0 && (
                <div className="mt-6 flex flex-col gap-3">
                  {(previewQuestion.options ?? []).map((option, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-black/10 px-4 py-3 text-left text-sm text-ink/80"
                    >
                      {localize(option, lang)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6 backdrop-blur-sm"
          onClick={() => {
            if (launching) return;
            navigate("/formations");
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-2xl border border-black/8 bg-white p-6 shadow-xl"
          >
            {launching === "exam" ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal/30 border-t-teal" />
                <p className="text-sm font-medium text-ink">{t.quiz.preparingExam}</p>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/formations")}
                  aria-label={backLabel}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-ink shadow-sm transition hover:bg-black/[0.03]"
                >
                  ✕
                </button>
                <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
                  {t.quiz.modeExamTitle}
                  <ClockIcon className="h-4 w-4 text-teal-dark" />
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.quiz.modeExamDescShort}</p>

                {questionCountSlider}

                <button
                  type="button"
                  onClick={launchExam}
                  aria-label={t.quiz.startExam}
                  title={t.quiz.startExam}
                  className="brand-gradient mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-sm transition hover:opacity-90"
                >
                  <span className="ml-0.5 text-2xl leading-none">▶</span>
                </button>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  if (mode === null) {
    return (
      <>
        <section className="mx-auto max-w-3xl px-6 py-24">
          <BackLink to="/formations" label={backLabel} />
          <h1 className="mt-6 font-display text-2xl font-semibold text-ink">
            {t.quiz.modeSelectTitle}
          </h1>

          {questionCountSlider}

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
                onClick={launchTraining}
                className="brand-gradient mt-5 rounded-full px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
              >
                {t.quiz.startTraining}
              </button>
            </div>

            <div className="flex h-full flex-col rounded-2xl border border-teal/25 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-display text-lg font-medium text-ink">
                {t.quiz.modeExamTitle}
                <ClockIcon className="h-4 w-4 text-teal-dark" />
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {t.quiz.modeExamDesc}
              </p>
              {isPro ? (
                <button
                  type="button"
                  onClick={launchExam}
                  className="mt-5 rounded-full border border-teal/40 px-5 py-2.5 text-sm font-medium text-teal-dark transition hover:bg-teal/5"
                >
                  {t.quiz.startExam}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => (user ? openUpgradeModal(slug) : openAuthModalForUpgrade(slug))}
                  className="brand-gradient mt-5 rounded-full px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                >
                  {t.quiz.modeExamLocked}
                </button>
              )}
            </div>
          </div>
        </section>
        {loadingModal}
      </>
    );
  }

  if (finished) {
    const points = currentScore * POINTS_PER_CORRECT;
    const ratio = runSize > 0 ? currentScore / runSize : 0;
    const passThreshold = getPassThreshold(slug);
    const passed = mode === "exam" && ratio >= passThreshold;
    const doingWell = ratio >= 0.75;

    function restartRun() {
      resetRun("training");
      setMode(null);
      setQuickExamSetup(false);
      setExamEndsAt(null);
      setExamEnded(false);
    }

    return (
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="rounded-2xl border border-black/8 bg-white p-10 shadow-sm">
          <div className="text-left">
            <BackLink to="/formations" label={backLabel} />
          </div>
          <h1 className="mt-6 font-display text-2xl font-semibold text-ink">
            {t.quiz.finishedTitle}
          </h1>
          {mode === "exam" ? (
            <div className="mt-4">
              <span
                className={`inline-flex rounded-full px-4 py-1.5 text-sm font-medium ${
                  passed
                    ? "border border-green/30 bg-green/10 text-green"
                    : "border border-red-300 bg-red-50 text-red-600"
                }`}
              >
                {passed ? t.quiz.trainingSuccess : t.quiz.trainingFail}
              </span>
              <p className="mt-2 text-xs text-muted">
                {t.quiz.passThresholdNote(Math.round(passThreshold * 1000))}
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <span
                className={`inline-flex rounded-full px-4 py-1.5 text-sm font-medium ${
                  doingWell
                    ? "border border-green/30 bg-green/10 text-green"
                    : "border border-red-300 bg-red-50 text-red-600"
                }`}
              >
                {doingWell ? t.quiz.trainingSuccess : t.quiz.trainingFail}
              </span>
            </div>
          )}

          <motion.p
            className="brand-gradient-text mt-6 font-display text-5xl font-bold"
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.1, repeat: 2, ease: "easeInOut" }}
          >
            {currentScore}/{runSize}
          </motion.p>
          <p className="mt-2 text-xs uppercase tracking-wide text-muted">
            {t.quiz.finishedScore}
          </p>

          {!isPro && (
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink/80">
              {doingWell ? t.quiz.quotaCongrats : t.quiz.quotaEncourage}
            </p>
          )}

          <div className={`mt-8 grid gap-4 ${isPro ? "grid-cols-2" : "grid-cols-1"}`}>
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

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={restartRun}
              className="brand-gradient rounded-full px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              {t.quiz.restart}
            </button>
          </div>
        </div>

        {mode === "exam" && (
          <div className="mt-8 text-left">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-lg font-semibold text-ink">{t.quiz.reviewTitle}</h2>
              <button
                type="button"
                onClick={() => setReviewErrorsOnly((v) => !v)}
                className="rounded-full border border-black/10 px-4 py-1.5 text-xs font-medium text-ink transition hover:border-black/20"
              >
                {reviewErrorsOnly ? t.quiz.reviewAll : t.quiz.reviewErrorsOnly}
              </button>
            </div>
            <div className="space-y-2">
              {Object.keys(results)
                .map(Number)
                .sort((a, b) => a - b)
                .filter((qi) => !reviewErrorsOnly || !results[qi])
                .map((qi) => {
                  const q = cert.questions[qi];
                  const correct = results[qi];
                  const isExpanded = expandedReview.has(qi);
                  return (
                    <div key={qi} className="rounded-xl border border-black/8 bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedReview((prev) => {
                            const next = new Set(prev);
                            if (next.has(qi)) next.delete(qi);
                            else next.add(qi);
                            return next;
                          })
                        }
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              correct ? "bg-green/15 text-green" : "bg-red-100 text-red-600"
                            }`}
                          >
                            {correct ? "✓" : "✕"}
                          </span>
                          {flagged.has(qi) && <span className="shrink-0">🚩</span>}
                          <span className="truncate font-medium text-ink">
                            {localize(q.question, lang)}
                          </span>
                        </span>
                        <span className="shrink-0 text-muted">{isExpanded ? "-" : "+"}</span>
                      </button>
                      {isExpanded && (
                        <div className="border-t border-black/8 px-4 py-4">
                          {renderAnswerSummary(q, answerLog[qi])}
                          {q.explanation && (
                            <div className="mt-4 rounded-xl border border-teal/25 bg-teal/[0.06] p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-teal-dark">
                                {t.quiz.explanationLabel}
                              </p>
                              <p className="mt-2 text-sm leading-relaxed text-ink/80">
                                {localize(q.explanation, lang)}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {!isPro && (
          <div className="mt-6 text-left">
            <p className="mb-4 text-center text-sm font-medium text-teal-dark">
              {t.quiz.quotaUnlockHint}
            </p>
            {user ? (
              <ProUpsell certName={localize(cert.name, lang)} certSlug={slug} />
            ) : (
              <AuthPanel />
            )}
          </div>
        )}
      </section>
    );
  }

  const qIndex = queue[pos];
  const question = cert.questions[qIndex];

  // Reset the per-type interaction state (order/match/hotspot) the instant
  // the current question changes, synchronously during render rather than
  // in a useEffect. An effect-based reset only takes effect *after* this
  // render already ran with the *previous* question's leftover state, which
  // crashes as soon as it indexes past the new question's (shorter) options/
  // targets/blanks - e.g. two "order" questions back-to-back with different
  // lengths. Local `current*` variables (not the bare state) are what the
  // JSX below reads, so this render is correct immediately; the setters
  // additionally persist it so later interactions/re-renders stay in sync.
  let currentOrderArrangement = orderArrangement;
  let currentMatchAssign = matchAssign;
  let currentHotspotPicks = hotspotPicks;
  if (qIndexRef.current !== qIndex) {
    qIndexRef.current = qIndex;
    if (question.type === "order") {
      currentOrderArrangement = shuffledIndexes(question.options?.length ?? 0);
    }
    if (question.type === "match") {
      currentMatchAssign = new Array(question.targets?.length ?? 0).fill(null);
    }
    if (question.type === "hotspot") {
      currentHotspotPicks = new Array(question.blanks?.length ?? 0).fill(null);
    }
    setOrderArrangement(currentOrderArrangement);
    setMatchAssign(currentMatchAssign);
    setHotspotPicks(currentHotspotPicks);
    setDragPool(null);
  }

  const isMulti = (question.correctIndexes?.length ?? 0) > 1;
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
      logAnswer(qIndex, { picked: [i] });
      commitAnswer([i]);
    }
  }

  async function commitResult(correct: boolean) {
    setSubmitted(true);
    setResults((prev) => ({ ...prev, [qIndex]: correct }));

    // Record the attempt for signed-in users (analytics only). Free questions are
    // repeatable per session and independent per certification, so nothing gates.
    if (user && supabase) {
      await supabase.from("attempts").insert({
        user_id: user.id,
        question_id: question.id,
        is_correct: correct,
      });
    }
  }

  function commitAnswer(answer: number[]) {
    commitResult(sameAnswers(answer, question.correctIndexes ?? []));
  }

  // Validate the current question according to its type.
  function handleValidate() {
    if (question.type === "order") {
      logAnswer(qIndex, { order: orderArrangement });
      commitResult(arraysEqualInOrder(orderArrangement, question.correctOrder ?? []));
    } else if (question.type === "match") {
      logAnswer(qIndex, { match: matchAssign });
      commitResult(
        (question.targets ?? []).every((tg, i) => matchAssign[i] === tg.correctPoolIndex)
      );
    } else if (question.type === "hotspot") {
      logAnswer(qIndex, { hotspot: hotspotPicks });
      commitResult(
        (question.blanks ?? []).every((bl, i) => hotspotPicks[i] === bl.correctIndex)
      );
    } else {
      logAnswer(qIndex, { picked });
      commitAnswer(picked);
    }
  }

  function assignTarget(targetIndex: number, poolIndex: number | null) {
    setMatchAssign((prev) => prev.map((v, i) => (i === targetIndex ? poolIndex : v)));
  }

  const canValidate =
    question.type === "order"
      ? true
      : question.type === "match"
        ? matchAssign.length > 0 && matchAssign.every((v) => v !== null)
        : question.type === "hotspot"
          ? hotspotPicks.length > 0 && hotspotPicks.every((v) => v !== null)
          : picked.length > 0;

  const needsValidateButton =
    isMulti ||
    question.type === "order" ||
    question.type === "match" ||
    question.type === "hotspot";

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
    <section className="mx-auto max-w-3xl px-6 pt-4 pb-24">
      <BackLink to="/formations" label={backLabel} />

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
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-ink transition hover:bg-teal/5"
            >
              {t.quiz.endExam}
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span>
          {answeredCount}/{runSize}
          {!isPro && (
            <>
              {" "}
              · {Math.max(runSize - answeredCount, 0)} {t.quiz.remainingFree}
            </>
          )}
        </span>
        {remainingFlagged > 0 && (
          <span className="font-medium text-amber">{t.quiz.reviewFlagged(remainingFlagged)}</span>
        )}
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/5">
        <motion.div
          className="brand-gradient h-full rounded-full"
          animate={{ width: `${runSize > 0 ? (answeredCount / runSize) * 100 : 0}%` }}
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
          {question.image && (
            <img
              src={question.image}
              alt=""
              className="mb-4 w-full max-w-xl rounded-xl border border-black/8"
            />
          )}
          <div className="flex items-start justify-between gap-4">
            <p className="whitespace-pre-line text-justify font-display text-base font-medium text-ink">
              {renderQuestionText(localize(question.question, lang))}
            </p>
            <button
              type="button"
              onClick={toggleFlag}
              title={isFlagged ? t.quiz.unflag : t.quiz.flag}
              aria-pressed={isFlagged}
              className={`-mr-4 flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition ${
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
              {t.quiz.selectAnswers} {question.correctIndexes?.length ?? 0}
            </div>
          )}
          {question.type === "order" && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/[0.08] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-dark">
              <span className="text-sm">⇅</span>
              {t.quiz.dragHint}
            </div>
          )}
          {question.type === "match" && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/[0.08] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-dark">
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                <path
                  d="M4 12h13M13 7l4 5-4 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t.quiz.matchHint}
            </div>
          )}
          {question.type === "hotspot" && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/[0.08] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-dark">
              <span className="text-sm">▾</span>
              {t.quiz.hotspotHint}
            </div>
          )}

          {question.type === "match" ? (
            <div className="mt-6 space-y-6">
              <div className="flex flex-wrap gap-2">
                {(question.pool ?? []).map((item, pi) => (
                  <button
                    key={localize(item, lang)}
                    type="button"
                    draggable={!submitted}
                    onDragStart={() => setDragPool(pi)}
                    onDragEnd={() => setDragPool(null)}
                    onClick={() => setDragPool((cur) => (cur === pi ? null : pi))}
                    disabled={submitted}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      dragPool === pi
                        ? "border-teal bg-teal/10 text-ink"
                        : "border-black/10 bg-white text-ink/80 hover:border-teal/30"
                    } ${submitted ? "opacity-60" : "cursor-grab active:cursor-grabbing"}`}
                  >
                    {withCircledNumbers(localize(item, lang))}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {(question.targets ?? []).map((target, ti) => {
                  const assigned = currentMatchAssign[ti];
                  const isRight = submitted && assigned === target.correctPoolIndex;
                  const isWrong = submitted && !isRight;
                  return (
                    <div
                      key={localize(target.label, lang)}
                      onDragOver={(e) => {
                        if (!submitted) e.preventDefault();
                      }}
                      onDrop={() => {
                        if (submitted || dragPool === null) return;
                        assignTarget(ti, dragPool);
                        setDragPool(null);
                      }}
                      onClick={() => {
                        if (submitted) return;
                        if (dragPool !== null) {
                          assignTarget(ti, dragPool);
                          setDragPool(null);
                        } else if (assigned !== null) {
                          assignTarget(ti, null);
                        }
                      }}
                      className={`flex flex-col gap-1.5 rounded-xl border px-4 py-3 transition sm:flex-row sm:items-center sm:gap-4 ${
                        submitted
                          ? isRight
                            ? "border-green/40 bg-green/10"
                            : "border-red-400/50 bg-red-50"
                          : dragPool !== null
                            ? "cursor-pointer border-dashed border-teal/50 bg-teal/[0.04]"
                            : "border-black/10 bg-white"
                      }`}
                    >
                      <span className="text-sm font-medium text-ink/70 sm:w-1/3">
                        {withCircledNumbers(localize(target.label, lang))}
                      </span>
                      <span
                        className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                          assigned !== null
                            ? isWrong
                              ? "border-red-300 bg-white text-red-600"
                              : "border-teal/30 bg-white text-ink"
                            : "border-dashed border-black/15 bg-black/[0.02] text-muted"
                        }`}
                      >
                        {assigned !== null
                          ? localize((question.pool ?? [])[assigned], lang)
                          : t.quiz.dropHere}
                      </span>
                      {isWrong && (
                        <span className="text-xs font-medium text-green sm:w-1/4">
                          ✓ {localize((question.pool ?? [])[target.correctPoolIndex], lang)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : question.type === "hotspot" ? (
            (() => {
              const blanks = question.blanks ?? [];
              const renderSelect = (bi: number, code: boolean) => {
                const pick = currentHotspotPicks[bi];
                const isRight = submitted && pick === blanks[bi].correctIndex;
                return (
                  <CustomSelect
                    options={blanks[bi].options.map((opt) => localize(opt, lang))}
                    value={pick}
                    disabled={submitted}
                    placeholder={t.quiz.choosePlaceholder}
                    onChange={(index) =>
                      setHotspotPicks((prev) => prev.map((v, i) => (i === bi ? index : v)))
                    }
                    className="inline-block w-auto min-w-[10rem] max-w-full align-middle"
                    triggerClassName={`${code ? "font-mono text-[12px]" : ""} ${
                      submitted
                        ? isRight
                          ? "border-green/40 bg-green/10 text-green"
                          : "border-red-400/50 bg-red-50 text-red-600"
                        : "border-black/15 bg-white text-ink"
                    }`}
                    optionsClassName={code ? "font-mono text-[12px]" : ""}
                  />
                );
              };

              // When every blank is a fragment of the same formula (e.g. a
              // DAX expression split across several dropdowns), render them
              // all on one continuous line instead of one boxed row each.
              // Fragments are short and don't end with a sentence period;
              // full statements (even ones that reference a bracketed
              // column, like "[Accounts] montre ... l'année.") do, so they
              // keep their own row instead of being merged together.
              const blankLabels = blanks.map((b) => (b.label ? localize(b.label, lang) : ""));
              const allFormula =
                blanks.length > 1 &&
                blankLabels.every((text) => !text.trim().endsWith(".")) &&
                blankLabels.some((text) => looksLikeCode(text));

              if (allFormula) {
                const anyWrong = submitted && blanks.some((b, bi) => currentHotspotPicks[bi] !== b.correctIndex);
                return (
                  <div className="mt-6 rounded-xl border border-black/8 bg-white px-4 py-4">
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 font-mono text-[13px] tracking-tight text-ink/80">
                      {blanks.map((blank, bi) => {
                        const labelText = blank.label ? localize(blank.label, lang) : "";
                        const [before, after] = labelText.includes("⬚")
                          ? labelText.split("⬚")
                          : [labelText, null];
                        return (
                          <Fragment key={bi}>
                            {before && <span>{withCircledNumbers(before)}</span>}
                            {renderSelect(bi, true)}
                            {after && <span>{withCircledNumbers(after)}</span>}
                          </Fragment>
                        );
                      })}
                    </div>
                    {anyWrong && (
                      <div className="mt-3 space-y-1">
                        {blanks.map(
                          (blank, bi) =>
                            currentHotspotPicks[bi] !== blank.correctIndex && (
                              <p key={bi} className="text-xs font-medium text-green">
                                ✓ {localize(blank.options[blank.correctIndex], lang)}
                              </p>
                            )
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div className="mt-6 space-y-3">
                  {blanks.map((blank, bi) => {
                    const pick = currentHotspotPicks[bi];
                    const isRight = submitted && pick === blank.correctIndex;
                    const isWrong = submitted && !isRight;
                    const labelText = blank.label ? localize(blank.label, lang) : "";
                    const code = looksLikeCode(labelText);
                    const [before, after] = labelText.includes("⬚")
                      ? labelText.split("⬚")
                      : [labelText, null];
                    return (
                      <div
                        key={bi}
                        className="flex flex-col gap-1.5 rounded-xl border border-black/8 bg-white px-4 py-3"
                      >
                        <div
                          className={`flex flex-wrap items-center gap-2 ${
                            code ? "font-mono text-[13px] tracking-tight" : "text-sm"
                          } text-ink/80`}
                        >
                          {before && <span>{withCircledNumbers(before)}</span>}
                          {renderSelect(bi, code)}
                          {after && <span>{withCircledNumbers(after)}</span>}
                        </div>
                        {isWrong && (
                          <span className="text-xs font-medium text-green">
                            ✓ {localize(blank.options[blank.correctIndex], lang)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()
          ) : question.type === "order" ? (
            <Reorder.Group
              axis="y"
              values={currentOrderArrangement}
              onReorder={setOrderArrangement}
              className="mt-6 flex flex-col gap-3"
            >
              {currentOrderArrangement.map((optIdx, position) => {
                const isCorrectPos = submitted && question.correctOrder?.[position] === optIdx;
                const isWrongPos = submitted && !isCorrectPos;
                const label = localize((question.options ?? [])[optIdx], lang);

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
                    <span className={`flex-1 ${looksLikeCode(label) ? "font-mono text-[13px] tracking-tight" : ""}`}>
                      {label}
                    </span>
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
              {(question.options ?? []).map((option, i) => {
                const isCorrect = (question.correctIndexes ?? []).includes(i);
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
                      looksLikeCode(label) ? "font-mono text-[13px] tracking-tight" : ""
                    } ${
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
            {needsValidateButton && !submitted && (
              <button
                type="button"
                onClick={handleValidate}
                disabled={!canValidate}
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
              {mode === "training" && question.explanation && (
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
