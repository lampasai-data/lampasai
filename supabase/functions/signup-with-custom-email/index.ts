import { createServiceClient } from "../_shared/gumroadMatch.ts";
import { corsHeaders, jsonResponse } from "../_shared/admin.ts";
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
  cleanFirstName,
} from "../_shared/email-layout.ts";

// Creates the account and generates its confirmation link via the admin
// API (which does NOT trigger Supabase's own auto-sent email), then emails
// that link ourselves via Resend with our own branded template - so the
// confirmation email visibly comes from Lampas .ai, not
// noreply@mail.app.supabase.io, while the link itself is still a real
// Supabase-signed confirmation token (same security as the default flow).
const RESEND_FROM = "Lampas .ai <noreply@lampasai.com>";

function passwordError(password: string): string | null {
  if (password.length < 8) return "weak_password";
  if (!/[a-z]/.test(password)) return "weak_password";
  if (!/[A-Z]/.test(password)) return "weak_password";
  if (!/[0-9]/.test(password)) return "weak_password";
  return null;
}

type Lang = "fr" | "en";

// French is the default (and what every existing caller gets): English only
// when the site explicitly says the visitor is using it in English.
const CONFIRM_COPY: Record<Lang, { subject: string; intro: string; button: string; ignore: string }> = {
  fr: {
    subject: "Confirme ton adresse email - Lampas .ai",
    intro: "Merci d'avoir rejoint Lampas .ai. Confirme ton adresse email pour activer ton compte et commencer à t'entraîner.",
    button: "Confirmer mon compte",
    ignore: "Si tu n'es pas à l'origine de cette inscription, ignore simplement cet email.",
  },
  en: {
    subject: "Confirm your email address - Lampas .ai",
    intro: "Thanks for joining Lampas .ai. Confirm your email address to activate your account and start practising.",
    button: "Confirm my account",
    ignore: "If you did not sign up, simply ignore this email.",
  },
};

function renderConfirmEmailHtml(firstName: string | null, confirmUrl: string, lang: Lang = "fr"): string {
  const copy = CONFIRM_COPY[lang];
  const content = `
${emailSalutation(firstName, lang)}
<p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#5B5B70;">
  ${copy.intro}
</p>
<table cellpadding="0" cellspacing="0" role="presentation"><tr><td style="border-radius:999px;background-color:#4A8896;">
  <a href="${confirmUrl}" style="display:inline-block;padding:12px 28px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;">${copy.button}</a>
</td></tr></table>
<p style="margin:24px 0 0;font-size:12px;color:#9CA3AF;">
  ${copy.ignore}
</p>`;

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

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: RESEND_FROM, to, subject, html }),
  });
  if (!res.ok) {
    console.error("Resend send failed", res.status, await res.text());
    return false;
  }
  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { email, password, firstName: rawFirstName, redirectTo, language } = await req.json();
  const lang: Lang = language === "en" ? "en" : "fr";
  // A name with a link or markup is dropped (the account is still created,
  // without a first name) rather than stored and mailed as typed.
  const firstName = cleanFirstName(typeof rawFirstName === "string" ? rawFirstName : null);
  if (!email || !password || !redirectTo) {
    return jsonResponse({ errorCode: "unknown" }, 400);
  }

  const pwError = passwordError(password);
  if (pwError) return jsonResponse({ errorCode: pwError });

  const supabase = createServiceClient();

  // This endpoint is necessarily unauthenticated (it's the signup flow
  // itself), so without a throttle a scripted caller could mass-create
  // accounts and burn the Resend send quota on every attempt. 5 signups per
  // IP per hour is generous for a real visitor, tight for a script.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { data: attempts, error: rateLimitError } = await supabase.rpc(
    "record_and_count_rate_limit",
    { p_bucket: `signup:${ip}`, p_window: "1 hour" }
  );
  if (!rateLimitError && (attempts ?? 0) > 5) {
    return jsonResponse({ errorCode: "rate_limited" }, 429);
  }

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: {
      data: { first_name: firstName || null, language: lang },
      redirectTo,
    },
  });

  if (error) {
    const already = /already.*registered|already.*exists/i.test(error.message);
    console.error("generateLink failed", error.message);
    return jsonResponse({ errorCode: already ? "already_registered" : "unknown" });
  }

  const confirmUrl = data.properties.action_link;
  const sent = await sendEmail(email, CONFIRM_COPY[lang].subject, renderConfirmEmailHtml(firstName || null, confirmUrl, lang));

  if (!sent) {
    // The account exists but the email failed to send - report a generic
    // error rather than silently leaving the user with no way to confirm.
    return jsonResponse({ errorCode: "unknown" });
  }

  return jsonResponse({ errorCode: null });
});
