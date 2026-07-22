import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "fr" | "en";

interface Translations {
  nav: {
    home: string;
    about: string;
    insights: string;
    team: string;
    clients: string;
    services: string;
    contact: string;
    formations: string;
  };
  hero: {
    eyebrow: string;
    title: [string, string];
    sub: string;
    ctaPrimary: string;
    ctaGhost: string;
  };
  about: {
    tag: string;
    title: string;
    lead: string;
    cards: { title: string; desc: string }[];
  };
  insights: {
    tag: string;
    title: string;
    lead: string;
    items: { title: string; desc: string }[];
  };
  team: {
    tag: string;
    title: string;
    lead: string;
    roles: string[];
  };
  partners: {
    tag: string;
    title: string;
    lead: string;
    wonjoDesc: string;
    visitSite: string;
  };
  services: {
    tag: string;
    title: string;
    lead: string;
  };
  contact: {
    tag: string;
    title: string;
    lead: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    message: string;
    submit: string;
    sent: string;
    tooFast: string;
  };
  footer: {
    copyright: string;
  };
  formations: {
    tag: string;
    title: string;
    lead: string;
    tabCertifications: string;
    tabFormations: string;
    trainFor: string;
    accessQuiz: string;
    remainingFree: string;
    comingSoonTitle: string;
    comingSoonDesc: string;
  };
  quiz: {
    back: string;
    score: string;
    points: string;
    remainingFree: string;
    selectAnswers: string;
    validate: string;
    next: string;
    skip: string;
    flag: string;
    unflag: string;
    flaggedNotice: string;
    reviewFlagged: (n: number) => string;
    timeElapsed: string;
    finishedTitle: string;
    finishedScore: string;
    finishedTime: string;
    finishedPoints: string;
    restart: string;
    backToFormations: string;
  };
}

