import { supabase, isSupabaseConfigured } from "./supabase";
import { CERTIFICATIONS, getCertification } from "../data/sampleQuestions";
import type { LocalizedText, Question } from "../data/types";

export interface CertificationSummary {
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
}

function toLocalized(value: string): LocalizedText {
  // Supabase-backed questions are not yet translated per-language;
  // reuse the stored text for both locales until the DB schema is migrated.
  return { fr: value, en: value };
}

export async function listCertifications(): Promise<CertificationSummary[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("certifications")
      .select("slug, name, description");
    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        slug: row.slug,
        name: toLocalized(row.name),
        description: toLocalized(row.description),
      }));
    }
  }
  return CERTIFICATIONS.map(({ slug, name, description }) => ({
    slug,
    name,
    description,
  }));
}

export async function loadQuestions(slug: string): Promise<{
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
        .select("id, question, options, correct_indexes, explanation")
        .eq("certification_id", cert.id)
        .order("position", { ascending: true });

      if (rows && rows.length > 0) {
        return {
          name: toLocalized(cert.name),
          description: toLocalized(cert.description),
          questions: rows.map((r) => ({
            id: r.id,
            question: toLocalized(r.question),
            options: (r.options as string[]).map(toLocalized),
            correctIndexes: r.correct_indexes as number[],
            explanation: r.explanation ? toLocalized(r.explanation) : undefined,
          })),
        };
      }
    }
  }

  const fallback = getCertification(slug);
  return fallback ?? null;
}
