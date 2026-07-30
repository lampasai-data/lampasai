import type { LocalizedText } from "./types";

export interface SkillDomain {
  label: LocalizedText;
  weight: string;
}

export const CERTIFICATION_DOMAINS: Record<string, SkillDomain[]> = {
  "power-bi": [
    {
      label: { fr: "Gérer et sécuriser Power BI", en: "Manage and secure Power BI" },
      weight: "17%",
    },
    { label: { fr: "Modéliser les données", en: "Model the data" }, weight: "19%" },
    { label: { fr: "Préparer les données", en: "Prepare the data" }, weight: "27%" },
    {
      label: { fr: "Visualiser et analyser les données", en: "Visualize and analyze the data" },
      weight: "37%",
    },
  ],
  snowflake: [
    {
      label: { fr: "Collaboration de données", en: "Data collaboration" },
      weight: "10%",
    },
    {
      label: {
        fr: "Chargement, déchargement & connectivité des données",
        en: "Data loading, unloading & connectivity",
      },
      weight: "18%",
    },
    {
      label: {
        fr: "Gestion des comptes & gouvernance des données",
        en: "Account management & data governance",
      },
      weight: "20%",
    },
    {
      label: {
        fr: "Optimisation des performances, requêtage & transformation",
        en: "Performance optimization, querying & transformation",
      },
      weight: "21%",
    },
    {
      label: {
        fr: "Architecture & fonctionnalités Snowflake AI Data Cloud",
        en: "Snowflake AI Data Cloud features & architecture",
      },
      weight: "31%",
    },
  ],
};

// Exam-mode question bank size per certification, shown on the public
// Pricing tab to sell the Pro upgrade - deliberately excludes the 20 free
// questions (those are already given away, showing them here would undersell
// what paying actually unlocks). Static rather than a live DB count: an
// anon/free visitor's RLS grant excludes exam_only rows entirely (see
// migration 011_quiz_questions_rls.sql), so a live COUNT from the browser
// would return 0 for a logged-out visitor anyway. Keep in sync manually with
// `select certification_id, count(*) from quiz_questions where exam_only
// group by 1` whenever the question bank changes.
export const EXAM_QUESTION_COUNTS: Record<string, number> = {
  "power-bi": 214,
  snowflake: 152,
};
