import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../../i18n";
import { AUDIT_T } from "../adminAuditI18n";
import JournalTab from "./audit/JournalTab";
import SecurityTab from "./audit/SecurityTab";

const TABS = ["security", "journal"] as const;
type Tab = (typeof TABS)[number];

export default function AdminAudit() {
  const { lang } = useLanguage();
  const t = AUDIT_T[lang];
  const [params, setParams] = useSearchParams();
  const requested = params.get("tab");
  const tab: Tab = TABS.includes(requested as Tab) ? (requested as Tab) : "security";

  return (
    <section className="w-full max-w-[1600px] px-6 lg:px-8 pt-8 pb-16">
      <h1 className="font-display text-2xl font-semibold text-ink">{t.title}</h1>
      <p className="mt-1 text-sm text-muted">{t.subtitle}</p>

      <div className="mt-5 flex w-fit max-w-full flex-wrap gap-0.5 rounded-xl border border-black/8 bg-white p-1 shadow-sm">
        {TABS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setParams(id === "security" ? {} : { tab: id })}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-bold whitespace-nowrap transition ${
              tab === id ? "bg-teal/13 text-teal-dark" : "text-muted hover:text-ink"
            }`}
          >
            {t.tabs[id]}
          </button>
        ))}
      </div>

      {tab === "security" ? <SecurityTab /> : <JournalTab />}
    </section>
  );
}
