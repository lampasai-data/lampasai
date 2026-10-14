import { createServiceClient } from "../_shared/gumroadMatch.ts";
import { corsHeaders, jsonResponse, requireAdmin } from "../_shared/admin.ts";
import { logAdminAction } from "../_shared/audit.ts";
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
} from "../_shared/email-layout.ts";
import { unsubscribeApiUrl, unsubscribePageUrl } from "../_shared/unsubscribe.ts";

// E-mails sent from the admin "E-mails" tab to one person, a hand-picked
// selection or a segment. Admin only (JWT checked by requireAdmin). Addresses
// never reach the browser: the segment is resolved here with the service role.
// verify_jwt stays on (a real signed-in admin calls this).
const RESEND_FROM = "Lampas .ai <noreply@lampasai.com>";
const SITE_URL = "https://lampasai.com";
const BATCH_SIZE = 100; // Resend batch API limit
// Safety net against a mis-click: one send never goes beyond this.
const MAX_RECIPIENTS = 1000;

const SEGMENTS = [
  "selection",
  "all",
  "paying",
  "voucher_active",
  "voucher_expiring",
  "expiring_48h",
  "access_expiring",
  "paid_inactive",
  "voucher_expired",
  "recently_expired",
  "hot_leads",
  "dormant",
];

interface Body {
  type?: "service" | "promotion";
  subject?: string;
  message?: string;
  cta_label?: string;
  cta_url?: string;
  // Optional English version, sent to people who use the site in English
  // (everyone else, and anyone without an English version, gets the French).
  subject_en?: string;
  message_en?: string;
  cta_label_en?: string;
  // Narrow the targeting to one language.
  language?: "fr" | "en" | null;
  segment?: string;
  ids?: string[];
  test?: boolean;
  test_language?: "fr" | "en";
}

type Lang = "fr" | "en";

interface Recipient {
  user_id: string;
  email: string;
  first_name: string | null;
  language: Lang;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const firstName = (name: string | null) => {
  const word = (name ?? "").trim().split(/\s+/)[0] ?? "";
  return word ? word[0].toLocaleUpperCase() + word.slice(1).toLocaleLowerCase() : "";
};

interface Content {
  subject: string;
  message: string;
  cta_label?: string;
  cta_url?: string;
}

function buildHtml(content: Content, lang: Lang, r: Recipient, unsubscribeUrl: string | null) {
  const text = escapeHtml(content.message.replaceAll("{prenom}", firstName(r.first_name)))
    .split(/\n{2,}/)
    .map(
      (para) =>
        `<p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#5B5B70;">${para.replace(/\n/g, "<br>")}</p>`
    )
    .join("");
  const cta =
    content.cta_label && content.cta_url && /^https:\/\//.test(content.cta_url)
      ? `<table cellpadding="0" cellspacing="0" role="presentation" style="margin:22px 0 6px;"><tr><td style="border-radius:999px;background-color:#4A8896;">
  <a href="${escapeHtml(content.cta_url)}" style="display:inline-block;padding:12px 28px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;">${escapeHtml(content.cta_label)}</a>
</td></tr></table>`
      : "";
  const unsub = unsubscribeUrl
    ? `<p style="margin:22px 0 0;font-size:12px;color:#9CA3AF;">${
        lang === "en"
          ? "You are receiving this e-mail because you have a Lampas .ai account."
          : "Tu reçois cet e-mail car tu as un compte Lampas .ai."
      }<br>
  <a href="${unsubscribeUrl}" style="color:#9CA3AF;">${lang === "en" ? "Stop receiving our offers" : "Ne plus recevoir nos offres"}</a></p>`
    : "";

  return emailPage(`
${emailCardOpen()}
        <tr>
${emailHeader()}
        </tr>
${emailFrameOpen()}
${emailBody(`${emailSalutation(r.first_name, lang)}${text}${cta}${unsub}`)}
${emailFooter(lang)}
${emailFrameClose()}
${emailCardClose()}
  `);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const supabase = createServiceClient();
  const auth = await requireAdmin(supabase, req);
  if ("response" in auth) return auth.response;

  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) return jsonResponse({ error: "RESEND_API_KEY is not set" }, 500);

