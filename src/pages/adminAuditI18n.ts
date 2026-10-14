import type { Lang } from "../i18n";

const frSignal = (n: number) => (n > 1 ? "signaux" : "signal");

// Copy for the admin "Audit" area: the action journal and the security
// check. Kept apart from adminI18n.ts, like the e-mails one.

export const SIGNAL_TYPES = [
  "rls_off",
  "access_without_payment",
  "gumroad_unverified",
  "signup_burst",
  "voucher_burst",
  "exam_score_rejected",
  "config_changed",
] as const;
export type SignalType = (typeof SIGNAL_TYPES)[number];
export type Severity = "alert" | "to_check" | "to_watch";
export type Tone = "danger" | "amber" | "muted";

// Names the journal cannot know by itself, looked up by the page.
export interface DescribeContext {
  segment: string | null;
  certification: string | null;
  account: string | null;
  category: string | null;
  locale: string;
}

export interface SignalCopy {
  title: string;
  // What it means, then what to do, in order.
  meaning: string;
  steps: string[];
  cause: { code: string; reason: string; tone: Tone };
}

export interface AuditStrings {
  title: string;
  subtitle: string;
  tabs: { security: string; journal: string };
  loading: string;
  journal: {
    intro: string;
    colDate: string;
    colBy: string;
    colAction: string;
    colTarget: string;
    colDetail: string;
    empty: string;
    system: string;
    actions: Record<string, string>;
    targets: Record<string, string>;
    // One readable line for the detail column.
    describe: (action: string, d: Record<string, unknown>, ctx: DescribeContext) => string;
  };
  security: {
    intro: string;
    viewOpen: string;
    viewHistory: string;
    viewArchived: string;
    selectedN: (n: number) => string;
    handleN: (n: number) => string;
    archiveN: (n: number) => string;
    restoreN: (n: number) => string;
    deleteN: (n: number) => string;
    clearSelection: string;
    emptyArchived: string;
    bulkHandleTitle: string;
    bulkHandleBody: (n: number) => string;
    bulkNotePlaceholder: string;
    bulkConfirm: string;
    bulkCancel: string;
    bulkWorking: string;
    deleteTitle: string;
    deleteBody: (n: number) => string;
    deleteWarning: string;
    bulkFailed: string;
    archivedNotice: (n: number) => string;
    restoredNotice: (n: number) => string;
    deletedNotice: (n: number) => string;
    handledNotice: (n: number) => string;
    kpiAlert: string;
    kpiCheck: string;
    kpiWatch: string;
    severity: Record<Severity, string>;
    colLevel: string;
    colDetected: string;
    colSignal: string;
    colCause: string;
    colHandled: string;
    colNote: string;
    handle: string;
    view: string;
    emptyOpen: string;
    emptyHistory: string;
    handledBy: (email: string) => string;
    autoClosed: string;
    autoClosedNote: string;
    noNote: string;
    lastScan: (when: string) => string;
    neverScanned: string;
    scanStale: string;
    runScan: string;
    scanning: string;
    scanResult: (opened: number, closed: number) => string;
    modal: {
      detected: (when: string) => string;
      happened: string;
      means: string;
      todo: string;
      technical: string;
      added: string;
      removed: string;
      noteLabel: string;
      notePlaceholder: string;
      markHandled: string;
      saving: string;
      close: string;
      handledOn: (when: string, who: string | null) => string;
    };
    signals: Record<SignalType, SignalCopy>;
    summary: (type: string, d: Record<string, unknown>, locale: string) => string;
  };
}

const num = (v: unknown) => Number(v ?? 0);
const when = (v: unknown, locale: string) => (v ? new Date(String(v)).toLocaleString(locale) : "-");

