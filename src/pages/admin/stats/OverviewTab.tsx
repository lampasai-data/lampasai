import { useLanguage } from "../../../i18n";
import { localize } from "../../../lib/i18nText";
import { ADMIN_T, adminLocale } from "../../adminI18n";
import { currencyOf, feeRateOf, formatMoney, netCents, sumByCurrency } from "../../../lib/money";
import { DAY_MS, isActivePurchase, type AdminPurchase } from "../../../lib/adminData";
import type { DisplayCurrency } from "../../../lib/useDisplayCurrency";
import DataTable, { type Column } from "../DataTable";
import { useAdminContext } from "../useAdminContext";

export default function OverviewTab({ currency }: { currency: DisplayCurrency }) {
  const { lang } = useLanguage();
  const a = ADMIN_T[lang];
  const locale = adminLocale(lang);
  const { data, loading } = useAdminContext();
  const { profiles, purchases, results, certs } = data;

  if (loading) {
    return <p className="mt-8 text-sm text-muted">{a.loading}</p>;
  }

  const now = Date.now();
  const paid = purchases.filter((p) => p.status === "paid");
  const realSales = paid.filter((p) => p.source !== "voucher");
  const saleFeesOf = (p: AdminPurchase) => (p.gumroad_sale_id ? data.saleFees.get(p.gumroad_sale_id) : undefined);
  const netEurOf = (p: AdminPurchase) => netCents(p.amount_cents, feeRateOf(saleFeesOf(p)));

  // EUR view: what customers paid, and an estimate of the net (real amount
  // minus Gumroad's share). Other currencies are never added to the euros.
  const revenueByCurrency = sumByCurrency(realSales);
  const revenueEur = revenueByCurrency.get("eur") ?? 0;
  const otherRevenue = [...revenueByCurrency.entries()]
    .filter(([c]) => c !== "eur")
    .map(([c, cents]) => formatMoney(cents, c, locale))
    .join(" + ");
  const eurWithFees = realSales.filter((p) => currencyOf(p.currency) === "eur" && saleFeesOf(p));
  const netEur = eurWithFees.reduce((sum, p) => sum + netEurOf(p), 0);

  // USD view: Gumroad's own figures (price and fee in USD cents); price - fee
  // is exactly what lands in the Gumroad balance.
  const usdSales = realSales.filter((p) => saleFeesOf(p));
  const revenueUsd = usdSales.reduce((sum, p) => sum + saleFeesOf(p)!.priceUsdCents, 0);
  const netUsd = usdSales.reduce((sum, p) => sum + saleFeesOf(p)!.priceUsdCents - saleFeesOf(p)!.feeUsdCents, 0);

  const netUnknown =
    currency === "usd"
      ? realSales.length - usdSales.length
      : realSales.filter((p) => currencyOf(p.currency) === "eur").length - eurWithFees.length;
  const activeAccess = purchases.filter((p) => isActivePurchase(p, now));
  const sales7d = realSales.filter((p) => now - new Date(p.created_at).getTime() < 7 * DAY_MS);
  const sessions7d = results.filter((r) => now - new Date(r.completed_at).getTime() < 7 * DAY_MS);

  const profileById = new Map(profiles.map((p) => [p.id, p]));
  const certName = (id: string) => {
    const c = certs.find((x) => x.id === id);
    return c ? localize(c.name, lang) : id;
  };
  const columns: Column<AdminPurchase>[] = [
    {
      key: "buyer",
      label: a.st.colBuyer,
      value: (p) => `${profileById.get(p.user_id)?.first_name ?? ""} ${profileById.get(p.user_id)?.email ?? ""}`.trim(),
      render: (p) => {
        const buyer = profileById.get(p.user_id);
        return (
          <span className="font-medium text-ink">
            {buyer?.first_name ?? buyer?.email ?? "-"}
            <span className="block text-xs font-normal text-muted">{buyer?.email}</span>
          </span>
        );
      },
    },
    { key: "cert", label: a.st.colCertification, value: (p) => certName(p.certification_id), filter: "options" },
    { key: "source", label: a.st.colSource, value: (p) => a.sourceLabel(p.source), filter: "options" },
    {
      key: "amount",
      label: a.st.colAmount,
      value: (p) => (currency === "eur" ? p.amount_cents : (saleFeesOf(p)?.priceUsdCents ?? null)),
      align: "right",
      render: (p) => {
        if (currency === "eur") return formatMoney(p.amount_cents, p.currency, locale);
        const f = saleFeesOf(p);
        return f ? formatMoney(f.priceUsdCents, "usd", locale) : "-";
      },
    },
    {
      key: "date",
      label: a.st.colDate,
      value: (p) => p.created_at,
      filter: "date",
      render: (p) => new Date(p.created_at).toLocaleDateString(locale),
    },
  ];

  const kpis = [
    { label: a.kpiUsers, value: profiles.length },
    { label: a.kpiActiveAccess, value: activeAccess.length },
    currency === "eur"
      ? {
          label: a.kpiRevenue,
          value: formatMoney(revenueEur, "eur", locale),
          hint: otherRevenue ? `+ ${otherRevenue}` : undefined,
        }
      : { label: a.kpiRevenue, value: formatMoney(revenueUsd, "usd", locale), hint: a.st.kpiRevenueHintUsd },
    {
      label: a.st.kpiNet,
      value: currency === "eur" ? formatMoney(netEur, "eur", locale) : formatMoney(netUsd, "usd", locale),
      hint: currency === "eur" ? a.st.kpiNetHint(netUnknown) : a.st.kpiNetHintUsd(netUnknown),
    },
    { label: a.kpiSales7d, value: sales7d.length },
    { label: a.kpiSessions7d, value: sessions7d.length },
  ];

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-black/8 bg-white p-4">
            <p className="font-display text-2xl font-semibold text-ink">{k.value}</p>
            <p className="mt-1 text-xs text-muted">{k.label}</p>
            {k.hint && <p className="mt-0.5 text-[11px] text-muted/80">{k.hint}</p>}
          </div>
        ))}
      </div>

      <DataTable
        title={a.recentSales}
        rows={realSales}
        columns={columns}
        rowKey={(p) => `${p.user_id}-${p.certification_id}-${p.created_at}`}
        initialSort={{ key: "date", dir: "desc" }}
        emptyText={a.noSalesYet}
      />
    </>
  );
}
