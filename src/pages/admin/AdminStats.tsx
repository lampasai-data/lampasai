import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../i18n";
import { ADMIN_T } from "../adminI18n";
import { actionableCount } from "../../lib/adminAlerts";
import { rangeFromParams, rangeToParams, type DateRange } from "../../lib/dateRange";
import { useDisplayCurrency } from "../../lib/useDisplayCurrency";
import AlertsTab from "./stats/AlertsTab";
import CurrencyToggle from "./CurrencyToggle";
import DateRangePicker from "./DateRangePicker";
import ExamsTab from "./stats/ExamsTab";
import OverviewTab from "./stats/OverviewTab";
import RetentionTab from "./stats/RetentionTab";
import SalesTab from "./stats/SalesTab";
import UsersTab from "./stats/UsersTab";
import { useAdminContext } from "./useAdminContext";

const TABS = ["overview", "sales", "users", "retention", "exams", "alerts"] as const;
type Tab = (typeof TABS)[number];

export default function AdminStats() {
  const { lang } = useLanguage();
  const st = ADMIN_T[lang].st;
  const { profile } = useAuth();
  const { loading, alerts } = useAdminContext();
  const [params, setParams] = useSearchParams();

  // The tab lives in the URL (?tab=alerts) so an alert, or a bookmark, can
  // link straight to it.
  const requested = params.get("tab");
  const tab: Tab = TABS.includes(requested as Tab) ? (requested as Tab) : "overview";

  const [currency, setCurrency] = useDisplayCurrency();

  const labels: Record<Tab, string> = {
    overview: st.tabOverview,
    sales: st.tabSales,
    users: st.tabUsers,
    retention: st.tabRetention,
    exams: st.tabExams,
    alerts: st.tabAlerts,
  };
  const alertCount = actionableCount(alerts);

  // The period is in the URL too (?range=7d, or ?from=…&to=…); the Alerts
  // tab describes the situation right now, so it ignores it.
  const range = useMemo(() => rangeFromParams(params), [params]);
  function changeRange(next: DateRange) {
    setParams({ tab, ...rangeToParams(next) });
  }

  return (
    <section className="w-full max-w-[1600px] px-6 lg:px-8 pt-8 pb-16">
      {/* Like the Wonjo back office: the greeting is the page title itself. */}
      <h1 className="font-display text-2xl font-semibold text-ink">
        {ADMIN_T[lang].greeting(new Date().getHours(), profile?.first_name ?? null)}
      </h1>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex max-w-full flex-wrap gap-0.5 rounded-xl border border-black/8 bg-white p-1 shadow-sm">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() =>
              setParams(t === "overview" ? {} : t === "alerts" ? { tab: t } : { tab: t, ...rangeToParams(range) })
            }
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-bold whitespace-nowrap transition ${
              tab === t ? "bg-teal/13 text-teal-dark" : "text-muted hover:text-ink"
            }`}
          >
            {labels[t]}
            {t === "alerts" && alertCount > 0 && (
              <span className="rounded-full bg-amber/25 px-1.5 text-[11px] font-extrabold text-amber-ink">{alertCount}</span>
            )}
          </button>
        ))}
      </div>
      {tab === "overview" && <CurrencyToggle value={currency} onChange={setCurrency} />}
      {(tab === "sales" || tab === "users" || tab === "retention" || tab === "exams") && <DateRangePicker value={range} onChange={changeRange} />}
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted">{ADMIN_T[lang].loading}</p>
      ) : (
        <>
          {tab === "overview" && <OverviewTab currency={currency} />}
          {tab === "sales" && <SalesTab range={range} />}
          {tab === "users" && <UsersTab range={range} />}
          {tab === "retention" && <RetentionTab range={range} />}
          {tab === "exams" && <ExamsTab range={range} />}
          {tab === "alerts" && <AlertsTab />}
        </>
      )}
    </section>
  );
}
