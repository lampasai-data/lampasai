import type { Lang } from "../i18n";

// Copy for the admin "E-mails" tab (kept apart from adminI18n.ts: it is a
// whole feature of its own).
export const SEGMENT_IDS = [
  "selection",
  "all",
  "paying",
  "voucher_active",
  "voucher_expiring",
  "expiring_48h",
  "access_expiring",
  "paid_inactive",
  "voucher_expired",
  "recently_expired",
  "hot_leads",
  "dormant",
] as const;
export type SegmentId = (typeof SEGMENT_IDS)[number];

export const TEMPLATE_CATEGORIES = ["welcome", "reminder", "promotion", "support", "other"] as const;
export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];

export interface EmailStrings {
  title: string;
  tabs: { sent: string; templates: string; app: string; unsubscribed: string; trash: string };
  newEmail: string;
  newTemplate: string;
  cancel: string;
  save: string;
  saving: string;
  close: string;
  deleteMode: string;
  moveToTrash: (n: number) => string;
  restore: (n: number) => string;
  deleteForever: (n: number) => string;
  confirmDeleteForever: (n: number) => string;
  loading: string;
  segments: Record<SegmentId, { label: string; hint: string }>;
  categories: Record<TemplateCategory, string>;
  sent: {
    intro: string;
    colDate: string;
    colType: string;
    colSubject: string;
    colTarget: string;
    colSent: string;
    promotion: string;
    service: string;
    empty: string;
    sentOf: (sent: number, total: number, failed: number) => string;
    manual: string;
  };
  composer: {
    title: string;
    type: string;
    typeService: string;
    typeServiceHint: string;
    typePromotion: string;
    typePromotionHint: string;
    target: string;
    pickMembers: string;
    showRecipients: (n: number) => string;
    hideRecipients: string;
    pickByHand: string;
    clearAll: string;
    noRecipients: string;
    searchMember: string;
    recipients: (n: number) => string;
    unsubscribedExcluded: (n: number) => string;
    template: string;
    noTemplate: string;
    subject: string;
    message: string;
    messageHint: string;
    ctaLabel: string;
    ctaUrl: string;
    ctaOptional: string;
    sendTest: string;
    send: string;
    sending: string;
    testSent: string;
    sentResult: (sent: number, total: number, failed: number) => string;
    confirmSend: (n: number) => string;
    saveAsTemplate: string;
    previewTitle: string;
    language: string;
    langAll: string;
    langFr: string;
    langEn: string;
    tabFrench: string;
    tabEnglish: string;
    englishHint: string;
    split: (fr: number, en: number) => string;
    noEnglishWarning: (n: number) => string;
    sendTestIn: (lang: "fr" | "en") => string;
    sentEnglish: (n: number) => string;
  };
  templates: {
    intro: string;
    category: string;
    name: string;
    subject: string;
    body: string;
    bodyPlaceholder: string;
    colUpdated: string;
    empty: string;
    namePlaceholder: string;
    edit: string;
    newTitle: string;
    englishVersion: string;
  };
  app: {
    intro: string;
    trigger: string;
    recipient: string;
    sentBy: string;
    sentCount: (n: number) => string;
    notTracked: string;
    preview: string;
    note: string;
    items: Record<
      "signup_confirm" | "expiry_7d" | "expiry_1d",
      { name: string; trigger: string; recipient: string; subject: string; paragraphs: string[]; cta: string }
    >;
  };
  unsub: { intro: string; colName: string; colEmail: string; colDate: string; empty: string };
  trash: { intro: string; templates: string; campaigns: string; empty: string };
  preview: { hello: string; footer: string; unsubscribe: string; unsubscribeFooter: string; example: string };
}

