import { supabase, isSupabaseConfigured } from "./supabase";
import { CERTIFICATIONS, getCertification } from "../data/sampleQuestions";
import type { HotspotBlank, LocalizedText, MatchTarget, Question } from "../data/types";

export interface CertificationSummary {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
}

export interface CertificationProgress {
  answered: number;
  correct: number;
}

function toLocalized(value: string): LocalizedText {
  // Supabase-backed questions are not yet translated per-language;
  // reuse the stored text for both locales until the DB schema is migrated.
  return { fr: value, en: value };
}

// Like toLocalized, but uses a real English translation when one is stored
// (see quiz_questions.question_en/options_en/explanation_en), falling back
// to the French text otherwise.
function toLocalizedPair(fr: string, en?: string | null): LocalizedText {
  return { fr, en: en ?? fr };
}

function toLocalizedOptions(fr: string[], en?: string[] | null): LocalizedText[] {
  return fr.map((value, i) => toLocalizedPair(value, en?.[i]));
}

export async function listCertifications(): Promise<CertificationSummary[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("certifications")
      .select("id, slug, name, description");
    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        slug: row.slug,
        name: toLocalized(row.name),
        description: toLocalized(row.description),
      }));
    }
  }
  return CERTIFICATIONS.map(({ slug, name, description }) => ({
    id: slug,
    slug,
    name,
    description,
  }));
}

export async function loadQuestions(slug: string): Promise<{
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  questions: Question[];
} | null> {
  if (isSupabaseConfigured && supabase) {
    const { data: cert } = await supabase
      .from("certifications")
      .select("id, name, description")
      .eq("slug", slug)
      .single();

    if (cert) {
      const { data: rows } = await supabase
        .from("quiz_questions")
        .select(
          "id, type, question, question_en, options, options_en, correct_indexes, correct_order, pool, pool_en, targets, targets_en, blanks, blanks_en, explanation, explanation_en, exam_only"
        )
        .eq("certification_id", cert.id)
        .order("position", { ascending: true });

      if (rows && rows.length > 0) {
        return {
          id: cert.id,
          name: toLocalized(cert.name),
          description: toLocalized(cert.description),
          questions: rows.map((r) => {
            const type = (r.type ?? "choice") as Question["type"];
            const base = {
              id: r.id,
              type,
              question: toLocalizedPair(r.question, r.question_en),
              explanation: r.explanation
                ? toLocalizedPair(r.explanation, r.explanation_en)
                : undefined,
              examOnly: Boolean(r.exam_only),
            };
            if (type === "match") {
              const poolEn = r.pool_en as string[] | null;
              const targetsEn = r.targets_en as { label: string; correctPoolIndex: number }[] | null;
              return {
                ...base,
                pool: (r.pool as string[]).map((p, i) => toLocalizedPair(p, poolEn?.[i])),
                targets: (r.targets as { label: string; correctPoolIndex: number }[]).map(
                  (t, i) => ({
                    label: toLocalizedPair(t.label, targetsEn?.[i]?.label),
                    correctPoolIndex: t.correctPoolIndex,
                  })
                ) as MatchTarget[],
              };
            }
            if (type === "hotspot") {
              const blanksEn = r.blanks_en as
                | { label?: string; options: string[]; correctIndex: number }[]
                | null;
              return {
                ...base,
                blanks: (
                  r.blanks as { label?: string; options: string[]; correctIndex: number }[]
                ).map((b, i) => ({
                  label: b.label ? toLocalizedPair(b.label, blanksEn?.[i]?.label) : undefined,
                  options: toLocalizedOptions(b.options, blanksEn?.[i]?.options),
                  correctIndex: b.correctIndex,
                })) as HotspotBlank[],
              };
            }
            if (type === "order") {
              return {
                ...base,
                options: toLocalizedOptions(r.options as string[], r.options_en as string[] | null),
                correctOrder: r.correct_order as number[],
              };
            }
            return {
              ...base,
              options: toLocalizedOptions(r.options as string[], r.options_en as string[] | null),
              correctIndexes: r.correct_indexes as number[],
            };
          }),
        };
      }
    }
  }

  const fallback = getCertification(slug);
  return fallback ? { id: fallback.slug, ...fallback } : null;
}

