import { useState } from "react";
import { useLanguage } from "../../../i18n";
import { supabase } from "../../../lib/supabase";
import { adminLocale } from "../../adminI18n";
import { EMAIL_T, type SegmentId } from "../../adminEmailsI18n";
import { IconRestore, IconTrash } from "../AdminIcons";
import DataTable, { type Column } from "../DataTable";
import { btnDanger, btnGhost } from "./SentTab";
import type { EmailCampaign, EmailsApi, EmailTemplate } from "./types";

type Table = "admin_email_templates" | "admin_email_campaigns";

export default function TrashTab({ api }: { api: EmailsApi }) {
  const { lang } = useLanguage();
  const t = EMAIL_T[lang];
  const locale = adminLocale(lang);
  const [selTemplates, setSelTemplates] = useState<Set<string>>(new Set());
  const [selCampaigns, setSelCampaigns] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  async function restore(table: Table, ids: string[], clear: () => void) {
    if (!supabase || ids.length === 0) return;
    const { error: e } = await supabase.from(table).update({ trashed_at: null }).in("id", ids);
    if (e) setError(e.message);
    clear();
    await api.reload();
  }
  async function eraseForever(table: Table, ids: string[], clear: () => void) {
    if (!supabase || ids.length === 0) return;
    if (!window.confirm(t.confirmDeleteForever(ids.length))) return;
    const { error: e } = await supabase.from(table).delete().in("id", ids);
    if (e) setError(e.message);
    clear();
    await api.reload();
  }

  const fmt = (iso: string) => new Date(iso).toLocaleString(locale);
  const templateColumns: Column<EmailTemplate>[] = [
    { key: "name", label: t.templates.name, value: (m) => m.name, render: (m) => <span className="font-medium text-ink">{m.name}</span> },
    { key: "subject", label: t.templates.subject, value: (m) => m.subject },
    { key: "trashed", label: t.tabs.trash, value: (m) => m.trashed_at, filter: "date", render: (m) => (m.trashed_at ? fmt(m.trashed_at) : "-") },
  ];
  const campaignColumns: Column<EmailCampaign>[] = [
    { key: "date", label: t.sent.colDate, value: (c) => c.created_at, filter: "date", render: (c) => fmt(c.created_at) },
    { key: "subject", label: t.sent.colSubject, value: (c) => c.subject, render: (c) => <span className="font-medium text-ink">{c.subject}</span> },
    { key: "target", label: t.sent.colTarget, value: (c) => t.segments[c.segment as SegmentId]?.label ?? c.segment, filter: "options" },
    { key: "sent", label: t.sent.colSent, value: (c) => c.sent, render: (c) => t.sent.sentOf(c.sent, c.recipients, c.failed) },
  ];

  const section = <T extends { id: string }>(
    title: string,
    rows: T[],
    columns: Column<T>[],
    table: Table,
    selected: Set<string>,
    setSelected: (s: Set<string>) => void
  ) => (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-base font-semibold text-ink">
          {title} <span className="text-sm font-normal text-muted">({rows.length})</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btnGhost} disabled={selected.size === 0} onClick={() => restore(table, [...selected], () => setSelected(new Set()))}>
            <IconRestore /> {t.restore(selected.size)}
          </button>
          <button type="button" className={btnDanger} disabled={selected.size === 0} onClick={() => eraseForever(table, [...selected], () => setSelected(new Set()))}>
            <IconTrash /> {t.deleteForever(selected.size)}
          </button>
        </div>
      </div>
      <DataTable rows={rows} columns={columns} rowKey={(r) => r.id} emptyText={t.trash.empty} selected={selected} onSelectedChange={setSelected} />
    </div>
  );

  return (
    <div>
      <p className="mt-5 text-sm text-muted">{t.trash.intro}</p>
      {error && <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-danger-ink">{error}</p>}
      {section(t.trash.templates, api.trashedTemplates, templateColumns, "admin_email_templates", selTemplates, setSelTemplates)}
      {section(t.trash.campaigns, api.trashedCampaigns, campaignColumns, "admin_email_campaigns", selCampaigns, setSelCampaigns)}
    </div>
  );
}
