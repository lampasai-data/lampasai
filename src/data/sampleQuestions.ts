import type { LocalizedText, Question } from "./types";
import { SNOWFLAKE_QUESTIONS } from "./snowflakeQuestions";
import { POWERBI_QUESTIONS } from "./powerbiQuestions";

export type { Question, LocalizedText };

export interface CertificationDef {
  slug: "power-bi" | "snowflake";
  name: LocalizedText;
  description: LocalizedText;
  questions: Question[];
}

export const CERTIFICATIONS: CertificationDef[] = [
  {
    slug: "power-bi",
    name: { fr: "Microsoft Power BI (PL-300)", en: "Microsoft Power BI (PL-300)" },
    description: {
      fr: "Entraînement à la certification Microsoft Power BI Data Analyst.",
      en: "Practice for the Microsoft Power BI Data Analyst certification.",
    },
    questions: POWERBI_QUESTIONS,
  },
  {
    slug: "snowflake",
    name: { fr: "Snowflake SnowPro Core COF-C03", en: "Snowflake SnowPro Core COF-C03" },
    description: {
      fr: "Entraînement à la certification SnowPro Core de Snowflake.",
      en: "Practice for the Snowflake SnowPro Core certification.",
    },
    questions: SNOWFLAKE_QUESTIONS,
  },
];

export function getCertification(slug: string) {
  return CERTIFICATIONS.find((c) => c.slug === slug);
}
