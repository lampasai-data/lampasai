import type { Lang } from "../i18n";

// Copy for the admin-only pages (stats, vouchers, Gumroad catch-up).
//
// Deliberately kept out of the `Translations` interface in i18n.tsx: that one
// types the product's user-facing copy, and padding it with ~55 keys only the
// site owner ever reads would bury the strings that actually ship to
// customers. Same mechanism though - it keys off the same `lang` returned by
// useLanguage(), so the language toggle drives these pages like any other.
export interface AdminStrings {
  loading: string;
  error: string;
  previous: string;
  next: string;
  pageOf: (current: number, total: number) => string;
  certification: string;
  // Stats
  statsTitle: string;
  statsSubtitle: string;
  statsUsers: string;
  statsEmail: string;
  statsPlan: string;
  statsSignedUp: string;
  statsPerCertification: string;
  statsTopScores: string;
  statsNoSessionThisMonth: string;
  statsSessions: string;
  statsQuestions: string;
  statsNewUsers7d: string;
  statsNewUsers30d: string;
  statsExamSessions: string;
  statsSessions7d: string;
  statsPaidSales: string;
  statsVouchersUsed: string;
  statsTotalRevenue: string;
  statsSales: string;
  statsSaleCount: (n: number) => string;
  statsActiveUsers: string;
  statsAvgScore: string;
  statsUser: string;
  statsRecentSignups: string;
  statsName: string;
  // Vouchers
  vouchersTitle: string;
  vouchersLead: string;
  vouchersExpiry: string;
  vouchersMaxRedemptions: string;
  vouchersGenerate: string;
  vouchersGenerating: string;
  vouchersGenerated: string;
  vouchersCode: string;
  vouchersType: string;
  vouchersCreatedAt: string;
  vouchersStatus: string;
  vouchersRedeemedBy: string;
  vouchersFilter: string;
  vouchersAll: string;
  vouchersAllFem: string;
  vouchersUnique: string;
  vouchersShared: string;
  vouchersNone: string;
  vouchersNoMatch: string;
  vouchersAvailable: string;
  vouchersExhausted: string;
  vouchersExpired: string;
  vouchersPeople: (n: number) => string;
  vouchersSearchPerson: string;
  vouchersAvailableCount: (used: number, max: number) => string;
  vouchersExhaustedCount: (used: number, max: number) => string;
  // Gumroad
  gumroadTitle: string;
  gumroadSubtitle: (hours: number) => string;
  gumroadReconcileNow: string;
  gumroadReconciling: string;
  gumroadNothingPending: string;
  gumroadLinkEmailPlaceholder: string;
  gumroadLink: string;
  gumroadLinking: string;
  gumroadLinked: string;
  gumroadEventsTitle: string;
  gumroadEventsLead: string;
  gumroadNoEvents: string;
  gumroadReceivedAt: string;
  gumroadVerification: string;
  gumroadResult: string;
  gumroadError: string;
  errorWith: (message: string) => string;
  unknownError: string;
  gumroadReceivedInline: string;
  gumroadReconcileDone: (total: number, processed: number, skipped: number) => string;
}

