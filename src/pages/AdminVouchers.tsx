import { useEffect, useState } from "react";
import { ADMIN_T, adminLocale } from "./adminI18n";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { listCertifications, type CertificationSummary } from "../lib/quizData";
import { localize } from "../lib/i18nText";
import { useLanguage } from "../i18n";
import Badge from "./admin/Badge";
import DataTable, { type Column } from "./admin/DataTable";


interface VoucherRow {
  id: string;
  code: string;
  certification_id: string;
  expires_at: string | null;
  created_at: string;
  max_redemptions: number;
  access_days: number;
}

const ACCESS_DAY_OPTIONS = [7, 14, 30, 90];

interface RedemptionRow {
  voucher_id: string;
  user_id: string;
  redeemed_at: string;
}

export default function AdminVouchers() {
  const { user, ready, profileReady, isAdmin } = useAuth();
  const { lang } = useLanguage();
  const a = ADMIN_T[lang];

  const [certs, setCerts] = useState<CertificationSummary[]>([]);
  const [vouchers, setVouchers] = useState<VoucherRow[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionRow[]>([]);
  const [redeemers, setRedeemers] = useState<
    Map<string, { email: string | null; first_name: string | null }>
  >(new Map());
  const [loading, setLoading] = useState(true);

  const [certificationId, setCertificationId] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [maxRedemptions, setMaxRedemptions] = useState("1");
  const [accessDays, setAccessDays] = useState(30);
  const [generating, setGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [picking, setPicking] = useState<Set<string>>(new Set());
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

  const [redeemersModalVoucher, setRedeemersModalVoucher] = useState<VoucherRow | null>(null);
  const [redeemerSearch, setRedeemerSearch] = useState("");

  async function loadData() {
    if (!supabase) return;
    setLoading(true);
    const [certList, { data: voucherRows }, { data: redemptionRows }] = await Promise.all([
      listCertifications(),
      supabase
        .from("exam_vouchers")
        .select("id, code, certification_id, expires_at, created_at, max_redemptions, access_days")
        .order("created_at", { ascending: false }),
      supabase.from("exam_voucher_redemptions").select("voucher_id, user_id, redeemed_at"),
    ]);
    setCerts(certList);
    setVouchers((voucherRows as VoucherRow[]) ?? []);
    const redemptionRowsTyped = (redemptionRows as RedemptionRow[]) ?? [];
    setRedemptions(redemptionRowsTyped);
    if (!certificationId && certList.length > 0) setCertificationId(certList[0].id);

    const redeemerIds = [...new Set(redemptionRowsTyped.map((r) => r.user_id))];
    if (redeemerIds.length > 0) {
      const { data: profileRows } = await supabase
        .from("profiles")
        .select("id, email, first_name")
        .in("id", redeemerIds);
      setRedeemers(
        new Map(
          (profileRows ?? []).map((p) => [
            p.id as string,
            { email: p.email as string | null, first_name: p.first_name as string | null },
          ])
        )
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    if (isAdmin) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  async function handleGenerate() {
    if (!supabase || !certificationId) return;
    setGenerating(true);
    setError(null);
    setGeneratedCode(null);

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    const { data, error: invokeError } = await supabase.functions.invoke(
      "admin-create-exam-voucher",
      {
        body: {
          certificationId,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
          maxRedemptions: Math.max(1, parseInt(maxRedemptions, 10) || 1),
          accessDays,
        },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      }
    );

    setGenerating(false);

    if (invokeError || data?.error) {
      setError(data?.error ?? invokeError?.message ?? a.unknownError);
      return;
    }

    setGeneratedCode(data.voucher.code);
    loadData();
  }

  function certName(certificationId: string) {
    const cert = certs.find((c) => c.id === certificationId);
    return cert ? localize(cert.name, lang) : certificationId;
  }

  function redemptionsFor(voucherId: string) {
    return redemptions.filter((r) => r.voucher_id === voucherId);
  }

  function usageType(v: VoucherRow): "unique" | "partage" {
    return v.max_redemptions > 1 ? "partage" : "unique";
  }

  function usageTypeLabel(v: VoucherRow) {
    return usageType(v) === "partage" ? a.vouchersShared : a.vouchersUnique;
  }

  function statusCategory(v: VoucherRow): "disponible" | "epuise" | "expire" {
    const count = redemptionsFor(v.id).length;
    if (count >= v.max_redemptions) return "epuise";
    if (v.expires_at && new Date(v.expires_at) < new Date()) return "expire";
    return "disponible";
  }

  function statusLabel(v: VoucherRow) {
    const count = redemptionsFor(v.id).length;
    const category = statusCategory(v);
    if (category === "epuise") return a.vouchersExhaustedCount(count, v.max_redemptions);
    if (category === "expire") return a.vouchersExpired;
    return v.max_redemptions > 1
      ? a.vouchersAvailableCount(count, v.max_redemptions)
      : a.vouchersAvailable;
  }

  function redeemerName(r: RedemptionRow) {
    const p = redeemers.get(r.user_id);
    return p?.first_name ?? p?.email ?? r.user_id;
  }

  // Plain text used for filtering only - the table cell itself renders a
  // count badge instead of this once redemptions are more than a couple of
  // names, since a shared voucher (max_redemptions in the hundreds) turned
  // this into one unreadable comma-separated blob spanning the whole row.
  function redeemerLabel(v: VoucherRow) {
    const rows = redemptionsFor(v.id);
    if (rows.length === 0) return "-";
    return rows.map(redeemerName).join(", ");
  }

  // Only a voucher that can no longer be used may go: fully used or expired.
  // The database function applies the same rule, so this is only for the UI.
  const deletableIds = vouchers
    .filter((v) => picking.has(v.id) && statusCategory(v) !== "disponible")
    .map((v) => v.id);

  async function handleDelete() {
    if (!supabase || deletableIds.length === 0) return;
    setDeleting(true);
    setError(null);
    const { data, error: rpcError } = await supabase.rpc("admin_delete_exam_vouchers", { p_ids: deletableIds });
    setDeleting(false);
    setConfirmingDelete(false);
    if (rpcError) {
      setError(a.vouchersDeleteError);
      return;
    }
    setDeleteNotice(a.vouchersDeleted(Number(data ?? 0)));
    setPicking(new Set());
    loadData();
  }

  const categoryLabel = {
    disponible: a.vouchersAvailable,
    epuise: a.vouchersExhausted,
    expire: a.vouchersExpired,
  };
  const categoryTone = { disponible: "green", epuise: "muted", expire: "amber" } as const;

  const columns: Column<VoucherRow>[] = [
    {
      key: "code",
      label: a.vouchersCode,
      value: (v) => v.code,
      render: (v) => <span className="font-mono">{v.code}</span>,
    },
    { key: "cert", label: a.certification, value: (v) => certName(v.certification_id), filter: "options" },
    { key: "type", label: a.vouchersType, value: (v) => usageTypeLabel(v), filter: "options" },
    { key: "access", label: a.vouchersAccessDays, value: (v) => a.vouchersDays(v.access_days ?? 30), filter: "options" },
    {
      key: "created",
      label: a.vouchersCreatedAt,
      value: (v) => v.created_at,
      filter: "date",
      render: (v) => new Date(v.created_at).toLocaleDateString(adminLocale(lang)),
    },
    {
      key: "status",
      label: a.vouchersStatus,
      value: (v) => categoryLabel[statusCategory(v)],
      filter: "options",
      render: (v) => <Badge tone={categoryTone[statusCategory(v)]}>{statusLabel(v)}</Badge>,
    },
    {
      key: "redeemers",
      label: a.vouchersRedeemedBy,
      value: (v) => redeemerLabel(v),
      render: (v) => {
        const rows = redemptionsFor(v.id);
        if (rows.length === 0) return "-";
        if (rows.length <= 3) return <span className="line-clamp-2 max-w-[16rem]">{rows.map(redeemerName).join(", ")}</span>;
        return (
          <button
            type="button"
            onClick={() => {
              setRedeemerSearch("");
              setRedeemersModalVoucher(v);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/[0.06] px-3 py-1 text-xs font-medium text-teal-dark transition hover:bg-teal/10"
          >
            👥 {a.vouchersPeople(rows.length)}
          </button>
        );
      },
    },
  ];

  if (!ready || !profileReady) return null;
  if (!user || !isAdmin) {
    return <Navigate to="/formations" replace />;
  }

  return (
    <section className="w-full max-w-[1600px] px-6 lg:px-8 pt-8 pb-16">
      <h1 className="font-display text-2xl font-semibold text-ink">{a.vouchersTitle}</h1>
      <p className="mt-2 text-sm text-muted">
        {a.vouchersLead}
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-black/8 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted">{a.certification}</label>
          <select
            value={certificationId}
            onChange={(e) => setCertificationId(e.target.value)}
            className="rounded-xl border border-black/12 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
          >
            {certs.map((c) => (
              <option key={c.id} value={c.id}>
                {localize(c.name, lang)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted">
            {a.vouchersExpiry}
          </label>
          <input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="rounded-xl border border-black/12 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted">{a.vouchersMaxRedemptions}</label>
          <input
            type="number"
            min={1}
            step={1}
            value={maxRedemptions}
            onChange={(e) => setMaxRedemptions(e.target.value)}
            className="w-28 rounded-xl border border-black/12 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted">{a.vouchersAccessDays}</label>
          <select
            value={accessDays}
            onChange={(e) => setAccessDays(Number(e.target.value))}
            className="rounded-xl border border-black/12 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
          >
            {ACCESS_DAY_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {a.vouchersDays(d)}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating || !certificationId}
          className="brand-gradient rounded-full px-5 py-2 text-sm font-semibold text-[#ffffff] shadow-sm shadow-teal/20 transition hover:opacity-90 disabled:opacity-50"
        >
          {generating ? a.vouchersGenerating : a.vouchersGenerate}
        </button>
      </div>

      {generatedCode && (
        <p className="mt-4 rounded-lg border border-green/30 bg-green/10 px-4 py-3 text-sm text-green">
          {a.vouchersGenerated} <span className="font-mono font-semibold">{generatedCode}</span>
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-danger-ink">
          {error}
        </p>
      )}

      {deleteNotice && (
        <p className="mt-4 rounded-lg border border-green/30 bg-green/10 px-4 py-3 text-sm text-green-ink">
          {deleteNotice}
        </p>
      )}

      {picking.size > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-semibold text-ink">{a.selectedN(picking.size)}</span>
          <span className="text-xs text-muted">{a.vouchersDeletableOf(deletableIds.length, picking.size)}</span>
          <button
            type="button"
            onClick={() => (deletableIds.length > 0 ? setConfirmingDelete(true) : setError(a.vouchersDeleteNone))}
            className="inline-flex items-center rounded-full border border-red-500/40 px-4 py-2 text-sm font-medium text-danger-ink hover:bg-red-500/10"
          >
            {a.vouchersDeleteN(deletableIds.length || picking.size)}
          </button>
          <button
            type="button"
            onClick={() => setPicking(new Set())}
            className="inline-flex items-center rounded-full border border-black/12 px-4 py-2 text-sm font-medium text-ink hover:bg-black/[0.04]"
          >
            {a.dt.clear}
          </button>
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-muted">{a.loading}</p>
      ) : (
        <DataTable
          selected={picking}
          onSelectedChange={(next) => {
            setDeleteNotice(null);
            setPicking(next);
          }}
          rows={vouchers}
          columns={columns}
          rowKey={(v) => v.id}
          searchPlaceholder={a.vouchersFilter}
          emptyText={vouchers.length === 0 ? a.vouchersNone : a.vouchersNoMatch}
          initialSort={{ key: "created", dir: "desc" }}
        />
      )}

      {confirmingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6"
          onClick={() => !deleting && setConfirmingDelete(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl border border-black/8 bg-white p-7 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg font-medium text-ink">{a.vouchersDeleteTitle}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink">{a.vouchersDeleteBody(deletableIds.length)}</p>
            <p className="mt-3 rounded-lg border border-amber/30 bg-amber/10 px-3 py-2 text-xs leading-relaxed text-amber-ink">
              {a.vouchersDeleteWarning}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                disabled={deleting}
                className="rounded-full border border-black/10 px-5 py-2 text-sm font-medium text-ink transition hover:bg-black/[0.03] disabled:opacity-50"
              >
                {a.vouchersDeleteCancel}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-full bg-[#e5484d] px-5 py-2 text-sm font-semibold text-[#ffffff] transition hover:opacity-90 disabled:opacity-50"
              >
                {deleting ? a.vouchersDeleting : a.vouchersDeleteConfirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {redeemersModalVoucher && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6"
          onClick={() => setRedeemersModalVoucher(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-md overflow-hidden rounded-2xl border border-black/8 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-black/8 px-5 py-4">
              <div>
                <p className="font-mono text-sm font-semibold text-ink">
                  {redeemersModalVoucher.code}
                </p>
                <p className="text-xs text-muted">
                  {redemptionsFor(redeemersModalVoucher.id).length} personnes ·{" "}
                  {certName(redeemersModalVoucher.certification_id)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRedeemersModalVoucher(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 text-ink transition hover:bg-black/[0.03]"
              >
                ✕
              </button>
            </div>
            <div className="border-b border-black/8 px-5 py-3">
              <input
                type="text"
                value={redeemerSearch}
                onChange={(e) => setRedeemerSearch(e.target.value)}
                placeholder={a.vouchersSearchPerson}
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              />
            </div>
            <div className="max-h-[50vh] overflow-y-auto">
              {redemptionsFor(redeemersModalVoucher.id)
                .filter((r) => {
                  if (!redeemerSearch) return true;
                  const p = redeemers.get(r.user_id);
                  const haystack = `${p?.first_name ?? ""} ${p?.email ?? ""}`.toLowerCase();
                  return haystack.includes(redeemerSearch.toLowerCase());
                })
                .sort((a, b) => a.redeemed_at.localeCompare(b.redeemed_at))
                .map((r) => {
                  const p = redeemers.get(r.user_id);
                  return (
                    <div
                      key={r.user_id}
                      className="flex items-center justify-between gap-3 border-b border-black/5 px-5 py-2.5 text-sm last:border-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink">
                          {p?.first_name ?? "(sans nom)"}
                        </p>
                        {p?.email && <p className="truncate text-xs text-muted">{p.email}</p>}
                      </div>
                      <span className="shrink-0 text-xs text-muted">
                        {new Date(r.redeemed_at).toLocaleDateString(adminLocale(lang))}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
