import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { listCertifications, type CertificationSummary } from "../lib/quizData";
import { localize } from "../lib/i18nText";
import { useLanguage } from "../i18n";

const ADMIN_EMAIL = "mbairo.allatessem@gmail.com";

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

  function usageType(v: VoucherRow) {
    return v.max_redemptions > 1 ? "Partagé" : "Unique";
  }

  function status(v: VoucherRow) {
    const count = redemptionsFor(v.id).length;
    if (count >= v.max_redemptions) return `Épuisé (${count}/${v.max_redemptions})`;
    if (v.expires_at && new Date(v.expires_at) < new Date()) return "Expiré";
    return v.max_redemptions > 1 ? `Disponible (${count}/${v.max_redemptions})` : "Disponible";
  }

  function redeemerLabel(v: VoucherRow) {
    const rows = redemptionsFor(v.id);
    if (rows.length === 0) return "-";
    return rows
      .map((r) => {
        const p = redeemers.get(r.user_id);
        return p?.first_name ?? p?.email ?? r.user_id;
      })
      .join(", ");
  }

  if (!ready) return null;
  if (!user || !isAdmin) {
    return <Navigate to="/formations" replace />;
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">Vouchers examen</h1>
      <p className="mt-2 text-sm text-muted">
        Génère un code qui débloque le mode examen (30 jours, sans export PDF) pour une
        certification. Un code peut être utilisable une seule fois ou par plusieurs personnes.
      </p>

      <div className="mt-8 flex flex-wrap items-end gap-3 rounded-2xl border border-black/8 bg-white p-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted">Certification</label>
          <select
            value={certificationId}
            onChange={(e) => setCertificationId(e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm"
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
            className="rounded-lg border border-black/10 px-3 py-2 text-sm"
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
            className="w-28 rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating || !certificationId}
          className="brand-gradient rounded-full px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
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

      <div className="mt-8 overflow-x-auto rounded-2xl border border-black/8 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/8 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Certification</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Créé le</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Utilisé par</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-4 text-muted" colSpan={6}>
                  Chargement…
                </td>
              </tr>
            ) : vouchers.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-muted" colSpan={6}>
                  Aucun voucher généré.
                </td>
              </tr>
            ) : (
              vouchers.map((v) => (
                <tr key={v.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3 font-mono">{v.code}</td>
                  <td className="px-4 py-3">{certName(v.certification_id)}</td>
                  <td className="px-4 py-3">{usageType(v)}</td>
                  <td className="px-4 py-3">{new Date(v.created_at).toLocaleDateString("fr-FR")}</td>
                  <td className="px-4 py-3">{status(v)}</td>
                  <td className="px-4 py-3">{redeemerLabel(v)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
