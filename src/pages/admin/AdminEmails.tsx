import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../../i18n";
import { supabase } from "../../lib/supabase";
import { EMAIL_T } from "../adminEmailsI18n";
import AppTab from "./emails/AppTab";
import SentTab from "./emails/SentTab";
import TemplatesTab from "./emails/TemplatesTab";
import TrashTab from "./emails/TrashTab";
import UnsubTab from "./emails/UnsubTab";
import type { EmailCampaign, EmailsApi, EmailTemplate } from "./emails/types";
import { IconTrash } from "./AdminIcons";

const TABS = ["sent", "templates", "app", "unsubscribed", "trash"] as const;
type Tab = (typeof TABS)[number];

export default function AdminEmails() {
  const { lang } = useLanguage();
  const t = EMAIL_T[lang];
  const [params, setParams] = useSearchParams();
  const requested = params.get("tab");
  const tab: Tab = TABS.includes(requested as Tab) ? (requested as Tab) : "sent";

  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState<Omit<EmailsApi, "reload">>({
    templates: [],
    campaigns: [],
    trashedTemplates: [],
    trashedCampaigns: [],
    unsubscribed: [],
    error: null,
  });

  const reload = useCallback(async () => {
    if (!supabase) return;
    const [tpl, camp, unsub] = await Promise.all([
      supabase.from("admin_email_templates").select("*").order("updated_at", { ascending: false }),
      supabase.from("admin_email_campaigns").select("*").order("created_at", { ascending: false }),
      supabase.from("email_unsubscribes").select("user_id, created_at"),
    ]);
    const templates = (tpl.data as EmailTemplate[]) ?? [];
    const campaigns = (camp.data as EmailCampaign[]) ?? [];
    setState({
      templates: templates.filter((x) => !x.trashed_at),
      trashedTemplates: templates.filter((x) => x.trashed_at),
      campaigns: campaigns.filter((x) => !x.trashed_at),
      trashedCampaigns: campaigns.filter((x) => x.trashed_at),
      unsubscribed: (unsub.data as { user_id: string; created_at: string }[]) ?? [],
      error: tpl.error?.message ?? camp.error?.message ?? unsub.error?.message ?? null,
    });
    setLoaded(true);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const api: EmailsApi = { ...state, reload };
  const trashCount = state.trashedTemplates.length + state.trashedCampaigns.length;
  const labels: Record<Tab, string> = {
    sent: t.tabs.sent,
    templates: `${t.tabs.templates}${state.templates.length ? ` (${state.templates.length})` : ""}`,
    app: t.tabs.app,
    unsubscribed: `${t.tabs.unsubscribed}${state.unsubscribed.length ? ` (${state.unsubscribed.length})` : ""}`,
    trash: t.tabs.trash,
  };

  return (
    <section className="w-full max-w-[1600px] px-6 lg:px-8 pt-8 pb-16">
      <h1 className="font-display text-2xl font-semibold text-ink">{t.title}</h1>

      <div className="mt-5 flex max-w-full flex-wrap gap-0.5 rounded-xl border border-black/8 bg-white p-1 shadow-sm w-fit">
        {TABS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setParams(id === "sent" ? {} : { tab: id })}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-bold whitespace-nowrap transition ${
              tab === id ? "bg-teal/13 text-teal-dark" : "text-muted hover:text-ink"
            }`}
          >
            {id === "trash" && <IconTrash />}
            {labels[id]}
            {id === "trash" && trashCount > 0 && <span className="text-[11px] font-semibold text-muted">({trashCount})</span>}
          </button>
        ))}
      </div>

      {state.error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-danger-ink">{state.error}</p>
      )}

      {!loaded ? (
        <p className="mt-6 text-sm text-muted">{t.loading}</p>
      ) : (
        <>
          {tab === "sent" && <SentTab api={api} />}
          {tab === "templates" && <TemplatesTab api={api} />}
          {tab === "app" && <AppTab />}
          {tab === "unsubscribed" && <UnsubTab api={api} />}
          {tab === "trash" && <TrashTab api={api} />}
        </>
      )}
    </section>
  );
}
