import { useLanguage } from "../../../i18n";
import { localize } from "../../../lib/i18nText";
import { bucketTitle, inRange, timeBuckets, type DateRange } from "../../../lib/dateRange";
import { ADMIN_T, adminLocale } from "../../adminI18n";
import { Card, HBars, Kpi, KpiGrid, TimeLine } from "../charts";
import DataTable, { type Column } from "../DataTable";
import { useAdminContext } from "../useAdminContext";

interface CertRow {
  id: string;
  name: string;
  sales: number;
  sessions: number;
  candidates: number;
  avgScore: number | null;
}
interface TopRow {
  userId: string;
  name: string;
  points: number;
  sessions: number;
  avgScore: number | null;
}

const ratio = (correct: number, total: number) => (total > 0 ? Math.round((correct / total) * 100) : null);

export default function ExamsTab({ range }: { range: DateRange }) {
  const { lang } = useLanguage();
  const st = ADMIN_T[lang].st;
  const locale = adminLocale(lang);
  const { data } = useAdminContext();
  const { certs, profiles } = data;
  const results = data.results.filter((r) => inRange(r.completed_at, range));
  const purchases = data.purchases.filter((p) => inRange(p.created_at, range));
  const candidates = new Set(results.map((r) => r.user_id)).size;
  const correct = results.reduce((s, r) => s + r.correct_count, 0);
  const answered = results.reduce((s, r) => s + r.total_count, 0);
  const timeline = timeBuckets(results, (r) => r.completed_at, () => 1, range);

  const buckets = [0, 0, 0, 0];
  for (const r of results) {
    const score = r.total_count > 0 ? (r.correct_count / r.total_count) * 100 : 0;
    buckets[score < 50 ? 0 : score < 70 ? 1 : score < 85 ? 2 : 3]++;
  }
  const distribution = st.scoreBuckets.map((label, i) => ({
    label,
    value: buckets[i],
    hint: `${results.length ? Math.round((buckets[i] / results.length) * 100) : 0} %`,
  }));

  const certRows: CertRow[] = certs.map((c) => {
    const rows = results.filter((r) => r.certification_id === c.id);
    return {
      id: c.id,
      name: localize(c.name, lang),
      sales: purchases.filter((p) => p.certification_id === c.id && p.status === "paid" && p.source !== "voucher").length,
      sessions: rows.length,
      candidates: new Set(rows.map((r) => r.user_id)).size,
      avgScore: ratio(rows.reduce((s, r) => s + r.correct_count, 0), rows.reduce((s, r) => s + r.total_count, 0)),
    };
  });

  const month = results; // already limited to the selected period
  const byUser = new Map<string, TopRow>();
  for (const r of month) {
    const p = profiles.find((x) => x.id === r.user_id);
    const row = byUser.get(r.user_id) ?? {
      userId: r.user_id,
      name: p?.first_name ?? p?.email ?? "-",
      points: 0,
      sessions: 0,
      avgScore: null,
    };
    row.points += r.points;
    row.sessions += 1;
    byUser.set(r.user_id, row);
  }
  for (const row of byUser.values()) {
    const rs = month.filter((r) => r.user_id === row.userId);
    // Weighted by question count: a 200-question run counts for more than a 20-question one.
    row.avgScore = ratio(rs.reduce((s, r) => s + r.correct_count, 0), rs.reduce((s, r) => s + r.total_count, 0));
  }
  const top = [...byUser.values()].sort((x, y) => y.points - x.points);

  const certColumns: Column<CertRow>[] = [
    { key: "cert", label: st.colCertification, value: (c) => c.name, render: (c) => <span className="font-medium text-ink">{c.name}</span> },
    { key: "sales", label: st.colSales, value: (c) => c.sales },
    { key: "sessions", label: st.colExams, value: (c) => c.sessions },
    { key: "candidates", label: st.colCandidates, value: (c) => c.candidates },
    { key: "avg", label: st.colAvgScore, value: (c) => c.avgScore, render: (c) => (c.avgScore !== null ? `${c.avgScore} %` : "-") },
  ];
  const topColumns: Column<TopRow>[] = [
    { key: "user", label: ADMIN_T[lang].statsUser, value: (r) => r.name, render: (r) => <span className="font-medium text-ink">{r.name}</span> },
    { key: "points", label: st.colPoints, value: (r) => r.points, render: (r) => r.points.toLocaleString(locale) },
    { key: "sessions", label: st.colExams, value: (r) => r.sessions },
    { key: "avg", label: st.colAvgScore, value: (r) => r.avgScore, render: (r) => (r.avgScore !== null ? `${r.avgScore} %` : "-") },
  ];

  return (
    <>
      <KpiGrid>
        <Kpi label={st.kpiExams} value={results.length} />
        <Kpi label={st.kpiAvgScore} value={answered ? `${ratio(correct, answered)} %` : "-"} />
        <Kpi label={st.kpiCandidates} value={candidates} />
        <Kpi label={st.kpiPerCandidate} value={candidates ? (results.length / candidates).toFixed(1) : "-"} />
      </KpiGrid>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title={st.examsByWeek}>
            <TimeLine
              buckets={timeline}
              locale={locale}
              format={String}
              tooltip={(b) => `${bucketTitle(b, locale, st.weekOf)} : ${st.sessionsCount(b.value)}`}
            />
          </Card>
        </div>
        <Card title={st.scoreDistribution}>
          <HBars rows={distribution} total={Math.max(results.length, 1)} />
        </Card>
      </div>

      <DataTable title={st.perCertification} rows={certRows} columns={certColumns} rowKey={(c) => c.id} />
      <DataTable
        title={st.topMonth}
        rows={top}
        columns={topColumns}
        rowKey={(r) => r.userId}
        initialSort={{ key: "points", dir: "desc" }}
        emptyText={st.noSessionThisMonth}
      />
    </>
  );
}
