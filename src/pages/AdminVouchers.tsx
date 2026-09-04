import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { listCertifications, type CertificationSummary } from "../lib/quizData";
import { localize } from "../lib/i18nText";
import { useLanguage } from "../i18n";

const ADMIN_EMAIL = "mbairo.allatessem@gmail.com";
const PAGE_SIZE = 10;

interface VoucherRow {
  id: string;
  code: string;
  certification_id: string;
  expires_at: string | null;
  created_at: string;
  max_redemptions: number;
}

interface RedemptionRow {
  voucher_id: string;
  user_id: string;
  redeemed_at: string;
}

export default function AdminVouchers() {
  const { user, ready } = useAuth();
  const { lang } = useLanguage();
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

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
  const [generating, setGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [filterCode, setFilterCode] = useState("");
  const [filterCertId, setFilterCertId] = useState("");
  const [filterType, setFilterType] = useState<"" | "unique" | "partage">("");
  const [filterStatus, setFilterStatus] = useState<"" | "disponible" | "epuise" | "expire">("");
  const [filterRedeemer, setFilterRedeemer] = useState("");
  const [page, setPage] = useState(0);
  const [redeemersModalVoucher, setRedeemersModalVoucher] = useState<VoucherRow | null>(null);
  const [redeemerSearch, setRedeemerSearch] = useState("");

  async function loadData() {
    if (!supabase) return;
    setLoading(true);
    const [certList, { data: voucherRows }, { data: redemptionRows }] = await Promise.all([
      listCertifications(),
      supabase
        .from("exam_vouchers")
        .select("id, code, certification_id, expires_at, created_at, max_redemptions")
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
        },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      }
    );

    setGenerating(false);

    if (invokeError || data?.error) {
      setError(data?.error ?? invokeError?.message ?? "Erreur inconnue.");
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
    return usageType(v) === "partage" ? "Partagé" : "Unique";
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
    if (category === "epuise") return `Épuisé (${count}/${v.max_redemptions})`;
    if (category === "expire") return "Expiré";
    return v.max_redemptions > 1 ? `Disponible (${count}/${v.max_redemptions})` : "Disponible";
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

  const filteredVouchers = vouchers.filter((v) => {
    if (filterCode && !v.code.toLowerCase().includes(filterCode.toLowerCase())) return false;
    if (filterCertId && v.certification_id !== filterCertId) return false;
    if (filterType && usageType(v) !== filterType) return false;
    if (filterStatus && statusCategory(v) !== filterStatus) return false;
    if (
      filterRedeemer &&
      !redeemerLabel(v).toLowerCase().includes(filterRedeemer.toLowerCase())
    )
      return false;
    return true;
  });
  const pageCount = Math.max(1, Math.ceil(filteredVouchers.length / PAGE_SIZE));
  const pagedVouchers = filteredVouchers.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  function resetPage<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPage(0);
    };
  }

  if (!ready) return null;
  if (!user || !isAdmin) {
    return <Navigate to="/formations" replace />;
  }

  return (
    <section className="mx-auto max-w-5xl px-6 pt-8 pb-16">
      <h1 className="font-display text-2xl font-semibold text-ink">Vouchers examen</h1>
      <p className="mt-2 text-sm text-muted">
        Génère un code qui débloque le mode examen (30 jours, sans export PDF) d'une
        certification, en usage unique ou partagé.
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-black/8 bg-white px-6 py-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted">Certification</label>
          <select
            value={certificationId}
            onChange={(e) => setCertificationId(e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-1.5 text-sm"
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
            Expiration du code (optionnel)
          </label>
          <input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-1.5 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted">Nombre d'utilisations</label>
          <input
            type="number"
            min={1}
            step={1}
            value={maxRedemptions}
            onChange={(e) => setMaxRedemptions(e.target.value)}
            className="w-28 rounded-lg border border-black/10 px-3 py-1.5 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating || !certificationId}
          className="brand-gradient rounded-full px-4 py-1.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {generating ? "Génération…" : "Générer un code"}
        </button>
      </div>

      {generatedCode && (
        <p className="mt-4 rounded-lg border border-green/30 bg-green/10 px-4 py-3 text-sm text-green">
          Code généré : <span className="font-mono font-semibold">{generatedCode}</span>
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-black/8 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/8 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="whitespace-nowrap px-4 py-3">Certification</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Créé le</th>
              <th className="whitespace-nowrap px-4 py-3">Statut</th>
              <th className="px-4 py-3">Utilisé par</th>
            </tr>
            <tr className="border-b border-black/8 bg-surface">
              <th className="px-4 py-2 font-normal">
                <input
                  type="text"
                  value={filterCode}
                  onChange={(e) => resetPage(setFilterCode)(e.target.value)}
                  placeholder="Filtrer…"
                  className="w-full rounded-md border border-black/10 bg-white px-2 py-1 text-xs normal-case"
                />
              </th>
              <th className="px-4 py-2 font-normal">
                <select
                  value={filterCertId}
                  onChange={(e) => resetPage(setFilterCertId)(e.target.value)}
                  className="w-full rounded-md border border-black/10 bg-white px-2 py-1 text-xs normal-case"
                >
                  <option value="">Toutes</option>
                  {certs.map((c) => (
                    <option key={c.id} value={c.id}>
                      {localize(c.name, lang)}
                    </option>
                  ))}
                </select>
              </th>
              <th className="px-4 py-2 font-normal">
                <select
                  value={filterType}
                  onChange={(e) =>
                    resetPage(setFilterType)(e.target.value as "" | "unique" | "partage")
                  }
                  className="w-full rounded-md border border-black/10 bg-white px-2 py-1 text-xs normal-case"
                >
                  <option value="">Tous</option>
                  <option value="unique">Unique</option>
                  <option value="partage">Partagé</option>
                </select>
              </th>
              <th className="px-4 py-2" />
              <th className="px-4 py-2 font-normal">
                <select
                  value={filterStatus}
                  onChange={(e) =>
                    resetPage(setFilterStatus)(
                      e.target.value as "" | "disponible" | "epuise" | "expire"
                    )
                  }
                  className="w-full rounded-md border border-black/10 bg-white px-2 py-1 text-xs normal-case"
                >
                  <option value="">Tous</option>
                  <option value="disponible">Disponible</option>
                  <option value="epuise">Épuisé</option>
                  <option value="expire">Expiré</option>
                </select>
              </th>
              <th className="px-4 py-2 font-normal">
                <input
                  type="text"
                  value={filterRedeemer}
                  onChange={(e) => resetPage(setFilterRedeemer)(e.target.value)}
                  placeholder="Filtrer…"
                  className="w-full rounded-md border border-black/10 bg-white px-2 py-1 text-xs normal-case"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-4 text-muted" colSpan={6}>
                  Chargement…
                </td>
              </tr>
            ) : filteredVouchers.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-muted" colSpan={6}>
                  {vouchers.length === 0 ? "Aucun voucher généré." : "Aucun voucher ne correspond aux filtres."}
                </td>
              </tr>
            ) : (
              pagedVouchers.map((v) => {
                const rows = redemptionsFor(v.id);
                return (
                  <tr key={v.id} className="border-b border-black/5 last:border-0">
                    <td className="px-4 py-3 font-mono">{v.code}</td>
                    <td className="whitespace-nowrap px-4 py-3">{certName(v.certification_id)}</td>
                    <td className="px-4 py-3">{usageTypeLabel(v)}</td>
                    <td className="px-4 py-3">{new Date(v.created_at).toLocaleDateString("fr-FR")}</td>
                    <td className="whitespace-nowrap px-4 py-3">{statusLabel(v)}</td>
                    <td className="px-4 py-3 max-w-[16rem]">
                      {rows.length === 0 ? (
                        "-"
                      ) : rows.length <= 3 ? (
                        <span className="line-clamp-2">{rows.map(redeemerName).join(", ")}</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setRedeemerSearch("");
                            setRedeemersModalVoucher(v);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/[0.06] px-3 py-1 text-xs font-medium text-teal-dark transition hover:bg-teal/10"
                        >
                          👥 {rows.length} personnes
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {filteredVouchers.length > PAGE_SIZE && (
        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-full border border-black/10 px-3 py-1.5 font-medium text-ink transition hover:border-black/20 disabled:opacity-40"
          >
            Précédent
          </button>
          <span>
            Page {page + 1} / {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page >= pageCount - 1}
            className="rounded-full border border-black/10 px-3 py-1.5 font-medium text-ink transition hover:border-black/20 disabled:opacity-40"
          >
            Suivant
          </button>
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
                placeholder="Rechercher un nom ou un email…"
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
                        {new Date(r.redeemed_at).toLocaleDateString("fr-FR")}
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
