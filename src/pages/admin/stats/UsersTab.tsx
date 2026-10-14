import { useLanguage } from "../../../i18n";
import { isActivePurchase, DAY_MS, type AdminProfile } from "../../../lib/adminData";
import { segmentUserIds } from "../../../lib/adminAlerts";
import { bucketTitle, inRange, timeBuckets, type DateRange } from "../../../lib/dateRange";
import { ADMIN_T, adminLocale } from "../../adminI18n";
import { Card, Kpi, KpiGrid, StepBars, TimeLine } from "../charts";
import DataTable, { type Column } from "../DataTable";
import { useAdminContext } from "../useAdminContext";

export default function UsersTab({ range }: { range: DateRange }) {
  const { lang } = useLanguage();
  const st = ADMIN_T[lang].st;
  const locale = adminLocale(lang);
  const { data } = useAdminContext();
  const { purchases, results } = data;

  const now = Date.now();
  const signups = data.profiles.filter((p) => inRange(p.created_at, range));

  const paidSales = purchases.filter((p) => p.status === "paid" && p.source !== "voucher");
  const activePeriod = new Set(results.filter((r) => inRange(r.completed_at, range)).map((r) => r.user_id)).size;
  const newBuyers = new Set(paidSales.filter((p) => inRange(p.created_at, range)).map((p) => p.user_id)).size;

  // Journey of the people who signed up in the period, wherever they are now.
  const examUsers = new Set(results.map((r) => r.user_id));
  const buyers = new Set(paidSales.map((p) => p.user_id));
  const activeUsers = new Set(purchases.filter((p) => isActivePurchase(p, now)).map((p) => p.user_id));
  const inCohort = (ids: Set<string>) => signups.filter((p) => ids.has(p.id)).length;
  const total = signups.length;
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

  const funnel = [
    { label: st.funnelSignups, value: total },
    { label: st.funnelExam, value: inCohort(examUsers), hint: `${pct(inCohort(examUsers))} %` },
    { label: st.funnelBought, value: inCohort(buyers), hint: `${pct(inCohort(buyers))} %` },
    { label: st.funnelActive, value: inCohort(activeUsers), hint: `${pct(inCohort(activeUsers))} %` },
  ];
  // Accounts that signed up in the period and then did nothing at all (no
  // exam, no paid or voucher access); same definition as the alert.
  const dormantIds = segmentUserIds(data, "dormant_signups", now);
  const dormant = signups.filter((p) => dormantIds.has(p.id));
  const daysSince = (p: AdminProfile) => Math.floor((now - new Date(p.created_at).getTime()) / DAY_MS);
  const buckets = timeBuckets(signups, (p) => p.created_at, () => 1, range);

  const columns: Column<AdminProfile>[] = [
    { key: "name", label: st.colName, value: (p) => p.first_name ?? "", render: (p) => <span className="font-medium text-ink">{p.first_name ?? "-"}</span> },
    { key: "email", label: st.colEmail, value: (p) => p.email ?? "" },
    { key: "plan", label: st.colPlan, value: (p) => p.plan, filter: "options", render: (p) => <span className="capitalize">{p.plan}</span> },
    {
      key: "signed",
      label: st.colSignedUp,
      value: (p) => p.created_at,
      filter: "date",
      render: (p) => new Date(p.created_at).toLocaleDateString(locale),
    },
  ];

  const dormantColumns: Column<AdminProfile>[] = [
    ...columns.filter((c) => c.key !== "plan"),
    { key: "days", label: st.colDaysSince, value: (p) => daysSince(p), align: "right" },
  ];

  return (
    <>
      <KpiGrid>
        <Kpi label={st.kpiSignupsPeriod} value={total} hint={st.kpiSignupsTotalHint(data.profiles.length)} />
        <Kpi label={st.kpiActivePeriod} value={activePeriod} />
        <Kpi label={st.kpiNewBuyers} value={newBuyers} />
        <Kpi label={st.kpiDormant} value={dormant.length} />
        <Kpi label={st.kpiActivation} value={total ? `${pct(inCohort(examUsers))} %` : "-"} hint={st.kpiActivationHint(inCohort(examUsers))} />
      </KpiGrid>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card title={st.signupsByWeek}>
          <TimeLine
            buckets={buckets}
            locale={locale}
            format={String}
            tooltip={(b) => `${bucketTitle(b, locale, st.weekOf)} : ${b.value}`}
          />
        </Card>
        <Card title={st.funnel}>
          <StepBars rows={funnel} total={Math.max(total, 1)} />
        </Card>
      </div>

      <DataTable
        title={st.dormantSignups}
        rows={dormant}
        columns={dormantColumns}
        rowKey={(p) => p.id}
        initialSort={{ key: "signed", dir: "desc" }}
      />

      <DataTable
        title={st.latestSignups}
        rows={signups}
        columns={columns}
        rowKey={(p) => p.id}
        initialSort={{ key: "signed", dir: "desc" }}
      />
    </>
  );
}
