import type { Lang } from "./i18n";

// Copy for the signed-in area that is not in the main i18n file: the profile
// page, the progress insights on the dashboard and the podium message.

export interface UserAreaStrings {
  profile: {
    title: string;
    subtitle: string;
    menu: string;
    editLink: string;
    addPhotoLink: string;
    photoTitle: string;
    addPhoto: string;
    changePhoto: string;
    removePhoto: string;
    photoHint: string;
    photoSaved: string;
    photoRemoved: string;
    photoError: string;
    notAnImage: string;
    tooBig: string;
    cropTitle: string;
    cropHelp: string;
    zoom: string;
    cancel: string;
    save: string;
    saving: string;
    nameTitle: string;
    nameLabel: string;
    nameHint: string;
    nameSaved: string;
    nameInvalid: string;
    nameLocked: (date: string) => string;
    nameError: string;
    emailTitle: string;
    back: string;
    memberSince: (date: string) => string;
    dangerTitle: string;
    dangerText: string;
    dangerButton: string;
    deleteModalTitle: string;
    deleteActiveAccess: string;
    deleteTypeToConfirm: (word: string) => string;
    deleteConfirmWord: string;
    deleteConfirmButton: string;
    deleting: string;
    deleteError: string;
    planPro: string;
    accessTitle: string;
    accessActiveUntil: (date: string) => string;
    accessNone: string;
    accessPro: string;
    unlock: string;
  };
  insights: {
    title: string;
    coursesTitle: string;
    streak: (n: number) => string;
    answered: (n: number) => string;
    scopeAll: string;
    tileStreak: string;
    tileStreakValue: (n: number) => string;
    tileAnswered: string;
    tileSuccess: string;
    tileExams: string;
    tileBest: string;
    readinessTitle: string;
    readinessNone: string;
    readinessBasis: (n: number) => string;
    goal: (pct: number) => string;
    levelBuilding: string;
    levelOnTrack: string;
    levelReady: string;
    trendTitle: string;
    domainsTitle: string;
    domainsNeedMore: string;
    domainsWeakest: string;
    revise: string;
    nextStep: string;
    reviseNamed: (domain: string) => string;
    takeExam: string;
    answeredShort: (n: number) => string;
  };
  podium: {
    message: (name: string | null, rank: number, certName: string) => string;
    dismiss: string;
  };
  share: {
    button: string;
    title: string;
    help: string;
    download: string;
    shareNative: string;
    linkedin: string;
    linkedinHint: string;
    close: string;
    cardExam: (cert: string) => string;
    cardCorrect: (score: number, total: number) => string;
    cardReached: (goal: number) => string;
    cardGoal: (goal: number) => string;
    cardFooter: string;
    shareText: (cert: string, pct: number) => string;
  };
  feedback: {
    openFeedback: string;
    openHelp: string;
    feedbackTitle: string;
    feedbackLead: string;
    kinds: { review: string; idea: string; problem: string };
    placeholders: { review: string; idea: string; problem: string };
    ratingLabel: string;
    helpTitle: string;
    helpLead: (email: string) => string;
    helpPlaceholder: string;
    messageLabel: string;
    send: string;
    sending: string;
    cancel: string;
    close: string;
    thanksFeedback: string;
    thanksHelp: string;
    invalid: string;
    rateLimited: string;
    error: string;
  };
  board: {
    subtitle: string;
    yourStanding: string;
    yourRank: string;
    gapToPodium: (points: number) => string;
    onPodium: string;
    leading: string;
    gapToLeader: (points: number) => string;
    rest: string;
    first: string;
  };
  examSetup: {
    summary: (questions: number, domains: number) => string;
    chooseDomains: string;
  };
  locked: {
    title: string;
    example: string;
    lead: string;
    bullets: string[];
    cta: string;
  };
}

