import { useEffect, useState } from "react";
import { useLanguage } from "../i18n";
import { ADMIN_T, adminLocale } from "./adminI18n";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { formatMoney } from "../lib/money";
import Badge, { type BadgeTone } from "./admin/Badge";
import DataTable, { type Column } from "./admin/DataTable";

const ADMIN_EMAIL = "mbairo.allatessem@gmail.com";
const STALE_HOURS = 24;
const LOGS_FETCH_LIMIT = 500;

interface PendingPurchase {
  id: string;
  email: string;
  certification_id: string;
  gumroad_sale_id: string;
  amount_cents: number;
  currency: string | null;
  expires_at: string;
  created_at: string;
}

interface WebhookLog {
  id: string;
  received_at: string;
  verification_result: string;
  match_result: string;
  gumroad_sale_id: string | null;
  error_message: string | null;
}

// The reconcile sweep (cron every 6h, or the admin "reconcile now" button)
// logs a row every time it runs, even when it finds nothing to do - a
// heartbeat proving the safety net is alive, not something the admin needs
// to see. Only genuine Gumroad webhook events and reconcile runs that
// actually did something (processed/skipped a sale, or errored) are worth
// showing here.
function isNoiseHeartbeat(log: WebhookLog): boolean {
  const isReconcileRun =
    log.verification_result === "reconcile" || log.verification_result === "reconcile-admin";
  // Also hides the older rows written before sweeps stopped logging "found nothing new".
  return isReconcileRun && /^processed:0,skipped:\d+$/.test(log.match_result) && !log.error_message;
}

// Postgres reports a second insert of an already-recorded sale as a raw
// unique-constraint error. That's harmless (the access already exists), so
// show it as a neutral note instead of a red error. Also covers older log
// rows written before the backend started tagging these as "duplicate".
function isDuplicateLog(log: WebhookLog): boolean {
  return (
    log.match_result === "duplicate" ||
    Boolean(log.error_message?.includes("certification_purchases_gumroad_sale_id_key"))
  );
}

// Badge colour for a webhook outcome: green = access granted, amber =
// waiting on the buyer, grey = nothing to do, red = needs a look.
function resultTone(result: string): BadgeTone {
  if (result.startsWith("matched")) return "green";
  if (result === "pending") return "amber";
  if (result.startsWith("error") || result === "not_processed") return "danger";
  if (result.startsWith("processed")) return "teal";
  return "muted";
}

