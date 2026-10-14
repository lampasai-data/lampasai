import type { Lang } from "../i18n";

// Copy for the admin "Feedback" page (messages sent from the site).
export interface FeedbackAdminStrings {
  title: string;
  intro: string;
  viewOpen: string;
  viewDone: string;
  colDate: string;
  colUser: string;
  colType: string;
  colRating: string;
  colMessage: string;
  colPage: string;
  kinds: Record<string, string>;
  markDone: string;
  reopen: string;
  reply: string;
  emptyOpen: string;
  emptyDone: string;
  loading: string;
}

export const FEEDBACK_T: Record<Lang, FeedbackAdminStrings> = {
  fr: {
    title: "Feedback",
    intro: "Les avis, idées, problèmes et demandes d'aide envoyés par les utilisateurs depuis le site.",
    viewOpen: "À traiter",
    viewDone: "Traités",
    colDate: "Reçu",
    colUser: "Utilisateur",
    colType: "Type",
    colRating: "Note",
    colMessage: "Message",
    colPage: "Page",
    kinds: { review: "Avis", idea: "Idée", problem: "Problème", help: "Aide" },
    markDone: "Marquer traité",
    reopen: "Rouvrir",
    reply: "Répondre",
    emptyOpen: "Aucun message à traiter.",
    emptyDone: "Aucun message traité.",
    loading: "Chargement…",
  },
  en: {
    title: "Feedback",
    intro: "Reviews, ideas, problems and help requests sent by users from the site.",
    viewOpen: "To handle",
    viewDone: "Handled",
    colDate: "Received",
    colUser: "User",
    colType: "Type",
    colRating: "Rating",
    colMessage: "Message",
    colPage: "Page",
    kinds: { review: "Review", idea: "Idea", problem: "Problem", help: "Help" },
    markDone: "Mark handled",
    reopen: "Reopen",
    reply: "Reply",
    emptyOpen: "No message to handle.",
    emptyDone: "No message handled yet.",
    loading: "Loading…",
  },
};
