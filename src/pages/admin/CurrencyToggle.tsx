import { useLanguage } from "../../i18n";
import type { DisplayCurrency } from "../../lib/useDisplayCurrency";
import { ADMIN_T } from "../adminI18n";

export default function CurrencyToggle({
  value,
  onChange,
}: {
  value: DisplayCurrency;
  onChange: (c: DisplayCurrency) => void;
}) {
  const { lang } = useLanguage();
  return (
    <div
      role="group"
      aria-label={ADMIN_T[lang].st.currencyLabel}
      className="inline-flex gap-1 rounded-xl border border-black/8 bg-white p-1 shadow-sm"
    >
      {(["eur", "usd"] as const).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          aria-pressed={value === c}
          className={`min-w-10 rounded-lg px-3 py-1.5 text-sm font-bold transition ${
            value === c ? "bg-teal/13 text-teal-dark" : "text-muted hover:text-ink"
          }`}
        >
          {c === "eur" ? "€" : "$"}
        </button>
      ))}
    </div>
  );
}
