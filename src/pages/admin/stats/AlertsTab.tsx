import { Link } from "react-router-dom";
import { useLanguage } from "../../../i18n";
import type { AdminAlert, AlertPriority } from "../../../lib/adminAlerts";
import { ADMIN_T } from "../../adminI18n";
import { useAdminContext } from "../useAdminContext";

const BORDER: Record<AlertPriority, string> = {
  urgent: "border-l-red-500",
  important: "border-l-amber",
  info: "border-l-teal",
};
const COUNT: Record<AlertPriority, string> = {
  urgent: "bg-red-500/13 text-danger-ink",
  important: "bg-amber/20 text-amber-ink",
  info: "bg-teal/15 text-teal-dark",
};

export function AlertCard({ alert }: { alert: AdminAlert }) {
  const { lang } = useLanguage();
  const item = ADMIN_T[lang].al.items[alert.code];
  return (
    <div className={`flex items-center gap-4 rounded-xl border border-l-4 border-black/8 bg-white px-4 py-3 ${BORDER[alert.priority]}`}>
      <span className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-extrabold tabular-nums ${COUNT[alert.priority]}`}>
        {alert.count}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{item.title(alert.count)}</p>
        <p className="text-xs text-muted">{item.detail}</p>
      </div>
      <Link
        to={alert.to}
        state={alert.segment ? { segment: alert.segment } : undefined}
        className="shrink-0 rounded-full border border-teal/40 px-3.5 py-1.5 text-xs font-semibold text-teal-dark transition hover:bg-teal/5"
      >
        {item.action}
      </Link>
    </div>
  );
}

export default function AlertsTab() {
  const { lang } = useLanguage();
  const al = ADMIN_T[lang].al;
  const { alerts } = useAdminContext();

  if (alerts.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-green/30 bg-green/5 p-5">
        <p className="font-semibold text-ink">{al.allClear}</p>
        <p className="mt-0.5 text-sm text-muted">{al.allClearSub}</p>
      </div>
    );
  }

  const groups: { priority: AlertPriority; title: string; sub: string }[] = [
    { priority: "urgent", title: al.groupUrgent, sub: al.groupUrgentSub },
    { priority: "important", title: al.groupImportant, sub: al.groupImportantSub },
    { priority: "info", title: al.groupInfo, sub: al.groupInfoSub },
  ];

  return (
    <div className="mt-6 space-y-6">
      {groups.map((g) => {
        const list = alerts.filter((a) => a.priority === g.priority);
        if (list.length === 0) return null;
        return (
          <section key={g.priority}>
            <h3 className="font-display text-base font-semibold text-ink">
              {g.title} <span className="text-xs font-normal text-muted">· {g.sub}</span>
            </h3>
            <div className="mt-2.5 space-y-2">
              {list.map((a) => (
                <AlertCard key={a.code} alert={a} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
