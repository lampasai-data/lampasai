import { supabase } from "./supabase";

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

  const [certs, attempts, exams] = await Promise.all([
    supabase.from("certifications").select("id, slug"),
    supabase
      .from("attempts")
      .select("is_correct, answered_at, quiz_questions(certification_id, domain)")
      .eq("user_id", userId)
      .order("answered_at", { ascending: false })
      .limit(20000),
    supabase
      .from("exam_results")
      .select("certification_id, correct_count, total_count, completed_at")
      .eq("user_id", userId)
      .order("completed_at", { ascending: true }),
  ]);
  if (certs.error || attempts.error || exams.error) return EMPTY_INSIGHTS;

  const slugById = new Map((certs.data ?? []).map((c) => [c.id as string, c.slug as string]));
  const bySlug: Record<string, CertInsights> = {};
  const get = (slug: string) => (bySlug[slug] ??= { domains: [], exams: [] });
  const tally = new Map<string, Map<string, DomainStat>>();
  const days = new Set<string>();
  const daysBySlug = new Map<string, Set<string>>();
  const totals: Record<string, { answered: number; correct: number }> = {};
  let correctTotal = 0;

  for (const row of attempts.data ?? []) {
    days.add(dayKey(new Date(row.answered_at as string)));
    if (row.is_correct) correctTotal++;
    const nested = row.quiz_questions as unknown as
      | { certification_id: string; domain: string | null }
      | { certification_id: string; domain: string | null }[]
      | null;
    const q = Array.isArray(nested) ? nested[0] : nested;
    const slug = q ? slugById.get(q.certification_id) : undefined;
    if (slug) {
      const t = (totals[slug] ??= { answered: 0, correct: 0 });
      t.answered++;
      if (row.is_correct) t.correct++;
      const d = daysBySlug.get(slug) ?? new Set<string>();
      d.add(dayKey(new Date(row.answered_at as string)));
      daysBySlug.set(slug, d);
    }
    if (!q || !slug || !q.domain) continue;
    const perDomain = tally.get(slug) ?? new Map<string, DomainStat>();
    const stat = perDomain.get(q.domain) ?? { key: q.domain, answered: 0, correct: 0 };
    stat.answered++;
    if (row.is_correct) stat.correct++;
    perDomain.set(q.domain, stat);
    tally.set(slug, perDomain);
  }
  for (const [slug, perDomain] of tally) get(slug).domains = [...perDomain.values()];

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
    streakDays: streakFrom(days),
    answeredTotal: attempts.data?.length ?? 0,
    correctTotal,
    examCount,
    bestExamRatio,
    bySlug,
    totalsBySlug: Object.fromEntries(
      Object.entries(totals).map(([slug, t]) => [slug, { ...t, streakDays: streakFrom(daysBySlug.get(slug) ?? new Set()) }])
    ),
  };
}