export const AUDIT_T: Record<Lang, AuditStrings> = {
  fr: {
    title: "Audit",
    subtitle: "Ce qui se passe sur la plateforme et ce que fait l'administrateur.",
    tabs: { security: "Sécurité", journal: "Journal des actions" },
    loading: "Chargement…",
    journal: {
      intro: "Toutes les actions d'administration, avec leur auteur. Ce journal ne peut être ni modifié ni effacé.",
      colDate: "Date",
      colBy: "Par",
      colAction: "Action",
      colTarget: "Cible",
      colDetail: "Détail",
      empty: "Aucune action enregistrée pour le moment.",
      system: "Système",
      actions: {
        email_sent: "a envoyé un e-mail",
        email_test_sent: "a envoyé un e-mail de test",
        accounts_deleted: "a supprimé des comptes",
        account_self_deleted: "Un utilisateur a supprimé son propre compte",
        gumroad_sale_linked: "a rattaché une vente Gumroad à un compte",
        gumroad_reconcile: "a lancé le rattrapage Gumroad",
        voucher_created: "a créé un voucher d'examen",
        template_created: "a créé un modèle d'e-mail",
        template_updated: "a modifié un modèle d'e-mail",
        template_trashed: "a mis un modèle à la corbeille",
        template_restored: "a restauré un modèle",
        template_deleted: "a supprimé un modèle pour de bon",
        campaign_trashed: "a mis un e-mail envoyé à la corbeille",
        campaign_restored: "a restauré un e-mail envoyé",
        campaign_deleted: "a supprimé un e-mail envoyé pour de bon",
        security_scan_run: "a relancé le relevé de sécurité",
        security_signal_handled: "a traité un signal de sécurité",
        security_signals_handled: "a traité plusieurs signaux de sécurité",
        security_signals_archived: "a retiré des signaux de sécurité de l'historique",
        security_signals_restored: "a remis des signaux de sécurité dans l'historique",
        security_signals_deleted: "a supprimé des signaux de sécurité",
      },
      targets: {
        email: "E-mail",
        email_template: "Modèle d'e-mail",
        email_campaign: "E-mail envoyé",
        account: "Comptes",
        gumroad_sale: "Vente Gumroad",
        gumroad: "Gumroad",
        voucher: "Voucher",
        security: "Sécurité",
        security_signal: "Signal de sécurité",
      },
      describe: (action, d, c) => {
        switch (action) {
          case "email_sent":
            return `${d.type === "promotion" ? "Promotion" : "Service"} · ${c.segment ?? d.segment} · ${num(d.sent)} envoyé(s) sur ${num(d.recipients)}${num(d.failed) ? `, ${num(d.failed)} échec(s)` : ""}`;
          case "email_test_sent":
            return `Version ${d.language === "en" ? "anglaise" : "française"}, envoyé à toi`;
          case "account_self_deleted":
            return `${num(d.answers)} réponse(s), ${num(d.exams)} examen(s)${d.had_paid_purchase ? ", avait un achat" : ""}`;
          case "accounts_deleted":
            return `${num(d.deleted)} supprimé(s) sur ${num(d.asked)} demandé(s)${num(d.skipped) ? `, ${num(d.skipped)} protégé(s)` : ""}${num(d.failed) ? `, ${num(d.failed)} échec(s)` : ""}`;
          case "gumroad_sale_linked":
            return c.account ? `Rattachée à ${c.account}` : "";
          case "gumroad_reconcile":
            return `${num(d.processed)} vente(s) enregistrée(s), ${num(d.total)} vue(s) chez Gumroad`;
          case "voucher_created":
            return `${c.certification ?? "-"} · ${num(d.max_redemptions)} utilisation(s)${d.expires_at ? ` · expire le ${when(d.expires_at, c.locale)}` : ""}`;
          case "template_created":
          case "template_updated":
            return c.category ?? "";
          case "campaign_deleted":
            return d.recipients ? `${num(d.recipients)} destinataire(s)` : "";
          case "security_scan_run":
            return `${num(d.opened)} nouveau(x) signal(aux), ${num(d.closed)} refermé(s)`;
          case "security_signal_handled":
            return typeof d.severity === "string" ? `Niveau : ${d.severity}` : "";
          case "security_signals_handled":
          case "security_signals_archived":
          case "security_signals_restored":
          case "security_signals_deleted":
            return `${num(d.count)} signal(aux)`;
          default:
            return "";
        }
      },
    },
    security: {
      intro: "Relevé automatique toutes les heures : une alerte veut dire qu'une règle de protection semble contournée.",
      viewOpen: "Ouverts",
      viewHistory: "Historique",
      viewArchived: "Retirés",
      selectedN: (n) => `${n} sélectionné${n > 1 ? "s" : ""}`,
      handleN: (n) => `Traiter ${n}`,
      archiveN: (n) => `Retirer ${n}`,
      restoreN: (n) => `Remettre ${n} dans l'historique`,
      deleteN: (n) => `Supprimer ${n}`,
      clearSelection: "Tout désélectionner",
      emptyArchived: "Aucun signal retiré.",
      bulkHandleTitle: "Traiter les signaux sélectionnés",
      bulkHandleBody: (n) => `Une même note sera enregistrée sur ${n} ${frSignal(n)}.`,
      bulkNotePlaceholder: "Note (3 caractères minimum), par exemple : vérifié, rien d'anormal.",
      bulkConfirm: "Confirmer",
      bulkCancel: "Annuler",
      bulkWorking: "En cours...",
      deleteTitle: "Supprimer définitivement",
      deleteBody: (n) => `${n} ${frSignal(n)} ${n > 1 ? "seront supprimés" : "sera supprimé"} définitivement.`,
      deleteWarning: "Cette action est irréversible. Elle est inscrite dans le journal d'audit (nombre et types de signaux), mais le détail des signaux supprimés ne pourra plus être consulté.",
      bulkFailed: "L'action a échoué. Réessaie dans un instant.",
      archivedNotice: (n) => `${n} ${frSignal(n)} ${n > 1 ? "retirés" : "retiré"} de l'historique.`,
      restoredNotice: (n) => `${n} ${frSignal(n)} ${n > 1 ? "remis" : "remis"} dans l'historique.`,
      deletedNotice: (n) => `${n} ${frSignal(n)} ${n > 1 ? "supprimés" : "supprimé"}.`,
      handledNotice: (n) => `${n} ${frSignal(n)} ${n > 1 ? "traités" : "traité"}.`,
      kpiAlert: "Alertes à traiter",
      kpiCheck: "À vérifier",
      kpiWatch: "À surveiller",
      severity: { alert: "Alerte", to_check: "À vérifier", to_watch: "À surveiller" },
      colLevel: "Niveau",
      colDetected: "Détecté",
      colSignal: "Signal",
      colCause: "Cause",
      colHandled: "Traité",
      colNote: "Note",
      handle: "Traiter",
      view: "Voir",
      emptyOpen: "Aucun signal à traiter. Le dernier relevé n'a rien trouvé d'anormal.",
      emptyHistory: "Aucun signal traité pour le moment.",
      handledBy: (email) => `Par ${email}`,
      autoClosed: "Refermé automatiquement",
      autoClosedNote: "La situation est revenue à la normale",
      noNote: "Aucune note",
      lastScan: (w) => `Dernier relevé : ${w}`,
      neverScanned: "Aucun relevé pour le moment",
      scanStale: "Le relevé horaire ne semble plus tourner.",
      runScan: "Relancer le relevé",
      scanning: "Relevé en cours…",
      scanResult: (o, c) => `Relevé terminé : ${o} nouveau(x) signal(aux), ${c} refermé(s).`,
      modal: {
        detected: (w) => `Détecté le ${w}`,
        happened: "Ce qui s'est passé",
        means: "Ce que ça veut dire",
        todo: "Ce qu'il faut faire",
        technical: "Voir le détail technique",
        added: "Ajouté ou modifié",
        removed: "Retiré ou ancienne valeur",
        noteLabel: "Note de traitement (obligatoire)",
        notePlaceholder: "Ex. migration 045 appliquée, changement attendu.",
        markHandled: "Marquer comme traité",
        saving: "…",
        close: "Fermer",
        handledOn: (w, who) => `Traité le ${w}${who ? ` par ${who}` : ", refermé automatiquement"}`,
      },
      signals: {
        rls_off: {
          title: "Table sans sécurité par ligne",
          meaning:
            "Une table de la base n'a plus de sécurité par ligne (RLS) : toute personne qui connaît la clé publique du site pourrait la lire, voire la modifier.",
          steps: [
            "Si ce n'est pas toi, réactive la protection tout de suite (alter table … enable row level security).",
            "Regarde dans Supabase qui a touché à la base (Logs).",
            "Si c'est une table de test que tu viens de créer, active la sécurité puis traite le signal.",
          ],
          cause: { code: "RLS", reason: "Une protection de la base est coupée", tone: "danger" },
        },
        access_without_payment: {
          title: "Accès payant sans paiement derrière",
          meaning:
            "Un accès marqué payé n'a ni identifiant de vente Gumroad ni identifiant de paiement Stripe : il a peut-être été ajouté à la main dans la base.",
          steps: [
            "Retrouve la personne dans Utilisateurs et compare avec les ventes de ton tableau Gumroad.",
            "Ne retire aucun accès avant d'avoir vérifié : un client a pu vraiment payer.",
            "Si c'est un accès offert volontairement, traite le signal avec une note.",
          ],
          cause: { code: "Règle", reason: "Accès payant sans trace de paiement", tone: "danger" },
        },
        gumroad_unverified: {
          title: "Ping Gumroad non reconnu",
          meaning:
            "Un ping annonçait une vente, mais Gumroad ne la connaît pas quand on l'interroge : quelqu'un envoie peut-être de faux pings. Aucun accès n'a été accordé.",
          steps: [
            "Ouvre Ventes Gumroad et regarde les événements en échec.",
            "Si une vraie vente est concernée, lance le rattrapage pour la récupérer.",
            "Sinon, c'est du bruit sans effet : rien n'est jamais accordé sur un ping non confirmé. Traite le signal.",
          ],
          cause: { code: "Gumroad", reason: "Vente annoncée mais introuvable chez Gumroad", tone: "amber" },
        },
        signup_burst: {
          title: "Rafale d'inscriptions",
          meaning: "Beaucoup de comptes ont été créés en une heure.",
          steps: [
            "Regarde les derniers comptes dans Utilisateurs : adresses e-mail qui se ressemblent ?",
            "Si ce sont de vraies inscriptions (une publication, un événement), traite le signal.",
          ],
          cause: { code: "Inscr.", reason: "Beaucoup de comptes créés en peu de temps", tone: "amber" },
        },
        voucher_burst: {
          title: "Voucher utilisé en rafale",
          meaning: "Un même voucher d'examen a été utilisé de nombreuses fois en une heure : le code a peut-être fuité.",
          steps: [
            "Ouvre Vouchers examen et regarde le nombre d'utilisations restantes.",
            "Si le code circule, il est limité par son nombre d'utilisations : ne génère pas de nouveau code multi-usage sans besoin.",
            "Si c'est une classe ou un groupe voulu, traite le signal.",
          ],
          cause: { code: "Voucher", reason: "Un code utilisé de nombreuses fois d'un coup", tone: "muted" },
        },
        exam_score_rejected: {
          title: "Score d'examen refusé",
          meaning:
            "Un résultat d'examen impossible à obtenir en vrai (trop de points, plus de bonnes réponses que de questions, trop d'examens en une journée) a été envoyé. Il n'a pas été compté au classement.",
          steps: [
            "Retrouve la personne dans Utilisateurs et regarde son activité.",
            "Plusieurs tentatives le même jour : c'est sûrement quelqu'un qui essaie de tricher au classement. Rien n'a été enregistré, traite le signal.",
            "Une seule tentative après une mise à jour du barème : c'est peut-être un ancien onglet resté ouvert. Traite le signal avec une note.",
          ],
          cause: { code: "Examen", reason: "Score impossible envoyé au classement", tone: "amber" },
        },
        config_changed: {
          title: "Configuration modifiée",
          meaning:
            "Des règles d'accès, des fonctions, leurs droits d'exécution ou des tâches planifiées ont changé depuis le relevé précédent. C'est normal après une migration.",
          steps: [
            "Lis la liste : correspond-elle à la migration que tu viens d'appliquer ?",
            "Si oui, traite le signal avec le numéro de la migration.",
            "Si tu n'as rien appliqué, c'est un changement non voulu : traite-le comme une alerte.",
          ],
          cause: { code: "Config", reason: "Règles ou fonctions changées : normal après migration", tone: "muted" },
        },
      },
      summary: (type, d, locale) => {
        switch (type) {
          case "rls_off":
            return `Table « ${d.table} »`;
          case "access_without_payment":
            return `Accès ${d.source} créé le ${when(d.since, locale)}`;
          case "gumroad_unverified":
            return `${num(d.count)} ping(s) non reconnu(s) sur 24 h`;
          case "signup_burst":
            return `${num(d.accounts_1h)} comptes créés en 1 heure`;
          case "voucher_burst":
            return `${num(d.redemptions_1h)} utilisations d'un même voucher en 1 heure`;
          case "exam_score_rejected":
            return `${d.email ?? "?"} · ${d.certification ?? "?"} · ${num(d.points)} pts (max ${num(d.max_points)}) · ${num(d.attempts)} tentative(s)`;
          case "config_changed":
            return `${num(d.nb_added)} ajouté(s) ou modifié(s), ${num(d.nb_removed)} retiré(s)`;
          default:
            return "";
        }
      },
    },
  },
  en: {
    title: "Audit",
    subtitle: "What happens on the platform and what the administrator does.",
    tabs: { security: "Security", journal: "Action journal" },
    loading: "Loading…",
    journal: {
      intro: "Every administration action, with who did it. This journal can be neither edited nor erased.",
      colDate: "Date",
      colBy: "By",
      colAction: "Action",
      colTarget: "Target",
      colDetail: "Detail",
      empty: "No action recorded yet.",
      system: "System",
      actions: {
        email_sent: "sent an e-mail",
        email_test_sent: "sent a test e-mail",
        accounts_deleted: "deleted accounts",
        account_self_deleted: "A user deleted their own account",
        gumroad_sale_linked: "linked a Gumroad sale to an account",
        gumroad_reconcile: "ran the Gumroad catch-up",
        voucher_created: "created an exam voucher",
        template_created: "created an e-mail template",
        template_updated: "edited an e-mail template",
        template_trashed: "moved a template to the trash",
        template_restored: "restored a template",
        template_deleted: "deleted a template for good",
        campaign_trashed: "moved a sent e-mail to the trash",
        campaign_restored: "restored a sent e-mail",
        campaign_deleted: "deleted a sent e-mail for good",
        security_scan_run: "re-ran the security check",
        security_signal_handled: "handled a security signal",
        security_signals_handled: "handled several security signals",
        security_signals_archived: "removed security signals from the history",
        security_signals_restored: "put security signals back in the history",
        security_signals_deleted: "deleted security signals",
      },
      targets: {
        email: "E-mail",
        email_template: "E-mail template",
        email_campaign: "Sent e-mail",
        account: "Accounts",
        gumroad_sale: "Gumroad sale",
        gumroad: "Gumroad",
        voucher: "Voucher",
        security: "Security",
        security_signal: "Security signal",
      },
      describe: (action, d, c) => {
        switch (action) {
          case "email_sent":
            return `${d.type === "promotion" ? "Promotion" : "Service"} · ${c.segment ?? d.segment} · ${num(d.sent)} sent out of ${num(d.recipients)}${num(d.failed) ? `, ${num(d.failed)} failed` : ""}`;
          case "email_test_sent":
            return `${d.language === "en" ? "English" : "French"} version, sent to you`;
          case "account_self_deleted":
            return `${num(d.answers)} answer(s), ${num(d.exams)} exam(s)${d.had_paid_purchase ? ", had a purchase" : ""}`;
          case "accounts_deleted":
            return `${num(d.deleted)} deleted out of ${num(d.asked)} asked${num(d.skipped) ? `, ${num(d.skipped)} protected` : ""}${num(d.failed) ? `, ${num(d.failed)} failed` : ""}`;
          case "gumroad_sale_linked":
            return c.account ? `Linked to ${c.account}` : "";
          case "gumroad_reconcile":
            return `${num(d.processed)} sale(s) recorded, ${num(d.total)} seen at Gumroad`;
          case "voucher_created":
            return `${c.certification ?? "-"} · ${num(d.max_redemptions)} use(s)${d.expires_at ? ` · expires ${when(d.expires_at, c.locale)}` : ""}`;
          case "template_created":
          case "template_updated":
            return c.category ?? "";
          case "campaign_deleted":
            return d.recipients ? `${num(d.recipients)} recipient(s)` : "";
          case "security_scan_run":
            return `${num(d.opened)} new signal(s), ${num(d.closed)} closed`;
          case "security_signal_handled":
            return typeof d.severity === "string" ? `Level: ${d.severity}` : "";
          case "security_signals_handled":
          case "security_signals_archived":
          case "security_signals_restored":
          case "security_signals_deleted":
            return `${num(d.count)} signal(s)`;
          default:
            return "";
        }
      },
    },
    security: {
      intro: "Automatic check every hour: an alert means a protection rule seems to have been bypassed.",
      viewOpen: "Open",
      viewHistory: "History",
      viewArchived: "Removed",
      selectedN: (n) => `${n} selected`,
      handleN: (n) => `Handle ${n}`,
      archiveN: (n) => `Remove ${n}`,
      restoreN: (n) => `Put ${n} back in history`,
      deleteN: (n) => `Delete ${n}`,
      clearSelection: "Clear selection",
      emptyArchived: "No removed signal.",
      bulkHandleTitle: "Handle the selected signals",
      bulkHandleBody: (n) => `The same note will be saved on ${n} signal${n > 1 ? "s" : ""}.`,
      bulkNotePlaceholder: "Note (3 characters minimum), for example: checked, nothing unusual.",
      bulkConfirm: "Confirm",
      bulkCancel: "Cancel",
      bulkWorking: "Working...",
      deleteTitle: "Delete for good",
      deleteBody: (n) => `${n} signal${n > 1 ? "s" : ""} will be permanently deleted.`,
      deleteWarning: "This cannot be undone. It is recorded in the audit log (count and signal types), but the deleted signals can no longer be consulted.",
      bulkFailed: "The action failed. Try again in a moment.",
      archivedNotice: (n) => `${n} signal${n > 1 ? "s" : ""} removed from history.`,
      restoredNotice: (n) => `${n} signal${n > 1 ? "s" : ""} put back in history.`,
      deletedNotice: (n) => `${n} signal${n > 1 ? "s" : ""} deleted.`,
      handledNotice: (n) => `${n} signal${n > 1 ? "s" : ""} handled.`,
      kpiAlert: "Alerts to handle",
      kpiCheck: "To check",
      kpiWatch: "To watch",
      severity: { alert: "Alert", to_check: "To check", to_watch: "To watch" },
      colLevel: "Level",
      colDetected: "Detected",
      colSignal: "Signal",
      colCause: "Cause",
      colHandled: "Handled",
      colNote: "Note",
      handle: "Handle",
      view: "View",
      emptyOpen: "No signal to handle. The last check found nothing unusual.",
      emptyHistory: "No signal handled yet.",
      handledBy: (email) => `By ${email}`,
      autoClosed: "Closed automatically",
      autoClosedNote: "The situation went back to normal",
      noNote: "No note",
      lastScan: (w) => `Last check: ${w}`,
      neverScanned: "No check yet",
      scanStale: "The hourly check no longer seems to run.",
      runScan: "Run the check now",
      scanning: "Checking…",
      scanResult: (o, c) => `Check done: ${o} new signal(s), ${c} closed.`,
      modal: {
        detected: (w) => `Detected on ${w}`,
        happened: "What happened",
        means: "What it means",
        todo: "What to do",
        technical: "See the technical detail",
        added: "Added or changed",
        removed: "Removed or previous value",
        noteLabel: "Handling note (required)",
        notePlaceholder: "E.g. migration 045 applied, expected change.",
        markHandled: "Mark as handled",
        saving: "…",
        close: "Close",
        handledOn: (w, who) => `Handled on ${w}${who ? ` by ${who}` : ", closed automatically"}`,
      },
      signals: {
        rls_off: {
          title: "Table without row-level security",
          meaning:
            "A table of the database has no row-level security (RLS): anyone who knows the site's public key could read it, or even change it.",
          steps: [
            "If it was not you, turn the protection back on right away (alter table … enable row level security).",
            "Check in Supabase who touched the database (Logs).",
            "If it is a test table you just created, enable security, then handle the signal.",
          ],
          cause: { code: "RLS", reason: "A database protection is off", tone: "danger" },
        },
        access_without_payment: {
          title: "Paid access with no payment behind it",
          meaning:
            "An access marked as paid has neither a Gumroad sale id nor a Stripe payment id: it may have been added by hand in the database.",
          steps: [
            "Find the person in Users and compare with the sales in your Gumroad dashboard.",
            "Do not remove any access before checking: a customer may really have paid.",
            "If it is an access you gave on purpose, handle the signal with a note.",
          ],
          cause: { code: "Rule", reason: "Paid access with no trace of payment", tone: "danger" },
        },
        gumroad_unverified: {
          title: "Unrecognised Gumroad ping",
          meaning:
            "A ping announced a sale, but Gumroad does not know it when asked: someone may be sending fake pings. No access was granted.",
          steps: [
            "Open Gumroad sales and look at the failed events.",
            "If a real sale is involved, run the catch-up to fetch it.",
            "Otherwise it is harmless noise: nothing is ever granted on an unconfirmed ping. Handle the signal.",
          ],
          cause: { code: "Gumroad", reason: "Sale announced but unknown to Gumroad", tone: "amber" },
        },
        signup_burst: {
          title: "Burst of sign-ups",
          meaning: "Many accounts were created within one hour.",
          steps: [
            "Look at the latest accounts in Users: similar e-mail addresses?",
            "If they are real sign-ups (a post, an event), handle the signal.",
          ],
          cause: { code: "Sign-up", reason: "Many accounts created in a short time", tone: "amber" },
        },
        voucher_burst: {
          title: "Voucher used in a burst",
          meaning: "The same exam voucher was used many times within an hour: the code may have leaked.",
          steps: [
            "Open Exam vouchers and check how many uses are left.",
            "If the code is circulating, its number of uses is capped: do not generate a new multi-use code without need.",
            "If it is a class or group you meant to give it to, handle the signal.",
          ],
          cause: { code: "Voucher", reason: "One code used many times at once", tone: "muted" },
        },
        exam_score_rejected: {
          title: "Exam score rejected",
          meaning:
            "An exam result no real run can produce (too many points, more right answers than questions, too many exams in one day) was sent. It was not counted on the leaderboard.",
          steps: [
            "Find the person in Users and look at their activity.",
            "Several attempts on the same day: most likely someone trying to cheat the leaderboard. Nothing was recorded, handle the signal.",
            "A single attempt right after a scoring change: maybe an old tab left open. Handle the signal with a note.",
          ],
          cause: { code: "Exam", reason: "Impossible score sent to the leaderboard", tone: "amber" },
        },
        config_changed: {
          title: "Configuration changed",
          meaning:
            "Access rules, functions, who may run them, or scheduled jobs changed since the previous check. This is normal after a migration.",
          steps: [
            "Read the list: does it match the migration you just applied?",
            "If so, handle the signal with the migration number.",
            "If you applied nothing, it is an unwanted change: treat it like an alert.",
          ],
          cause: { code: "Config", reason: "Rules or functions changed: normal after a migration", tone: "muted" },
        },
      },
      summary: (type, d, locale) => {
        switch (type) {
          case "rls_off":
            return `Table "${d.table}"`;
          case "access_without_payment":
            return `${d.source} access created on ${when(d.since, locale)}`;
          case "gumroad_unverified":
            return `${num(d.count)} unrecognised ping(s) in 24 h`;
          case "signup_burst":
            return `${num(d.accounts_1h)} accounts created in 1 hour`;
          case "voucher_burst":
            return `${num(d.redemptions_1h)} uses of the same voucher in 1 hour`;
          case "exam_score_rejected":
            return `${d.email ?? "?"} · ${d.certification ?? "?"} · ${num(d.points)} pts (max ${num(d.max_points)}) · ${num(d.attempts)} attempt(s)`;
          case "config_changed":
            return `${num(d.nb_added)} added or changed, ${num(d.nb_removed)} removed`;
          default:
            return "";
        }
      },
    },
  },
};
