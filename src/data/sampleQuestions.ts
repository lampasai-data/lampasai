import type { Question } from "./types";
import { SNOWFLAKE_QUESTIONS } from "./snowflakeQuestions";

export type { Question };

export interface CertificationDef {
  slug: "power-bi" | "snowflake";
  name: string;
  description: string;
  questions: Question[];
}

// Power BI bank is still a placeholder — swap it for the real one once provided.
export const CERTIFICATIONS: CertificationDef[] = [
  {
    slug: "power-bi",
    name: "Microsoft Power BI (PL-300)",
    description:
      "Entraînement à la certification Microsoft Power BI Data Analyst.",
    questions: [
      {
        id: "pbi-1",
        question:
          "Quel type de relation Power BI recommande-t-il par défaut entre deux tables ?",
        options: ["Plusieurs-à-plusieurs", "Un-à-plusieurs", "Un-à-un", "Aucune relation"],
        correctIndexes: [1],
        explanation:
          "Power BI privilégie les relations un-à-plusieurs pour des modèles en étoile performants.",
      },
      {
        id: "pbi-2",
        question: "Quel langage est utilisé pour créer des mesures dans Power BI ?",
        options: ["M", "DAX", "SQL", "Python"],
        correctIndexes: [1],
      },
      {
        id: "pbi-3",
        question:
          "Quelle fonctionnalité permet de transformer et nettoyer les données avant chargement ?",
        options: ["Power Query", "Power Automate", "Power Pages", "Power Apps"],
        correctIndexes: [0],
      },
    ],
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