export const ADMIN_T: Record<Lang, AdminStrings> = {
  fr: {
    loading: "Chargement…",
    error: "Erreur",
    previous: "Précédent",
    next: "Suivant",
    pageOf: (c, t) => `Page ${c} / ${t}`,
    certification: "Certification",
    statsTitle: "Statistiques",
    statsSubtitle:
      "Vue d'ensemble de l'activité du site : inscriptions, sessions d'examen et revenus.",
    statsUsers: "Utilisateurs",
    statsEmail: "Email",
    statsPlan: "Plan",
    statsSignedUp: "Inscrit le",
    statsPerCertification: "Par certification",
    statsTopScores: "Meilleurs scores ce mois-ci",
    statsNoSessionThisMonth: "Aucune session ce mois-ci.",
    statsSessions: "Sessions",
    statsQuestions: "Questions",
    statsNewUsers7d: "Nouveaux (7j)",
    statsNewUsers30d: "Nouveaux (30j)",
    statsExamSessions: "Sessions d'examen",
    statsSessions7d: "Sessions (7j)",
    statsPaidSales: "Ventes payantes",
    statsVouchersUsed: "Vouchers utilisés",
    statsTotalRevenue: "Revenu total",
    statsSales: "Ventes",
    statsSaleCount: (n) => `${n} vente${n > 1 ? "s" : ""}`,
    statsActiveUsers: "Utilisateurs actifs",
    statsAvgScore: "Score moyen",
    statsUser: "Utilisateur",
    statsRecentSignups: "3 dernières inscriptions",
    statsName: "Nom",
    vouchersTitle: "Vouchers examen",
    vouchersLead:
      "Génère un code qui débloque le mode examen (30 jours, sans export PDF) d'une certification, en usage unique ou partagé.",
    vouchersExpiry: "Expiration du code (optionnel)",
    vouchersMaxRedemptions: "Nombre d'utilisations",
    vouchersGenerate: "Générer un code",
    vouchersGenerating: "Génération…",
    vouchersGenerated: "Code généré :",
    vouchersCode: "Code",
    vouchersType: "Type",
    vouchersCreatedAt: "Créé le",
    vouchersStatus: "Statut",
    vouchersRedeemedBy: "Utilisé par",
    vouchersFilter: "Filtrer…",
    vouchersAll: "Tous",
    vouchersAllFem: "Toutes",
    vouchersUnique: "Unique",
    vouchersShared: "Partagé",
    vouchersNone: "Aucun voucher généré.",
    vouchersNoMatch: "Aucun voucher ne correspond aux filtres.",
    vouchersAvailable: "Disponible",
    vouchersExhausted: "Épuisé",
    vouchersExpired: "Expiré",
    vouchersPeople: (n) => `${n} personnes`,
    vouchersSearchPerson: "Rechercher un nom ou un email…",
    vouchersAvailableCount: (u, m) => `Disponible (${u}/${m})`,
    vouchersExhaustedCount: (u, m) => `Épuisé (${u}/${m})`,
    gumroadTitle: "Rattrapage Gumroad",
    gumroadSubtitle: (h) => `Ventes Gumroad non associées à un compte depuis plus de ${h}h.`,
    gumroadReconcileNow: "Relancer le rapprochement maintenant",
    gumroadReconciling: "Rapprochement en cours…",
    gumroadNothingPending: "Rien à rattraper pour le moment.",
    gumroadLinkEmailPlaceholder: "email du compte à lier",
    gumroadLink: "Lier",
    gumroadLinking: "Liaison…",
    gumroadLinked: "Lié avec succès.",
    gumroadEventsTitle: "Événements à surveiller",
    gumroadEventsLead:
      "Ventes Gumroad reçues, erreurs, et passages de rapprochement ayant traité quelque chose. Les balayages automatiques qui ne trouvent rien ne sont pas affichés ici.",
    gumroadNoEvents: "Rien à signaler pour le moment.",
    gumroadReceivedAt: "Reçu le",
    gumroadVerification: "Vérification",
    gumroadResult: "Résultat",
    gumroadError: "Erreur",
    errorWith: (m) => `Erreur : ${m}`,
    unknownError: "Erreur inconnue.",
    gumroadReceivedInline: "reçu le",
    gumroadReconcileDone: (t, p, sk) =>
      `Terminé : ${t} vente(s) vues, ${p} traitée(s), ${sk} déjà connue(s).`,
  },
  en: {
    loading: "Loading…",
    error: "Error",
    previous: "Previous",
    next: "Next",
    pageOf: (c, t) => `Page ${c} / ${t}`,
    certification: "Certification",
    statsTitle: "Statistics",
    statsSubtitle:
      "Overview of site activity: sign-ups, exam sessions and revenue.",
    statsUsers: "Users",
    statsEmail: "Email",
    statsPlan: "Plan",
    statsSignedUp: "Signed up",
    statsPerCertification: "By certification",
    statsTopScores: "Top scores this month",
    statsNoSessionThisMonth: "No session this month.",
    statsSessions: "Sessions",
    statsQuestions: "Questions",
    statsNewUsers7d: "Nouveaux (7j)",
    statsNewUsers30d: "Nouveaux (30j)",
    statsExamSessions: "Sessions d'examen",
    statsSessions7d: "Sessions (7j)",
    statsPaidSales: "Ventes payantes",
    statsVouchersUsed: "Vouchers utilisés",
    statsTotalRevenue: "Revenu total",
    statsSales: "Ventes",
    statsSaleCount: (n) => `${n} vente${n > 1 ? "s" : ""}`,
    statsActiveUsers: "Utilisateurs actifs",
    statsAvgScore: "Score moyen",
    statsUser: "Utilisateur",
    statsRecentSignups: "3 dernières inscriptions",
    statsName: "Nom",
    vouchersTitle: "Exam vouchers",
    vouchersLead:
      "Generate a code that unlocks exam mode (30 days, no PDF export) for a certification, single-use or shared.",
    vouchersExpiry: "Code expiry (optional)",
    vouchersMaxRedemptions: "Number of uses",
    vouchersGenerate: "Generate a code",
    vouchersGenerating: "Generating…",
    vouchersGenerated: "Code generated:",
    vouchersCode: "Code",
    vouchersType: "Type",
    vouchersCreatedAt: "Created",
    vouchersStatus: "Status",
    vouchersRedeemedBy: "Redeemed by",
    vouchersFilter: "Filter…",
    vouchersAll: "All",
    vouchersAllFem: "All",
    vouchersUnique: "Single-use",
    vouchersShared: "Shared",
    vouchersNone: "No voucher generated yet.",
    vouchersNoMatch: "No voucher matches the filters.",
    vouchersAvailable: "Available",
    vouchersExhausted: "Exhausted",
    vouchersExpired: "Expired",
    vouchersPeople: (n) => `${n} people`,
    vouchersSearchPerson: "Search by name or email…",
    vouchersAvailableCount: (u, m) => `Available (${u}/${m})`,
    vouchersExhaustedCount: (u, m) => `Exhausted (${u}/${m})`,
    gumroadTitle: "Gumroad catch-up",
    gumroadSubtitle: (h) => `Gumroad sales unmatched to an account for more than ${h}h.`,
    gumroadReconcileNow: "Run reconciliation now",
    gumroadReconciling: "Reconciling…",
    gumroadNothingPending: "Nothing to catch up on right now.",
    gumroadLinkEmailPlaceholder: "email of the account to link",
    gumroadLink: "Link",
    gumroadLinking: "Linking…",
    gumroadLinked: "Linked successfully.",
    gumroadEventsTitle: "Events to watch",
    gumroadEventsLead:
      "Gumroad sales received, errors, and reconciliation passes that actually did something. Automatic sweeps that find nothing are not listed here.",
    gumroadNoEvents: "Nothing to report right now.",
    gumroadReceivedAt: "Received",
    gumroadVerification: "Verification",
    gumroadResult: "Result",
    gumroadError: "Error",
    errorWith: (m) => `Error: ${m}`,
    unknownError: "Unknown error.",
    gumroadReceivedInline: "received",
    gumroadReconcileDone: (t, p, sk) =>
      `Done: ${t} sale(s) seen, ${p} processed, ${sk} already known.`,
  },
};

// Date/time formatting follows the same toggle - these pages hardcoded
// "fr-FR" everywhere, so timestamps stayed French even in English.
export function adminLocale(lang: Lang) {
  return lang === "fr" ? "fr-FR" : "en-GB";
}