  const c = (await req.json()) as Body;
  const type: "service" | "promotion" | null =
    c.type === "promotion" ? "promotion" : c.type === "service" ? "service" : null;
  const subject = (c.subject ?? "").trim();
  const message = (c.message ?? "").trim();
  const segment = c.segment ?? "";
  if (!type) return jsonResponse({ error: "Invalid type" }, 400);
  if (!subject || subject.length > 150) return jsonResponse({ error: "Subject required (150 characters max)" }, 400);
  if (!message || message.length > 5000) return jsonResponse({ error: "Message required (5000 characters max)" }, 400);
  if (!SEGMENTS.includes(segment)) return jsonResponse({ error: "Invalid segment" }, 400);
  const subjectEn = (c.subject_en ?? "").trim();
  const messageEn = (c.message_en ?? "").trim();
  if (subjectEn.length > 150 || messageEn.length > 5000) {
    return jsonResponse({ error: "English version too long" }, 400);
  }
  const hasEnglish = subjectEn !== "" && messageEn !== "";
  const languageFilter: Lang | null = c.language === "fr" || c.language === "en" ? c.language : null;
  if (c.cta_url && !/^https:\/\//.test(c.cta_url)) {
    return jsonResponse({ error: "The button link must start with https://" }, 400);
  }

  let recipients: Recipient[];
  if (c.test) {
    // A test only ever goes to the admin's own address, in the chosen language.
    const { data: me } = await supabase.from("profiles").select("first_name").eq("id", auth.user.id).maybeSingle();
    recipients = [
      {
        user_id: auth.user.id,
        email: auth.user.email,
        first_name: me?.first_name ?? null,
        language: c.test_language === "en" ? "en" : "fr",
      },
    ];
  } else {
    const { data, error } = await supabase.rpc("fn_email_recipients", {
      p_segment: segment,
      p_ids: c.ids ?? [],
      p_type: type,
      p_language: languageFilter,
    });
    if (error) return jsonResponse({ error: error.message }, 500);
    recipients = (data ?? []) as Recipient[];
  }
  if (recipients.length === 0) return jsonResponse({ error: "No recipient for this targeting" }, 400);
  if (recipients.length > MAX_RECIPIENTS) {
    return jsonResponse({ error: `Too many recipients (${recipients.length}, max ${MAX_RECIPIENTS})` }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const french: Content = { subject, message, cta_label: c.cta_label, cta_url: c.cta_url };
  const english: Content = { subject: subjectEn, message: messageEn, cta_label: c.cta_label_en || c.cta_label, cta_url: c.cta_url };
  let sent = 0;
  let failed = 0;
  let englishCount = 0; // recipients who got the English version

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = await Promise.all(
      recipients.slice(i, i + BATCH_SIZE).map(async (r) => {
        const promo = type === "promotion";
        const pageUrl = promo ? await unsubscribePageUrl(SITE_URL, r.user_id) : null;
        const apiUrl = promo ? await unsubscribeApiUrl(supabaseUrl, r.user_id) : null;
        // English only when the person uses the site in English AND an English
        // version was written; otherwise French.
        const lang: Lang = r.language === "en" && hasEnglish ? "en" : "fr";
        const content = lang === "en" ? english : french;
        if (lang === "en") englishCount++;
        return {
          from: RESEND_FROM,
          to: r.email,
          subject: (c.test ? "[TEST] " : "") + content.subject,
          html: buildHtml(content, lang, r, pageUrl),
          ...(apiUrl
            ? { headers: { "List-Unsubscribe": `<${apiUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } }
            : {}),
        };
      })
    );
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(batch),
    });
    if (res.ok) {
      sent += batch.length;
    } else {
      failed += batch.length;
      console.error("Resend batch error:", await res.text());
    }
  }

  if (!c.test) {
    await supabase.from("admin_email_campaigns").insert({
      type,
      subject,
      message,
      cta_label: c.cta_label || null,
      cta_url: c.cta_url || null,
      subject_en: hasEnglish ? subjectEn : null,
      message_en: hasEnglish ? messageEn : null,
      cta_label_en: hasEnglish ? c.cta_label_en || null : null,
      language_filter: languageFilter,
      segment,
      recipients: recipients.length,
      sent,
      failed,
    });
  }

  await logAdminAction(supabase, auth.user.email, {
    action: c.test ? "email_test_sent" : "email_sent",
    targetType: "email",
    targetLabel: subject,
    detail: c.test
      ? { language: c.test_language === "en" ? "en" : "fr" }
      : { type, segment, language_filter: languageFilter, recipients: recipients.length, sent, failed },
  });

  return jsonResponse({
    ok: failed === 0,
    recipients: recipients.length,
    sent,
    failed,
    english: englishCount,
    // English speakers who got the French version because no English text was written.
    english_without_version: hasEnglish ? 0 : recipients.filter((r) => r.language === "en").length,
  });
});
