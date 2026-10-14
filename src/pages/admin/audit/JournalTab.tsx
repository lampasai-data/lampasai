import { useEffect, useState } from "react";
import { useLanguage } from "../../../i18n";
import { localize } from "../../../lib/i18nText";
import { supabase } from "../../../lib/supabase";
import { adminLocale } from "../../adminI18n";
import { AUDIT_T } from "../../adminAuditI18n";
import { EMAIL_T, type SegmentId, type TemplateCategory } from "../../adminEmailsI18n";
import DataTable, { type Column } from "../DataTable";
import { useAdminContext } from "../useAdminContext";

interface JournalRow {
  id: number;
  created_at: string;
  actor: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  target_label: string | null;
  detail: Record<string, unknown> | null;
}

export default function JournalTab() {
  const { lang } = useLanguage();
  const t = AUDIT_T[lang];
  const locale = adminLocale(lang);
  const { data } = useAdminContext();
  const [rows, setRows] = useState<JournalRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("admin_audit_log")
      .select("id, created_at, actor, action, target_type, target_id, target_label, detail")
      .order("created_at", { ascending: false })
      .limit(2000)
      .then(({ data: res, error: e }) => {
        if (e) setError(e.message);
        else setRows((res as JournalRow[]) ?? []);
      });
  }, []);

  const actionLabel = (action: string) => t.journal.actions[action] ?? action.replace(/_/g, " ");
  const targetLabel = (r: JournalRow) => {
    const kind = r.target_type ? (t.journal.targets[r.target_type] ?? r.target_type) : "";
    return r.target_label ? `${kind}${kind ? " : " : ""}${r.target_label}` : kind;
  };

  function detailOf(r: JournalRow) {
    const d = r.detail ?? {};
    const certId = typeof d.certification_id === "string" ? d.certification_id : null;
    const cert = data.certs.find((c) => c.id === certId);
    const userId = typeof d.user_id === "string" ? d.user_id : null;
    const profile = data.profiles.find((p) => p.id === userId);
    return t.journal.describe(r.action, d, {
      segment:
        typeof d.segment === "string" ? (EMAIL_T[lang].segments[d.segment as SegmentId]?.label ?? null) : null,
      certification: cert ? localize(cert.name, lang) : null,
      account: profile ? (profile.first_name ? `${profile.first_name} (${profile.email})` : profile.email) : userId,
      category:
        typeof d.category === "string" ? (EMAIL_T[lang].categories[d.category as TemplateCategory] ?? d.category) : null,
      locale,
    });
  }

  const columns: Column<JournalRow>[] = [
    {
      key: "date",
      label: t.journal.colDate,
      value: (r) => r.created_at,
      filter: "date",
      render: (r) => <span className="whitespace-nowrap">{new Date(r.created_at).toLocaleString(locale)}</span>,
    },
    {
      key: "by",
      label: t.journal.colBy,
      filter: "options",
      value: (r) => (r.actor === "system" ? t.journal.system : r.actor),
    },
    {
      key: "action",
      label: t.journal.colAction,
      filter: "options",
      value: (r) => actionLabel(r.action),
      render: (r) => <span className="font-medium text-ink">{actionLabel(r.action)}</span>,
    },
    { key: "target", label: t.journal.colTarget, value: targetLabel },
    { key: "detail", label: t.journal.colDetail, value: detailOf },
  ];

  return (
    <div>
      <p className="mt-5 text-sm text-muted">{t.journal.intro}</p>
      {error && <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-danger-ink">{error}</p>}
      {!rows && !error ? (
        <p className="mt-6 text-sm text-muted">{t.loading}</p>
      ) : (
        rows && (
          <DataTable
            rows={rows}
            columns={columns}
            rowKey={(r) => String(r.id)}
            emptyText={t.journal.empty}
            initialSort={{ key: "date", dir: "desc" }}
          />
        )
      )}
    </div>
  );
}
