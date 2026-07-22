import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { loadQuestions } from "../lib/quizData";
import type { Question } from "../data/sampleQuestions";
import { useAuth } from "../context/AuthContext";
import {
  FREE_QUESTION_LIMIT,
  getAnonymousUsage,
  incrementAnonymousUsage,
} from "../lib/freeQuota";
import { supabase } from "../lib/supabase";
import AuthPanel from "../components/AuthPanel";
import ProUpsell from "../components/ProUpsell";

function sameAnswers(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((v, i) => v === sortedB[i]);
}

export default function CertificationQuiz() {
  const { slug = "" } = useParams();
  const { user, profile, refreshProfile } = useAuth();

  const [cert, setCert] = useState<{ name: string; questions: Question[] } | null>(
    null
  );
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [anonUsed, setAnonUsed] = useState(getAnonymousUsage());

  useEffect(() => {
    loadQuestions(slug).then((data) => {
      if (data) setCert({ name: data.name, questions: data.questions });
    });
  }, [slug]);

  if (!cert) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-white/60">
        Chargement…
      </section>
    );
  }

  const isPro = profile?.plan === "pro";
  const used = user ? profile?.free_questions_used ?? 0 : anonUsed;
  const quotaExhausted = !isPro && used >= FREE_QUESTION_LIMIT;

  if (quotaExhausted) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24">
        <Link
          to="/certifications"
          className="text-sm text-white/50 hover:text-white"
        >
          ← Retour aux certifications
        </Link>
        <div className="mt-8">
          {user ? <ProUpsell certName={cert.name} /> : <AuthPanel />}
        </div>
      </section>
    );
  }

  const question = cert.questions[index % cert.questions.length];
  const isMulti = question.correctIndexes.length > 1;

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
    if (correct) setScore((s) => s + 1);

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

  function handleNext() {
    setPicked([]);
    setSubmitted(false);
    setIndex((i) => i + 1);
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <Link to="/certifications" className="text-sm text-white/50 hover:text-white">
        ← Retour aux certifications
      </Link>

      <div className="mt-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-white">
          {cert.name}
        </h1>
        <span className="text-sm text-white/50">
          Score : {score} · {Math.max(FREE_QUESTION_LIMIT - used, 0)} gratuite(s)
          restante(s)
        </span>
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-7">
        <p className="font-display text-lg font-medium text-white">
          {question.question}
        </p>
        {isMulti && (
          <p className="mt-1 text-xs uppercase tracking-wide text-violet-300">
            Sélectionne {question.correctIndexes.length} réponses
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {question.options.map((option, i) => {
            const isCorrect = question.correctIndexes.includes(i);
            const isPicked = picked.includes(i);

            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleOption(i)}
                disabled={submitted}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                  submitted && isCorrect
                    ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-200"
                    : submitted && isPicked
                      ? "border-red-400/50 bg-red-400/10 text-red-200"
                      : !submitted && isPicked
                        ? "border-violet-400/50 bg-violet-400/10 text-white"
                        : "border-white/10 bg-white/[0.02] text-white/80 hover:border-violet-400/30 hover:bg-white/[0.05]"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {isMulti && !submitted && (
          <button
            type="button"
            onClick={() => commitAnswer(picked)}
            disabled={picked.length === 0}
            className="mt-5 rounded-full bg-violet-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-400 disabled:opacity-40"
          >
            Valider
          </button>
        )}

        {submitted && (
          <div className="mt-6">
            {question.explanation && (
              <p className="text-sm leading-relaxed text-white/55">
                {question.explanation}
              </p>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="mt-4 rounded-full bg-violet-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-400"
            >
              Question suivante →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
