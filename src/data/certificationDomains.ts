import type { LocalizedText } from "./types";

export interface SkillDomain {
  /**
   * Stable id persisted in quiz_questions.domain. Never rename one of these:
   * the value lives in the database, and a rename would orphan every question
   * tagged with the old key (they'd simply lose their badge, silently).
   */
  key: string;
  label: LocalizedText;
  /**
   * Condensed label for tight surfaces - the per-question badge and the
   * rubric filter chips. The full `label` still carries the official domain
   * wording everywhere it has room (dashboard cards, pricing tab).
   */
  shortLabel: LocalizedText;
  weight: string;
}

export const CERTIFICATION_DOMAINS: Record<string, SkillDomain[]> = {
  "power-bi": [
    {
      key: "manage-secure",
      label: { fr: "Gérer et sécuriser Power BI", en: "Manage and secure Power BI" },
      shortLabel: { fr: "Gérer & sécuriser", en: "Manage & secure" },
      weight: "17%",
    },
    {
      key: "model-data",
      label: { fr: "Modéliser les données", en: "Model the data" },
      shortLabel: { fr: "Modélisation", en: "Modeling" },
      weight: "19%",
    },
    {
      key: "prepare-data",
      label: { fr: "Préparer les données", en: "Prepare the data" },
      shortLabel: { fr: "Préparation des données", en: "Data preparation" },
      weight: "27%",
    },
    {
      key: "visualize-analyze",
      label: { fr: "Visualiser et analyser les données", en: "Visualize and analyze the data" },
      shortLabel: { fr: "Visualisation & analyse", en: "Visualize & analyze" },
      weight: "37%",
    },
  ],
  snowflake: [
    {
      key: "data-collaboration",
      label: { fr: "Collaboration de données", en: "Data collaboration" },
      shortLabel: { fr: "Collaboration", en: "Collaboration" },
      weight: "10%",
    },
    {
      key: "data-loading",
      label: {
        fr: "Chargement, déchargement & connectivité des données",
        en: "Data loading, unloading & connectivity",
      },
      shortLabel: { fr: "Chargement & connectivité", en: "Loading & connectivity" },
      weight: "18%",
    },
    {
      key: "account-governance",
      label: {
        fr: "Gestion des comptes & gouvernance des données",
        en: "Account management & data governance",
      },
      shortLabel: { fr: "Comptes & gouvernance", en: "Accounts & governance" },
      weight: "20%",
    },
    {
      key: "performance-querying",
      label: {
        fr: "Optimisation des performances, requêtage & transformation",
        en: "Performance optimization, querying & transformation",
      },
      shortLabel: { fr: "Performances & requêtage", en: "Performance & querying" },
      weight: "21%",
    },
    {
      key: "architecture-features",
      label: {
        fr: "Architecture & fonctionnalités Snowflake AI Data Cloud",
        en: "Snowflake AI Data Cloud features & architecture",
      },
      shortLabel: { fr: "Architecture & fonctionnalités", en: "Architecture & features" },
      weight: "31%",
    },
  ],
};

// Resolves a question's stored domain key back to its labelled rubric.
// Returns null for an untagged question, and for a key the TypeScript
// taxonomy no longer knows about - a question whose rubric was renamed or
// removed in the database still gets drawn normally, it just shows no badge
// rather than crashing or rendering a raw key like "prepare-data".
export function findDomain(slug: string, key: string | null | undefined): SkillDomain | null {
  if (!key) return null;
  return CERTIFICATION_DOMAINS[slug]?.find((d) => d.key === key) ?? null;
}

// Total question bank size per certification (free + exam_only combined),
// shown on the public Pricing tab to sell the Pro upgrade. Matches the max
// value of the exam question-count slider a Pro user sees in-app (see
// CertificationQuiz.tsx's questionCountSlider, capped at `total` = every
// question, not just the exam-only ones) - using the same total here avoids
// the marketing page quoting a different number than the product itself.
// Static rather than a live DB count: an anon/free visitor's RLS grant
// excludes exam_only rows entirely (see migration 011_quiz_questions_rls.sql),
// so a live COUNT from the browser would undercount for a logged-out
// visitor anyway. Keep in sync manually with `select certification_id,
// count(*) from quiz_questions group by 1` whenever the question bank
// changes.
export const EXAM_QUESTION_COUNTS: Record<string, number> = {
  "power-bi": 234,
  snowflake: 172,
};