const translations: Record<Lang, Translations> = {
  fr: {
    nav: {
      home: "Accueil",
      about: "Qui sommes-nous ?",
      insights: "Insights",
      team: "Teams",
      clients: "Partenaires",
      services: "Services",
      contact: "Contact",
      formations: "Formations",
    },
    hero: {
      eyebrow: "Data & Intelligence Artificielle",
      title: ["Rendre votre projet", "réussi par l'IA."],
      sub: "Lampas AI accompagne les organisations dans l'exploitation de leurs données grâce à des solutions d'intelligence artificielle sur-mesure, quantitatives et durables.",
      ctaPrimary: "Discutons de votre projet",
      ctaGhost: "En savoir plus",
    },
    about: {
      tag: "Qui sommes-nous ?",
      title: "Un partenaire pour votre transformation digitale",
      lead: "Lampas AI est une startup dédiée à la conception de solutions personnalisées, quantitatives et durables pour booster la performance de nos partenaires. Nous exploitons vos données grâce à des algorithmes prédictifs et accompagnons votre transformation digitale, avec l'ambition de propulser la recherche en IA en Afrique vers de nouveaux sommets.",
      cards: [
        { title: "KPIs & performance", desc: "Identifier et optimiser vos indicateurs de performance clés." },
        { title: "Digitalisation", desc: "Transformer vos processus internes grâce à la digitalisation." },
        { title: "Formation IA", desc: "Développer les compétences de vos équipes grâce à des formations en IA." },
        { title: "Outils IA", desc: "Tirer le meilleur parti des outils d'intelligence artificielle." },
      ],
    },
    insights: {
      tag: "Insights",
      title: "Ce que la donnée peut vous apprendre",
      lead: "Explorez comment des entreprises similaires à la vôtre exploitent leurs données, et restez informés de nos dernières analyses et actualités.",
      items: [
        { title: "Data Strategy", desc: "Poser les bases d'une stratégie data solide et alignée avec vos objectifs métier." },
        { title: "Prédictif", desc: "Anticiper vos performances grâce à des modèles prédictifs adaptés à votre secteur." },
        { title: "Cloud & IA", desc: "Exploiter la flexibilité du cloud pour déployer vos projets d'intelligence artificielle." },
      ],
    },
    team: {
      tag: "Teams",
      title: "Une équipe pluridisciplinaire, à vos côtés",
      lead: "Travaillant de concert avec des partenaires technologiques, nous nous engageons à simplifier, accélérer et optimiser vos processus de données et d'entreprise. Pour donner un coup de pouce à votre projet, Lampas AI réunit avec enthousiasme Analytics Engineers, AI Scientists et Développeurs, tous issus de formations prestigieuses. Notre ouverture à de nouveaux partenariats témoigne de notre quête constante d'innovation pour renforcer votre réussite.",
      roles: ["Analytics Engineers", "AI Scientists", "Développeurs"],
    },
    partners: {
      tag: "Partenaires",
      title: "Ils nous font confiance",
      lead: "Nous construisons des relations durables avec nos partenaires technologiques et académiques pour porter l'innovation IA plus loin.",
      wonjoDesc: "Application de paiement et de transferts d'argent.",
      visitSite: "Visiter wonjo.app",
    },
    services: {
      tag: "Services",
      title: "La donnée, richesse du 21e siècle",
      lead: "Les données représentent la nouvelle richesse du 21e siècle. Cependant, à l'instar de l'or au 19e siècle, leur exploitation est complexe. Sans la flexibilité du cloud et la puissance expressive des logiciels modernes, il est difficile de tirer pleinement profit de la diversité, de la qualité variable, du volume et du rythme de mise à jour de vos données.",
    },
    contact: {
      tag: "Contact",
      title: "Aspirez-vous à faire progresser votre projet ?",
      lead: "Au moment de notre rencontre, nous examinerons vos objectifs pour élaborer la meilleure stratégie adaptée à votre projet.",
      firstname: "Prénom*",
      lastname: "Nom*",
      email: "Email*",
      phone: "Numéro de téléphone",
      message: "Message*",
      submit: "Contactez-nous",
      sent: "Message envoyé ✓",
      tooFast: "Merci de patienter quelques secondes avant d'envoyer.",
    },
    footer: {
      copyright: "Copyright © 2026 Lampas AI",
    },
    formations: {
      tag: "Formations",
      title: "Certifications & formations data",
      lead: "Prépare tes certifications ou découvre nos prochaines formations pour monter en compétence sur la donnée et l'IA.",
      tabCertifications: "Certifications",
      tabFormations: "Formations",
      trainFor: "S'entraîner →",
      accessQuiz: "Accéder au quiz",
      remainingFree: "question(s) gratuite(s) restante(s)",
      comingSoonTitle: "Nos formations arrivent bientôt",
      comingSoonDesc: "Nous préparons des parcours de formation complets (Power BI, Snowflake, IA appliquée...). Reviens bientôt ou contacte-nous pour être informé en priorité.",
    },
    quiz: {
      back: "← Retour aux formations",
      score: "Score",
      points: "Points",
      remainingFree: "gratuite(s) restante(s)",
      selectAnswers: "Sélectionne",
      validate: "Valider",
      next: "Question suivante →",
      skip: "Passer",
      flag: "Marquer pour plus tard",
      unflag: "Retirer le marquage",
      flaggedNotice: "Marquée pour plus tard",
      reviewFlagged: (n) => `Revoir les questions marquées (${n})`,
      timeElapsed: "Temps",
      finishedTitle: "Certification terminée 🎉",
      finishedScore: "Bonnes réponses",
      finishedTime: "Temps total",
      finishedPoints: "Points obtenus",
      restart: "Recommencer",
      backToFormations: "Retour aux formations",
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About us",
      insights: "Insights",
      team: "Team",
      clients: "Partners",
      services: "Services",
      contact: "Contact",
      formations: "Training",
    },
    hero: {
      eyebrow: "Data & Artificial Intelligence",
      title: ["Make your project", "succeed with AI."],
      sub: "Lampas AI helps organizations unlock the value of their data through tailor-made, quantitative and sustainable artificial intelligence solutions.",
      ctaPrimary: "Let's talk about your project",
      ctaGhost: "Learn more",
    },
    about: {
      tag: "About us",
      title: "A partner for your digital transformation",
      lead: "Lampas AI is a startup dedicated to designing personalized, quantitative and sustainable solutions to boost the performance of our partners. We leverage your data through predictive algorithms and support your digital transformation, with the ambition of propelling AI research in Africa to new heights.",
      cards: [
        { title: "KPIs & performance", desc: "Identify and optimize your key performance indicators." },
        { title: "Digitalization", desc: "Transform your internal processes through digitalization." },
        { title: "AI training", desc: "Develop your teams' skills through AI training." },
        { title: "AI tools", desc: "Get the most out of artificial intelligence tools." },
      ],
    },
    insights: {
      tag: "Insights",
      title: "What data can teach you",
      lead: "Explore how companies similar to yours leverage their data, and stay informed of our latest analyses and news.",
      items: [
        { title: "Data Strategy", desc: "Lay the foundations of a solid data strategy aligned with your business goals." },
        { title: "Predictive", desc: "Anticipate your performance with predictive models tailored to your sector." },
        { title: "Cloud & AI", desc: "Leverage the flexibility of the cloud to deploy your AI projects." },
      ],
    },
    team: {
      tag: "Team",
      title: "A multidisciplinary team, by your side",
      lead: "Working closely with technology partners, we are committed to simplifying, accelerating and optimizing your data and business processes. To give your project a boost, Lampas AI enthusiastically brings together Analytics Engineers, AI Scientists and Developers, all from prestigious backgrounds. Our openness to new partnerships reflects our constant quest for innovation to strengthen your success.",
      roles: ["Analytics Engineers", "AI Scientists", "Developers"],
    },
    partners: {
      tag: "Partners",
      title: "They trust us",
      lead: "We build lasting relationships with our technology and academic partners to push AI innovation further.",
      wonjoDesc: "Payments and money transfer application.",
      visitSite: "Visit wonjo.app",
    },
    services: {
      tag: "Services",
      title: "Data, the wealth of the 21st century",
      lead: "Data represents the new wealth of the 21st century. However, like gold in the 19th century, harnessing it is complex. Without the flexibility of the cloud and the expressive power of modern software, it is difficult to fully benefit from the diversity, variable quality, volume and update pace of your data.",
    },
    contact: {
      tag: "Contact",
      title: "Ready to move your project forward?",
      lead: "When we meet, we'll review your goals to build the best strategy for your project.",
      firstname: "First name*",
      lastname: "Last name*",
      email: "Email*",
      phone: "Phone number",
      message: "Message*",
      submit: "Contact us",
      sent: "Message sent ✓",
      tooFast: "Please wait a few seconds before sending.",
    },
    footer: {
      copyright: "Copyright © 2026 Lampas AI",
    },
    formations: {
      tag: "Training",
      title: "Data certifications & training",
      lead: "Prepare for your certifications or discover our upcoming training paths to grow your data and AI skills.",
      tabCertifications: "Certifications",
      tabFormations: "Training",
      trainFor: "Practice →",
      accessQuiz: "Go to quiz",
      remainingFree: "free question(s) left",
      comingSoonTitle: "Our training paths are coming soon",
      comingSoonDesc: "We're building complete training paths (Power BI, Snowflake, applied AI...). Check back soon or contact us to be notified first.",
    },
    quiz: {
      back: "← Back to training",
      score: "Score",
      points: "Points",
      remainingFree: "free left",
      selectAnswers: "Select",
      validate: "Submit",
      next: "Next question →",
      skip: "Skip",
      flag: "Flag for later",
      unflag: "Remove flag",
      flaggedNotice: "Flagged for later",
      reviewFlagged: (n) => `Review flagged questions (${n})`,
      timeElapsed: "Time",
      finishedTitle: "Certification complete 🎉",
      finishedScore: "Correct answers",
      finishedTime: "Total time",
      finishedPoints: "Points earned",
      restart: "Restart",
      backToFormations: "Back to training",
    },
  },
};

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("lang") : null;
    if (stored === "fr" || stored === "en") return stored;
    // Default language is always French, regardless of browser locale.
    return "fr";
  });

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  function updateLang(next: Lang) {
    setLang(next);
    if (typeof window !== "undefined") window.localStorage.setItem("lang", next);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: updateLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