// Aggregates each certification's attempt history for the signed-in user,
// keyed by certification slug, so the dashboard can show real progress.
export async function getUserProgress(
  userId: string
): Promise<Record<string, CertificationProgress>> {
  if (!isSupabaseConfigured || !supabase) return {};

  const { data: certs } = await supabase.from("certifications").select("id, slug");
  if (!certs || certs.length === 0) return {};
  const slugById = new Map(certs.map((c) => [c.id, c.slug]));

  const { data: attempts, error } = await supabase
    .from("attempts")
    .select("is_correct, answered_at, quiz_questions(certification_id)")
    .eq("user_id", userId)
    .order("answered_at", { ascending: true });
  if (error || !attempts) return {};

  // Group attempts per certification, then split them into runs: a new run
  // starts whenever there's a gap of more than 20 minutes since the previous
  // attempt. Only the most recent run is kept, so the dashboard reflects the
  // last quiz taken rather than a lifetime cumulative average.
  const RUN_GAP_MS = 20 * 60 * 1000;
  const bySlug: Record<string, { is_correct: boolean; answered_at: string }[]> = {};
  for (const row of attempts) {
    const nested = row.quiz_questions as unknown as
      | { certification_id: string }
      | { certification_id: string }[]
      | null;
    const certId = Array.isArray(nested) ? nested[0]?.certification_id : nested?.certification_id;
    const slug = certId ? slugById.get(certId) : undefined;
    if (!slug) continue;
    (bySlug[slug] ??= []).push({ is_correct: row.is_correct, answered_at: row.answered_at });
  }

  const progress: Record<string, CertificationProgress> = {};
  for (const [slug, rows] of Object.entries(bySlug)) {
    let runStart = 0;
    for (let i = 1; i < rows.length; i++) {
      const gap = new Date(rows[i].answered_at).getTime() - new Date(rows[i - 1].answered_at).getTime();
      if (gap > RUN_GAP_MS) runStart = i;
    }
    const lastRun = rows.slice(runStart);
    progress[slug] = {
      answered: lastRun.length,
      correct: lastRun.filter((r) => r.is_correct).length,
    };
  }
  return progress;
}

export interface PurchasedCertificationAccess {
  expiresAt: string;
  // False for exam vouchers: they unlock exam mode but not PDF export,
  // unlike a real (Stripe/Gumroad) purchase.
  pdfAllowed: boolean;
}

// Certification ids the user has paid for (or unlocked via voucher) and
// that are still within their validity window. Independent from the legacy
// profiles.plan flag. Maps each still-valid certification id to its expiry
// date and whether it allows PDF export, so the UI can both gate access
// (.has()) and show the user when their window runs out.
export async function getPurchasedCertificationIds(
  userId: string
): Promise<Map<string, PurchasedCertificationAccess>> {
  if (!isSupabaseConfigured || !supabase) return new Map();

  const { data, error } = await supabase
    .from("certification_purchases")
    .select("certification_id, expires_at, pdf_allowed")
    .eq("user_id", userId)
    .eq("status", "paid")
    .gte("expires_at", new Date().toISOString());

  if (error || !data) return new Map();
  return new Map(
    data.map((row) => [
      row.certification_id as string,
      { expiresAt: row.expires_at as string, pdfAllowed: row.pdf_allowed as boolean },
    ])
  );
}

