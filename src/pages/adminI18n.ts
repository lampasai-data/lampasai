import type { Lang } from "../i18n";

// Copy for the admin-only pages (stats, vouchers, Gumroad catch-up).
//
// Deliberately kept out of the `Translations` interface in i18n.tsx: that one
// types the product's user-facing copy, and padding it with ~55 keys only the
// site owner ever reads would bury the strings that actually ship to
// customers. Same mechanism though - it keys off the same `lang` returned by
// useLanguage(), so the language toggle drives these pages like any other.
export interface AdminStrings {
  // Data tables (Wonjo-style: search, per-column sort/filter, chips, pager)
  dt: {
    search: string;
    count: (shown: number, total: number) => string;
    range: (from: number, to: number, total: number) => string;
    clearAll: string;
    removeFilter: (label: string) => string;
    sortAZ: string;
    sortZA: string;
    sortAsc: string;
    sortDesc: string;
    oldest: string;
    newest: string;
    showOnly: string;
    searchColumn: string;
    contains: string;
    from: string;
    to: string;
    filterPeriod: string;
    clear: string;
    checkAll: string;
    emptyValue: string;
    empty: string;
    headerTitle: (label: string) => string;
    chipContains: (v: string) => string;
    chipBetween: (f: string, t: string) => string;
    chipSince: (f: string) => string;
    chipUntil: (t: string) => string;
  };
  // Retention tab
  rt: {
    tab: string;
    unavailable: string;
    kpiActivation: string;
    kpiActivationHint: (h24: string) => string;
    kpiRetW1: string;
    kpiRetW4: string;
    kpiRetHint: string;
    kpiActive7d: string;
    kpiActive7dHint: (pct: number) => string;
    kpiVoucherConv: string;
    kpiVoucherConvHint: (bought: number, vouchers: number) => string;
    kpiTimeToBuy: string;
    kpiTimeToBuyHint: (n: number) => string;
    days: (n: number) => string;
    funnel: string;
    funnelAnswered: string;
    funnelExam: string;
    funnelVoucher: string;
    funnelBought: string;
    cohorts: string;
    colWeek: string;
    colSize: string;
    colActivated: string;
    colRetained: string;
    colExam: string;
    colBought: string;
    nudge: string;
    nudgeEmpty: string;
    colVoucherEnd: string;
    colAnswers: string;
    colLastAnswer: string;
  };
  // Period picker
  dr: {
    period: string;
    presets: Record<"today" | "yesterday" | "3d" | "7d" | "15d" | "30d" | "90d" | "all", string>;
    prevMonth: string;
    nextMonth: string;
    pickEnd: string;
  };
  // Statistics sub-tabs
  st: {
    title: string;
    subtitle: string;
    tabOverview: string;
    tabRetention: string;
    tabSales: string;
    tabUsers: string;
    tabExams: string;
    tabAlerts: string;
    kpiRevenue: string;
    kpiSales: string;
    kpiAvgBasket: string;
    kpiActiveAccess: string;
    kpiConversion: string;
    kpiConversionHint: (buyers: number, users: number) => string;
    kpiVouchers: string;
    kpiFees: string;
    kpiNet: string;
    kpiNetHint: (unknown: number) => string;
    kpiNetHintUsd: (unknown: number) => string;
    kpiFeesHint: string;
    kpiRevenueHintUsd: string;
    donutTotal: string;
    other: string;
    currencyLabel: string;
    kpiRevenueHint: string;
    kpiNewBuyers: string;
    kpiDormant: string;
    dormantSignups: string;
    colDaysSince: string;
    kpiSignupsPeriod: string;
    kpiSignupsTotalHint: (n: number) => string;
    kpiActivePeriod: string;
    colNet: string;
    kpiSignups: string;
    kpiSignups7d: string;
    kpiSignups30d: string;
    kpiActive7d: string;
    kpiActive30d: string;
    kpiActivation: string;
    kpiActivationHint: (n: number) => string;
    kpiExams: string;
    kpiExams7d: string;
    kpiAvgScore: string;
    kpiCandidates: string;
    kpiPerCandidate: string;
    revenueByWeek: string;
    signupsByWeek: string;
    examsByWeek: string;
    weekOf: (date: string) => string;
    funnel: string;
    funnelSignups: string;
    funnelExam: string;
    funnelBought: string;
    funnelActive: string;
    bySource: string;
    byCertification: string;
    allSales: string;
    latestSignups: string;
    scoreDistribution: string;
    scoreBuckets: [string, string, string, string];
    topMonth: string;
    perCertification: string;
    sessionsCount: (n: number) => string;
    salesCount: (n: number) => string;
    colDate: string;
    colBuyer: string;
    colCertification: string;
    colSource: string;
    colAmount: string;
    colStatus: string;
    colExpires: string;
    colName: string;
    colEmail: string;
    colPlan: string;
    colSignedUp: string;
    colSales: string;
    colExams: string;
    colCandidates: string;
    colAvgScore: string;
    colPoints: string;
    colRank: string;
    statusPaid: string;
    statusRefunded: string;
    statusLabel: (s: string) => string;
    noSessionThisMonth: string;
  };
  // Alerts
  al: {
    allClear: string;
    allClearSub: string;
    groupUrgent: string;
    groupUrgentSub: string;
    groupImportant: string;
    groupImportantSub: string;
    groupInfo: string;
    groupInfoSub: string;
    segment: (label: string) => string;
    items: Record<
      | "gumroad_pending"
      | "gumroad_errors"
      | "expiring_soon"
      | "paid_inactive"
      | "recently_expired"
      | "hot_leads"
      | "refunded"
      | "dormant_signups",
      { title: (n: number) => string; detail: string; action: string }
    >;
    segments: Record<
      | "expiring_soon"
      | "paid_inactive"
      | "recently_expired"
      | "hot_leads"
      | "refunded"
      | "dormant_signups"
      | "cleanup",
      string
    >;
  };
  // Admin shell + overview + users
  navOverview: string;
  navUsers: string;
  navSales: string;
  navVouchers: string;
  navEmails: string;
  navAudit: string;
  navFeedback: string;
  navStats: string;
  adminArea: string;
  greeting: (hour: number, name: string | null) => string;
  backToSite: string;
  collapseMenu: string;
  switchToDark: string;
  switchToLight: string;
  expandMenu: string;
  logout: string;
  overviewTitle: string;
  overviewSubtitle: string;
  kpiUsers: string;
  kpiActiveAccess: string;
  kpiRevenue: string;
  kpiSales7d: string;
  kpiSessions7d: string;
  todoTitle: string;
  todoNothing: string;
  todoPending: (n: number) => string;
  todoErrors: (n: number) => string;
  todoExpiring: (n: number, days: number) => string;
  todoOpen: string;
  recentSales: string;
  noSalesYet: string;
  seeAll: string;
  seeAllAlerts: string;
  usersTitle: string;
  usersSubtitle: string;
  usersSearch: string;
  usersCount: (n: number) => string;
  filterAll: string;
  filterActive: string;
  filterExpired: string;
  filterNone: string;
  colUser: string;
  colEmail: string;
  colPerson: string;
  colAvatar: string;
  colLastLogin: string;
  colAccess: string;
  colLastActivity: string;
  colSessions: string;
  colAccessEnd: string;
  colLanguage: string;
  langValue: (l: string | null) => string;
  colOrigin: string;
  colCertification: string;
  colCode: string;
  originPaid: string;
  originVoucher: string;
  originBoth: string;
  noAccess: string;
  accessUntil: (date: string) => string;
  accessExpiredOn: (date: string) => string;
  noUserMatch: string;
  writeEmail: string;
  writeToN: (n: number) => string;
  cleanupButton: (n: number) => string;
  selectedN: (n: number) => string;
  deleteAllShown: (n: number) => string;
  deleteN: (n: number) => string;
  del: {
    title: string;
    checking: string;
    intro: string;
    deletable: (n: number) => string;
    protectedTitle: (n: number) => string;
    reasons: Record<"not_found" | "admin" | "paid_purchase" | "active_access", string>;
    detail: (answers: number, exams: number, voucher: boolean) => string;
    warning: string;
    confirmWord: string;
    typeToConfirm: (word: string) => string;
    confirmButton: (n: number) => string;
    deleting: string;
    done: (n: number) => string;
    failed: (n: number) => string;
    nothing: string;
    close: string;
    cancel: string;
  };
  purchasesHeading: string;
  examsHeading: string;
  noPurchases: string;
  noExams: string;
  sourceLabel: (source: string) => string;
  pdfIncluded: string;
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
  vouchersAccessDays: string;
  vouchersDays: (n: number) => string;
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
  gumroadDuplicateNote: string;
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
    dt: {
      search: "Rechercher…",
      count: (shown, total) => `${shown} / ${total}`,
      range: (f, t, total) => `${f}-${t} sur ${total}`,
      clearAll: "Tout effacer",
      removeFilter: (l) => `Retirer le filtre ${l}`,
      sortAZ: "Trier A → Z",
      sortZA: "Trier Z → A",
      sortAsc: "Croissant ↑",
      sortDesc: "Décroissant ↓",
      oldest: "Plus ancien ↑",
      newest: "Plus récent ↓",
      showOnly: "Afficher uniquement",
      searchColumn: "Rechercher dans cette colonne",
      contains: "Contient…",
      from: "À partir du",
      to: "Jusqu'au",
      filterPeriod: "Filtrer par période",
      clear: "Effacer",
      checkAll: "Tout cocher",
      emptyValue: "(vide)",
      empty: "Aucun résultat.",
      headerTitle: (l) => `Trier ou filtrer : ${l}`,
      chipContains: (v) => `contient « ${v} »`,
      chipBetween: (f, t) => `du ${f} au ${t}`,
      chipSince: (f) => `à partir du ${f}`,
      chipUntil: (t) => `jusqu'au ${t}`,
    },
    rt: {
      tab: "Fidélisation",
      unavailable: "Les données d'activité ne sont pas disponibles (fonction admin_user_activity absente de la base).",
      kpiActivation: "Activation à 7 jours",
      kpiActivationHint: (h24) => `${h24} en 24 h`,
      kpiRetW1: "Rétention semaine 1",
      kpiRetW4: "Rétention semaine 4",
      kpiRetHint: "Parmi les activés",
      kpiActive7d: "Actifs sur 7 jours",
      kpiActive7dHint: (pct) => `${pct} % des inscrits`,
      kpiVoucherConv: "Voucher → achat",
      kpiVoucherConvHint: (b, v) => `${b} sur ${v} avec voucher`,
      kpiTimeToBuy: "Délai avant achat",
      kpiTimeToBuyHint: (n) => `Médiane · ${n} acheteur(s)`,
      days: (n) => `${n} j`,
      funnel: "Du compte à l'achat (inscrits de la période)",
      funnelAnswered: "Ont répondu à une question",
      funnelExam: "Ont passé un examen",
      funnelVoucher: "Ont eu un voucher",
      funnelBought: "Ont acheté",
      cohorts: "Cohortes d'inscription par semaine",
      colWeek: "Semaine du",
      colSize: "Inscrits",
      colActivated: "Activés 7 j",
      colRetained: "Rétention S1",
      colExam: "Examen",
      colBought: "Achat",
      nudge: "Vouchers qui expirent sous 7 jours : à convertir",
      nudgeEmpty: "Aucun voucher actif n'expire dans les 7 jours.",
      colVoucherEnd: "Voucher expire",
      colAnswers: "Réponses",
      colLastAnswer: "Dernière réponse",
    },
    dr: {
      period: "Période",
      presets: {
        today: "Aujourd'hui",
        yesterday: "Hier",
        "3d": "3 derniers jours",
        "7d": "7 derniers jours",
        "15d": "15 derniers jours",
        "30d": "30 derniers jours",
        "90d": "90 derniers jours",
        all: "Depuis le début",
      },
      prevMonth: "Mois précédent",
      nextMonth: "Mois suivant",
      pickEnd: "Choisis le dernier jour de la période.",
    },
    st: {
      title: "Tableau de bord",
      subtitle: "Vue d'ensemble, ventes, utilisateurs, examens et alertes, chacun dans son onglet.",
      tabOverview: "Vue d'ensemble",
      tabRetention: "Fidélisation",
      tabSales: "Ventes",
      tabUsers: "Utilisateurs",
      tabExams: "Examens",
      tabAlerts: "Alertes",
      kpiRevenue: "Chiffre d'affaires",
      kpiSales: "Ventes",
      kpiAvgBasket: "Panier moyen",
      kpiActiveAccess: "Accès payants actifs",
      kpiConversion: "Conversion",
      kpiConversionHint: (b, u) => `${b} acheteur(s) sur ${u} inscrits`,
      kpiVouchers: "Vouchers utilisés",
      kpiFees: "Frais Gumroad",
      kpiNet: "Marge nette",
      kpiNetHint: (n) => (n > 0 ? `${n} sans frais connus` : ""),
      kpiNetHintUsd: (n) => (n > 0 ? `${n} sans frais connus` : ""),
      kpiFeesHint: "Prélevés par Gumroad",
      kpiRevenueHintUsd: "",
      donutTotal: "Total",
      other: "Autres",
      currencyLabel: "Devise d'affichage",
      kpiRevenueHint: "Payé par les clients",
      kpiNewBuyers: "Nouveaux acheteurs",
      kpiDormant: "Comptes sans activité",
      dormantSignups: "Comptes créés sans aucune activité",
      colDaysSince: "Jours depuis l'inscription",
      kpiSignupsPeriod: "Inscrits (période)",
      kpiSignupsTotalHint: (n) => `${n} au total`,
      kpiActivePeriod: "Actifs (période)",
      colNet: "Net perçu",
      kpiSignups: "Inscrits",
      kpiSignups7d: "Nouveaux (7 jours)",
      kpiSignups30d: "Nouveaux (30 jours)",
      kpiActive7d: "Actifs (7 jours)",
      kpiActive30d: "Actifs (30 jours)",
      kpiActivation: "Activation",
      kpiActivationHint: (n) => `${n} ont passé un examen`,
      kpiExams: "Examens passés",
      kpiExams7d: "Examens (7 jours)",
      kpiAvgScore: "Score moyen",
      kpiCandidates: "Candidats",
      kpiPerCandidate: "Examens / candidat",
      revenueByWeek: "Chiffre d'affaires",
      signupsByWeek: "Inscriptions",
      examsByWeek: "Examens passés",
      weekOf: (d) => `Semaine du ${d}`,
      funnel: "Parcours des inscrits de la période",
      funnelSignups: "Inscrits",
      funnelExam: "Ont passé un examen",
      funnelBought: "Ont acheté",
      funnelActive: "Accès actif aujourd'hui",
      bySource: "Par source",
      byCertification: "Par certification",
      allSales: "Toutes les ventes",
      latestSignups: "Inscrits de la période",
      scoreDistribution: "Répartition des scores d'examen",
      scoreBuckets: ["Moins de 50 %", "50 – 69 %", "70 – 84 %", "85 % et plus"],
      topMonth: "Meilleurs scores de la période",
      perCertification: "Par certification",
      sessionsCount: (n) => `${n} examen${n > 1 ? "s" : ""}`,
      salesCount: (n) => `${n} vente${n > 1 ? "s" : ""}`,
      colDate: "Date",
      colBuyer: "Acheteur",
      colCertification: "Certification",
      colSource: "Source",
      colAmount: "Montant",
      colStatus: "Statut",
      colExpires: "Expire le",
      colName: "Prénom",
      colEmail: "E-mail",
      colPlan: "Plan",
      colSignedUp: "Inscrit le",
      colSales: "Ventes",
      colExams: "Examens",
      colCandidates: "Candidats",
      colAvgScore: "Score moyen",
      colPoints: "Points",
      colRank: "#",
      statusPaid: "Payé",
      statusRefunded: "Remboursé",
      statusLabel: (s) => (s === "paid" ? "Payé" : s === "refunded" ? "Remboursé" : s),
      noSessionThisMonth: "Aucun examen sur cette période.",
    },
    al: {
      allClear: "Tout est à jour",
      allClearSub: "Aucune alerte pour le moment.",
      groupUrgent: "Urgent",
      groupUrgentSub: "Un client peut être bloqué",
      groupImportant: "À traiter",
      groupImportantSub: "À faire dans les prochains jours",
      groupInfo: "Pour information",
      groupInfoSub: "Des occasions à saisir",
      segment: (l) => `Segment : ${l}`,
      items: {
        gumroad_pending: {
          title: (n) => `${n} vente${n > 1 ? "s" : ""} Gumroad sans compte`,
          detail: "Payées depuis plus de 24 h mais aucun compte avec cet e-mail : l'acheteur n'a pas d'accès.",
          action: "Lier à un compte",
        },
        gumroad_errors: {
          title: (n) => `${n} erreur${n > 1 ? "s" : ""} Gumroad (7 jours)`,
          detail: "Une vente a pu ne pas être enregistrée. Les doublons inoffensifs ne sont pas comptés.",
          action: "Voir le journal",
        },
        expiring_soon: {
          title: (n) => `${n} accès expire${n > 1 ? "nt" : ""} bientôt`,
          detail: "Dans les 14 jours : bon moment pour relancer et proposer un renouvellement.",
          action: "Voir les utilisateurs",
        },
        paid_inactive: {
          title: (n) => `${n} acheteur${n > 1 ? "s" : ""} inactif${n > 1 ? "s" : ""}`,
          detail: "Accès actif, acheté il y a plus de 3 jours, mais aucun examen depuis 7 jours.",
          action: "Voir les utilisateurs",
        },
        recently_expired: {
          title: (n) => `${n} accès expiré${n > 1 ? "s" : ""} récemment`,
          detail: "Expirés depuis moins de 30 jours et non renouvelés.",
          action: "Voir les utilisateurs",
        },
        hot_leads: {
          title: (n) => `${n} inscrit${n > 1 ? "s" : ""} actif${n > 1 ? "s" : ""} sans achat`,
          detail: "Ont passé un examen ces 14 derniers jours sans avoir acheté : acheteurs potentiels.",
          action: "Voir les utilisateurs",
        },
        refunded: {
          title: (n) => `${n} achat${n > 1 ? "s" : ""} remboursé${n > 1 ? "s" : ""}`,
          detail: "Accès retiré après remboursement : à connaître pour comprendre les retours.",
          action: "Voir les utilisateurs",
        },
        dormant_signups: {
          title: (n) => `${n} compte${n > 1 ? "s" : ""} créé${n > 1 ? "s" : ""} sans aucune activité`,
          detail: "Inscrits depuis plus de 3 jours, sans aucune réponse, examen ni accès (payé ou voucher) : à relancer par e-mail.",
          action: "Voir les utilisateurs",
        },
      },
      segments: {
        expiring_soon: "accès qui expirent sous 14 jours",
        paid_inactive: "acheteurs inactifs",
        recently_expired: "accès expirés récemment",
        hot_leads: "inscrits actifs sans achat",
        refunded: "achats remboursés",
        dormant_signups: "comptes sans activité",
        cleanup: "comptes à nettoyer",
      },
    },
    navOverview: "Vue d'ensemble",
    navUsers: "Utilisateurs",
    navSales: "Ventes Gumroad",
    navVouchers: "Vouchers examen",
    navEmails: "E-mails",
    navAudit: "Audit",
    navFeedback: "Feedback",
    navStats: "Tableau de bord",
    adminArea: "Administration",
    greeting: (h, name) => `${h < 5 || h >= 18 ? "Bonsoir" : "Bonjour"}${name ? ` ${name}` : ""}`,
    backToSite: "Retour au site",
    collapseMenu: "Replier le menu",
    switchToDark: "Passer en mode sombre",
    switchToLight: "Passer en mode clair",
    expandMenu: "Déplier le menu",
    logout: "Se déconnecter",
    overviewTitle: "Vue d'ensemble",
    overviewSubtitle: "L'essentiel pour piloter la plateforme : ce qui demande une action, puis les chiffres clés.",
    kpiUsers: "Inscrits",
    kpiActiveAccess: "Accès payants actifs",
    kpiRevenue: "Chiffre d'affaires",
    kpiSales7d: "Ventes (7 jours)",
    kpiSessions7d: "Examens (7 jours)",
    todoTitle: "À traiter",
    todoNothing: "Tout est en ordre : rien à traiter pour le moment.",
    todoPending: (n) =>
      `${n} vente${n > 1 ? "s" : ""} Gumroad sans compte correspondant depuis plus de 24 h`,
    todoErrors: (n) => `${n} erreur${n > 1 ? "s" : ""} Gumroad sur les 7 derniers jours`,
    todoExpiring: (n, d) => `${n} accès payant${n > 1 ? "s" : ""} expire${n > 1 ? "nt" : ""} dans les ${d} jours`,
    todoOpen: "Ouvrir",
    recentSales: "Dernières ventes",
    noSalesYet: "Aucune vente pour le moment.",
    seeAll: "Tout voir",
    seeAllAlerts: "Voir toutes les alertes",
    usersTitle: "Utilisateurs",
    usersSubtitle: "Qui est inscrit, qui a un accès payant, et qui s'entraîne. Lecture seule.",
    usersSearch: "Rechercher par prénom ou e-mail",
    usersCount: (n) => `${n} utilisateur${n > 1 ? "s" : ""}`,
    filterAll: "Tous",
    filterActive: "Accès actif",
    filterExpired: "Accès expiré",
    filterNone: "Sans achat",
    colUser: "Prénom",
    colEmail: "E-mail",
    colPerson: "Utilisateur",
    colAvatar: "Avatar",
    colLastLogin: "Connecté",
    colAccess: "Accès payant",
    colLastActivity: "Dernier examen",
    colSessions: "Examens",
    colAccessEnd: "Fin d'accès",
    colLanguage: "Langue",
    langValue: (l) => (l === "en" ? "Anglais" : l === "fr" ? "Français" : "Inconnue"),
    colOrigin: "Accès via",
    colCertification: "Certification",
    colCode: "Code utilisé",
    originPaid: "Payé",
    originVoucher: "Voucher",
    originBoth: "Payé + voucher",
    noAccess: "Aucun",
    accessUntil: (d) => `jusqu'au ${d}`,
    accessExpiredOn: (d) => `expiré le ${d}`,
    noUserMatch: "Aucun utilisateur ne correspond.",
    writeEmail: "Écrire un e-mail",
    writeToN: (n) => `Écrire à ${n} personne${n > 1 ? "s" : ""}`,
    cleanupButton: (n) => `Comptes à nettoyer (${n})`,
    selectedN: (n) => `${n} sélectionné${n > 1 ? "s" : ""}`,
    deleteAllShown: (n) => `Supprimer ces ${n} compte${n > 1 ? "s" : ""}`,
    deleteN: (n) => `Supprimer ${n} compte${n > 1 ? "s" : ""}`,
    del: {
      title: "Supprimer des comptes",
      checking: "Vérification des comptes…",
      intro: "Vérification faite avant toute suppression : seuls les comptes sans achat et sans accès actif peuvent être supprimés.",
      deletable: (n) => `${n} compte${n > 1 ? "s" : ""} supprimable${n > 1 ? "s" : ""}`,
      protectedTitle: (n) => `${n} compte${n > 1 ? "s" : ""} protégé${n > 1 ? "s" : ""}, non supprimé${n > 1 ? "s" : ""}`,
      reasons: {
        not_found: "Compte introuvable",
        admin: "Compte administrateur",
        paid_purchase: "A un achat (payé ou remboursé)",
        active_access: "Accès encore actif",
      },
      detail: (a, e, v) => `${a} réponse${a > 1 ? "s" : ""}, ${e} examen${e > 1 ? "s" : ""}${v ? ", a utilisé un voucher" : ""}`,
      warning:
        "Sont supprimés définitivement : le compte, ses réponses, ses examens et son accès voucher. Les scores de classement disparaissent avec lui. Impossible à annuler.",
      confirmWord: "SUPPRIMER",
      typeToConfirm: (w) => `Pour confirmer, tape ${w}`,
      confirmButton: (n) => `Supprimer définitivement ${n} compte${n > 1 ? "s" : ""}`,
      deleting: "Suppression…",
      done: (n) => `${n} compte${n > 1 ? "s" : ""} supprimé${n > 1 ? "s" : ""}.`,
      failed: (n) => `${n} suppression${n > 1 ? "s ont" : " a"} échoué.`,
      nothing: "Aucun des comptes choisis ne peut être supprimé.",
      close: "Fermer",
      cancel: "Annuler",
    },
    purchasesHeading: "Achats et accès",
    examsHeading: "Derniers examens",
    noPurchases: "Aucun achat.",
    noExams: "Aucun examen passé.",
    sourceLabel: (s) => (s === "voucher" ? "Voucher" : s === "stripe" ? "Stripe" : s === "gumroad" ? "Gumroad" : s),
    pdfIncluded: "PDF inclus",
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
    vouchersAccessDays: "Durée d'accès",
    vouchersDays: (n) => `${n} jours`,
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
    gumroadDuplicateNote:
      "Vente déjà enregistrée : doublon ignoré, l'acheteur a déjà son accès. Rien à faire.",
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
    dt: {
      search: "Search…",
      count: (shown, total) => `${shown} / ${total}`,
      range: (f, t, total) => `${f}-${t} of ${total}`,
      clearAll: "Clear all",
      removeFilter: (l) => `Remove ${l} filter`,
      sortAZ: "Sort A → Z",
      sortZA: "Sort Z → A",
      sortAsc: "Ascending ↑",
      sortDesc: "Descending ↓",
      oldest: "Oldest ↑",
      newest: "Newest ↓",
      showOnly: "Show only",
      searchColumn: "Search in this column",
      contains: "Contains…",
      from: "From",
      to: "Until",
      filterPeriod: "Filter by period",
      clear: "Clear",
      checkAll: "Check all",
      emptyValue: "(empty)",
      empty: "No results.",
      headerTitle: (l) => `Sort or filter: ${l}`,
      chipContains: (v) => `contains "${v}"`,
      chipBetween: (f, t) => `${f} to ${t}`,
      chipSince: (f) => `from ${f}`,
      chipUntil: (t) => `until ${t}`,
    },
    rt: {
      tab: "Retention",
      unavailable: "Activity data is unavailable (admin_user_activity function missing from the database).",
      kpiActivation: "7-day activation",
      kpiActivationHint: (h24) => `${h24} within 24 h`,
      kpiRetW1: "Week-1 retention",
      kpiRetW4: "Week-4 retention",
      kpiRetHint: "Of activated users",
      kpiActive7d: "Active over 7 days",
      kpiActive7dHint: (pct) => `${pct}% of sign-ups`,
      kpiVoucherConv: "Voucher → purchase",
      kpiVoucherConvHint: (b, v) => `${b} of ${v} with voucher`,
      kpiTimeToBuy: "Time to purchase",
      kpiTimeToBuyHint: (n) => `Median · ${n} buyer(s)`,
      days: (n) => `${n} d`,
      funnel: "From account to purchase (period's sign-ups)",
      funnelAnswered: "Answered a question",
      funnelExam: "Took an exam",
      funnelVoucher: "Had a voucher",
      funnelBought: "Bought",
      cohorts: "Weekly sign-up cohorts",
      colWeek: "Week of",
      colSize: "Sign-ups",
      colActivated: "Activated 7d",
      colRetained: "Retention W1",
      colExam: "Exam",
      colBought: "Purchase",
      nudge: "Vouchers expiring within 7 days: to convert",
      nudgeEmpty: "No active voucher expires within 7 days.",
      colVoucherEnd: "Voucher expires",
      colAnswers: "Answers",
      colLastAnswer: "Last answer",
    },
    dr: {
      period: "Period",
      presets: {
        today: "Today",
        yesterday: "Yesterday",
        "3d": "Last 3 days",
        "7d": "Last 7 days",
        "15d": "Last 15 days",
        "30d": "Last 30 days",
        "90d": "Last 90 days",
        all: "All time",
      },
      prevMonth: "Previous month",
      nextMonth: "Next month",
      pickEnd: "Pick the last day of the period.",
    },
    st: {
      title: "Dashboard",
      subtitle: "Overview, sales, users, exams and alerts, each in its own tab.",
      tabOverview: "Overview",
      tabRetention: "Retention",
      tabSales: "Sales",
      tabUsers: "Users",
      tabExams: "Exams",
      tabAlerts: "Alerts",
      kpiRevenue: "Revenue",
      kpiSales: "Sales",
      kpiAvgBasket: "Average basket",
      kpiActiveAccess: "Active paid access",
      kpiConversion: "Conversion",
      kpiConversionHint: (b, u) => `${b} buyer(s) out of ${u} sign-ups`,
      kpiVouchers: "Vouchers used",
      kpiFees: "Gumroad fees",
      kpiNet: "Net margin",
      kpiNetHint: (n) => (n > 0 ? `${n} with unknown fees` : ""),
      kpiNetHintUsd: (n) => (n > 0 ? `${n} with unknown fees` : ""),
      kpiFeesHint: "Taken by Gumroad",
      kpiRevenueHintUsd: "",
      donutTotal: "Total",
      other: "Other",
      currencyLabel: "Display currency",
      kpiRevenueHint: "Paid by customers",
      kpiNewBuyers: "New buyers",
      kpiDormant: "Accounts with no activity",
      dormantSignups: "Accounts created with no activity at all",
      colDaysSince: "Days since sign-up",
      kpiSignupsPeriod: "Sign-ups (period)",
      kpiSignupsTotalHint: (n) => `${n} in total`,
      kpiActivePeriod: "Active (period)",
      colNet: "Net received",
      kpiSignups: "Sign-ups",
      kpiSignups7d: "New (7 days)",
      kpiSignups30d: "New (30 days)",
      kpiActive7d: "Active (7 days)",
      kpiActive30d: "Active (30 days)",
      kpiActivation: "Activation",
      kpiActivationHint: (n) => `${n} took an exam`,
      kpiExams: "Exams taken",
      kpiExams7d: "Exams (7 days)",
      kpiAvgScore: "Average score",
      kpiCandidates: "Candidates",
      kpiPerCandidate: "Exams / candidate",
      revenueByWeek: "Revenue",
      signupsByWeek: "Sign-ups",
      examsByWeek: "Exams taken",
      weekOf: (d) => `Week of ${d}`,
      funnel: "Journey of the period's sign-ups",
      funnelSignups: "Signed up",
      funnelExam: "Took an exam",
      funnelBought: "Bought",
      funnelActive: "Active access today",
      bySource: "By source",
      byCertification: "By certification",
      allSales: "All sales",
      latestSignups: "Sign-ups in the period",
      scoreDistribution: "Exam score distribution",
      scoreBuckets: ["Under 50%", "50 – 69%", "70 – 84%", "85% and above"],
      topMonth: "Top scores in the period",
      perCertification: "By certification",
      sessionsCount: (n) => `${n} exam${n > 1 ? "s" : ""}`,
      salesCount: (n) => `${n} sale${n > 1 ? "s" : ""}`,
      colDate: "Date",
      colBuyer: "Buyer",
      colCertification: "Certification",
      colSource: "Source",
      colAmount: "Amount",
      colStatus: "Status",
      colExpires: "Expires",
      colName: "First name",
      colEmail: "Email",
      colPlan: "Plan",
      colSignedUp: "Signed up",
      colSales: "Sales",
      colExams: "Exams",
      colCandidates: "Candidates",
      colAvgScore: "Avg score",
      colPoints: "Points",
      colRank: "#",
      statusPaid: "Paid",
      statusRefunded: "Refunded",
      statusLabel: (s) => (s === "paid" ? "Paid" : s === "refunded" ? "Refunded" : s),
      noSessionThisMonth: "No exam in this period.",
    },
    al: {
      allClear: "All up to date",
      allClearSub: "No alerts right now.",
      groupUrgent: "Urgent",
      groupUrgentSub: "A customer may be blocked",
      groupImportant: "To handle",
      groupImportantSub: "To do in the next few days",
      groupInfo: "For information",
      groupInfoSub: "Opportunities to seize",
      segment: (l) => `Segment: ${l}`,
      items: {
        gumroad_pending: {
          title: (n) => `${n} Gumroad sale${n > 1 ? "s" : ""} without an account`,
          detail: "Paid over 24h ago but no account has this email: the buyer has no access.",
          action: "Link to an account",
        },
        gumroad_errors: {
          title: (n) => `${n} Gumroad error${n > 1 ? "s" : ""} (7 days)`,
          detail: "A sale may not have been recorded. Harmless duplicates are not counted.",
          action: "View the log",
        },
        expiring_soon: {
          title: (n) => `${n} access${n > 1 ? "es" : ""} expiring soon`,
          detail: "Within 14 days: a good moment to follow up and offer a renewal.",
          action: "View users",
        },
        paid_inactive: {
          title: (n) => `${n} inactive buyer${n > 1 ? "s" : ""}`,
          detail: "Active access, bought over 3 days ago, but no exam in the last 7 days.",
          action: "View users",
        },
        recently_expired: {
          title: (n) => `${n} access${n > 1 ? "es" : ""} recently expired`,
          detail: "Expired less than 30 days ago and not renewed.",
          action: "View users",
        },
        hot_leads: {
          title: (n) => `${n} active sign-up${n > 1 ? "s" : ""} without a purchase`,
          detail: "Took an exam in the last 14 days without buying: potential customers.",
          action: "View users",
        },
        refunded: {
          title: (n) => `${n} refunded purchase${n > 1 ? "s" : ""}`,
          detail: "Access removed after a refund: worth knowing to understand returns.",
          action: "View users",
        },
        dormant_signups: {
          title: (n) => `${n} account${n > 1 ? "s" : ""} created with no activity`,
          detail: "Signed up over 3 days ago, no answer, no exam and no access (paid or voucher): worth an email nudge.",
          action: "View users",
        },
      },
      segments: {
        expiring_soon: "access expiring within 14 days",
        paid_inactive: "inactive buyers",
        recently_expired: "recently expired access",
        hot_leads: "active sign-ups without a purchase",
        refunded: "refunded purchases",
        dormant_signups: "accounts with no activity",
        cleanup: "accounts to clean up",
      },
    },
    navOverview: "Overview",
    navUsers: "Users",
    navSales: "Gumroad sales",
    navVouchers: "Exam vouchers",
    navEmails: "E-mails",
    navAudit: "Audit",
    navFeedback: "Feedback",
    navStats: "Dashboard",
    adminArea: "Administration",
    greeting: (h, name) => `${h < 5 || h >= 18 ? "Good evening" : h < 12 ? "Good morning" : "Good afternoon"}${name ? ` ${name}` : ""}`,
    backToSite: "Back to site",
    collapseMenu: "Collapse menu",
    switchToDark: "Switch to dark mode",
    switchToLight: "Switch to light mode",
    expandMenu: "Expand menu",
    logout: "Log out",
    overviewTitle: "Overview",
    overviewSubtitle: "What you need to run the platform: what needs action, then the key numbers.",
    kpiUsers: "Sign-ups",
    kpiActiveAccess: "Active paid access",
    kpiRevenue: "Revenue",
    kpiSales7d: "Sales (7 days)",
    kpiSessions7d: "Exams (7 days)",
    todoTitle: "To do",
    todoNothing: "All clear: nothing to handle right now.",
    todoPending: (n) => `${n} Gumroad sale${n > 1 ? "s" : ""} with no matching account for over 24h`,
    todoErrors: (n) => `${n} Gumroad error${n > 1 ? "s" : ""} in the last 7 days`,
    todoExpiring: (n, d) => `${n} paid access${n > 1 ? "es" : ""} expiring within ${d} days`,
    todoOpen: "Open",
    recentSales: "Latest sales",
    noSalesYet: "No sales yet.",
    seeAll: "See all",
    seeAllAlerts: "See all alerts",
    usersTitle: "Users",
    usersSubtitle: "Who signed up, who has paid access, and who is practising. Read-only.",
    usersSearch: "Search by first name or email",
    usersCount: (n) => `${n} user${n > 1 ? "s" : ""}`,
    filterAll: "All",
    filterActive: "Active access",
    filterExpired: "Expired access",
    filterNone: "No purchase",
    colUser: "First name",
    colEmail: "E-mail",
    colPerson: "User",
    colAvatar: "Avatar",
    colLastLogin: "Signed in",
    colAccess: "Paid access",
    colLastActivity: "Last exam",
    colSessions: "Exams",
    colAccessEnd: "Access ends",
    colLanguage: "Language",
    langValue: (l) => (l === "en" ? "English" : l === "fr" ? "French" : "Unknown"),
    colOrigin: "Access via",
    colCertification: "Certification",
    colCode: "Code used",
    originPaid: "Paid",
    originVoucher: "Voucher",
    originBoth: "Paid + voucher",
    noAccess: "None",
    accessUntil: (d) => `until ${d}`,
    accessExpiredOn: (d) => `expired on ${d}`,
    noUserMatch: "No matching user.",
    writeEmail: "Write an e-mail",
    writeToN: (n) => `Write to ${n} ${n > 1 ? "people" : "person"}`,
    cleanupButton: (n) => `Accounts to clean up (${n})`,
    selectedN: (n) => `${n} selected`,
    deleteAllShown: (n) => `Delete these ${n} account${n > 1 ? "s" : ""}`,
    deleteN: (n) => `Delete ${n} account${n > 1 ? "s" : ""}`,
    del: {
      title: "Delete accounts",
      checking: "Checking the accounts…",
      intro: "Checked before anything is deleted: only accounts with no purchase and no active access can be deleted.",
      deletable: (n) => `${n} account${n > 1 ? "s" : ""} can be deleted`,
      protectedTitle: (n) => `${n} protected account${n > 1 ? "s" : ""}, not deleted`,
      reasons: {
        not_found: "Account not found",
        admin: "Administrator account",
        paid_purchase: "Has a purchase (paid or refunded)",
        active_access: "Access still active",
      },
      detail: (a, e, v) => `${a} answer${a > 1 ? "s" : ""}, ${e} exam${e > 1 ? "s" : ""}${v ? ", used a voucher" : ""}`,
      warning:
        "Permanently deleted: the account, its answers, its exams and its voucher access. Leaderboard scores disappear with it. This cannot be undone.",
      confirmWord: "DELETE",
      typeToConfirm: (w) => `To confirm, type ${w}`,
      confirmButton: (n) => `Permanently delete ${n} account${n > 1 ? "s" : ""}`,
      deleting: "Deleting…",
      done: (n) => `${n} account${n > 1 ? "s" : ""} deleted.`,
      failed: (n) => `${n} deletion${n > 1 ? "s" : ""} failed.`,
      nothing: "None of the chosen accounts can be deleted.",
      close: "Close",
      cancel: "Cancel",
    },
    purchasesHeading: "Purchases and access",
    examsHeading: "Latest exams",
    noPurchases: "No purchases.",
    noExams: "No exams taken.",
    sourceLabel: (s) => (s === "voucher" ? "Voucher" : s === "stripe" ? "Stripe" : s === "gumroad" ? "Gumroad" : s),
    pdfIncluded: "PDF included",
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
    vouchersAccessDays: "Access length",
    vouchersDays: (n) => `${n} days`,
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
    gumroadDuplicateNote:
      "Sale already recorded: duplicate ignored, the buyer already has access. Nothing to do.",
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
