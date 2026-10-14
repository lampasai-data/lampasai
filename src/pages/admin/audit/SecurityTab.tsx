import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "../../../i18n";
import { supabase } from "../../../lib/supabase";
import { adminLocale } from "../../adminI18n";
import { AUDIT_T, SIGNAL_TYPES, type Severity, type SignalType } from "../../adminAuditI18n";
import Badge, { type BadgeTone } from "../Badge";
import { Kpi } from "../charts";
import DataTable, { type Column } from "../DataTable";

interface Signal {
  id: string;
  detected_at: string;
  type: string;
  severity: Severity;
  details: Record<string, unknown>;
  handled_at: string | null;
  handled_by: string | null;
  note: string | null;
}

const SEVERITY_TONE: Record<Severity, BadgeTone> = { alert: "danger", to_check: "amber", to_watch: "muted" };
const STALE_AFTER_MS = 3 * 60 * 60 * 1000;

export default function SecurityTab() {
  const { lang } = useLanguage();
  const t = AUDIT_T[lang].security;
  const locale = adminLocale(lang);

  const [view, setView] = useState<"open" | "history">("open");
  const [signals, setSignals] = useState<Signal[] | null>(null);
  const [openCounts, setOpenCounts] = useState<Record<Severity, number>>({ alert: 0, to_check: 0, to_watch: 0 });
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState<Signal | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    setError(null);
    const [list, open, state] = await Promise.all([
      supabase
        .from("security_signals")
        .select("id, detected_at, type, severity, details, handled_at, handled_by, note")
        .order("detected_at", { ascending: false })
        .limit(1000),
      supabase.from("security_signals").select("severity").is("handled_at", null),
      supabase.from("security_state").select("value").eq("key", "last_scan").maybeSingle(),
    ]);
    const failed = list.error ?? open.error ?? state.error;
    if (failed) {
      setError(failed.message);
      setSignals([]);
      return;
    }
    const all = (list.data as Signal[]) ?? [];
    setSignals(all);
    const counts: Record<Severity, number> = { alert: 0, to_check: 0, to_watch: 0 };
    for (const s of (open.data as { severity: Severity }[]) ?? []) counts[s.severity]++;
    setOpenCounts(counts);
    setLastScan((state.data?.value as { at?: string } | null)?.at ?? null);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function runScan() {
    if (!supabase) return;
    setScanning(true);
    setScanMessage(null);
    const { data, error: e } = await supabase.rpc("admin_run_security_scan");
    setScanning(false);
    if (e) {
      setError(e.message);
      return;
    }
    const r = data as { opened: number; closed: number };
    setScanMessage(t.scanResult(r.opened, r.closed));
    load();
  }

  const copy = (type: string) => (SIGNAL_TYPES.includes(type as SignalType) ? t.signals[type as SignalType] : null);
  const titleOf = (s: Signal) => copy(s.type)?.title ?? s.type;
  const summaryOf = (s: Signal) => t.summary(s.type, s.details ?? {}, locale);
  const stale = lastScan !== null && Date.now() - new Date(lastScan).getTime() > STALE_AFTER_MS;

  const rows = (signals ?? []).filter((s) => (view === "open" ? !s.handled_at : Boolean(s.handled_at)));

  const columns: Column<Signal>[] = [
    {
      key: "level",
      label: t.colLevel,
      filter: "options",
      value: (s) => t.severity[s.severity],
      render: (s) => <Badge tone={SEVERITY_TONE[s.severity]}>{t.severity[s.severity]}</Badge>,
    },
    {
      key: "date",
      label: t.colDetected,
      value: (s) => s.detected_at,
      filter: "date",
      render: (s) => <span className="whitespace-nowrap">{new Date(s.detected_at).toLocaleString(locale)}</span>,
    },
    {
      key: "signal",
      label: t.colSignal,
      value: (s) => `${titleOf(s)} ${summaryOf(s)}`,
      render: (s) => (
        <div>
          <p className="font-medium text-ink">{titleOf(s)}</p>
          <p className="text-xs text-muted">{summaryOf(s)}</p>
        </div>
      ),
    },
    {
      key: "cause",
      label: t.colCause,
      filter: "options",
      value: (s) => copy(s.type)?.cause.code ?? "-",
      render: (s) => {
        const c = copy(s.type)?.cause;
        return c ? (
          <div>
            <Badge tone={c.tone}>{c.code}</Badge>
            <p className="mt-1 text-xs text-muted">{c.reason}</p>
          </div>
        ) : (
          "-"
        );
      },
    },
    ...(view === "history"
      ? ([
          {
            key: "handled",
            label: t.colHandled,
            value: (s) => s.handled_at ?? "",
            filter: "date",
            render: (s) => (
              <div className="whitespace-nowrap">
                <p className="font-medium text-ink">{s.handled_by ? t.handledBy(s.handled_by) : t.autoClosed}</p>
                <p className="text-xs text-muted">{s.handled_at ? new Date(s.handled_at).toLocaleString(locale) : ""}</p>
              </div>
            ),
          },
          {
            key: "note",
            label: t.colNote,
            value: (s) => s.note ?? "",
            render: (s) =>
              s.note ? (
                <span className="line-clamp-2 max-w-xs" title={s.note}>
                  {s.note}
                </span>
              ) : (
                <span className="text-muted">{s.handled_by ? t.noNote : t.autoClosedNote}</span>
              ),
          },
        ] satisfies Column<Signal>[])
      : []),
    {
      key: "open",
      label: "",
      render: (s) => (
        <button
          type="button"
          onClick={() => setCurrent(s)}
          className="rounded-full border border-black/12 px-3 py-1 text-xs font-semibold text-ink hover:bg-black/[0.04]"
        >
          {view === "open" ? t.handle : t.view}
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">{t.intro}</p>
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5 rounded-xl border border-black/8 bg-white p-1 shadow-sm">
            {(["open", "history"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-bold whitespace-nowrap transition ${
                  view === v ? "bg-teal/13 text-teal-dark" : "text-muted hover:text-ink"
                }`}
              >
                {v === "open" ? t.viewOpen : t.viewHistory}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
        <span>{lastScan ? t.lastScan(new Date(lastScan).toLocaleString(locale)) : t.neverScanned}</span>
        {stale && <span className="font-semibold text-danger-ink">{t.scanStale}</span>}
        <button
          type="button"
          onClick={runScan}
          disabled={scanning}
          className="rounded-full border border-black/12 px-3 py-1 text-xs font-semibold text-ink hover:bg-black/[0.04] disabled:opacity-50"
        >
          {scanning ? t.scanning : t.runScan}
        </button>
        {scanMessage && <span className="text-green-ink">{scanMessage}</span>}
      </div>

      {view === "open" && (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Kpi label={t.kpiAlert} value={openCounts.alert} />
          <Kpi label={t.kpiCheck} value={openCounts.to_check} />
          <Kpi label={t.kpiWatch} value={openCounts.to_watch} />
        </div>
      )}

      {error && <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-danger-ink">{error}</p>}
      {signals === null ? (
        <p className="mt-6 text-sm text-muted">{AUDIT_T[lang].loading}</p>
      ) : (
        <DataTable
          key={view}
          rows={rows}
          columns={columns}
          rowKey={(s) => s.id}
          emptyText={view === "open" ? t.emptyOpen : t.emptyHistory}
          initialSort={{ key: "date", dir: "desc" }}
        />
      )}

      {current && (
        <SignalModal
          signal={current}
          onClose={() => setCurrent(null)}
          onHandled={() => {
            setCurrent(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function SignalModal({
  signal,
  onClose,
  onHandled,
}: {
  signal: Signal;
  onClose: () => void;
  onHandled: () => void;
}) {
  const { lang } = useLanguage();
  const t = AUDIT_T[lang].security;
  const m = t.modal;
  const locale = adminLocale(lang);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copy = SIGNAL_TYPES.includes(signal.type as SignalType) ? t.signals[signal.type as SignalType] : null;
  const handled = Boolean(signal.handled_at);
  const added = Array.isArray(signal.details.added) ? (signal.details.added as string[]) : [];
  const removed = Array.isArray(signal.details.removed) ? (signal.details.removed as string[]) : [];

  async function markHandled() {
    if (!supabase) return;
    setBusy(true);
    setError(null);
    const { error: e } = await supabase.rpc("admin_handle_security_signal", { p_id: signal.id, p_note: note.trim() });
    setBusy(false);
    if (e) setError(e.message);
    else onHandled();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div
        role="dialog"
        aria-label={copy?.title ?? signal.type}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl"
      >
        <div className="border-b border-black/8 px-5 py-4">
          <div className="flex flex-wrap gap-1.5">
            <Badge tone={SEVERITY_TONE[signal.severity]}>{t.severity[signal.severity]}</Badge>
            {copy && <Badge tone={copy.cause.tone}>{copy.cause.code}</Badge>}
          </div>
          <h2 className="mt-2 font-display text-lg font-semibold text-ink">{copy?.title ?? signal.type}</h2>
          <p className="mt-0.5 text-xs text-muted">{m.detected(new Date(signal.detected_at).toLocaleString(locale))}</p>
        </div>

        <div className="space-y-3 overflow-y-auto px-5 py-4 text-sm">
          <div className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2.5">
            <p className="font-semibold text-danger-ink">{m.happened}</p>
            <p className="mt-0.5 text-ink">{t.summary(signal.type, signal.details ?? {}, locale)}</p>
            {copy && <p className="text-muted">{copy.cause.reason}.</p>}
          </div>

          {copy && (
            <div className="rounded-lg border border-amber/40 bg-amber/10 px-3 py-2.5">
              <p className="font-semibold text-amber-ink">{m.means}</p>
              <p className="mt-0.5 text-ink">{copy.meaning}</p>
            </div>
          )}

          {copy && (
            <div className="rounded-lg border border-green/30 bg-green/10 px-3 py-2.5">
              <p className="font-semibold text-green-ink">{m.todo}</p>
              <ol className="mt-1 list-decimal space-y-1 pl-5 text-ink">
                {copy.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
          )}

          {(added.length > 0 || removed.length > 0) && (
            <details className="rounded-lg border border-black/10 px-3 py-2">
              <summary className="cursor-pointer font-semibold text-ink">{m.technical}</summary>
              {added.length > 0 && (
                <>
                  <p className="mt-2 text-xs font-bold text-muted">{m.added}</p>
                  <pre className="mt-1 max-h-40 overflow-auto rounded-md bg-black/[0.04] p-2 text-[11px] whitespace-pre-wrap text-ink">
                    {added.join("\n")}
                  </pre>
                </>
              )}
              {removed.length > 0 && (
                <>
                  <p className="mt-2 text-xs font-bold text-muted">{m.removed}</p>
                  <pre className="mt-1 max-h-40 overflow-auto rounded-md bg-black/[0.04] p-2 text-[11px] whitespace-pre-wrap text-ink">
                    {removed.join("\n")}
                  </pre>
                </>
              )}
            </details>
          )}

          {handled && (
            <div className="rounded-lg border border-black/10 px-3 py-2.5">
              <p className="text-ink">
                {m.handledOn(new Date(signal.handled_at!).toLocaleString(locale), signal.handled_by)}
              </p>
              {signal.note && <p className="mt-0.5 text-muted">{signal.note}</p>}
            </div>
          )}

          {!handled && (
            <div>
              <label htmlFor="signal-note" className="block text-xs font-bold text-ink">
                {m.noteLabel}
              </label>
              <textarea
                id="signal-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={m.notePlaceholder}
                rows={3}
                className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-ink"
              />
              {error && <p className="mt-2 rounded-lg bg-red-500/10 px-3 py-2 text-danger-ink">{error}</p>}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-black/8 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black/12 px-4 py-2 text-sm font-medium text-ink hover:bg-black/[0.04]"
          >
            {m.close}
          </button>
          {!handled && (
            <button
              type="button"
              onClick={markHandled}
              disabled={busy || note.trim().length < 3}
              className="rounded-full bg-teal px-4 py-2 text-sm font-medium text-[#ffffff] hover:opacity-90 disabled:opacity-40"
            >
              {busy ? m.saving : m.markHandled}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
