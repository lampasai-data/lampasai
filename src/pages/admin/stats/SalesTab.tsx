import { useLanguage } from "../../../i18n";
import { localize } from "../../../lib/i18nText";
import { isActivePurchase, type AdminPurchase } from "../../../lib/adminData";
import { bucketTitle, inRange, timeBuckets, type DateRange } from "../../../lib/dateRange";
import { currencyOf, feeRateOf, formatMoney, netCents, sumByCurrency } from "../../../lib/money";
import { ADMIN_T, adminLocale } from "../../adminI18n";
import Badge from "../Badge";
import { Card, Donut, Kpi, KpiGrid, TimeLine } from "../charts";
import DataTable, { type Column } from "../DataTable";
import { useAdminContext } from "../useAdminContext";

export default function SalesTab({ range }: { range: DateRange }) {
  const { lang } = useLanguage();
  const a = ADMIN_T[lang];
  const st = a.st;
  const locale = adminLocale(lang);
  const { data } = useAdminContext();
  const { profiles, certs, saleFees } = data;
  const purchases = data.purchases.filter((p) => inRange(p.created_at, range));

  const eur = (cents: number) => formatMoney(cents, "eur", locale);
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(locale);
  const certName = (id: string) => {
    const c = certs.find((x) => x.id === id);
    return c ? localize(c.name, lang) : id;
  };
  const profileById = new Map(profiles.map((p) => [p.id, p]));
  const buyerName = (p: AdminPurchase) => {
    const u = profileById.get(p.user_id);
    return u?.first_name ? `${u.first_name} (${u.email ?? ""})` : (u?.email ?? "-");
  };

  // Everything outside the dashboard is shown in euros. Gumroad reports its
  // fee as a share of the price (the ratio is the same in USD and EUR), so the
  // euro net is the real amount minus that share - an estimate.
  const feesOf = (p: AdminPurchase) => (p.gumroad_sale_id ? saleFees.get(p.gumroad_sale_id) : undefined);
  const netEurOf = (p: AdminPurchase) => netCents(p.amount_cents, feeRateOf(feesOf(p)));

  const now = Date.now();
  const sales = purchases.filter((p) => p.status === "paid" && p.source !== "voucher");
  // Euros and other currencies are never added together: charts and the
  // headline figures are EUR, any other currency is listed beside them.
  const eurSales = sales.filter((p) => currencyOf(p.currency) === "eur");
  const revenue = eurSales.reduce((sum, p) => sum + p.amount_cents, 0);
  const withFees = eurSales.filter((p) => feesOf(p) !== undefined);
  const unknownFees = eurSales.length - withFees.length;
  const netEur = withFees.reduce((sum, p) => sum + netEurOf(p), 0);
  const feesEur = withFees.reduce((sum, p) => sum + p.amount_cents - netEurOf(p), 0);
  const otherRevenue = [...sumByCurrency(sales).entries()]
    .filter(([c]) => c !== "eur")
    .map(([c, cents]) => formatMoney(cents, c, locale))
    .join(" + ");
  const vouchers = purchases.filter((p) => p.status === "paid" && p.source === "voucher").length;
  const activeAccess = data.purchases.filter((p) => isActivePurchase(p, now)).length;

  const buckets = timeBuckets(eurSales, (p) => p.created_at, (p) => p.amount_cents, range);
  const bySource = ["gumroad", "stripe"].map((source) => {
    const rows = eurSales.filter((p) => p.source === source);
    return { label: a.sourceLabel(source), value: rows.reduce((s, p) => s + p.amount_cents, 0), hint: st.salesCount(rows.length) };
  });
  const byCert = certs.map((c) => {
    const rows = eurSales.filter((p) => p.certification_id === c.id);
    return { label: certName(c.id), value: rows.reduce((s, p) => s + p.amount_cents, 0), hint: st.salesCount(rows.length) };
  });

  const columns: Column<AdminPurchase>[] = [
    { key: "date", label: st.colDate, value: (p) => p.created_at, filter: "date", render: (p) => fmtDate(p.created_at) },
    { key: "buyer", label: st.colBuyer, value: buyerName, render: (p) => <span className="font-medium text-ink">{buyerName(p)}</span> },
    { key: "cert", label: st.colCertification, value: (p) => certName(p.certification_id), filter: "options" },
    { key: "source", label: st.colSource, value: (p) => a.sourceLabel(p.source), filter: "options" },
    {
      key: "amount",
      label: st.colAmount,
      value: (p) => p.amount_cents,
      align: "right",
      render: (p) => (p.source === "voucher" ? "-" : formatMoney(p.amount_cents, p.currency, locale)),
    },
    {
      key: "net",
      label: st.colNet,
      value: (p) => (p.source === "voucher" || !feesOf(p) ? null : netEurOf(p)),
      align: "right",
      render: (p) =>
        p.source === "voucher" || !feesOf(p) ? (
          "-"
        ) : (
          <span className="font-medium text-ink">{formatMoney(netEurOf(p), p.currency, locale)}</span>
        ),
    },
    {
      key: "status",
      label: st.colStatus,
      value: (p) => st.statusLabel(p.status),
      filter: "options",
      render: (p) => <Badge tone={p.status === "paid" ? "green" : "muted"}>{st.statusLabel(p.status)}</Badge>,
    },
    { key: "expires", label: st.colExpires, value: (p) => p.expires_at, filter: "date", render: (p) => fmtDate(p.expires_at) },
  ];

  return (
    <>
      <KpiGrid>
        <Kpi label={st.kpiRevenue} value={eur(revenue)} hint={otherRevenue ? `+ ${otherRevenue}` : st.kpiRevenueHint} />
        <Kpi label={st.kpiFees} value={eur(feesEur)} hint={st.kpiFeesHint} />
        <Kpi label={st.kpiNet} value={eur(netEur)} hint={st.kpiNetHint(unknownFees)} />
        <Kpi label={st.kpiSales} value={sales.length} hint={vouchers ? `+ ${vouchers} voucher${vouchers > 1 ? "s" : ""}` : undefined} />
        <Kpi label={st.kpiAvgBasket} value={eurSales.length ? eur(revenue / eurSales.length) : "-"} />
        <Kpi label={st.kpiActiveAccess} value={activeAccess} />
      </KpiGrid>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title={st.bySource}>
          <Donut rows={bySource} format={eur} totalLabel={st.donutTotal} otherLabel={st.other} />
        </Card>
        <Card title={st.byCertification}>
          <Donut rows={byCert} format={eur} totalLabel={st.donutTotal} otherLabel={st.other} />
        </Card>
      </div>

      <div className="mt-4">
        <Card title={st.revenueByWeek}>
          <TimeLine
            buckets={buckets}
            locale={locale}
            format={eur}
            tooltip={(b) => `${bucketTitle(b, locale, st.weekOf)} : ${eur(b.value)} · ${st.salesCount(b.count)}`}
          />
        </Card>
      </div>

      <DataTable
        title={st.allSales}
        rows={purchases}
        columns={columns}
        rowKey={(p) => `${p.user_id}-${p.certification_id}-${p.created_at}`}
        initialSort={{ key: "date", dir: "desc" }}
      />
    </>
  );
}
