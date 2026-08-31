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
    formations: string;
    login: string;
    logout: string;
  };
  auth: {
    notConfigured: string;
    googleAccountNotFoundError: string;
    titleSignin: string;
    titleForgot: string;
    titleSignup: string;
    subtitleSignin: string;
    subtitleForgot: string;
    subtitleSignup: string;
    googleRedirecting: string;
    continueWithGoogle: string;
    orByEmail: string;
    resetSentMessage: string;
    confirmationSentMessage: string;
    firstNamePlaceholder: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    tooFastWarning: string;
    submitLoading: string;
    submitSignin: string;
    submitSignup: string;
    submitForgot: string;
    forgotPasswordLink: string;
    backToSignin: string;
    noAccountYet: string;
    signUpLink: string;
    alreadyHaveAccount: string;
    signInLink: string;
    proUpsellBadge: string;
    proUpsellTitle: string;
    proUpsellDesc: (certName: string) => string;
    proUpsellCta: string;
    emailCheckingStatus: string;
    emailConfirmedTitle: string;
    emailConfirmedDesc: string;
    emailConfirmedCta: string;
    emailAlreadyUsedTitle: string;
    emailAlreadyUsedDesc: string;
    emailAlreadyUsedCta: string;
    resetPasswordTitle: string;
    resetPasswordDone: string;
    resetPasswordContinue: string;
    resetPasswordPlaceholder: string;
    resetPasswordSubmit: string;
    resetPasswordBack: string;
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
    contactLink: string;
    navTitle: string;
    contactTitle: string;
  };
  formations: {
    tag: string;
    title: string;
    lead: string;
    tabCertifications: string;
    tabFormations: string;
    tabPricing: string;
    trainFor: string;
    leaderboardTeaser: (points: number, ratioPercent: number) => string;
    accessQuiz: string;
    remainingFree: string;
    valueProp: string;
    certifValue: string;
    skipFreeTitle: string;
    skipFreeDesc: string;
    createAccountCta: string;
    upgradeTitle: string;
    upgradeDesc: string;
    upgradeCta: string;
    dashboardWelcome: string;
    dashboardGreeting: (name: string) => string;
    dashboardPlanPro: string;
    dashboardPaidBadge: string;
    dashboardAccessUntil: (date: string) => string;
    dashboardRenewAccess: string;
    dashboardProgress: (pct: number, correct: number, answered: number) => string;
    dashboardNotStarted: string;
    dashboardContinue: string;
    dashboardGoPro: string;
    upgradeModalTitle: string;
    upgradeModalDesc: string;
    upgradeModalDescSingle: string;
    upgradeModalDescForCert: (certName: string) => string;
    upgradeModalEmpty: string;
    upgradeModalTotal: string;
    upgradeModalSubmit: string;
    upgradeModalLoading: string;
    upgradeModalError: string;
    checkoutSuccessBanner: (months: number) => string;
    comingSoonTitle: string;
    comingSoonDesc: string;
    comingSoonCta: string;
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
    offerQuestionBank: (count: number) => string;
    offerFeaturesLabel: string;
    offerFeatures: string[];
    domainsLabel: string;
    downloadPdf: string;
    downloadingPdf: string;
    pdfCountPrompt: string;
    pdfCountConfirm: string;
    pdfCountCancel: string;
    pdfCountAll: string;
  };
  quiz: {
    back: string;
    backDashboard: string;
    score: string;
    points: string;
    answeredLabel: string;
    questionOf: (current: number, total: number) => string;
    selectAnswers: string;
    validate: string;
    next: string;
    previous: string;
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
    viewLeaderboard: string;
    leaderboardTitle: string;
    leaderboardLoading: string;
    leaderboardEmpty: string;
    leaderboardLoginRequired: string;
    leaderboardWeek: string;
    leaderboardMonth: string;
    leaderboardGoal: (percent: number) => string;
    leaderboardSessions: (count: number) => string;
    leaderboardPointsUnit: string;
    leaderboardYou: (firstName: string) => string;
    explanationLabel: string;
    modeSelectTitle: string;
    modeTrainingTitle: string;
    modeTrainingDesc: string;
    modeExamTitle: string;
    modeExamDesc: string;
    modeExamDescShort: string;
    modeExamLocked: string;
    startExamTimer: string;
    voucherTitle: string;
    voucherPlaceholder: string;
    voucherSubmit: string;
    voucherRedeeming: string;
    voucherSuccess: string;
    voucherSuccessFor: (certName: string) => string;
    voucherModalTitle: string;
    voucherModalDescFor: (certName: string) => string;
    voucherModalDescGeneric: string;
    voucherModalPayInstead: string;
    questionCountLabel: string;
    questionCountAll: string;
    startTraining: string;
    startExam: string;
    endExam: string;
    examTimeLeft: string;
    passThresholdNote: (scoreOn1000: number) => string;
    trainingSuccess: string;
    trainingFail: string;
    dragHint: string;
    validateOrder: string;
    matchHint: string;
    hotspotHint: string;
    dropHere: string;
    choosePlaceholder: string;
    quotaScoreLabel: string;
    quotaCongrats: string;
    quotaEncourage: string;
    quotaUnlockHint: string;
    reviewTitle: string;
    reviewErrorsOnly: string;
    reviewAll: string;
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
      formations: "Formations",
      login: "Se connecter",
      logout: "Déconnexion",
    },
    auth: {
      notConfigured: "Supabase n'est pas configuré.",
      googleAccountNotFoundError:
        "Aucun compte n'existe avec cette adresse Google. Crée ton compte ci-dessous.",
      titleSignin: "Bon retour !",
      titleForgot: "Mot de passe oublié ?",
      titleSignup: "Crée ton compte pour continuer",
      subtitleSignin: "Connecte-toi pour continuer ton entraînement.",
      subtitleForgot: "On t'envoie un lien de réinitialisation par email.",
      subtitleSignup:
        "Tu as terminé les questions gratuites. Connecte-toi pour poursuivre ton entraînement.",
      googleRedirecting: "Redirection...",
      continueWithGoogle: "Continuer avec Google",
      orByEmail: "ou par email",
      resetSentMessage: "Un email avec un lien de réinitialisation vient d'être envoyé.",
      confirmationSentMessage: "Vérifie ta boîte mail pour confirmer ton inscription.",
      firstNamePlaceholder: "Prénom",
      emailPlaceholder: "Email",
      passwordPlaceholder: "Mot de passe (8+ car., maj., min., chiffre)",
      tooFastWarning: "Un instant... prends le temps de vérifier tes informations avant de valider.",
      submitLoading: "...",
      submitSignin: "Se connecter",
      submitSignup: "Créer mon compte",
      submitForgot: "Envoyer le lien",
      forgotPasswordLink: "Mot de passe oublié ?",
      backToSignin: "Retour à la connexion",
      noAccountYet: "Pas encore de compte ?",
      signUpLink: "Inscris-toi",
      alreadyHaveAccount: "Déjà un compte ?",
      signInLink: "Connecte-toi",
      proUpsellBadge: "Mode Pro",
      proUpsellTitle: "Tu as terminé tes 20 questions gratuites",
      proUpsellDesc: (certName: string) =>
        `Passe en mode Pro pour continuer à t'entraîner sans limite sur la certification ${certName} pendant toute la durée de ta préparation.`,
      proUpsellCta: "Passer en mode Pro (9,99 € / 3 mois)",
      emailCheckingStatus: "Vérification en cours…",
      emailConfirmedTitle: "Email confirmé 🎉",
      emailConfirmedDesc: "Ton compte est validé et tu es connecté.",
      emailConfirmedCta: "Accéder à mon espace",
      emailAlreadyUsedTitle: "Ton compte est déjà activé ✅",
      emailAlreadyUsedDesc:
        "Le lien de confirmation ne fonctionne qu'une seule fois, et il a déjà été ouvert. Tu n'as rien de plus à faire : connecte-toi avec ton email et ton mot de passe.",
      emailAlreadyUsedCta: "Me connecter",
      resetPasswordTitle: "Choisis un nouveau mot de passe",
      resetPasswordDone: "Mot de passe mis à jour.",
      resetPasswordContinue: "Continuer vers les formations",
      resetPasswordPlaceholder: "Nouveau mot de passe (8+ car., maj., min., chiffre)",
      resetPasswordSubmit: "Mettre à jour",
      resetPasswordBack: "Retour aux formations",
    },
    hero: {
      eyebrow: "Data & Intelligence Artificielle",
      title: ["Vos données,", "propulsées par l'IA."],
      sub: "Lampas .ai accompagne les entreprises dans l'exploitation de leurs données grâce à des solutions d'intelligence artificielle sur-mesure, quantitatives et durables.",
      ctaPrimary: "Discutons de votre projet",
      ctaGhost: "En savoir plus",
      highlights: ["KPIs & performance", "IA prédictive", "Cloud & données"],
      toolsLabel: "La stack technique que nous maîtrisons",
    },
    about: {
      tag: "Qui sommes-nous ?",
      title: "Un partenaire pour votre transformation digitale",
      lead: "Lampas .ai est une startup dédiée à la conception de solutions personnalisées, quantitatives et durables pour booster la performance de nos partenaires. Nous exploitons vos données grâce à des algorithmes prédictifs et accompagnons votre transformation digitale, avec l'ambition de propulser la recherche en IA vers de nouveaux sommets.",
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
      lead: "Travaillant de concert avec des partenaires technologiques, nous nous engageons à simplifier, accélérer et optimiser vos processus de données et d'entreprise. Pour donner un coup de pouce à votre projet, Lampas .ai réunit avec enthousiasme Analytics Engineers, AI Scientists, Data Engineers, Data Analysts et Développeurs, tous issus de formations prestigieuses. Notre ouverture à de nouveaux partenariats témoigne de notre quête constante d'innovation pour renforcer votre réussite.",
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
      copyright: "Copyright © 2026 Lampas .ai",
      contactLink: "Nous contacter",
      navTitle: "Navigation",
      contactTitle: "Contact",
    },
    formations: {
      tag: "Formations",
      title: "Certifications & formations",
      lead: "Prépare tes certifications ou découvre nos prochaines formations pour monter en compétence sur la donnée et l'IA.",
      tabCertifications: "Certifications",
      tabFormations: "Formations",
      tabPricing: "Pricing",
      trainFor: "S'entraîner",
      leaderboardTeaser: (points: number, ratioPercent: number) =>
        `Top du mois : ${points} pts (${ratioPercent}% de réussite) : à toi de faire mieux !`,
      accessQuiz: "Accéder au quiz",
      remainingFree: "question(s) gratuite(s) restante(s)",
      valueProp: "Nos questions vont droit à l'essentiel : pas de superflu, seulement ce qu'il faut pour réussir ta certification.",
      certifValue: "Avoir une certification est une vraie plus-value sur ton CV : prends le temps de bien la préparer.",
      skipFreeTitle: "Pas envie de passer par les questions gratuites ?",
      skipFreeDesc: "Tu peux créer ton compte dès maintenant et passer directement en accès illimité, sans faire les 20 questions gratuites.",
      createAccountCta: "Créer mon compte",
      upgradeTitle: "Envie de t'entraîner sans limite ?",
      upgradeDesc: "Passe en mode Pro pour accéder à toutes les questions de certification",
      upgradeCta: "Passer en illimité",
      dashboardWelcome: "Ton espace d'entraînement",
      dashboardGreeting: (name) => `Bienvenue ${name}`,
      dashboardPlanPro: "Compte Pro",
      dashboardPaidBadge: "Payé",
      dashboardAccessUntil: (date) => `Accès jusqu'au ${date}`,
      dashboardRenewAccess: "Renouvelle ton accès",
      dashboardProgress: (pct, correct, answered) =>
        `${correct}/${answered} (${pct}%) à ta dernière session`,
      dashboardNotStarted: "Pas encore commencé",
      dashboardContinue: "Démarrer l'examen",
      dashboardGoPro: "Passer en mode Pro",
      upgradeModalTitle: "Débloquer des certifications",
      upgradeModalDesc: "Choisis une ou plusieurs certifications pour un accès illimité pendant 3 mois (9,99 € / certification).",
      upgradeModalDescSingle: "Choisis une certification pour un accès illimité pendant 3 mois (9,99 € / certification).",
      upgradeModalDescForCert: (certName) =>
        `Débloque ${certName} pour un accès illimité pendant 3 mois (9,99 €).`,
      upgradeModalEmpty: "Toutes tes certifications sont déjà débloquées.",
      upgradeModalTotal: "Total",
      upgradeModalSubmit: "Continuer vers le paiement",
      upgradeModalLoading: "Redirection vers le paiement...",
      upgradeModalError: "Impossible de démarrer le paiement. Réessaie dans un instant.",
      checkoutSuccessBanner: (months: number) =>
        `Paiement confirmé, ton accès illimité est débloqué pour ${months} mois 🎉`,
      comingSoonTitle: "Nos formations arrivent bientôt",
      comingSoonDesc: "Nous préparons des parcours de formation complets (Power BI, Snowflake, Dbt, Git ...). Contacte-nous via le formulaire ci-dessous pour être informé en priorité.",
      comingSoonCta: "Voir les certifications",
      requestTitle: "Demande de formation sur-mesure",
      requestLead: "Envie d'une formation Power BI, Snowflake, dbt, Git, Linux ou SQL adaptée à ton niveau ? Pour aller plus loin et renforcer tes compétences pratiques sur ces outils, n'hésite pas à nous faire une demande de formation : nous te répondons sous 24h avec un devis.",
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
      offerQuestionBank: (count) => `${count} questions au total en mode examen`,
      offerFeaturesLabel: "Ce qui est inclus :",
      offerFeatures: [
        "Accès illimité à toutes les questions de la certification",
        "Mode examen chronométré, avec correction détaillée à la fin",
        "Export PDF (questions, corrections, explications) pour réviser hors ligne",
        "Tentatives illimitées pendant 3 mois",
      ],
      domainsLabel: "Nos questions couvrent les blocs réellement évalués à l'examen :",
      downloadPdf: "Télécharger en PDF",
      downloadingPdf: "Génération...",
      pdfCountPrompt: "Combien de questions veux-tu exporter ?",
      pdfCountConfirm: "Télécharger",
      pdfCountCancel: "Annuler",
      pdfCountAll: "Toutes",
    },
    quiz: {
      back: "Retour aux certifications",
      backDashboard: "Retour à mon espace",
      score: "Score",
      points: "Points",
      answeredLabel: "répondu(es)",
      questionOf: (current: number, total: number) => `Question ${current} sur ${total}`,
      selectAnswers: "Sélectionne",
      validate: "Valider",
      next: "Suivante >",
      previous: "< Précédente",
      skip: "Passer",
      flag: "Marquer pour plus tard",
      unflag: "Retirer le marquage",
      flaggedNotice: "Marquée pour plus tard",
      reviewFlagged: (n) => `Revoir les questions marquées (${n})`,
      timeElapsed: "Temps",
      finishedTitle: "C'est terminé !",
      finishedScore: "Bonnes réponses",
      finishedTime: "Temps total",
      finishedPoints: "Points obtenus",
      restart: "Recommencer",
      viewLeaderboard: "Voir le classement",
      leaderboardTitle: "Classement",
      leaderboardLoading: "Chargement…",
      leaderboardEmpty: "Personne n'a encore de session sur cette période. Sois le premier !",
      leaderboardLoginRequired: "Connecte-toi pour voir le classement.",
      leaderboardWeek: "Cette semaine",
      leaderboardMonth: "Ce mois",
      leaderboardGoal: (percent: number) => `Objectif : ${percent}%`,
      leaderboardSessions: (count: number) => `${count} session${count > 1 ? "s" : ""}`,
      leaderboardPointsUnit: "pts",
      leaderboardYou: (firstName: string) => `${firstName} (toi)`,
      explanationLabel: "💡 Explication",
      modeSelectTitle: "Choisis ton mode d'entraînement",
      modeTrainingTitle: "Mode gratuit",
      modeTrainingDesc: "Avance à ton rythme, avec explications après chaque question.",
      modeExamTitle: "Mode examen",
      modeExamDesc: "Toutes les questions, en conditions d'examen : résultat réussi/échoué à la fin. Avance à ton rythme, puis lance le chrono quand tu te sens prêt pour voir si tu tiens le temps imparti.",
      modeExamDescShort: "Toutes les questions, en conditions d'examen : résultat réussi/échoué à la fin. Le chrono est optionnel : lance-le quand tu es prêt.",
      modeExamLocked: "Clique pour débloquer",
      startExamTimer: "Démarrer le chrono",
      voucherTitle: "J'ai un code d'accès",
      voucherPlaceholder: "XXXX-XXXX",
      voucherSubmit: "Valider",
      voucherRedeeming: "Validation…",
      voucherSuccess: "Code validé, accès débloqué !",
      voucherSuccessFor: (certName: string) => `Code validé : ${certName} débloqué !`,
      voucherModalTitle: "Débloquer avec un code d'accès",
      voucherModalDescFor: (certName: string) =>
        `Saisis ton code pour débloquer ${certName} en mode examen pendant 30 jours.`,
      voucherModalDescGeneric:
        "Choisis la certification concernée, puis saisis ton code pour débloquer le mode examen pendant 30 jours.",
      voucherModalPayInstead: "Payer plutôt",
      questionCountLabel: "Nombre de questions",
      questionCountAll: "Toutes",
      startTraining: "Commencer l'entraînement",
      startExam: "Démarrer l'examen",
      endExam: "Terminer l'examen",
      examTimeLeft: "Temps restant",
      passThresholdNote: (scoreOn1000) =>
        `Seuil de réussite : ${scoreOn1000}/1000 (${Math.round(scoreOn1000 / 10)}% de bonnes réponses).`,
      trainingSuccess: "Succès 🎉",
      trainingFail: "Échec",
      dragHint: "Fais glisser pour réordonner",
      validateOrder: "Valider mon classement",
      matchHint: "Fais glisser chaque élément vers la bonne cible",
      hotspotHint: "Choisis la bonne option dans chaque liste",
      dropHere: "Déposer ici",
      choosePlaceholder: "Choisir…",
      quotaScoreLabel: "Ton score sur les 20 questions gratuites",
      quotaCongrats: "Bravo, de très bons résultats ! Tu es sur la bonne voie pour réussir ta certification.",
      quotaEncourage: "C'est un bon début, encore un peu d'entraînement et tu vas y arriver - ne lâche rien !",
      quotaUnlockHint: "Dans tous les cas, débloque l'accès illimité pour t'entraîner sur toutes les questions et arriver serein le jour J.",
      reviewTitle: "Revoir les questions",
      reviewErrorsOnly: "Voir seulement mes erreurs",
      reviewAll: "Voir toutes les questions",
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
      formations: "Training",
      login: "Sign in",
      logout: "Sign out",
    },
    auth: {
      notConfigured: "Supabase is not configured yet.",
      googleAccountNotFoundError:
        "No account exists with this Google address. Create your account below.",
      titleSignin: "Welcome back!",
      titleForgot: "Forgot your password?",
      titleSignup: "Create your account to continue",
      subtitleSignin: "Sign in to continue your training.",
      subtitleForgot: "We'll send you a reset link by email.",
      subtitleSignup: "You've finished the free questions. Sign in to keep training.",
      googleRedirecting: "Redirecting...",
      continueWithGoogle: "Continue with Google",
      orByEmail: "or by email",
      resetSentMessage: "An email with a reset link has just been sent.",
      confirmationSentMessage: "Check your inbox to confirm your signup.",
      firstNamePlaceholder: "First name",
      emailPlaceholder: "Email",
      passwordPlaceholder: "Password (8+ chars, upper, lower, digit)",
      tooFastWarning: "Just a moment... take the time to check your info before submitting.",
      submitLoading: "...",
      submitSignin: "Sign in",
      submitSignup: "Create my account",
      submitForgot: "Send the link",
      forgotPasswordLink: "Forgot your password?",
      backToSignin: "Back to sign in",
      noAccountYet: "No account yet?",
      signUpLink: "Sign up",
      alreadyHaveAccount: "Already have an account?",
      signInLink: "Sign in",
      proUpsellBadge: "Pro mode",
      proUpsellTitle: "You've finished your 20 free questions",
      proUpsellDesc: (certName: string) =>
        `Go Pro to keep training without limits on the ${certName} certification for as long as you need to prepare.`,
      proUpsellCta: "Go Pro (€9.99 / 3 months)",
      emailCheckingStatus: "Checking…",
      emailConfirmedTitle: "Email confirmed 🎉",
      emailConfirmedDesc: "Your account is verified and you're signed in.",
      emailConfirmedCta: "Go to my dashboard",
      emailAlreadyUsedTitle: "Your account is already active ✅",
      emailAlreadyUsedDesc:
        "The confirmation link only works once, and it has already been opened. There's nothing else to do: just sign in with your email and password.",
      emailAlreadyUsedCta: "Sign in",
      resetPasswordTitle: "Choose a new password",
      resetPasswordDone: "Password updated.",
      resetPasswordContinue: "Continue to training",
      resetPasswordPlaceholder: "New password (8+ chars, upper, lower, digit)",
      resetPasswordSubmit: "Update",
      resetPasswordBack: "Back to training",
    },
    hero: {
      eyebrow: "Data & Artificial Intelligence",
      title: ["Your data,", "powered by AI."],
      sub: "Lampas .ai helps organizations unlock the value of their data through tailor-made, quantitative and sustainable artificial intelligence solutions.",
      ctaPrimary: "Let's talk about your project",
      ctaGhost: "Learn more",
      highlights: ["KPIs & performance", "Predictive AI", "Cloud & data"],
      toolsLabel: "Tools we work with",
    },
    about: {
      tag: "About us",
      title: "A partner for your digital transformation",
      lead: "Lampas .ai is a startup dedicated to designing personalized, quantitative and sustainable solutions to boost the performance of our partners. We leverage your data through predictive algorithms and support your digital transformation, with the ambition of propelling AI research to new heights.",
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
      lead: "Working closely with technology partners, we are committed to simplifying, accelerating and optimizing your data and business processes. To give your project a boost, Lampas .ai enthusiastically brings together Analytics Engineers, AI Scientists, Data Engineers, Data Analysts and Developers, all from prestigious backgrounds. Our openness to new partnerships reflects our constant quest for innovation to strengthen your success.",
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
      copyright: "Copyright © 2026 Lampas .ai",
      contactLink: "Contact us",
      navTitle: "Navigation",
      contactTitle: "Contact",
    },
    formations: {
      tag: "Training",
      title: "Data certifications & training",
      lead: "Prepare for your certifications or discover our upcoming training paths to grow your data and AI skills.",
      tabCertifications: "Certifications",
      tabFormations: "Training",
      tabPricing: "Pricing",
      trainFor: "Practice",
      leaderboardTeaser: (points: number, ratioPercent: number) =>
        `Top this month: ${points} pts (${ratioPercent}% correct): can you beat it?`,
      accessQuiz: "Go to quiz",
      remainingFree: "free question(s) left",
      valueProp: "Our questions go straight to the point: nothing superfluous, only what you need to pass your certification.",
      certifValue: "Having a certification is a real asset on your resume: take the time to prepare it properly.",
      skipFreeTitle: "Don't want to go through the free questions?",
      skipFreeDesc: "You can create your account right away and go straight to unlimited access, without doing the 20 free questions.",
      createAccountCta: "Create my account",
      upgradeTitle: "Want to practice without limits?",
      upgradeDesc: "Switch to Pro to access every certification question",
      upgradeCta: "Go unlimited",
      dashboardWelcome: "Your training space",
      dashboardGreeting: (name) => `Welcome ${name}, your training space`,
      dashboardPlanPro: "Pro account",
      dashboardPaidBadge: "Paid",
      dashboardAccessUntil: (date) => `Access until ${date}`,
      dashboardRenewAccess: "Renew your access",
      dashboardProgress: (pct, correct, answered) =>
        `${correct}/${answered} (${pct}%) in your last session`,
      dashboardNotStarted: "Not started yet",
      dashboardContinue: "Start the exam",
      dashboardGoPro: "Go Pro",
      upgradeModalTitle: "Unlock certifications",
      upgradeModalDesc: "Pick one or more certifications for unlimited access for 3 months (€9.99 / certification).",
      upgradeModalDescSingle: "Pick a certification for unlimited access for 3 months (€9.99 / certification).",
      upgradeModalDescForCert: (certName) =>
        `Unlock ${certName} for unlimited access for 3 months (€9.99).`,
      upgradeModalEmpty: "All your certifications are already unlocked.",
      upgradeModalTotal: "Total",
      upgradeModalSubmit: "Continue to payment",
      upgradeModalLoading: "Redirecting to payment...",
      upgradeModalError: "Couldn't start the payment. Please try again in a moment.",
      checkoutSuccessBanner: (months: number) =>
        `Payment confirmed, your unlimited access is unlocked for ${months} month${months > 1 ? "s" : ""} 🎉`,
      comingSoonTitle: "Our training paths are coming soon",
      comingSoonDesc: "We're building complete training paths (Power BI, Snowflake, Dbt, Git ...). Contact us via the form below to be notified first.",
      comingSoonCta: "See certifications",
      requestTitle: "Request tailor-made training",
      requestLead: "Want Power BI, Snowflake, dbt, Git, Linux or SQL training tailored to your level? To go further and strengthen your practical skills on these tools, feel free to request a training - we reply within 24h with a quote.",
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
      offerQuestionBank: (count) => `${count} questions in total in exam mode`,
      offerFeaturesLabel: "What's included:",
      offerFeatures: [
        "Unlimited access to every question for that certification",
        "Timed exam mode, with a detailed review at the end",
        "PDF export (questions, corrections, explanations) to study offline",
        "Unlimited attempts for 3 months",
      ],
      domainsLabel: "Our questions cover the skill blocks actually assessed on the exam:",
      downloadPdf: "Download as PDF",
      downloadingPdf: "Generating...",
      pdfCountPrompt: "How many questions do you want to export?",
      pdfCountConfirm: "Download",
      pdfCountCancel: "Cancel",
      pdfCountAll: "All",
    },
    quiz: {
      back: "Back to training",
      backDashboard: "Back to my dashboard",
      score: "Score",
      points: "Points",
      answeredLabel: "answered",
      questionOf: (current: number, total: number) => `Question ${current} of ${total}`,
      selectAnswers: "Select",
      validate: "Submit",
      next: "Next question →",
      previous: "← Previous question",
      skip: "Skip",
      flag: "Flag for later",
      unflag: "Remove flag",
      flaggedNotice: "Flagged for later",
      reviewFlagged: (n) => `Review flagged questions (${n})`,
      timeElapsed: "Time",
      finishedTitle: "All done",
      finishedScore: "Correct answers",
      finishedTime: "Total time",
      finishedPoints: "Points earned",
      restart: "Restart",
      viewLeaderboard: "View leaderboard",
      leaderboardTitle: "Leaderboard",
      leaderboardLoading: "Loading…",
      leaderboardEmpty: "No one has a session yet for this period. Be the first!",
      leaderboardLoginRequired: "Log in to see the leaderboard.",
      leaderboardWeek: "This week",
      leaderboardMonth: "This month",
      leaderboardGoal: (percent: number) => `Goal: ${percent}%`,
      leaderboardSessions: (count: number) => `${count} session${count > 1 ? "s" : ""}`,
      leaderboardPointsUnit: "pts",
      leaderboardYou: (firstName: string) => `${firstName} (you)`,
      explanationLabel: "💡 Explanation",
      modeSelectTitle: "Choose your practice mode",
      modeTrainingTitle: "Free mode",
      modeTrainingDesc: "Go at your own pace, with explanations after each question.",
      modeExamTitle: "Exam mode",
      modeExamDesc: "All the questions, exam-condition style: pass/fail result at the end. Go at your own pace, then start the timer whenever you feel ready to see if you'd finish in time.",
      modeExamDescShort: "All the questions, exam-condition style: pass/fail result at the end. The timer is optional: start it whenever you're ready.",
      modeExamLocked: "Click to unlock",
      startExamTimer: "Start the timer",
      voucherTitle: "I have an access code",
      voucherPlaceholder: "XXXX-XXXX",
      voucherSubmit: "Redeem",
      voucherRedeeming: "Redeeming…",
      voucherSuccess: "Code redeemed, access unlocked!",
      voucherSuccessFor: (certName: string) => `Code redeemed: ${certName} unlocked!`,
      voucherModalTitle: "Unlock with an access code",
      voucherModalDescFor: (certName: string) =>
        `Enter your code to unlock ${certName} exam mode for 30 days.`,
      voucherModalDescGeneric:
        "Pick the certification, then enter your code to unlock exam mode for 30 days.",
      voucherModalPayInstead: "Pay instead",
      questionCountLabel: "Number of questions",
      questionCountAll: "All",
      startTraining: "Start practice",
      startExam: "Start exam",
      endExam: "End exam",
      examTimeLeft: "Time left",
      passThresholdNote: (scoreOn1000) =>
        `Pass threshold: ${scoreOn1000}/1000 (${Math.round(scoreOn1000 / 10)}% correct answers).`,
      trainingSuccess: "Success 🎉",
      trainingFail: "Failure",
      dragHint: "Drag to reorder",
      validateOrder: "Submit my ranking",
      matchHint: "Drag each item onto the correct target",
      hotspotHint: "Pick the correct option in each dropdown",
      dropHere: "Drop here",
      choosePlaceholder: "Choose…",
      quotaScoreLabel: "Your score on the 20 free questions",
      quotaCongrats: "Great job, solid results! You're on track to pass your certification.",
      quotaEncourage: "That's a good start - a bit more practice and you'll get there, don't give up!",
      quotaUnlockHint: "Either way, unlock unlimited access to train on every question and feel ready on exam day.",
      reviewTitle: "Review the questions",
      reviewErrorsOnly: "Show only my mistakes",
      reviewAll: "Show all questions",
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
