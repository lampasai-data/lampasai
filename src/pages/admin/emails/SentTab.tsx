import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../../i18n";
import { supabase } from "../../../lib/supabase";
import { adminLocale } from "../../adminI18n";
import { EMAIL_T, type SegmentId } from "../../adminEmailsI18n";
import { IconPencil, IconTrash } from "../AdminIcons";
import Badge from "../Badge";
import DataTable, { type Column } from "../DataTable";
import Composer from "./Composer";
import EmailPreview from "./EmailPreview";
import { toParagraphs, type EmailCampaign, type EmailsApi } from "./types";

export const btnPrimary = "brand-gradient inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[#ffffff] hover:opacity-90 disabled:opacity-40";
export const btnGhost = "inline-flex items-center gap-2 rounded-full border border-black/12 px-4 py-2 text-sm font-medium text-ink hover:bg-black/[0.04] disabled:opacity-40";
export const btnDanger = "inline-flex items-center gap-2 rounded-full border border-red-500/40 px-4 py-2 text-sm font-medium text-danger-ink hover:bg-red-500/10 disabled:opacity-40";

export default function SentTab({ api }: { api: EmailsApi }) {
  const { lang } = useLanguage();
  const t = EMAIL_T[lang];
  const locale = adminLocale(lang);
  // The Users table can open the composer with people already picked.
  const incoming = (useLocation().state as { compose?: { ids?: string[]; segment?: SegmentId } } | null)?.compose;
  const [composing, setComposing] = useState(Boolean(incoming));
  const [selecting, setSelecting] = useState<Set<string> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const segmentLabel = (id: string) => t.segments[id as SegmentId]?.label ?? id;

  async function trash(ids: string[]) {
    if (!supabase || ids.length === 0) return;
    const { error: e } = await supabase
      .from("admin_email_campaigns")
      .update({ trashed_at: new Date().toISOString() })
      .in("id", ids);
    if (e) setError(e.message);
    setSelecting(null);
    await api.reload();
  }

  const columns: Column<EmailCampaign>[] = [
    {
      key: "date",
      label: t.sent.colDate,
      value: (c) => c.created_at,
      filter: "date",
      render: (c) => new Date(c.created_at).toLocaleString(locale),
    },
    {
      key: "type",
      label: t.sent.colType,
      value: (c) => (c.type === "promotion" ? t.sent.promotion : t.sent.service),
      filter: "options",
      render: (c) => (
        <Badge tone={c.type === "promotion" ? "amber" : "teal"}>
          {c.type === "promotion" ? t.sent.promotion : t.sent.service}
        </Badge>
      ),
    },
    { key: "subject", label: t.sent.colSubject, value: (c) => c.subject, render: (c) => <span className="font-medium text-ink">{c.subject}</span> },
    { key: "target", label: t.sent.colTarget, value: (c) => segmentLabel(c.segment), filter: "options" },
    {
      key: "sent",
      label: t.sent.colSent,
      value: (c) => c.sent,
      render: (c) => t.sent.sentOf(c.sent, c.recipients, c.failed),
    },
  ];

  return (
    <div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">{t.sent.intro}</p>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={btnPrimary} onClick={() => setComposing(true)} disabled={composing}>
            <IconPencil /> {t.newEmail}
          </button>
          {selecting ? (
            <>
              <button type="button" className={btnGhost} onClick={() => setSelecting(null)}>
                {t.cancel}
              </button>
              <button type="button" className={btnDanger} disabled={selecting.size === 0} onClick={() => trash([...selecting])}>
                <IconTrash /> {t.moveToTrash(selecting.size)}
              </button>
            </>
          ) : (
            <button type="button" className={btnGhost} title={t.deleteMode} aria-label={t.deleteMode} onClick={() => setSelecting(new Set())}>
              <IconTrash />
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-danger-ink">{error}</p>}

      {composing && (
        <Composer templates={api.templates} initial={incoming} onClose={() => setComposing(false)} onSent={() => api.reload()} />
      )}

      <DataTable
        rows={api.campaigns}
        columns={columns}
        rowKey={(c) => c.id}
        emptyText={t.sent.empty}
        initialSort={{ key: "date", dir: "desc" }}
        selected={selecting ?? undefined}
        onSelectedChange={selecting ? setSelecting : undefined}
        expanded={(c) => (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
            <div>
              <p className="text-sm font-semibold text-ink">{c.subject}</p>
              <p className="mt-2 text-sm whitespace-pre-line text-muted">{c.message}</p>
              {c.cta_label && <p className="mt-2 text-xs text-muted">[{c.cta_label}] {c.cta_url}</p>}
            </div>
            <div className="space-y-3">
              <EmailPreview firstName="" paragraphs={toParagraphs(c.message)} ctaLabel={c.cta_label ?? undefined} promotion={c.type === "promotion"} emailLang="fr" />
              {c.message_en && (
                <EmailPreview firstName="" paragraphs={toParagraphs(c.message_en)} ctaLabel={c.cta_label_en ?? c.cta_label ?? undefined} promotion={c.type === "promotion"} emailLang="en" />
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
}
