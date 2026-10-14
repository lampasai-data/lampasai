import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "../../i18n";
import { supabase } from "../../lib/supabase";
import { adminLocale } from "../adminI18n";
import { FEEDBACK_T } from "../adminFeedbackI18n";
import Badge, { type BadgeTone } from "./Badge";
import DataTable, { type Column } from "./DataTable";
import { useAdminContext } from "./useAdminContext";

interface FeedbackRow {
  id: string;
  user_id: string;
  kind: string;
  rating: number | null;
  message: string;
  page: string | null;
  created_at: string;
  handled_at: string | null;
}

const KIND_TONE: Record<string, BadgeTone> = { review: "teal", idea: "green", problem: "danger", help: "amber" };

export default function AdminFeedback() {
  const { lang } = useLanguage();
  const t = FEEDBACK_T[lang];
  const locale = adminLocale(lang);
  const { data } = useAdminContext();
  const [rows, setRows] = useState<FeedbackRow[] | null>(null);
  const [view, setView] = useState<"open" | "done">("open");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data: res, error: e } = await supabase
      .from("user_feedback")
      .select("id, user_id, kind, rating, message, page, created_at, handled_at")
      .order("created_at", { ascending: false })
      .limit(2000);
    if (e) setError(e.message);
    else {
      setError(null);
      setRows((res as FeedbackRow[]) ?? []);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setHandled(id: string, handled: boolean) {
    if (!supabase) return;
    const { error: e } = await supabase.rpc("admin_set_feedback_handled", { p_id: id, p_handled: handled });
    if (e) setError(e.message);
    else load();
  }

  const profileOf = (id: string) => data.profiles.find((p) => p.id === id);
  const shown = (rows ?? []).filter((r) => (view === "open" ? !r.handled_at : Boolean(r.handled_at)));
  const openCount = (rows ?? []).filter((r) => !r.handled_at).length;

  const columns: Column<FeedbackRow>[] = [
    {
      key: "date",
      label: t.colDate,
      value: (r) => r.created_at,
      filter: "date",
      render: (r) => <span className="whitespace-nowrap">{new Date(r.created_at).toLocaleString(locale)}</span>,
    },
    {
      key: "user",
      label: t.colUser,
      value: (r) => `${profileOf(r.user_id)?.first_name ?? ""} ${profileOf(r.user_id)?.email ?? ""}`.trim(),
      render: (r) => {
        const p = profileOf(r.user_id);
        return (
          <span className="block">
            <span className="font-medium text-ink">{p?.first_name ?? "-"}</span>
            <span className="block text-[11px] text-muted">{p?.email}</span>
          </span>
        );
      },
    },
    {
      key: "kind",
      label: t.colType,
      filter: "options",
      value: (r) => t.kinds[r.kind] ?? r.kind,
      render: (r) => <Badge tone={KIND_TONE[r.kind] ?? "muted"}>{t.kinds[r.kind] ?? r.kind}</Badge>,
    },
    {
      key: "rating",
      label: t.colRating,
      value: (r) => r.rating,
      render: (r) => (r.rating ? <span className="whitespace-nowrap text-amber-ink">{"★".repeat(r.rating)}<span className="text-black/20">{"★".repeat(5 - r.rating)}</span></span> : "-"),
    },
    {
      key: "message",
      label: t.colMessage,
      value: (r) => r.message,
      render: (r) => <span className="block max-w-md whitespace-pre-wrap">{r.message}</span>,
    },
    { key: "page", label: t.colPage, value: (r) => r.page ?? "" },
    {
      key: "actions",
      label: "",
      render: (r) => {
        const p = profileOf(r.user_id);
        return (
          <span className="flex items-center justify-end gap-2 whitespace-nowrap">
            {p?.email && (
              <a
                href={`mailto:${p.email}?subject=${encodeURIComponent("Lampas .ai")}`}
                className="rounded-full border border-black/12 px-3 py-1 text-xs font-semibold text-ink hover:bg-black/[0.04]"
              >
                {t.reply}
              </a>
            )}
            <button
              type="button"
              onClick={() => setHandled(r.id, !r.handled_at)}
              className="rounded-full border border-teal/40 px-3 py-1 text-xs font-semibold text-teal-dark hover:bg-teal/5"
            >
              {r.handled_at ? t.reopen : t.markDone}
            </button>
          </span>
        );
      },
    },
  ];

  return (
    <section className="w-full max-w-[1600px] px-6 lg:px-8 pt-8 pb-16">
      <h1 className="font-display text-2xl font-semibold text-ink">{t.title}</h1>
      <p className="mt-1 text-sm text-muted">{t.intro}</p>

      <div className="mt-5 flex w-fit gap-0.5 rounded-xl border border-black/8 bg-white p-1 shadow-sm">
        {(["open", "done"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-bold whitespace-nowrap transition ${
              view === v ? "bg-teal/13 text-teal-dark" : "text-muted hover:text-ink"
            }`}
          >
            {v === "open" ? t.viewOpen : t.viewDone}
            {v === "open" && openCount > 0 && (
              <span className="rounded-full bg-amber/25 px-1.5 text-[11px] font-extrabold text-amber-ink">{openCount}</span>
            )}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-danger-ink">{error}</p>}
      {rows === null && !error ? (
        <p className="mt-6 text-sm text-muted">{t.loading}</p>
      ) : (
        rows && (
          <DataTable
            key={view}
            rows={shown}
            columns={columns}
            rowKey={(r) => r.id}
            emptyText={view === "open" ? t.emptyOpen : t.emptyDone}
            initialSort={{ key: "date", dir: "desc" }}
          />
        )
      )}
    </section>
  );
}
