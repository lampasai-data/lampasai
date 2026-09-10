import { useEffect, useState } from "react";
import { useLanguage } from "../i18n";
import { ADMIN_T, adminLocale } from "./adminI18n";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const ADMIN_EMAIL = "mbairo.allatessem@gmail.com";
const STALE_HOURS = 24;
const LOGS_PAGE_SIZE = 10;
const LOGS_FETCH_LIMIT = 500;

interface PendingPurchase {
  id: string;
  email: string;
  certification_id: string;
  gumroad_sale_id: string;
  amount_cents: number;
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
  return isReconcileRun && log.match_result === "processed:0,skipped:0" && !log.error_message;
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
  const [logsPage, setLogsPage] = useState(0);

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  async function loadData() {
    if (!supabase) return;
    setLoading(true);
    const staleThreshold = new Date(Date.now() - STALE_HOURS * 60 * 60 * 1000).toISOString();

    const [{ data: pendingRows }, { data: logRows }] = await Promise.all([
      supabase
        .from("pending_gumroad_purchases")
        .select("id, email, certification_id, gumroad_sale_id, amount_cents, expires_at, created_at")
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
    setLogsPage(0);
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

  if (!ready) return null;

  if (!user || !isAdmin) {
    return <Navigate to="/formations" replace />;
  }

  return (
    <section className="mx-auto max-w-4xl px-6 pt-8 pb-24">
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
            className="rounded-full border border-teal/40 px-4 py-2 text-xs font-medium text-teal-dark transition hover:bg-teal/5 disabled:opacity-50"
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
            <div key={row.id} className="rounded-xl border border-black/8 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <div>
                  <p className="font-medium text-ink">{row.email}</p>
                  <p className="text-xs text-muted">
                    sale_id: {row.gumroad_sale_id} · {(row.amount_cents / 100).toFixed(2)} € · {a.gumroadReceivedInline}{" "}
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
                  className="flex-1 min-w-[220px] rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleLink(row.id)}
                  disabled={linking === row.id || !(linkEmails[row.id] ?? "").trim()}
                  className="brand-gradient rounded-full px-4 py-2 text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-50"
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
      <div className="mt-4 overflow-x-auto rounded-xl border border-black/8 bg-white">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-black/8 text-muted">
            <tr>
              <th className="px-3 py-2">{a.gumroadReceivedAt}</th>
              <th className="px-3 py-2">{a.gumroadVerification}</th>
              <th className="px-3 py-2">{a.gumroadResult}</th>
              <th className="px-3 py-2">sale_id</th>
              <th className="px-3 py-2">{a.gumroadError}</th>
            </tr>
          </thead>
          <tbody>
            {logs.slice(logsPage * LOGS_PAGE_SIZE, logsPage * LOGS_PAGE_SIZE + LOGS_PAGE_SIZE).map((log) => (
              <tr key={log.id} className="border-b border-black/5 last:border-0">
                <td className="px-3 py-2 text-muted">
                  {new Date(log.received_at).toLocaleString(adminLocale(lang))}
                </td>
                <td className="px-3 py-2">{log.verification_result}</td>
                <td className="px-3 py-2">{log.match_result}</td>
                <td className="px-3 py-2 font-mono">{log.gumroad_sale_id ?? "-"}</td>
                <td className="px-3 py-2 text-red-600">{log.error_message ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      {logs.length > LOGS_PAGE_SIZE && (
        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <button
            type="button"
            onClick={() => setLogsPage((p) => Math.max(0, p - 1))}
            disabled={logsPage === 0}
            className="rounded-full border border-black/10 px-3 py-1.5 font-medium text-ink transition hover:border-black/20 disabled:opacity-40"
          >
            {a.previous}
          </button>
          <span>
            {a.pageOf(logsPage + 1, Math.ceil(logs.length / LOGS_PAGE_SIZE))}
          </span>
          <button
            type="button"
            onClick={() =>
              setLogsPage((p) =>
                (p + 1) * LOGS_PAGE_SIZE < logs.length ? p + 1 : p
              )
            }
            disabled={(logsPage + 1) * LOGS_PAGE_SIZE >= logs.length}
            className="rounded-full border border-black/10 px-3 py-1.5 font-medium text-ink transition hover:border-black/20 disabled:opacity-40"
          >
            {a.next}
          </button>
        </div>
      )}
    </section>
  );
}
