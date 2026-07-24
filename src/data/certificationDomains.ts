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