// Redeems a single-use exam voucher code for the current user via the
// redeem-exam-voucher Edge Function. When certificationId is passed, the
// server rejects the code if it doesn't actually unlock that certification.
// Returns the id of the certification the code unlocked. Throws with a
// user-facing message on failure (invalid/expired/already-used/mismatched
// code, or no session).
export async function redeemExamVoucher(
  code: string,
  certificationId?: string
): Promise<{ certificationId: string }> {
  if (!supabase) throw new Error("Supabase n'est pas configuré.");

  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) throw new Error("Vous devez être connecté.");

  const { data, error } = await supabase.functions.invoke("redeem-exam-voucher", {
    body: { code, certificationId },
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (error || data?.error) {
    // On a non-2xx response, supabase-js sets `data` to null and `error` to a
    // generic FunctionsHttpError ("Edge Function returned a non-2xx status
    // code") rather than the actual { error: "..." } body the function sent
    // (e.g. "Ce voucher n'est pas utilisable...") - that body only lives on
    // error.context, the raw fetch Response, and has to be parsed out
    // manually.
    let message = data?.error ?? "Ce voucher n'est pas utilisable. Réessaie ou vérifie le code.";
    if (!data?.error && error && "context" in error && error.context instanceof Response) {
      try {
        const body = await error.context.json();
        if (body?.error) message = body.error;
      } catch {
        // ignore - fall back to the generic message below
      }
    }
    throw new Error(message);
  }
  return { certificationId: data.certificationId };
}

// Every certification the user has ever paid for, regardless of whether the
// 3-month window is still valid - lets the Dashboard tell "never purchased"
// apart from "purchased but expired" (used for display only; access gating
// still relies on getPurchasedCertificationIds, which only returns the
// still-valid ones).
export async function getAllCertificationPurchaseDates(
  userId: string
): Promise<Map<string, string>> {
  if (!isSupabaseConfigured || !supabase) return new Map();

  const { data, error } = await supabase
    .from("certification_purchases")
    .select("certification_id, expires_at")
    .eq("user_id", userId)
    .eq("status", "paid")
    .order("expires_at", { ascending: true });

  if (error || !data) return new Map();
  // Rows are ascending by expiry, so later rows (renewals) overwrite earlier
  // ones, leaving the most recent expiry per certification.
  const map = new Map<string, string>();
  for (const row of data) map.set(row.certification_id as string, row.expires_at as string);
  return map;
}

export async function createCheckoutSession(
  certificationIds: string[],
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  if (!supabase) throw new Error("Supabase n'est pas configuré.");

  const { data, error } = await supabase.functions.invoke("create-checkout-session", {
    body: { certificationIds, successUrl, cancelUrl },
  });

  if (error || !data?.url) {
    throw new Error(error?.message ?? "Impossible de créer la session de paiement.");
  }
  return data.url as string;
}

// Records one completed exam-mode run so it counts toward the
// certification's monthly leaderboard (get_certification_monthly_leaderboard
// sums points earned this calendar month).
export async function recordExamResult(
  userId: string,
  certificationId: string,
  correctCount: number,
  totalCount: number,
  points: number
): Promise<void> {
  if (!supabase || totalCount <= 0) return;
  await supabase.from("exam_results").insert({
    user_id: userId,
    certification_id: certificationId,
    correct_count: correctCount,
    total_count: totalCount,
    points,
  });
}

export interface LeaderboardEntry {
  rank: number;
  firstName: string;
  points: number;
  sessionCount: number;
  // Ratio (0-1) of the user's most recent exam run in the period - shown as
  // an at-a-glance "where are they right now", independent of the points
  // ranking. null when the database didn't return it (migration 023 not
  // applied yet): the UI then hides the indicator rather than rendering a
  // fake 0%, which would read as "everyone just failed".
  lastRatio: number | null;
  // Weighted success rate (0-1) across every session in the period. Same
  // null-means-unknown rule as lastRatio.
  avgRatio: number | null;
  isYou: boolean;
}

export type LeaderboardPeriod = "week" | "month";

// Ranked list of every user's points earned this week/month on exam-mode
// runs for a certification, via the get_certification_period_leaderboard
// Postgres function (security definer - exposes only first name + points +
// session count + rank, nothing else).
export async function getCertificationLeaderboard(
  certificationId: string,
  period: LeaderboardPeriod
): Promise<LeaderboardEntry[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.rpc("get_certification_period_leaderboard", {
    p_certification_id: certificationId,
    p_period: period,
  });
  if (error || !data) return [];
  return (
    data as {
      rank: number;
      first_name: string;
      points: number;
      session_count: number;
      // Absent entirely if migrations 023/024 haven't been applied here.
      last_ratio?: number | null;
      avg_ratio?: number | null;
      is_you: boolean;
    }[]
  ).map((row) => ({
    rank: row.rank,
    firstName: row.first_name,
    points: row.points,
    sessionCount: row.session_count,
    lastRatio: row.last_ratio == null ? null : Number(row.last_ratio),
    avgRatio: row.avg_ratio == null ? null : Number(row.avg_ratio),
    isYou: row.is_you,
  }));
}

export interface LeaderboardPreview {
  topPoints: number;
  topRatio: number;
  totalSessions: number;
}

// Fully anonymized teaser for logged-out visitors (Formations.tsx): just
// this month's top score, that top scorer's success ratio, and how many
// sessions happened - no names. The full leaderboard
// (getCertificationLeaderboard) requires being logged in.
export async function getCertificationLeaderboardPreview(
  certificationId: string
): Promise<LeaderboardPreview | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("get_certification_leaderboard_preview", {
    p_certification_id: certificationId,
  });
  const row = data?.[0] as
    | { top_points: number | null; top_ratio: number | null; total_sessions: number }
    | undefined;
  if (error || !row || !row.top_points) return null;
  return {
    topPoints: row.top_points,
    topRatio: row.top_ratio ?? 0,
    totalSessions: row.total_sessions,
  };
}