export const EMAIL_T: Record<Lang, EmailStrings> = {
  fr: {
    title: "E-mails",
    tabs: {
      sent: "Messages envoyés",
      templates: "Modèles",
      app: "E-mails de l'app",
      unsubscribed: "Désinscrits",
      trash: "Corbeille",
    },
    newEmail: "Nouvel e-mail",
    newTemplate: "Nouveau modèle",
    cancel: "Annuler",
    save: "Enregistrer",
    saving: "Enregistrement…",
    close: "Fermer",
    deleteMode: "Sélectionner pour supprimer",
    moveToTrash: (n) => `Mettre à la corbeille${n ? ` (${n})` : ""}`,
    restore: (n) => `Restaurer${n ? ` (${n})` : ""}`,
    deleteForever: (n) => `Supprimer définitivement${n ? ` (${n})` : ""}`,
    confirmDeleteForever: (n) => `Supprimer définitivement ${n} élément(s) ? Impossible à annuler.`,
    loading: "Chargement…",
    segments: {
      selection: { label: "Sélection manuelle", hint: "Une ou plusieurs personnes précises" },
      all: { label: "Tous les inscrits", hint: "Tous les comptes avec une adresse e-mail" },
      paying: { label: "Clients payants", hint: "Accès payant actif en ce moment" },
      voucher_active: { label: "Accès voucher actifs", hint: "Utilisent un voucher en ce moment" },
      voucher_expiring: { label: "Vouchers qui expirent sous 7 jours", hint: "À convertir en achat" },
      expiring_48h: { label: "Accès qui expirent sous 48 h", hint: "Payant ou voucher : dernier rappel" },
      voucher_expired: { label: "Vouchers expirés, pas d'achat", hint: "Terminés depuis moins de 30 jours : à reconquérir" },
      access_expiring: { label: "Accès payants qui expirent sous 14 jours", hint: "Pour proposer un renouvellement" },
      paid_inactive: { label: "Acheteurs inactifs", hint: "Accès actif mais aucune activité depuis 7 jours" },
      recently_expired: { label: "Accès expirés récemment", hint: "Expirés depuis moins de 30 jours, non renouvelés" },
      hot_leads: { label: "Actifs sans achat", hint: "S'entraînent depuis 14 jours sans avoir acheté" },
      dormant: { label: "Comptes sans activité", hint: "Inscrits depuis plus de 3 jours, rien fait" },
    },
    categories: {
      welcome: "Bienvenue",
      reminder: "Relance",
      promotion: "Promotion",
      support: "Support",
      other: "Autre",
    },
    sent: {
      intro: "Historique des e-mails envoyés depuis l'administration.",
      colDate: "Date",
      colType: "Type",
      colSubject: "Objet",
      colTarget: "Cible",
      colSent: "Envoyés",
      promotion: "Promotion",
      service: "Information",
      empty: "Aucun e-mail envoyé pour l'instant.",
      sentOf: (s, t, f) => `${s} / ${t}${f ? ` (${f} échec${f > 1 ? "s" : ""})` : ""}`,
      manual: "Sélection manuelle",
    },
    composer: {
      title: "Nouvel e-mail",
      type: "Type d'e-mail",
      typeService: "Information",
      typeServiceHint: "Lié au compte. Envoyé même aux désinscrits.",
      typePromotion: "Promotion",
      typePromotionHint: "Offre commerciale. Lien de désinscription, désinscrits exclus.",
      target: "Destinataires",
      pickMembers: "Personnes choisies",
      showRecipients: (n) => `Voir les ${n} destinataire${n > 1 ? "s" : ""}`,
      hideRecipients: "Masquer la liste",
      pickByHand: "Choisir à la main",
      clearAll: "Tout retirer",
      noRecipients: "Personne ne correspond pour l'instant.",
      searchMember: "Chercher un inscrit (prénom ou e-mail)",
      recipients: (n) => `${n} destinataire${n > 1 ? "s" : ""}`,
      unsubscribedExcluded: (n) => `${n} désinscrit${n > 1 ? "s" : ""} exclu${n > 1 ? "s" : ""}`,
      template: "Partir d'un modèle",
      noTemplate: "Aucun (page blanche)",
      subject: "Objet",
      message: "Message",
      messageHint:
        "Pas de « Bonjour » à écrire : il est ajouté tout seul. {prenom} est remplacé par le prénom de chaque destinataire. L'en-tête et le pied de page sont ajoutés à l'envoi.",
      ctaLabel: "Texte du bouton",
      ctaUrl: "Lien du bouton (https://…)",
      ctaOptional: "Bouton (facultatif)",
      sendTest: "M'envoyer un test",
      send: "Envoyer",
      sending: "Envoi…",
      testSent: "E-mail de test envoyé sur ton adresse.",
      sentResult: (s, t, f) => `${s} e-mail(s) envoyé(s) sur ${t}${f ? `, ${f} échec(s)` : ""}.`,
      confirmSend: (n) => `Envoyer cet e-mail à ${n} destinataire(s) ? Cette action est définitive.`,
      saveAsTemplate: "Enregistrer comme modèle",
      previewTitle: "Aperçu",
      language: "Langue des destinataires",
      langAll: "Toutes les langues",
      langFr: "Français",
      langEn: "Anglais",
      tabFrench: "Français",
      tabEnglish: "English",
      englishHint:
        "Version anglaise (facultative) : envoyée aux personnes qui utilisent le site en anglais. Sans elle, elles reçoivent la version française.",
      split: (fr, en) => `${fr} en français · ${en} en anglais`,
      noEnglishWarning: (n) =>
        `${n} destinataire${n > 1 ? "s utilisent" : " utilise"} le site en anglais mais ${n > 1 ? "recevront" : "recevra"} la version française : écris la version anglaise.`,
      sendTestIn: (l) => (l === "en" ? "Test en anglais" : "Test en français"),
      sentEnglish: (n) => `dont ${n} en anglais`,
    },
    templates: {
      intro: "Des objets et messages prêts à réutiliser. Choisis-en un en écrivant un nouvel e-mail, modifie-le si besoin, puis envoie.",
      category: "Catégorie",
      name: "Nom du modèle",
      subject: "Objet",
      body: "Message",
      bodyPlaceholder: "Écris le corps du modèle (sans « Bonjour », ajouté automatiquement).",
      colUpdated: "Dernière modification",
      empty: "Aucun modèle pour l'instant.",
      namePlaceholder: "Ex. Relance voucher qui expire",
      edit: "Modifier le modèle",
      newTitle: "Nouveau modèle",
      englishVersion: "Version anglaise (facultative)",
    },
    app: {
      intro: "Les e-mails que Lampas envoie automatiquement, avec ce qui les déclenche et un aperçu.",
      trigger: "Déclencheur",
      recipient: "Destinataire",
      sentBy: "Fonction",
      sentCount: (n) => `${n} envoyé${n > 1 ? "s" : ""}`,
      notTracked: "Envois non comptés",
      preview: "Aperçu",
      note: "Aperçu à titre indicatif : le texte exact est celui du code d'envoi.",
      items: {
        signup_confirm: {
          name: "Confirmation de compte",
          trigger: "À la création d'un compte par e-mail et mot de passe",
          recipient: "Le nouvel inscrit",
          subject: "Confirme ton adresse email - Lampas .ai",
          paragraphs: [
            "Merci d'avoir rejoint Lampas .ai. Confirme ton adresse email pour activer ton compte et commencer à t'entraîner.",
          ],
          cta: "Confirmer mon compte",
        },
        expiry_7d: {
          name: "Rappel d'expiration à 7 jours",
          trigger: "Chaque jour, 7 jours avant la fin d'un accès payant ou voucher",
          recipient: "Le titulaire de l'accès",
          subject: "Ton accès {cert} expire dans 7 jours",
          paragraphs: [
            "Ton accès illimité à {cert} expire le {date} (dans 7 jours). Renouvelle-le pour continuer à t'entraîner sans interruption.",
          ],
          cta: "Renouveler mon accès",
        },
        expiry_1d: {
          name: "Rappel d'expiration à 1 jour",
          trigger: "Chaque jour, la veille de la fin d'un accès",
          recipient: "Le titulaire de l'accès",
          subject: "Dernier jour : ton accès {cert} expire demain",
          paragraphs: [
            "Ton accès illimité à {cert} expire demain, le {date}. C'est le moment de renouveler si tu veux continuer à t'entraîner en mode examen.",
          ],
          cta: "Renouveler mon accès",
        },
      },
    },
    unsub: {
      intro: "Personnes qui ne veulent plus recevoir les e-mails promotionnels. Elles sont exclues de chaque envoi « Promotion ».",
      colName: "Inscrit",
      colEmail: "E-mail",
      colDate: "Désinscrit le",
      empty: "Personne ne s'est désinscrit.",
    },
    trash: {
      intro: "Éléments supprimés, récupérables tant qu'ils ne sont pas effacés définitivement.",
      templates: "Modèles",
      campaigns: "Messages envoyés",
      empty: "La corbeille est vide.",
    },
    preview: {
      hello: "Bonjour",
      footer: "Tu peux répondre directement à cet e-mail.",
      unsubscribe: "Ne plus recevoir nos offres",
      unsubscribeFooter: "Tu reçois cet e-mail car tu as un compte Lampas .ai.",
      example: "Le message apparaîtra ici.",
    },
  },
  en: {
    title: "E-mails",
    tabs: {
      sent: "Sent messages",
      templates: "Templates",
      app: "App e-mails",
      unsubscribed: "Unsubscribed",
      trash: "Trash",
    },
    newEmail: "New e-mail",
    newTemplate: "New template",
    cancel: "Cancel",
    save: "Save",
    saving: "Saving…",
    close: "Close",
    deleteMode: "Select to delete",
    moveToTrash: (n) => `Move to trash${n ? ` (${n})` : ""}`,
    restore: (n) => `Restore${n ? ` (${n})` : ""}`,
    deleteForever: (n) => `Delete permanently${n ? ` (${n})` : ""}`,
    confirmDeleteForever: (n) => `Permanently delete ${n} item(s)? This cannot be undone.`,
    loading: "Loading…",
    segments: {
      selection: { label: "Hand-picked", hint: "One or more specific people" },
      all: { label: "All sign-ups", hint: "Every account with an e-mail address" },
      paying: { label: "Paying customers", hint: "Paid access active right now" },
      voucher_active: { label: "Active voucher access", hint: "Using a voucher right now" },
      voucher_expiring: { label: "Vouchers expiring within 7 days", hint: "To convert into a purchase" },
      expiring_48h: { label: "Access expiring within 48h", hint: "Paid or voucher: last reminder" },
      voucher_expired: { label: "Expired vouchers, no purchase", hint: "Ended under 30 days ago: to win back" },
      access_expiring: { label: "Paid access expiring within 14 days", hint: "To offer a renewal" },
      paid_inactive: { label: "Inactive buyers", hint: "Active access but no activity for 7 days" },
      recently_expired: { label: "Recently expired access", hint: "Expired under 30 days ago, not renewed" },
      hot_leads: { label: "Active without a purchase", hint: "Practising in the last 14 days, not bought" },
      dormant: { label: "Accounts with no activity", hint: "Signed up over 3 days ago, did nothing" },
    },
    categories: {
      welcome: "Welcome",
      reminder: "Follow-up",
      promotion: "Promotion",
      support: "Support",
      other: "Other",
    },
    sent: {
      intro: "History of the e-mails sent from the admin area.",
      colDate: "Date",
      colType: "Type",
      colSubject: "Subject",
      colTarget: "Target",
      colSent: "Sent",
      promotion: "Promotion",
      service: "Information",
      empty: "No e-mail sent yet.",
      sentOf: (s, t, f) => `${s} / ${t}${f ? ` (${f} failed)` : ""}`,
      manual: "Hand-picked",
    },
    composer: {
      title: "New e-mail",
      type: "E-mail type",
      typeService: "Information",
      typeServiceHint: "Tied to the account. Sent even to unsubscribed people.",
      typePromotion: "Promotion",
      typePromotionHint: "Commercial offer. Unsubscribe link, unsubscribed people excluded.",
      target: "Recipients",
      pickMembers: "Chosen people",
      showRecipients: (n) => `Show the ${n} recipient${n > 1 ? "s" : ""}`,
      hideRecipients: "Hide the list",
      pickByHand: "Pick by hand",
      clearAll: "Remove all",
      noRecipients: "Nobody matches right now.",
      searchMember: "Find a sign-up (first name or e-mail)",
      recipients: (n) => `${n} recipient${n > 1 ? "s" : ""}`,
      unsubscribedExcluded: (n) => `${n} unsubscribed excluded`,
      template: "Start from a template",
      noTemplate: "None (blank page)",
      subject: "Subject",
      message: "Message",
      messageHint:
        'No "Hello" to write: it is added automatically. {prenom} is replaced by each recipient\'s first name. The header and footer are added when sending.',
      ctaLabel: "Button text",
      ctaUrl: "Button link (https://…)",
      ctaOptional: "Button (optional)",
      sendTest: "Send me a test",
      send: "Send",
      sending: "Sending…",
      testSent: "Test e-mail sent to your address.",
      sentResult: (s, t, f) => `${s} e-mail(s) sent out of ${t}${f ? `, ${f} failed` : ""}.`,
      confirmSend: (n) => `Send this e-mail to ${n} recipient(s)? This cannot be undone.`,
      saveAsTemplate: "Save as template",
      previewTitle: "Preview",
      language: "Recipients' language",
      langAll: "All languages",
      langFr: "French",
      langEn: "English",
      tabFrench: "Français",
      tabEnglish: "English",
      englishHint:
        "English version (optional): sent to people who use the site in English. Without it they get the French version.",
      split: (fr, en) => `${fr} in French · ${en} in English`,
      noEnglishWarning: (n) =>
        `${n} recipient${n > 1 ? "s use" : " uses"} the site in English but will get the French version: write the English version.`,
      sendTestIn: (l) => (l === "en" ? "Test in English" : "Test in French"),
      sentEnglish: (n) => `${n} in English`,
    },
    templates: {
      intro: "Ready-to-reuse subjects and messages. Pick one when writing a new e-mail, tweak it if needed, then send.",
      category: "Category",
      name: "Template name",
      subject: "Subject",
      body: "Message",
      bodyPlaceholder: 'Write the template body (no "Hello", added automatically).',
      colUpdated: "Last modified",
      empty: "No template yet.",
      namePlaceholder: "E.g. Expiring voucher follow-up",
      edit: "Edit template",
      newTitle: "New template",
      englishVersion: "English version (optional)",
    },
    app: {
      intro: "The e-mails Lampas sends on its own, with what triggers them and a preview.",
      trigger: "Trigger",
      recipient: "Recipient",
      sentBy: "Function",
      sentCount: (n) => `${n} sent`,
      notTracked: "Sends not counted",
      preview: "Preview",
      note: "Indicative preview: the exact text is the one in the sending code.",
      items: {
        signup_confirm: {
          name: "Account confirmation",
          trigger: "When an account is created with e-mail and password",
          recipient: "The new sign-up",
          subject: "Confirm your Lampas .ai account",
          paragraphs: [
            "Thanks for joining Lampas .ai. Confirm your e-mail address to activate your account and start practising.",
          ],
          cta: "Confirm my account",
        },
        expiry_7d: {
          name: "Expiry reminder, 7 days",
          trigger: "Every day, 7 days before a paid or voucher access ends",
          recipient: "The access holder",
          subject: "Your {cert} access expires in 7 days",
          paragraphs: [
            "Your unlimited access to {cert} expires on {date} (in 7 days). Renew it to keep practising without interruption.",
          ],
          cta: "Renew my access",
        },
        expiry_1d: {
          name: "Expiry reminder, 1 day",
          trigger: "Every day, the day before an access ends",
          recipient: "The access holder",
          subject: "Last day: your {cert} access expires tomorrow",
          paragraphs: [
            "Your unlimited access to {cert} expires tomorrow, {date}. Now is the time to renew if you want to keep practising in exam mode.",
          ],
          cta: "Renew my access",
        },
      },
    },
    unsub: {
      intro: "People who no longer want promotional e-mails. They are excluded from every \"Promotion\" send.",
      colName: "Sign-up",
      colEmail: "E-mail",
      colDate: "Unsubscribed on",
      empty: "Nobody has unsubscribed.",
    },
    trash: {
      intro: "Deleted items, recoverable until they are erased for good.",
      templates: "Templates",
      campaigns: "Sent messages",
      empty: "The trash is empty.",
    },
    preview: {
      hello: "Hello",
      footer: "You can reply to this e-mail directly.",
      unsubscribe: "Stop receiving our offers",
      unsubscribeFooter: "You are receiving this e-mail because you have a Lampas .ai account.",
      example: "The message will appear here.",
    },
  },
};
