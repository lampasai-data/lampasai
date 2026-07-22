import type { Question } from "./types";
import { SNOWFLAKE_QUESTIONS } from "./snowflakeQuestions";
import { POWERBI_QUESTIONS } from "./powerbiQuestions";

export type { Question };

export interface CertificationDef {
  slug: "power-bi" | "snowflake";
  name: string;
  description: string;
  questions: Question[];
}

export const CERTIFICATIONS: CertificationDef[] = [
  {
    slug: "power-bi",
    name: "Microsoft Power BI (PL-300)",
    description:
      "Entraînement à la certification Microsoft Power BI Data Analyst.",
    questions: POWERBI_QUESTIONS,
  },
  {
    slug: "snowflake",
    name: "Snowflake SnowPro Core",
    description: "Entraînement à la certification SnowPro Core de Snowflake.",
    questions: SNOWFLAKE_QUESTIONS,
  },
];

export function getCertification(slug: string) {
  return CERTIFICATIONS.find((c) => c.slug === slug);
}
