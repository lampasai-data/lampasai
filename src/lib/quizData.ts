import { supabase, isSupabaseConfigured } from "./supabase";
import { CERTIFICATIONS, getCertification, type Question } from "../data/sampleQuestions";

export interface CertificationSummary {
  slug: string;
  name: string;
  description: string;
}

export async function listCertifications(): Promise<CertificationSummary[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("certifications")
      .select("slug, name, description");
    if (!error && data && data.length > 0) return data;
  }
  return CERTIFICATIONS.map(({ slug, name, description }) => ({
    slug,
    name,
    description,
  }));
}

export async function loadQuestions(slug: string): Promise<{
  name: string;
  description: string;
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
          name: cert.name,
          description: cert.description,
          questions: rows.map((r) => ({
            id: r.id,
            question: r.question,
            options: r.options as string[],
            correctIndexes: r.correct_indexes as number[],
            explanation: r.explanation ?? undefined,
          })),
        };
      }
    }
  }

  const fallback = getCertification(slug);
  return fallback ?? null;
}
