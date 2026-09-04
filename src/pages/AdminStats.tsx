import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { listCertifications, type CertificationSummary } from "../lib/quizData";
import { localize } from "../lib/i18nText";
import { useLanguage } from "../i18n";

const ADMIN_EMAIL = "mbairo.allatessem@gmail.com";

interface ProfileRow {
  id: string;
  email: string | null;
  first_name: string | null;
  plan: string;
  created_at: string;
}

interface ExamResultRow {
  user_id: string;
  certification_id: string;
  correct_count: number;
  total_count: number;
  points: number;
  completed_at: string;
}

interface PurchaseRow {
  user_id: string;
  certification_id: string;
  amount_cents: number;
  status: string;
  source: string;
  created_at: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function formatEur(cents: number) {
  return (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export default function AdminStats() {
  const { user, ready } = useAuth();
  const { lang } = useLanguage();
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  const [certs, setCerts] = useState<CertificationSummary[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [results, setResults] = useState<ExamResultRow[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin || !supabase) return;
    (async () => {
      setLoading(true);
      const [certList, { data: profileRows }, { data: resultRows }, { data: purchaseRows }] =
        await Promise.all([
          listCertifications(),
          supabase!.from("profiles").select("id, email, first_name, plan, created_at"),
          supabase!
            .from("exam_results")
            .select("user_id, certification_id, correct_count, total_count, points, completed_at"),
          supabase!
            .from("certification_purchases")
            .select("user_id, certification_id, amount_cents, status, source, created_at"),
        ]);
      setCerts(certList);
      setProfiles((profileRows as ProfileRow[]) ?? []);
      setResults((resultRows as ExamResultRow[]) ?? []);
      setPurchases((purchaseRows as PurchaseRow[]) ?? []);
      setLoading(false);
    })();
  }, [isAdmin]);

  if (!ready) return null;
  if (!user || !isAdmin) return <Navigate to="/formations" replace />;

  function certName(id: string) {
    const cert = certs.find((c) => c.id === id);
    return cert ? localize(cert.name, lang) : id;
  }

  const now = Date.now();
  const newUsers7d = profiles.filter((p) => now - new Date(p.created_at).getTime() < 7 * DAY_MS);
  const newUsers30d = profiles.filter((p) => now - new Date(p.created_at).getTime() < 30 * DAY_MS);
  const sessions7d = results.filter((r) => now - new Date(r.completed_at).getTime() < 7 * DAY_MS);

  const paidPurchases = purchases.filter((p) => p.status === "paid");
  const revenueCents = paidPurchases
    .filter((p) => p.source !== "voucher")
    .reduce((sum, p) => sum + p.amount_cents, 0);
  const revenueBySource = ["stripe", "gumroad"].map((source) => ({
    source,
    cents: paidPurchases
      .filter((p) => p.source === source)
      .reduce((sum, p) => sum + p.amount_cents, 0),
    count: paidPurchases.filter((p) => p.source === source).length,
  }));
  const voucherCount = paidPurchases.filter((p) => p.source === "voucher").length;

  const perCert = certs.map((cert) => {
    const certResults = results.filter((r) => r.certification_id === cert.id);
    const certPurchases = paidPurchases.filter((p) => p.certification_id === cert.id);
    const uniqueUsers = new Set(certResults.map((r) => r.user_id)).size;
    const totalCorrect = certResults.reduce((sum, r) => sum + r.correct_count, 0);
    const totalAnswered = certResults.reduce((sum, r) => sum + r.total_count, 0);
    const avgScore = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : null;
    return {
      cert,
      sessions: certResults.length,
      uniqueUsers,
      avgScore,
      purchases: certPurchases.length,
    };
  });

  const recentSignups = [...profiles]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 3);

  // Best cumulative score this month per user, site-wide - same spirit as
  // the per-certification leaderboard, just not scoped to one cert.
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const thisMonthResults = results.filter((r) => new Date(r.completed_at) >= monthStart);
  const pointsByUser = new Map<string, number>();
  for (const r of thisMonthResults) {
    pointsByUser.set(r.user_id, (pointsByUser.get(r.user_id) ?? 0) + r.points);
  }
  const topPerformers = [...pointsByUser.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([userId, points]) => ({
      profile: profiles.find((p) => p.id === userId),
      points,
      sessions: thisMonthResults.filter((r) => r.user_id === userId).length,
    }));

  return (
    <section className="mx-auto max-w-5xl px-6 pt-8 pb-16">
      <h1 className="font-display text-2xl font-semibold text-ink">Statistiques</h1>
      <p className="mt-2 text-sm text-muted">
        Vue d'ensemble de l'activité du site : inscriptions, sessions d'examen et revenus.
      </p>

      {loading ? (
        <p className="mt-8 text-sm text-muted">Chargement…</p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Utilisateurs" value={profiles.length} />
            <StatCard label="Nouveaux (7j)" value={newUsers7d.length} />
            <StatCard label="Nouveaux (30j)" value={newUsers30d.length} />
            <StatCard label="Sessions d'examen" value={results.length} />
            <StatCard label="Sessions (7j)" value={sessions7d.length} />
            <StatCard label="Ventes payantes" value={paidPurchases.filter((p) => p.source !== "voucher").length} />
            <StatCard label="Vouchers utilisés" value={voucherCount} />
            <StatCard label="Revenu total" value={formatEur(revenueCents)} />
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
            {revenueBySource.map(({ source, cents, count }) => (
              <span
                key={source}
                className="rounded-full border border-black/10 bg-white px-3 py-1.5"
              >
                {source === "stripe" ? "Stripe" : "Gumroad"} : {formatEur(cents)} ({count} vente
                {count > 1 ? "s" : ""})
              </span>
            ))}
          </div>

          <h2 className="mt-10 font-display text-lg font-semibold text-ink">Par certification</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-black/8 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-black/8 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Certification</th>
                  <th className="px-4 py-3">Ventes</th>
                  <th className="px-4 py-3">Sessions</th>
                  <th className="px-4 py-3">Utilisateurs actifs</th>
                  <th className="px-4 py-3">Score moyen</th>
                </tr>
              </thead>
              <tbody>
                {perCert.map(({ cert, sessions, uniqueUsers, avgScore, purchases: certPurchases }) => (
                  <tr key={cert.id} className="border-b border-black/5 last:border-0">
                    <td className="px-4 py-3 font-medium text-ink">{certName(cert.id)}</td>
                    <td className="px-4 py-3">{certPurchases}</td>
                    <td className="px-4 py-3">{sessions}</td>
                    <td className="px-4 py-3">{uniqueUsers}</td>
                    <td className="px-4 py-3">{avgScore !== null ? `${avgScore}%` : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-10 font-display text-lg font-semibold text-ink">
            Meilleurs scores ce mois-ci
          </h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-black/8 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-black/8 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Utilisateur</th>
                  <th className="px-4 py-3">Points</th>
                  <th className="px-4 py-3">Sessions</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-muted" colSpan={4}>
                      Aucune session ce mois-ci.
                    </td>
                  </tr>
                ) : (
                  topPerformers.map((row, i) => (
                    <tr key={row.profile?.id ?? i} className="border-b border-black/5 last:border-0">
                      <td className="px-4 py-3 text-muted">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-ink">
                        {row.profile?.first_name ?? row.profile?.email ?? "-"}
                      </td>
                      <td className="px-4 py-3">{row.points}</td>
                      <td className="px-4 py-3">{row.sessions}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <h2 className="mt-10 font-display text-lg font-semibold text-ink">
            3 dernières inscriptions
          </h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-black/8 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-black/8 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Inscrit le</th>
                </tr>
              </thead>
              <tbody>
                {recentSignups.map((p) => (
                  <tr key={p.id} className="border-b border-black/5 last:border-0">
                    <td className="px-4 py-3 font-medium text-ink">{p.first_name ?? "-"}</td>
                    <td className="px-4 py-3">{p.email ?? "-"}</td>
                    <td className="px-4 py-3 capitalize">{p.plan}</td>
                    <td className="px-4 py-3">
                      {new Date(p.created_at).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-black/8 bg-white p-4">
      <p className="font-display text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}
