import { useEffect, useState } from "react";
import { useLanguage } from "../../../i18n";
import { supabase } from "../../../lib/supabase";
import { EMAIL_T } from "../../adminEmailsI18n";
import Badge from "../Badge";
import EmailPreview from "./EmailPreview";
import { btnGhost } from "./SentTab";

type AppEmailId = "signup_confirm" | "expiry_7d" | "expiry_1d";
const ORDER: { id: AppEmailId; fn: string }[] = [
  { id: "signup_confirm", fn: "signup-with-custom-email" },
  { id: "expiry_7d", fn: "send-expiry-reminders" },
  { id: "expiry_1d", fn: "send-expiry-reminders" },
];

// The e-mails Lampas sends on its own. Read-only: what triggers each one, who
// gets it, how many went out when that is tracked, and a look at the message.
export default function AppTab() {
  const { lang } = useLanguage();
  const t = EMAIL_T[lang];
  const [open, setOpen] = useState<AppEmailId | null>(null);
  const [counts, setCounts] = useState<Partial<Record<AppEmailId, number>>>({});

  useEffect(() => {
    if (!supabase) return;
    // Reminders are stamped on the purchase when sent, so they can be counted.
    Promise.all([
      supabase.from("certification_purchases").select("id", { count: "exact", head: true }).not("reminder_7d_sent_at", "is", null),
      supabase.from("certification_purchases").select("id", { count: "exact", head: true }).not("reminder_1d_sent_at", "is", null),
    ]).then(([d7, d1]) => setCounts({ expiry_7d: d7.count ?? 0, expiry_1d: d1.count ?? 0 }));
  }, []);

  const fill = (text: string) => text.replaceAll("{cert}", "Snowflake").replaceAll("{date}", "10 janvier 2027");

  return (
    <div>
      <p className="mt-5 text-sm text-muted">{t.app.intro}</p>
      <div className="mt-4 space-y-3">
        {ORDER.map(({ id, fn }) => {
          const item = t.app.items[id];
          const isOpen = open === id;
          return (
            <div key={id} className="rounded-2xl border border-black/8 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display text-base font-semibold text-ink">{item.name}</h3>
                  <dl className="mt-2 space-y-1 text-sm">
                    <div className="flex gap-2">
                      <dt className="w-24 shrink-0 text-muted">{t.app.trigger}</dt>
                      <dd className="text-ink">{item.trigger}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-24 shrink-0 text-muted">{t.app.recipient}</dt>
                      <dd className="text-ink">{item.recipient}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-24 shrink-0 text-muted">{t.app.sentBy}</dt>
                      <dd className="font-mono text-xs text-ink">{fn}</dd>
                    </div>
                  </dl>
                </div>
                <div className="flex items-center gap-3">
                  {counts[id] !== undefined ? <Badge tone="green">{t.app.sentCount(counts[id]!)}</Badge> : <Badge tone="muted">{t.app.notTracked}</Badge>}
                  <button type="button" className={btnGhost} onClick={() => setOpen(isOpen ? null : id)}>
                    {isOpen ? t.close : t.app.preview}
                  </button>
                </div>
              </div>
              {isOpen && (
                <div className="mt-4 border-t border-black/8 pt-4">
                  <p className="mb-3 text-sm font-semibold text-ink">{fill(item.subject)}</p>
                  <EmailPreview firstName="Prénom" paragraphs={item.paragraphs.map(fill)} ctaLabel={item.cta} />
                  <p className="mt-3 text-center text-xs text-muted">{t.app.note}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