export default function AdminGumroad() {
  const { user, ready } = useAuth();
  const { lang } = useLanguage();
  const a = ADMIN_T[lang];
  const [pending, setPending] = useState<PendingPurchase[]>([]);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [linkEmails, setLinkEmails] = useState<Record<string, string>>({});
  const [linking, setLinking] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [reconciling, setReconciling] = useState(false);
  const [reconcileFeedback, setReconcileFeedback] = useState<string | null>(null);

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  async function loadData() {
    if (!supabase) return;
    setLoading(true);
    const staleThreshold = new Date(Date.now() - STALE_HOURS * 60 * 60 * 1000).toISOString();

    const [{ data: pendingRows }, { data: logRows }] = await Promise.all([
      supabase
        .from("pending_gumroad_purchases")
        .select("id, email, certification_id, gumroad_sale_id, amount_cents, currency, expires_at, created_at")
        .is("resolved_at", null)
        .lt("created_at", staleThreshold)
        .order("created_at", { ascending: false }),
      supabase
        .from("gumroad_webhook_logs")
        .select("id, received_at, verification_result, match_result, gumroad_sale_id, error_message")
        .order("received_at", { ascending: false })
        .limit(LOGS_FETCH_LIMIT),
    ]);

    setPending((pendingRows as PendingPurchase[]) ?? []);
    setLogs(((logRows as WebhookLog[]) ?? []).filter((log) => !isNoiseHeartbeat(log)));
    setLoading(false);
  }

  useEffect(() => {
    if (isAdmin) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  async function handleLink(pendingId: string) {
    if (!supabase) return;
    const targetEmail = (linkEmails[pendingId] ?? "").trim();
    if (!targetEmail) return;

    setLinking(pendingId);
    setFeedback((prev) => ({ ...prev, [pendingId]: "" }));

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    const { data, error } = await supabase.functions.invoke("admin-link-gumroad-purchase", {
      body: { pendingPurchaseId: pendingId, targetEmail },
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });

    setLinking(null);

    if (error || data?.error) {
      setFeedback((prev) => ({ ...prev, [pendingId]: a.errorWith(String(data?.error ?? error?.message)) }));
      return;
    }

    setFeedback((prev) => ({ ...prev, [pendingId]: a.gumroadLinked }));
    loadData();
  }

  async function handleReconcileNow() {
    if (!supabase) return;
    setReconciling(true);
    setReconcileFeedback(null);

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    const { data, error } = await supabase.functions.invoke("admin-trigger-reconcile", {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });

    setReconciling(false);

    if (error || data?.error) {
      setReconcileFeedback(a.errorWith(String(data?.error ?? error?.message)));
      return;
    }

    setReconcileFeedback(a.gumroadReconcileDone(data.total, data.processed, data.skipped));
    loadData();
  }

  const logColumns: Column<WebhookLog>[] = [
    {
      key: "received",
      label: a.gumroadReceivedAt,
      value: (log) => log.received_at,
      filter: "date",
      render: (log) => new Date(log.received_at).toLocaleString(adminLocale(lang)),
    },
    { key: "verification", label: a.gumroadVerification, value: (log) => log.verification_result, filter: "options" },
    {
      key: "result",
      label: a.gumroadResult,
      value: (log) => (isDuplicateLog(log) ? "duplicate" : log.match_result),
      filter: "options",
      render: (log) => {
        const result = isDuplicateLog(log) ? "duplicate" : log.match_result;
        return <Badge tone={resultTone(result)}>{result}</Badge>;
      },
    },
    {
      key: "sale",
      label: "sale_id",
      value: (log) => log.gumroad_sale_id ?? "",
      render: (log) => <span className="font-mono text-xs">{log.gumroad_sale_id ?? "-"}</span>,
    },
    {
      key: "error",
      label: a.gumroadError,
      value: (log) => (isDuplicateLog(log) ? a.gumroadDuplicateNote : (log.error_message ?? "")),
      render: (log) =>
        isDuplicateLog(log) ? (
          <span className="text-muted">{a.gumroadDuplicateNote}</span>
        ) : (
          <span className="text-danger-ink">{log.error_message ?? ""}</span>
        ),
    },
  ];

  if (!ready) return null;

  if (!user || !isAdmin) {
    return <Navigate to="/formations" replace />;
  }

  return (
    <section className="w-full max-w-[1600px] px-6 lg:px-8 pt-8 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{a.gumroadTitle}</h1>
          <p className="mt-2 text-sm text-muted">
            {a.gumroadSubtitle(STALE_HOURS)}
          </p>
        </div>
        <div className="text-right">
          <button
            type="button"
            onClick={handleReconcileNow}
            disabled={reconciling}
            className="rounded-full border border-teal/40 bg-white px-4 py-2 text-xs font-semibold text-teal-dark shadow-sm transition hover:bg-teal/5 disabled:opacity-50"
          >
            {reconciling ? a.gumroadReconciling : a.gumroadReconcileNow}
          </button>
          {reconcileFeedback && (
            <p className="mt-2 max-w-xs text-xs text-muted">{reconcileFeedback}</p>
          )}
        </div>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted">{a.loading}</p>
      ) : pending.length === 0 ? (
        <p className="mt-8 rounded-xl border border-black/8 bg-white p-4 text-sm text-muted">
          {a.gumroadNothingPending}
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {pending.map((row) => (
            <div key={row.id} className="rounded-2xl border border-black/8 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <div>
                  <p className="font-medium text-ink">{row.email}</p>
                  <p className="text-xs text-muted">
                    sale_id: {row.gumroad_sale_id} · {formatMoney(row.amount_cents, row.currency, adminLocale(lang))} · {a.gumroadReceivedInline}{" "}
                    {new Date(row.created_at).toLocaleString(adminLocale(lang))}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <input
                  type="email"
                  placeholder={a.gumroadLinkEmailPlaceholder}
                  value={linkEmails[row.id] ?? ""}
                  onChange={(e) =>
                    setLinkEmails((prev) => ({ ...prev, [row.id]: e.target.value }))
                  }
                  className="min-w-[220px] flex-1 rounded-xl border border-black/12 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
                />
                <button
                  type="button"
                  onClick={() => handleLink(row.id)}
                  disabled={linking === row.id || !(linkEmails[row.id] ?? "").trim()}
                  className="brand-gradient rounded-full px-4 py-2 text-xs font-medium text-[#ffffff] transition hover:opacity-90 disabled:opacity-50"
                >
                  {linking === row.id ? a.gumroadLinking : a.gumroadLink}
                </button>
              </div>
              {feedback[row.id] && (
                <p className="mt-2 text-xs font-medium text-teal-dark">{feedback[row.id]}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-12 font-display text-lg font-semibold text-ink">
        {a.gumroadEventsTitle}
      </h2>
      <p className="mt-2 text-sm text-muted">
        {a.gumroadEventsLead}
      </p>
      {logs.length === 0 ? (
        <p className="mt-4 rounded-xl border border-black/8 bg-white p-4 text-sm text-muted">
          {a.gumroadNoEvents}
        </p>
      ) : (
        <DataTable
          rows={logs}
          columns={logColumns}
          rowKey={(log) => log.id}
          initialSort={{ key: "received", dir: "desc" }}
        />
      )}
    </section>
  );
}
