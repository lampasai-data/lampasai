import { useEffect, useState } from "react";
import { ADMIN_T, adminLocale } from "../adminI18n";
import { supabase } from "../../lib/supabase";
import { listCertifications, type CertificationSummary } from "../../lib/quizData";
import { refreshCertPrices } from "../../lib/certPrices";
import { formatMoney } from "../../lib/money";
import { localize } from "../../lib/i18nText";
import { useLanguage } from "../../i18n";

// Same bounds as the check in admin_set_certification_price: the database
// refuses anything outside them, this only gives the message sooner.
const MIN_CENTS = 100;
const MAX_CENTS = 9900;
// A change this large asks for an extra look: it is rarely intended.
const BIG_CHANGE_RATIO = 0.5;

interface PriceRow {
  certification_id: string;
  price_cents: number;
  updated_at: string;
  updated_by: string | null;
}

interface ChangeRow {
  id: string;
  certification_id: string;
  old_price_cents: number | null;
  new_price_cents: number;
  changed_by: string;
  changed_at: string;
}

function parseCents(input: string): number | null {
  const n = Number(input.trim().replace(",", "."));
  if (!input.trim() || !Number.isFinite(n)) return null;
  return Math.round(n * 100);
}

export default function AdminPricing() {
  const { lang } = useLanguage();
  const a = ADMIN_T[lang];
  const locale = adminLocale(lang);
  const money = (cents: number) => formatMoney(cents, "eur", locale);

  const [certs, setCerts] = useState<CertificationSummary[]>([]);
  const [prices, setPrices] = useState<Map<string, PriceRow>>(new Map());
  const [changes, setChanges] = useState<ChangeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirming, setConfirming] = useState<{ cert: CertificationSummary; oldCents: number | null; newCents: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ saved: string; reminder: string } | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  async function load() {
    if (!supabase) return;
    setLoading(true);
    const [certList, priceRes, changeRes] = await Promise.all([
      listCertifications(),
      supabase.from("certification_prices").select("certification_id, price_cents, updated_at, updated_by"),
      supabase
        .from("certification_price_changes")
        .select("id, certification_id, old_price_cents, new_price_cents, changed_by, changed_at")
        .order("changed_at", { ascending: false })
        .limit(50),
    ]);
    setCerts(certList);
    setPrices(new Map(((priceRes.data ?? []) as PriceRow[]).map((r) => [r.certification_id, r])));
    setChanges((changeRes.data ?? []) as ChangeRow[]);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  const certName = (id: string) => {
    const c = certs.find((x) => x.id === id);
    return c ? localize(c.name, lang) : id;
  };

  function review(cert: CertificationSummary) {
    setNotice(null);
    setGlobalError(null);
    const current = prices.get(cert.id)?.price_cents ?? null;
    const cents = parseCents(drafts[cert.id] ?? "");
    const fail = (message: string) => setErrors((e) => ({ ...e, [cert.id]: message }));
    if (cents === null) return fail(a.pricingInvalid);
    if (cents < MIN_CENTS || cents > MAX_CENTS) return fail(a.pricingRange(money(MIN_CENTS), money(MAX_CENTS)));
    if (cents === current) return fail(a.pricingUnchanged);
    setErrors((e) => ({ ...e, [cert.id]: "" }));
    setConfirming({ cert, oldCents: current, newCents: cents });
  }

  async function save() {
    if (!confirming || !supabase) return;
    setSaving(true);
    setGlobalError(null);
    const { cert, oldCents, newCents } = confirming;
    const { error } = await supabase.rpc("admin_set_certification_price", {
      p_certification_id: cert.id,
      p_price_cents: newCents,
      p_expected_cents: oldCents,
    });
    setSaving(false);
    setConfirming(null);
    if (error) {
      setGlobalError(error.message.includes("price_changed_meanwhile") ? a.pricingStale : a.pricingError);
      await load();
      return;
    }
    const name = localize(cert.name, lang);
    setNotice({ saved: a.pricingSaved(name, money(newCents)), reminder: a.pricingGumroadReminder(name, money(newCents)) });
    setDrafts((d) => ({ ...d, [cert.id]: "" }));
    await Promise.all([load(), refreshCertPrices()]);
  }

  const inputClass =
    "w-32 rounded-xl border border-black/12 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20";

  return (
    <section className="w-full max-w-[1600px] px-6 lg:px-8 pt-8 pb-16">
      <h1 className="font-display text-2xl font-semibold text-ink">{a.pricingTitle}</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted">{a.pricingLead}</p>
      <p className="mt-3 max-w-3xl rounded-lg border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber-ink">
        {a.pricingGumroadNote}
      </p>

      {notice && (
        <div className="mt-4 rounded-lg border border-green/30 bg-green/10 px-4 py-3 text-sm text-green-ink">
          <p className="font-medium">{notice.saved}</p>
          <p className="mt-1">{notice.reminder}</p>
        </div>
      )}
      {globalError && (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-danger-ink">
          {globalError}
        </p>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-muted">{a.loading}</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {certs.map((cert) => {
              const row = prices.get(cert.id);
              return (
                <div key={cert.id} className="rounded-2xl border border-black/8 bg-white px-6 py-5 shadow-sm">
                  <h2 className="font-display text-lg font-medium text-ink">{localize(cert.name, lang)}</h2>
                  <p className="mt-3 text-xs font-medium text-muted">{a.pricingCurrent}</p>
                  <p className="font-display text-3xl font-semibold text-ink tabular-nums">
                    {row ? money(row.price_cents) : "-"}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {row && row.updated_by
                      ? a.pricingLastChange(new Date(row.updated_at).toLocaleDateString(locale))
                      : a.pricingNeverChanged}
                  </p>
                  <div className="mt-4 flex flex-wrap items-end gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-muted" htmlFor={`price-${cert.id}`}>
                        {a.pricingNew}
                      </label>
                      <input
                        id={`price-${cert.id}`}
                        inputMode="decimal"
                        value={drafts[cert.id] ?? ""}
                        placeholder="4,99"
                        onChange={(e) => setDrafts((d) => ({ ...d, [cert.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && review(cert)}
                        className={inputClass}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => review(cert)}
                      disabled={!(drafts[cert.id] ?? "").trim()}
                      className="brand-gradient rounded-full px-5 py-2 text-sm font-semibold text-[#ffffff] shadow-sm shadow-teal/20 transition hover:opacity-90 disabled:opacity-50"
                    >
                      {a.pricingSave}
                    </button>
                  </div>
                  {errors[cert.id] && <p className="mt-2 text-xs text-danger-ink">{errors[cert.id]}</p>}
                </div>
              );
            })}
          </div>

          <h2 className="mt-10 font-display text-lg font-semibold text-ink">{a.pricingHistory}</h2>
          {changes.length === 0 ? (
            <p className="mt-3 text-sm text-muted">{a.pricingHistoryNone}</p>
          ) : (
            <div className="mt-3 overflow-x-auto rounded-2xl border border-black/8 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">{a.pricingColDate}</th>
                    <th className="px-4 py-3 font-medium">{a.pricingColCert}</th>
                    <th className="px-4 py-3 font-medium">{a.pricingColChange}</th>
                    <th className="px-4 py-3 font-medium">{a.pricingColBy}</th>
                  </tr>
                </thead>
                <tbody>
                  {changes.map((c) => (
                    <tr key={c.id} className="border-t border-black/5">
                      <td className="whitespace-nowrap px-4 py-2.5 text-muted">
                        {new Date(c.changed_at).toLocaleString(locale)}
                      </td>
                      <td className="px-4 py-2.5 text-ink">{certName(c.certification_id)}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 tabular-nums text-ink">
                        {c.old_price_cents === null ? "-" : money(c.old_price_cents)} → {money(c.new_price_cents)}
                      </td>
                      <td className="px-4 py-2.5 text-muted">{c.changed_by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {confirming && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
          onClick={() => !saving && setConfirming(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl border border-black/8 bg-white p-7 shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg font-medium text-ink">{a.pricingConfirmTitle}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink">
              {a.pricingConfirmBody(
                localize(confirming.cert.name, lang),
                confirming.oldCents === null ? "-" : money(confirming.oldCents),
                money(confirming.newCents)
              )}
            </p>
            {confirming.oldCents !== null &&
              Math.abs(confirming.newCents - confirming.oldCents) / confirming.oldCents >= BIG_CHANGE_RATIO && (
                <p className="mt-3 rounded-lg border border-amber/30 bg-amber/10 px-3 py-2 text-sm text-amber-ink">
                  {a.pricingBigChange(
                    Math.round((Math.abs(confirming.newCents - confirming.oldCents) / confirming.oldCents) * 100)
                  )}
                </p>
              )}
            <p className="mt-3 text-xs text-muted">{a.pricingGumroadNote}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirming(null)}
                disabled={saving}
                className="rounded-full border border-black/10 px-5 py-2 text-sm font-medium text-ink transition hover:bg-black/[0.03] disabled:opacity-50"
              >
                {a.pricingCancel}
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="brand-gradient rounded-full px-5 py-2 text-sm font-semibold text-[#ffffff] shadow-sm shadow-teal/20 transition hover:opacity-90 disabled:opacity-50"
              >
                {saving ? a.pricingSaving : a.pricingConfirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
