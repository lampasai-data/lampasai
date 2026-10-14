import { useLanguage } from "../../../i18n";
import { DAY_MS, isActivePurchase, type AdminProfile } from "../../../lib/adminData";
import { addDays, inRange, startOfDay, type DateRange } from "../../../lib/dateRange";
import { localize } from "../../../lib/i18nText";
import { ADMIN_T, adminLocale } from "../../adminI18n";
import { Card, Kpi, KpiGrid, StepBars } from "../charts";
import DataTable, { type Column } from "../DataTable";
import { useAdminContext } from "../useAdminContext";

interface CohortRow {
  week: string;
  size: number;
  activated: number | null;
  retained: number | null;
  exam: number;
  bought: number;
}
interface NudgeRow {
  profile: AdminProfile;
  voucherEnd: string;
  answers: number;
  lastAnswer: string | null;
  certName: string;
}

const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 100) : null);
const median = (xs: number[]) => {
  if (xs.length === 0) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
// Whole days between two instants.
const daysBetween = (from: string, to: string) => (new Date(to).getTime() - new Date(from).getTime()) / DAY_MS;
const dayIndex = (signup: string, day: string) =>
  Math.floor((new Date(day + "T00:00:00Z").getTime() - startOfDay(new Date(signup)).getTime()) / DAY_MS);
const mondayOf = (d: Date) => addDays(startOfDay(d), -((d.getDay() + 6) % 7));

export default function RetentionTab({ range }: { range: DateRange }) {
  const { lang } = useLanguage();
  const a = ADMIN_T[lang];
  const rt = a.rt;
  const locale = adminLocale(lang);
  const { data } = useAdminContext();

  if (!data.activityLoaded) {
    return <p className="mt-6 rounded-xl border border-amber/40 bg-amber/10 p-4 text-sm text-ink">{rt.unavailable}</p>;
  }

  const { activity, purchases, results, certs } = data;
  const now = Date.now();
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(locale);

  // The admin's own account is a test account: left out of every figure.
  const isAdmin = (p: AdminProfile) => p.id === data.adminUserId;
  const users = data.profiles.filter((p) => !isAdmin(p));
  const signups = users.filter((p) => inRange(p.created_at, range));

  const ageDays = (p: AdminProfile) => (now - new Date(p.created_at).getTime()) / DAY_MS;
  const examUsers = new Set(results.map((r) => r.user_id));
  const voucherUsers = new Set(purchases.filter((p) => p.source === "voucher").map((p) => p.user_id));
  const paidBuyers = new Set(purchases.filter((p) => p.status === "paid" && p.source !== "voucher").map((p) => p.user_id));

  // Activation: first practice answer within 24 h / 7 days of signing up,
  // counted only among accounts old enough for the window to have elapsed.
  const activatedWithin = (p: AdminProfile, days: number) => {
    const act = activity.get(p.id);
    return !!act && daysBetween(p.created_at, act.firstAnswerAt) <= days;
  };
  const elig24 = signups.filter((p) => ageDays(p) >= 1);
  const elig7 = signups.filter((p) => ageDays(p) >= 7);
  const act24 = pct(elig24.filter((p) => activatedWithin(p, 1)).length, elig24.length);
  const act7 = pct(elig7.filter((p) => activatedWithin(p, 7)).length, elig7.length);

  // Retention: among activated accounts old enough, any answer during week N
  // after signing up (week 1 = days 7-13, week 4 = days 28-34).
  const retained = (p: AdminProfile, week: number) =>
    (activity.get(p.id)?.activeDays ?? []).some((d) => {
      const i = dayIndex(p.created_at, d);
      return i >= week * 7 && i < week * 7 + 7;
    });
  const retention = (week: number) => {
    const base = signups.filter((p) => activity.has(p.id) && ageDays(p) >= week * 7 + 7);
    return pct(base.filter((p) => retained(p, week)).length, base.length);
  };

  const activeLast7 = users.filter((p) => {
    const last = activity.get(p.id)?.lastAnswerAt;
    return last && now - new Date(last).getTime() < 7 * DAY_MS;
  }).length;

  // Voucher -> purchase, over everyone who ever had a voucher.
  const vouchered = users.filter((p) => voucherUsers.has(p.id));
  const voucherBuyers = vouchered.filter((p) => paidBuyers.has(p.id)).length;

  // Delay between creating the account and the first paid purchase.
  const delays = users
    .filter((p) => paidBuyers.has(p.id))
    .map((p) => {
      const first = purchases
        .filter((x) => x.user_id === p.id && x.status === "paid" && x.source !== "voucher")
        .map((x) => x.created_at)
        .sort()[0];
      return Math.max(0, Math.round(daysBetween(p.created_at, first)));
    });
  const timeToBuy = median(delays);

  const total = signups.length;
  const funnel = [
    { label: rt.funnelAnswered, n: signups.filter((p) => activity.has(p.id)).length },
    { label: rt.funnelExam, n: signups.filter((p) => examUsers.has(p.id)).length },
    { label: rt.funnelVoucher, n: signups.filter((p) => voucherUsers.has(p.id)).length },
    { label: rt.funnelBought, n: signups.filter((p) => paidBuyers.has(p.id)).length },
  ];
  const funnelRows = [
    { label: a.st.funnelSignups, value: total },
    ...funnel.map((f) => ({ label: f.label, value: f.n, hint: `${pct(f.n, total) ?? 0} %` })),
  ];

  // Weekly cohorts of the period's sign-ups.
  const byWeek = new Map<string, AdminProfile[]>();
  for (const p of signups) {
    const key = mondayOf(new Date(p.created_at)).toISOString();
    byWeek.set(key, [...(byWeek.get(key) ?? []), p]);
  }
  const cohorts: CohortRow[] = [...byWeek.entries()].map(([week, members]) => {
    const e7 = members.filter((p) => ageDays(p) >= 7);
    const e14 = members.filter((p) => activity.has(p.id) && ageDays(p) >= 14);
    return {
      week,
      size: members.length,
      activated: pct(e7.filter((p) => activatedWithin(p, 7)).length, e7.length),
      retained: pct(e14.filter((p) => retained(p, 1)).length, e14.length),
      exam: pct(members.filter((p) => examUsers.has(p.id)).length, members.length) ?? 0,
      bought: pct(members.filter((p) => paidBuyers.has(p.id)).length, members.length) ?? 0,
    };
  });
  const pctCell = (v: number | null) => (v === null ? "-" : `${v} %`);
  const cohortColumns: Column<CohortRow>[] = [
    { key: "week", label: rt.colWeek, value: (c) => c.week, filter: "date", render: (c) => fmtDate(c.week) },
    { key: "size", label: rt.colSize, value: (c) => c.size },
    { key: "act", label: rt.colActivated, value: (c) => c.activated, render: (c) => pctCell(c.activated) },
    { key: "ret", label: rt.colRetained, value: (c) => c.retained, render: (c) => pctCell(c.retained) },
    { key: "exam", label: rt.colExam, value: (c) => c.exam, render: (c) => `${c.exam} %` },
    { key: "bought", label: rt.colBought, value: (c) => c.bought, render: (c) => `${c.bought} %` },
  ];

  // Voucher users about to lose access and not (yet) paying: the conversion moment.
  const certName = (id: string) => {
    const c = certs.find((x) => x.id === id);
    return c ? localize(c.name, lang) : id;
  };
  const nudge: NudgeRow[] = [];
  for (const p of users) {
    if (paidBuyers.has(p.id) && purchases.some((x) => x.user_id === p.id && x.source !== "voucher" && isActivePurchase(x, now))) continue;
    const v = purchases
      .filter((x) => x.user_id === p.id && x.source === "voucher" && isActivePurchase(x, now))
      .sort((x, y) => x.expires_at.localeCompare(y.expires_at))[0];
    if (!v || new Date(v.expires_at).getTime() - now > 7 * DAY_MS) continue;
    nudge.push({
      profile: p,
      voucherEnd: v.expires_at,
      answers: activity.get(p.id)?.answers ?? 0,
      lastAnswer: activity.get(p.id)?.lastAnswerAt ?? null,
      certName: certName(v.certification_id),
    });
  }
  const nudgeColumns: Column<NudgeRow>[] = [
    {
      key: "user",
      label: a.colPerson,
      value: (r) => `${r.profile.first_name ?? ""} ${r.profile.email ?? ""}`.trim(),
      render: (r) => (
        <span className="font-medium text-ink">
          {r.profile.first_name ?? "-"}
          <span className="block text-xs font-normal text-muted">{r.profile.email}</span>
        </span>
      ),
    },
    { key: "cert", label: a.st.colCertification, value: (r) => r.certName, filter: "options" },
    { key: "end", label: rt.colVoucherEnd, value: (r) => r.voucherEnd, filter: "date", render: (r) => fmtDate(r.voucherEnd) },
    { key: "answers", label: rt.colAnswers, value: (r) => r.answers },
    { key: "last", label: rt.colLastAnswer, value: (r) => r.lastAnswer, filter: "date", render: (r) => (r.lastAnswer ? fmtDate(r.lastAnswer) : "-") },
  ];

  return (
    <>
      <KpiGrid>
        <Kpi
          label={rt.kpiActivation}
          value={pctCell(act7)}
          hint={rt.kpiActivationHint(pctCell(act24))}
        />
        <Kpi label={rt.kpiRetW1} value={pctCell(retention(1))} hint={rt.kpiRetHint} />
        <Kpi label={rt.kpiRetW4} value={pctCell(retention(4))} hint={rt.kpiRetHint} />
        <Kpi
          label={rt.kpiActive7d}
          value={activeLast7}
          hint={rt.kpiActive7dHint(pct(activeLast7, users.length) ?? 0)}
        />
        <Kpi
          label={rt.kpiVoucherConv}
          value={pctCell(pct(voucherBuyers, vouchered.length))}
          hint={rt.kpiVoucherConvHint(voucherBuyers, vouchered.length)}
        />
        <Kpi
          label={rt.kpiTimeToBuy}
          value={timeToBuy === null ? "-" : rt.days(Math.round(timeToBuy))}
          hint={rt.kpiTimeToBuyHint(delays.length)}
        />
      </KpiGrid>

      <div className="mt-6">
        <Card title={rt.funnel}>
          <StepBars rows={funnelRows} total={Math.max(total, 1)} />
        </Card>
      </div>

      <DataTable
        title={rt.cohorts}
        rows={cohorts}
        columns={cohortColumns}
        rowKey={(c) => c.week}
        initialSort={{ key: "week", dir: "desc" }}
      />
      <DataTable
        title={rt.nudge}
        rows={nudge}
        columns={nudgeColumns}
        rowKey={(r) => r.profile.id}
        initialSort={{ key: "end", dir: "asc" }}
        emptyText={rt.nudgeEmpty}
      />
    </>
  );
}
