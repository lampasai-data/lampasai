import type { LocalizedText } from "./types";

export interface SkillDomain {
  label: LocalizedText;
  weight: string;
}

export const CERTIFICATION_DOMAINS: Record<string, SkillDomain[]> = {
  "power-bi": [
    { label: { fr: "Préparer les données", en: "Prepare the data" }, weight: "15-20%" },
    { label: { fr: "Modéliser les données", en: "Model the data" }, weight: "30-35%" },
    {
      label: { fr: "Visualiser et analyser les données", en: "Visualize and analyze the data" },
      weight: "25-30%",
    },
    {
      label: { fr: "Déployer et maintenir les livrables", en: "Deploy and maintain assets" },
      weight: "20-25%",
    },
  ],
  snowflake: [
    {
      label: {
        fr: "Architecture & fonctionnalités Snowflake AI Data Cloud",
        en: "Snowflake AI Data Cloud features & architecture",
      },
      weight: "31%",
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
        fr: "Chargement, déchargement & connectivité des données",
        en: "Data loading, unloading & connectivity",
      },
      weight: "18%",
    },
    {
      label: { fr: "Collaboration de données", en: "Data collaboration" },
      weight: "10%",
    },
  ],
};
