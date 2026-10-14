import { useState } from "react";
import { useLanguage } from "../i18n";
import { supabase } from "../lib/supabase";

// Landing page of the "Stop receiving our offers" link in promotional
// e-mails. It asks for one click instead of unsubscribing on load, so mailbox
// link scanners that pre-open links cannot unsubscribe anyone by accident.
const COPY = {
  fr: {
    title: "Ne plus recevoir nos offres",
    lead: "Confirme que tu ne veux plus recevoir les e-mails promotionnels de Lampas .ai. Les e-mails liés à ton compte (confirmation, rappels d'accès) continueront de t'être envoyés.",
    button: "Me désinscrire",
    working: "Désinscription…",
    done: "C'est fait : tu ne recevras plus nos offres.",
    invalid: "Ce lien de désinscription est invalide ou incomplet.",
    failed: "La désinscription n'a pas pu être enregistrée. Réessaie plus tard.",
  },
  en: {
    title: "Stop receiving our offers",
    lead: "Confirm that you no longer want promotional e-mails from Lampas .ai. E-mails tied to your account (confirmation, access reminders) will still reach you.",
    button: "Unsubscribe me",
    working: "Unsubscribing…",
    done: "Done: you will no longer receive our offers.",
    invalid: "This unsubscribe link is invalid or incomplete.",
    failed: "Your unsubscription could not be saved. Please try again later.",
  },
} as const;

export default function Unsubscribe() {
  const { lang } = useLanguage();
  const c = COPY[lang];
  const params = new URLSearchParams(window.location.search);
  const u = params.get("u") ?? "";
  const t = params.get("t") ?? "";
  const [status, setStatus] = useState<"idle" | "working" | "done" | "failed">("idle");

  async function confirm() {
    if (!supabase) return;
    setStatus("working");
    const { data, error } = await supabase.functions.invoke("email-unsubscribe", { body: { u, t } });
    setStatus(error || !data?.ok ? "failed" : "done");
  }

  return (
    <section className="mx-auto max-w-md px-6 py-24 text-center">
      <div className="rounded-2xl border border-black/8 bg-white p-8 shadow-sm">
        <h1 className="font-display text-xl font-semibold text-ink">{c.title}</h1>
        {!u || !t ? (
          <p className="mt-4 text-sm text-muted">{c.invalid}</p>
        ) : status === "done" ? (
          <p className="mt-4 text-sm text-ink">{c.done}</p>
        ) : (
          <>
            <p className="mt-4 text-sm text-muted">{c.lead}</p>
            {status === "failed" && <p className="mt-3 text-sm text-red-600">{c.failed}</p>}
            <button
              type="button"
              onClick={confirm}
              disabled={status === "working"}
              className="brand-gradient mt-6 rounded-full px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {status === "working" ? c.working : c.button}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
