import { supabase } from "./supabase";
import { loadAttemptSummary } from "./quizData";

export interface DomainStat {
  key: string;
  answered: number;
  correct: number;
}

export interface ExamPoint {
  ratio: number;
  completedAt: string;
}

export interface CertInsights {
  domains: DomainStat[];
  exams: ExamPoint[]; // oldest first
}

// Answers and streak of one certification, to filter the dashboard figures.
export interface CertTotals {
  streakDays: number;
  answered: number;
  correct: number;
}

export interface MyInsights {
  streakDays: number;
  answeredTotal: number;
  correctTotal: number;
  examCount: number;
  // Best exam score over every certification, 0-1 (null = no exam yet).
  bestExamRatio: number | null;
  bySlug: Record<string, CertInsights>;
  totalsBySlug: Record<string, CertTotals>;
}

export const EMPTY_INSIGHTS: MyInsights = {
  streakDays: 0,
  answeredTotal: 0,
  correctTotal: 0,
  examCount: 0,
  bestExamRatio: null,
  bySlug: {},
  totalsBySlug: {},
};

// Local calendar day of a timestamp, YYYY-MM-DD.
const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// Consecutive days with at least one answer, counting back from today. A
// person who has not practised yet today keeps yesterday's streak alive:
// it only ends once a whole day has been missed.
export function streakFrom(days: Set<string>, now = new Date()): number {
  const cursor = new Date(now);
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let n = 0;
  while (days.has(dayKey(cursor))) {
    n++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return n;
}

// Everything on the dashboard's "My preparation" block comes from the
// person's own answers and exam results, read through the same row-level
// rules as the rest of the app. Read-only; a failed read gives an empty block.
export async function loadMyInsights(userId: string): Promise<MyInsights> {
  if (!supabase) return EMPTY_INSIGHTS;

  const [certs, summary, exams] = await Promise.all([
    supabase.from("certifications").select("id, slug"),
    loadAttemptSummary(userId),
    supabase
      .from("exam_results")
      .select("certification_id, correct_count, total_count, completed_at")
      .eq("user_id", userId)
      .order("completed_at", { ascending: true }),
  ]);
  if (certs.error || !summary || exams.error) return EMPTY_INSIGHTS;

  const slugById = new Map((certs.data ?? []).map((c) => [c.id as string, c.slug as string]));
  const bySlug: Record<string, CertInsights> = {};
  const get = (slug: string) => (bySlug[slug] ??= { domains: [], exams: [] });
  const totalsBySlug: Record<string, CertTotals> = {};

  for (const c of summary.certs) {
    get(c.slug).domains = c.domains.map((d) => ({ key: d.key, answered: d.answered, correct: d.correct }));
    totalsBySlug[c.slug] = {
      answered: c.answered,
      correct: c.correct,
      streakDays: streakFrom(new Set(c.days)),
    };
  }

  let bestExamRatio: number | null = null;
  let examCount = 0;
  for (const e of exams.data ?? []) {
    const slug = slugById.get(e.certification_id as string);
    if (!slug || !e.total_count) continue;
    const ratio = (e.correct_count as number) / (e.total_count as number);
    examCount++;
    if (bestExamRatio === null || ratio > bestExamRatio) bestExamRatio = ratio;
    get(slug).exams.push({ ratio, completedAt: e.completed_at as string });
  }

  return {
    streakDays: streakFrom(new Set(summary.days)),
    answeredTotal: summary.answered_total,
    correctTotal: summary.correct_total,
    examCount,
    bestExamRatio,
    bySlug,
    totalsBySlug,
  };
}
