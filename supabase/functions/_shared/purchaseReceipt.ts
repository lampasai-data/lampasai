import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import {
  emailPage,
  emailCardOpen,
  emailCardClose,
  emailHeader,
  emailFrameOpen,
  emailFrameClose,
  emailBody,
  emailSalutation,
  emailFooter,
} from "./email-layout.ts";

// Confirmation e-mail sent once a purchase has been recorded and the access
// is open. It is deliberately NOT an invoice: Gumroad is the seller and sends
// the official receipt, so this mail says what was unlocked, for how much and
// until when, and points back to Gumroad's receipt for the payment itself.
// A failure here must never undo or block the purchase it follows.
const RESEND_FROM = "Lampas .ai <noreply@lampasai.com>";
const SITE_URL = "https://lampasai.com";

type Lang = "fr" | "en";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const COPY = {
  fr: {
    subject: (cert: string) => `Confirmation de ton achat : ${cert}`,
    intro: (cert: string) =>
      `Merci pour ton achat ! Ton accès illimité à <strong>${cert}</strong> est ouvert. Voici le récapitulatif.`,
    rows: {
      cert: "Certification",
      access: "Accès",
      accessValue: "Illimité pendant 3 mois",
      amount: "Montant payé",
      date: "Date d'achat",
      until: "Accès jusqu'au",
    },
    gumroad:
      "Le paiement a été traité par Gumroad, qui t'envoie séparément le reçu officiel de ta transaction. Ce message confirme uniquement l'ouverture de ton accès sur Lampas .ai.",
    button: "Commencer à m'entraîner",
  },
  en: {
    subject: (cert: string) => `Your purchase confirmation: ${cert}`,
    intro: (cert: string) =>
      `Thank you for your purchase! Your unlimited access to <strong>${cert}</strong> is open. Here is the summary.`,
    rows: {
      cert: "Certification",
      access: "Access",
      accessValue: "Unlimited for 3 months",
      amount: "Amount paid",
      date: "Purchase date",
      until: "Access until",
    },
    gumroad:
      "The payment was processed by Gumroad, which sends you the official receipt for your transaction separately. This message only confirms that your access on Lampas .ai is open.",
    button: "Start practising",
  },
} as const;

function formatDate(date: Date, lang: Lang): string {
  if (lang === "fr") {
    const day = date.getDate();
    const rest = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    return `${day === 1 ? "1er" : day} ${rest}`;
  }
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatAmount(cents: number, currency: string, lang: Lang): string {
  try {
    return (cents / 100).toLocaleString(lang === "fr" ? "fr-FR" : "en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      currencyDisplay: "narrowSymbol",
    });
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}

function renderHtml(
  firstName: string | null,
  lang: Lang,
  fields: { cert: string; amount: string; purchaseDate: string; until: string }
): string {
  const c = COPY[lang];
  const cert = escapeHtml(fields.cert);
  const row = (label: string, value: string) => `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #F0F0F0;font-size:13px;color:#5B5B70;">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid #F0F0F0;font-size:13px;color:#14142B;font-weight:600;text-align:right;">${value}</td>
  </tr>`;
  const content = `
${emailSalutation(firstName, lang)}
<p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#5B5B70;">${c.intro(cert)}</p>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 20px;">
${row(c.rows.cert, cert)}
${row(c.rows.access, c.rows.accessValue)}
${row(c.rows.amount, escapeHtml(fields.amount))}
${row(c.rows.date, escapeHtml(fields.purchaseDate))}
${row(c.rows.until, escapeHtml(fields.until))}
</table>
<p style="margin:0 0 22px;font-size:12px;line-height:1.6;color:#9CA3AF;">${c.gumroad}</p>
<table cellpadding="0" cellspacing="0" role="presentation"><tr><td style="border-radius:999px;background-color:#4A8896;">
  <a href="${SITE_URL}/formations" style="display:inline-block;padding:12px 28px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;">${c.button}</a>
</td></tr></table>`;

  return emailPage(`
${emailCardOpen()}
        <tr>
${emailHeader()}
        </tr>
${emailFrameOpen()}
${emailBody(content)}
${emailFooter(lang)}
${emailFrameClose()}
${emailCardClose()}
  `);
}

export interface ReceiptInput {
  userId: string;
  certificationId: string;
  amountCents: number;
  currency: string;
  expiresAt: string;
  purchasedAt?: string | Date;
}

// Never throws: returns false (and logs) when the mail could not be sent.
export async function sendPurchaseReceipt(supabase: SupabaseClient, input: ReceiptInput): Promise<boolean> {
  try {
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("Purchase receipt skipped: RESEND_API_KEY is not set");
      return false;
    }

    const [{ data: profile }, { data: cert }] = await Promise.all([
      supabase.from("profiles").select("email, first_name, language").eq("id", input.userId).maybeSingle(),
      supabase.from("certifications").select("name").eq("id", input.certificationId).maybeSingle(),
    ]);
    if (!profile?.email || !cert?.name) return false;

    const lang: Lang = profile.language === "en" ? "en" : "fr";
    const html = renderHtml(profile.first_name as string | null, lang, {
      cert: cert.name as string,
      amount: formatAmount(input.amountCents, input.currency, lang),
      purchaseDate: formatDate(input.purchasedAt ? new Date(input.purchasedAt) : new Date(), lang),
      until: formatDate(new Date(input.expiresAt), lang),
    });

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: profile.email,
        subject: COPY[lang].subject(cert.name as string),
        html,
      }),
    });
    if (!res.ok) {
      console.error("Purchase receipt send failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Purchase receipt failed", err);
    return false;
  }
}
