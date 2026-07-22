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
    highlights: [string, string, string];
    toolsLabel: string;
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
    tabPricing: string;
    trainFor: string;
    accessQuiz: string;
    remainingFree: string;
    valueProp: string;
    certifValue: string;
    skipFreeTitle: string;
    skipFreeDesc: string;
    createAccountCta: string;
    upgradeCta: string;
    comingSoonTitle: string;
    comingSoonDesc: string;
    requestTitle: string;
    requestLead: string;
    requestName: string;
    requestEmail: string;
    requestTool: string;
    requestToolHint: string;
    requestLevelLabel: string;
    levelBeginner: string;
    levelIntermediate: string;
    levelAdvanced: string;
    requestFormatLabel: string;
    formatOnsite: string;
    formatRemote: string;
    requestMessage: string;
    requestMessagePlaceholder: string;
    requestSubmit: string;
    requestSent: string;
    requestTooFast: string;
    offerBadge: string;
    offerPrice: string;
    offerPeriod: string;
    offerNote: string;
    offerCertLabel: string;
    offerCta: string;
    domainsLabel: string;
    downloadPdf: string;
    downloadingPdf: string;
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
    explanationLabel: string;
    modeSelectTitle: string;
    modeTrainingTitle: string;
    modeTrainingDesc: string;
    modeExamTitle: string;
    modeExamDesc: string;
    modeExamLocked: string;
    startTraining: string;
    startExam: string;
    endExam: string;
    examTimeLeft: string;
    passResult: string;
    failResult: string;
    passThresholdNote: string;
    dragHint: string;
    validateOrder: string;
    quotaScoreLabel: string;
    quotaCongrats: string;
    quotaEncourage: string;
    quotaUnlockHint: string;
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
      title: ["Rendre votre projet", "réussi."],
      sub: "Lampas AI accompagne les organisations dans l'exploitation de leurs données grâce à des solutions d'intelligence artificielle sur-mesure, quantitatives et durables.",
      ctaPrimary: "Discutons de votre projet",
      ctaGhost: "En savoir plus",
      highlights: ["KPIs & performance", "IA prédictive", "Cloud & données"],
      toolsLabel: "Les outils que nous maîtrisons",
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
      lead: "Travaillant de concert avec des partenaires technologiques, nous nous engageons à simplifier, accélérer et optimiser vos processus de données et d'entreprise. Pour donner un coup de pouce à votre projet, Lampas AI réunit avec enthousiasme Analytics Engineers, AI Scientists, Data Engineers, Data Analysts et Développeurs, tous issus de formations prestigieuses. Notre ouverture à de nouveaux partenariats témoigne de notre quête constante d'innovation pour renforcer votre réussite.",
      roles: ["Analytics Engineers", "AI Scientists", "Data Engineers", "Data Analysts", "Développeurs"],
    },
    partners: {
      tag: "Partenaires",
      title: "Nos partenaires de confiance",
      lead: "Nous construisons des collaborations solides avec des acteurs tech et académiques qui partagent notre vision de l'IA au service de la performance.",
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
      title: "Certifications & formations",
      lead: "Prépare tes certifications ou découvre nos prochaines formations pour monter en compétence sur la donnée et l'IA.",
      tabCertifications: "Certifications",
      tabFormations: "Formations",
      tabPricing: "Pricing",
      trainFor: "S'entraîner >",
      accessQuiz: "Accéder au quiz",
      remainingFree: "question(s) gratuite(s) restante(s)",
      valueProp: "Nos questions vont droit à l'essentiel : pas de superflu, seulement ce qu'il faut pour réussir ta certification.",
      certifValue: "Avoir une certification est une vraie plus-value sur ton CV : prends le temps de bien la préparer.",
      skipFreeTitle: "Pas envie de passer par les questions gratuites ?",
      skipFreeDesc: "Tu peux créer ton compte dès maintenant et passer directement en accès illimité, sans faire les 20 questions gratuites.",
      createAccountCta: "Créer mon compte",
      upgradeCta: "Passer en illimité",
      comingSoonTitle: "Nos formations arrivent bientôt",
      comingSoonDesc: "Nous préparons des parcours de formation complets (Power BI, Snowflake, IA appliquée...). Reviens bientôt ou contacte-nous pour être informé en priorité.",
      requestTitle: "Demande de formation sur-mesure",
      requestLead: "Envie d'une formation Power BI, Snowflake ou dbt adaptée à ton niveau ? Pour aller plus loin et renforcer tes compétences pratiques sur ces outils, n'hésite pas à nous faire une demande de formation : nous te répondons sous 24h avec un devis.",
      requestName: "Nom complet*",
      requestEmail: "Email*",
      requestTool: "Outil souhaité*",
      requestToolHint: "Sélectionne un ou plusieurs outils.",
      requestLevelLabel: "Niveau souhaité*",
      levelBeginner: "Débutant",
      levelIntermediate: "Intermédiaire",
      levelAdvanced: "Avancé",
      requestFormatLabel: "Format de la séance*",
      formatOnsite: "Présentiel",
      formatRemote: "Distanciel",
      requestMessage: "Précisions sur ton besoin",
      requestMessagePlaceholder: "Objectifs, nombre de participants, dates souhaitées...",
      requestSubmit: "Demander un devis",
      requestSent: "Demande envoyée ✓ Nous te recontactons rapidement.",
      requestTooFast: "Merci de patienter quelques secondes avant d'envoyer.",
      offerBadge: "Accès illimité pendant 3 mois",
      offerPrice: "9,99 €",
      offerPeriod: "par certification, pour 3 mois d'accès illimité",
      offerNote: "Paiement unique par certification, sans réengagement.",
      offerCertLabel: "Certification :",
      offerCta: "Débloquer l'accès illimité",
      domainsLabel: "Nos questions couvrent les blocs réellement évalués à l'examen :",
      downloadPdf: "Télécharger en PDF",
      downloadingPdf: "Génération...",
    },
    quiz: {
      back: "Retour aux formations",
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
      explanationLabel: "💡 Explication",
      modeSelectTitle: "Choisis ton mode d'entraînement",
      modeTrainingTitle: "Entraînement libre",
      modeTrainingDesc: "Avance à ton rythme, avec explications après chaque question.",
      modeExamTitle: "Mode examen chronométré",
      modeExamDesc: "Simule l'examen réel : temps limité, résultat réussi/échoué à la fin.",
      modeExamLocked: "Réservé aux comptes en accès illimité.",
      startTraining: "Commencer l'entraînement",
      startExam: "Démarrer l'examen",
      endExam: "Terminer l'examen",
      examTimeLeft: "Temps restant",
      passResult: "Examen réussi 🎉",
      failResult: "Examen non réussi",
      passThresholdNote: "Seuil de réussite : 70% de bonnes réponses.",
      dragHint: "Fais glisser pour réordonner",
      validateOrder: "Valider mon classement",
      quotaScoreLabel: "Ton score sur les 20 questions gratuites",
      quotaCongrats: "Bravo, de très bons résultats ! Tu es sur la bonne voie pour réussir ta certification.",
      quotaEncourage: "C'est un bon début, encore un peu d'entraînement et tu vas y arriver — ne lâche rien !",
      quotaUnlockHint: "Dans tous les cas, débloque l'accès illimité pour t'entraîner sur toutes les questions et arriver serein le jour J.",
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
      highlights: ["KPIs & performance", "Predictive AI", "Cloud & data"],
      toolsLabel: "Tools we work with",
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
      lead: "Working closely with technology partners, we are committed to simplifying, accelerating and optimizing your data and business processes. To give your project a boost, Lampas AI enthusiastically brings together Analytics Engineers, AI Scientists, Data Engineers, Data Analysts and Developers, all from prestigious backgrounds. Our openness to new partnerships reflects our constant quest for innovation to strengthen your success.",
      roles: ["Analytics Engineers", "AI Scientists", "Data Engineers", "Data Analysts", "Developers"],
    },
    partners: {
      tag: "Partners",
      title: "Our trusted partners",
      lead: "We're building strong collaborations with tech and academic players who share our vision of AI-driven performance.",
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
      tabPricing: "Pricing",
      trainFor: "Practice >",
      accessQuiz: "Go to quiz",
      remainingFree: "free question(s) left",
      valueProp: "Our questions go straight to the point: nothing superfluous, only what you need to pass your certification.",
      certifValue: "Having a certification is a real asset on your resume: take the time to prepare it properly.",
      skipFreeTitle: "Don't want to go through the free questions?",
      skipFreeDesc: "You can create your account right away and go straight to unlimited access, without doing the 20 free questions.",
      createAccountCta: "Create my account",
      upgradeCta: "Go unlimited",
      comingSoonTitle: "Our training paths are coming soon",
      comingSoonDesc: "We're building complete training paths (Power BI, Snowflake, applied AI...). Check back soon or contact us to be notified first.",
      requestTitle: "Request tailor-made training",
      requestLead: "Want Power BI, Snowflake or dbt training tailored to your level? To go further and strengthen your practical skills on these tools, feel free to request a training — we reply within 24h with a quote.",
      requestName: "Full name*",
      requestEmail: "Email*",
      requestTool: "Tool*",
      requestToolHint: "Select one or more tools.",
      requestLevelLabel: "Desired level*",
      levelBeginner: "Beginner",
      levelIntermediate: "Intermediate",
      levelAdvanced: "Advanced",
      requestFormatLabel: "Session format*",
      formatOnsite: "On-site",
      formatRemote: "Remote",
      requestMessage: "Details about your needs",
      requestMessagePlaceholder: "Goals, number of participants, preferred dates...",
      requestSubmit: "Request a quote",
      requestSent: "Request sent ✓ We'll get back to you shortly.",
      requestTooFast: "Please wait a few seconds before sending.",
      offerBadge: "Unlimited access for 3 months",
      offerPrice: "€9.99",
      offerPeriod: "per certification, for 3 months of unlimited access",
      offerNote: "One-time payment per certification, no subscription.",
      offerCertLabel: "Certification:",
      offerCta: "Unlock unlimited access",
      domainsLabel: "Our questions cover the skill blocks actually assessed on the exam:",
      downloadPdf: "Download as PDF",
      downloadingPdf: "Generating...",
    },
    quiz: {
      back: "Back to training",
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
      explanationLabel: "💡 Explanation",
      modeSelectTitle: "Choose your practice mode",
      modeTrainingTitle: "Free practice",
      modeTrainingDesc: "Go at your own pace, with explanations after each question.",
      modeExamTitle: "Timed exam mode",
      modeExamDesc: "Simulate the real exam: limited time, pass/fail result at the end.",
      modeExamLocked: "Reserved for unlimited access accounts.",
      startTraining: "Start practice",
      startExam: "Start exam",
      endExam: "End exam",
      examTimeLeft: "Time left",
      passResult: "Exam passed 🎉",
      failResult: "Exam not passed",
      passThresholdNote: "Pass threshold: 70% correct answers.",
      dragHint: "Drag to reorder",
      validateOrder: "Submit my ranking",
      quotaScoreLabel: "Your score on the 20 free questions",
      quotaCongrats: "Great job, solid results! You're on track to pass your certification.",
      quotaEncourage: "That's a good start — a bit more practice and you'll get there, don't give up!",
      quotaUnlockHint: "Either way, unlock unlimited access to train on every question and feel ready on exam day.",
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