export const USER_T: Record<Lang, UserAreaStrings> = {
  fr: {
    profile: {
      title: "Mon profil",
      subtitle: "Ces informations personnalisent ton espace.",
      menu: "Mon profil",
      editLink: "Modifier mon profil",
      addPhotoLink: "Ajouter ma photo",
      photoTitle: "Photo de profil",
      addPhoto: "Ajouter une photo",
      changePhoto: "Changer la photo",
      removePhoto: "Retirer",
      photoHint: "Une photo carrée est idéale. Elle est rognée en rond.",
      photoSaved: "Photo enregistrée.",
      photoRemoved: "Photo retirée.",
      photoError: "Impossible d'enregistrer la photo. Réessaie dans un instant.",
      notAnImage: "Ce fichier n'est pas une image (JPEG, PNG ou WebP).",
      tooBig: "Cette image est trop lourde (10 Mo maximum).",
      cropTitle: "Cadre ta photo",
      cropHelp: "Glisse l'image pour la déplacer et utilise le curseur pour zoomer.",
      zoom: "Zoom",
      cancel: "Annuler",
      save: "Enregistrer",
      saving: "Enregistrement…",
      nameTitle: "Informations personnelles",
      nameLabel: "Ton prénom",
      nameHint: "Tu peux le modifier une fois par semaine. Il apparaît dans le classement.",
      nameSaved: "Prénom mis à jour.",
      nameInvalid: "Ton prénom doit faire entre 1 et 40 caractères, sans lien ni adresse e-mail.",
      nameLocked: (d) => `Tu pourras le modifier de nouveau à partir du ${d}.`,
      nameError: "Impossible de modifier le prénom. Réessaie dans un instant.",
      emailTitle: "Adresse e-mail",
      back: "Retour à mes formations",
      memberSince: (d) => `Membre depuis ${d}`,
      dangerTitle: "Supprimer mon compte",
      dangerText: "Ton compte et tes données seront supprimés définitivement, et tu seras déconnecté.",
      dangerButton: "Supprimer mon compte",
      deleteModalTitle: "Supprimer définitivement ton compte ?",
      deleteActiveAccess: "Attention, tu as un accès en cours qui sera perdu :",
      deleteTypeToConfirm: (w) => `Pour confirmer, écris ${w} en majuscules.`,
      deleteConfirmWord: "SUPPRIMER",
      deleteConfirmButton: "Supprimer définitivement",
      deleting: "Suppression…",
      deleteError: "Impossible de supprimer le compte. Réessaie dans un instant.",
      planPro: "Compte Pro",
      accessTitle: "Mon accès",
      accessActiveUntil: (d) => `Actif jusqu'au ${d}`,
      accessNone: "Pas d'accès en ce moment",
      accessPro: "Accès complet à toutes les certifications",
      unlock: "Débloquer",
    },
    insights: {
      title: "Ma préparation",
      coursesTitle: "Mes certifications",
      streak: (n) => (n > 0 ? `Série : ${n} jour${n > 1 ? "s" : ""} d'affilée` : "Pas de série en cours"),
      answered: (n) => `${n} question${n > 1 ? "s" : ""} répondue${n > 1 ? "s" : ""}`,
      scopeAll: "Toutes",
      tileStreak: "Série en cours",
      tileStreakValue: (n) => `${n} jour${n > 1 ? "s" : ""}`,
      tileAnswered: "Questions répondues",
      tileSuccess: "Taux de réussite",
      tileExams: "Examens passés",
      tileBest: "Meilleur score",
      readinessTitle: "Niveau pour l'examen",
      readinessNone: "Passe un examen blanc pour mesurer ton niveau.",
      readinessBasis: (n) => `Moyenne de tes ${n > 1 ? `${n} derniers examens` : "dernier examen"}`,
      goal: (p) => `Objectif ${p} %`,
      levelBuilding: "En construction",
      levelOnTrack: "Sur la bonne voie",
      levelReady: "Objectif atteint",
      trendTitle: "Tes derniers examens",
      domainsTitle: "Réussite par domaine",
      domainsNeedMore: "Réponds à quelques questions de plus pour voir ta réussite par domaine.",
      domainsWeakest: "À renforcer",
      revise: "Réviser",
      nextStep: "Prochaine étape",
      reviseNamed: (d) => `Réviser « ${d} »`,
      takeExam: "Passer un examen blanc",
      answeredShort: (n) => `${n} rép.`,
    },
    podium: {
      message: (name, rank, cert) =>
        `Bravo${name ? ` ${name}` : ""} ! Tu es ${rank === 1 ? "1er" : `${rank}e`} du classement ${cert} ce mois-ci.`,
      dismiss: "Fermer",
    },
    share: {
      button: "Partager mon résultat",
      title: "Ton résultat",
      help: "Une image à publier où tu veux. Elle ne contient que ton prénom, ta photo si tu en as une, et ton score.",
      download: "Télécharger l'image",
      shareNative: "Partager…",
      linkedin: "Ouvrir LinkedIn",
      linkedinHint: "Sur LinkedIn, ajoute l'image téléchargée à ta publication.",
      close: "Fermer",
      cardExam: (c) => `Examen blanc · ${c}`,
      cardCorrect: (s, t) => `${s} bonnes réponses sur ${t}`,
      cardReached: (g) => `Objectif ${g} % atteint`,
      cardGoal: (g) => `Objectif : ${g} %`,
      cardFooter: "Examen blanc Lampas .ai · ne remplace pas l'examen officiel",
      shareText: (c, p) => `${p} % à un examen blanc ${c} sur Lampas .ai.`,
    },
    feedback: {
      openFeedback: "Donner mon avis",
      openHelp: "Besoin d'aide ?",
      feedbackTitle: "Ton avis compte",
      feedbackLead: "Dis-nous ce que tu apprécies, ce qui te gêne ou ce que tu aimerais voir sur la plateforme.",
      kinds: { review: "Avis", idea: "Idée", problem: "Problème" },
      placeholders: {
        review: "Ce que tu apprécies, ou pas, dans Lampas .ai…",
        idea: "Une amélioration que tu aimerais voir…",
        problem: "Décris ce qui ne fonctionne pas comme prévu…",
      },
      ratingLabel: "Ta note (facultatif)",
      helpTitle: "Besoin d'aide ?",
      helpLead: (e) => `Une question, un blocage ? Écris-nous : on te répond par e-mail à ${e}.`,
      helpPlaceholder: "Explique-nous ta question ou ton problème…",
      messageLabel: "Ton message",
      send: "Envoyer",
      sending: "Envoi…",
      cancel: "Annuler",
      close: "Fermer",
      thanksFeedback: "Merci ! Ton message nous est bien parvenu.",
      thanksHelp: "Message envoyé. On te répond par e-mail dès que possible.",
      invalid: "Ton message doit faire entre 3 et 2000 caractères.",
      rateLimited: "Tu as déjà envoyé plusieurs messages aujourd'hui. Réessaie demain.",
      error: "Impossible d'envoyer le message. Réessaie dans un instant.",
    },
    board: {
      subtitle: "Les meilleurs de la période, classés aux points d'examen blanc.",
      yourStanding: "Ton classement",
      yourRank: "Rang",
      gapToPodium: (n) => `Plus que ${n} pt${n > 1 ? "s" : ""} pour entrer au podium`,
      onPodium: "Tu es sur le podium. Bravo !",
      leading: "Tu mènes le classement. Bravo !",
      gapToLeader: (n) => `${n} pt${n > 1 ? "s" : ""} derrière la première place`,
      rest: "Suite du classement",
      first: "1er",
    },
    examSetup: {
      summary: (q, d) =>
        `${q} question${q > 1 ? "s" : ""} · ${d === 0 ? "tous les domaines" : `${d} domaine${d > 1 ? "s" : ""}`}`,
      chooseDomains: "Domaines",
    },
    locked: {
      title: "Passe en mode Pro",
      example: "Exemple",
      lead: "En débloquant cette certification, tu obtiens :",
      bullets: [
        "Toutes les questions et le mode examen",
        "Ton niveau pour l'examen",
        "Ta réussite par domaine et tes points à réviser",
      ],
      cta: "Passer en mode Pro",
    },
  },
  en: {
    profile: {
      title: "My profile",
      subtitle: "This information personalises your space.",
      menu: "My profile",
      editLink: "Edit my profile",
      addPhotoLink: "Add my picture",
      photoTitle: "Profile picture",
      addPhoto: "Add a picture",
      changePhoto: "Change picture",
      removePhoto: "Remove",
      photoHint: "A square picture works best. It is cropped into a circle.",
      photoSaved: "Picture saved.",
      photoRemoved: "Picture removed.",
      photoError: "The picture could not be saved. Please try again in a moment.",
      notAnImage: "This file is not an image (JPEG, PNG or WebP).",
      tooBig: "This image is too large (10 MB maximum).",
      cropTitle: "Frame your picture",
      cropHelp: "Drag the image to move it and use the slider to zoom.",
      zoom: "Zoom",
      cancel: "Cancel",
      save: "Save",
      saving: "Saving…",
      nameTitle: "Personal information",
      nameLabel: "Your first name",
      nameHint: "You can change it once a week. It appears in the leaderboard.",
      nameSaved: "First name updated.",
      nameInvalid: "Your first name must be 1 to 40 characters, with no link or e-mail address.",
      nameLocked: (d) => `You will be able to change it again from ${d}.`,
      nameError: "The first name could not be changed. Please try again in a moment.",
      emailTitle: "E-mail address",
      back: "Back to my courses",
      memberSince: (d) => `Member since ${d}`,
      dangerTitle: "Delete my account",
      dangerText: "Your account and data will be permanently deleted, and you will be signed out.",
      dangerButton: "Delete my account",
      deleteModalTitle: "Permanently delete your account?",
      deleteActiveAccess: "Warning, you have an access in progress that will be lost:",
      deleteTypeToConfirm: (w) => `To confirm, type ${w} in capital letters.`,
      deleteConfirmWord: "DELETE",
      deleteConfirmButton: "Delete permanently",
      deleting: "Deleting…",
      deleteError: "The account could not be deleted. Please try again in a moment.",
      planPro: "Pro account",
      accessTitle: "My access",
      accessActiveUntil: (d) => `Active until ${d}`,
      accessNone: "No access right now",
      accessPro: "Full access to every certification",
      unlock: "Unlock",
    },
    insights: {
      title: "My preparation",
      coursesTitle: "My certifications",
      streak: (n) => (n > 0 ? `Streak: ${n} day${n > 1 ? "s" : ""} in a row` : "No streak right now"),
      answered: (n) => `${n} question${n > 1 ? "s" : ""} answered`,
      scopeAll: "All",
      tileStreak: "Current streak",
      tileStreakValue: (n) => `${n} day${n > 1 ? "s" : ""}`,
      tileAnswered: "Questions answered",
      tileSuccess: "Success rate",
      tileExams: "Exams taken",
      tileBest: "Best score",
      readinessTitle: "Exam readiness",
      readinessNone: "Take a mock exam to measure your level.",
      readinessBasis: (n) => `Average of your ${n > 1 ? `last ${n} exams` : "last exam"}`,
      goal: (p) => `Goal ${p}%`,
      levelBuilding: "Building up",
      levelOnTrack: "On track",
      levelReady: "Goal reached",
      trendTitle: "Your latest exams",
      domainsTitle: "Success by domain",
      domainsNeedMore: "Answer a few more questions to see your success by domain.",
      domainsWeakest: "To strengthen",
      revise: "Revise",
      nextStep: "Next step",
      reviseNamed: (d) => `Revise "${d}"`,
      takeExam: "Take a mock exam",
      answeredShort: (n) => `${n} ans.`,
    },
    podium: {
      message: (name, rank, cert) =>
        `Well done${name ? ` ${name}` : ""}! You are ${rank === 1 ? "1st" : rank === 2 ? "2nd" : "3rd"} in the ${cert} leaderboard this month.`,
      dismiss: "Close",
    },
    share: {
      button: "Share my result",
      title: "Your result",
      help: "An image to post wherever you like. It only shows your first name, your picture if you have one, and your score.",
      download: "Download the image",
      shareNative: "Share…",
      linkedin: "Open LinkedIn",
      linkedinHint: "On LinkedIn, add the downloaded image to your post.",
      close: "Close",
      cardExam: (c) => `Mock exam · ${c}`,
      cardCorrect: (s, t) => `${s} correct answers out of ${t}`,
      cardReached: (g) => `${g}% goal reached`,
      cardGoal: (g) => `Goal: ${g}%`,
      cardFooter: "Lampas .ai mock exam · does not replace the official exam",
      shareText: (c, p) => `${p}% on a ${c} mock exam on Lampas .ai.`,
    },
    feedback: {
      openFeedback: "Give feedback",
      openHelp: "Need help?",
      feedbackTitle: "Your feedback matters",
      feedbackLead: "Tell us what you like, what bothers you, or what you would like to see on the platform.",
      kinds: { review: "Review", idea: "Idea", problem: "Problem" },
      placeholders: {
        review: "What you like, or not, about Lampas .ai…",
        idea: "An improvement you would like to see…",
        problem: "Describe what is not working as expected…",
      },
      ratingLabel: "Your rating (optional)",
      helpTitle: "Need help?",
      helpLead: (e) => `A question, something blocking you? Write to us: we reply by e-mail at ${e}.`,
      helpPlaceholder: "Tell us your question or your problem…",
      messageLabel: "Your message",
      send: "Send",
      sending: "Sending…",
      cancel: "Cancel",
      close: "Close",
      thanksFeedback: "Thank you! Your message reached us.",
      thanksHelp: "Message sent. We reply by e-mail as soon as possible.",
      invalid: "Your message must be 3 to 2000 characters long.",
      rateLimited: "You already sent several messages today. Please try again tomorrow.",
      error: "The message could not be sent. Please try again in a moment.",
    },
    board: {
      subtitle: "The best of the period, ranked by mock exam points.",
      yourStanding: "Your standing",
      yourRank: "Rank",
      gapToPodium: (n) => `Only ${n} pt${n > 1 ? "s" : ""} to reach the podium`,
      onPodium: "You are on the podium. Well done!",
      leading: "You lead the leaderboard. Well done!",
      gapToLeader: (n) => `${n} pt${n > 1 ? "s" : ""} behind first place`,
      rest: "The rest of the ranking",
      first: "1st",
    },
    examSetup: {
      summary: (q, d) =>
        `${q} question${q > 1 ? "s" : ""} · ${d === 0 ? "all domains" : `${d} domain${d > 1 ? "s" : ""}`}`,
      chooseDomains: "Domains",
    },
    locked: {
      title: "Go Pro",
      example: "Example",
      lead: "By unlocking this certification, you get:",
      bullets: [
        "Every question and the exam mode",
        "Your exam readiness",
        "Your success by domain and what to revise",
      ],
      cta: "Go Pro",
    },
  },
};
