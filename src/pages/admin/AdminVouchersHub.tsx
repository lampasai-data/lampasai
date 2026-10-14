import { lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { ADMIN_T } from "../adminI18n";
import { useLanguage } from "../../i18n";

const AdminVouchers = lazy(() => import("../AdminVouchers"));
const AdminPricing = lazy(() => import("./AdminPricing"));

type SubTab = "vouchers" | "pricing";

// One admin entry, two sub-tabs. The tab lives in the URL (?onglet=tarification)
// so a reload or a shared link lands on the same one.
export default function AdminVouchersHub() {
  const { lang } = useLanguage();
  const a = ADMIN_T[lang];
  const [params, setParams] = useSearchParams();
  const tab: SubTab = params.get("onglet") === "tarification" ? "pricing" : "vouchers";

  const tabs: { id: SubTab; label: string }[] = [
    { id: "vouchers", label: a.tabVouchers },
    { id: "pricing", label: a.tabPricing },
  ];

  return (
    <>
      <div className="flex gap-8 border-b border-black/8 px-6 pt-6 lg:px-8">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setParams(item.id === "pricing" ? { onglet: "tarification" } : {})}
            className={`relative pb-3 text-sm font-semibold transition ${
              tab === item.id ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {item.label}
            {tab === item.id && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-teal" />}
          </button>
        ))}
      </div>
      <Suspense fallback={null}>{tab === "pricing" ? <AdminPricing /> : <AdminVouchers />}</Suspense>
    </>
  );
}
