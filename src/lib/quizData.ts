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
          "id, type, question, question_en, options, options_en, correct_indexes, correct_order, pool, pool_en, targets, targets_en, blanks, blanks_en, explanation, explanation_en"
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
    .select("is_correct, quiz_questions(certification_id)")
    .eq("user_id", userId);
  if (error || !attempts) return {};

  const progress: Record<string, CertificationProgress> = {};
  for (const row of attempts) {
    const nested = row.quiz_questions as unknown as
      | { certification_id: string }
      | { certification_id: string }[]
      | null;
    const certId = Array.isArray(nested) ? nested[0]?.certification_id : nested?.certification_id;
    const slug = certId ? slugById.get(certId) : undefined;
    if (!slug) continue;
    progress[slug] ??= { answered: 0, correct: 0 };
    progress[slug].answered += 1;
    if (row.is_correct) progress[slug].correct += 1;
  }
  return progress;
}

// Certification ids the user has paid for and that are still within their
// 3-month validity window. Independent from the legacy profiles.plan flag.
export async function getPurchasedCertificationIds(userId: string): Promise<Set<string>> {
  if (!isSupabaseConfigured || !supabase) return new Set();

  const { data, error } = await supabase
    .from("certification_purchases")
    .select("certification_id")
    .eq("user_id", userId)
    .eq("status", "paid")
    .gte("expires_at", new Date().toISOString());

  if (error || !data) return new Set();
  return new Set(data.map((row) => row.certification_id as string));
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
