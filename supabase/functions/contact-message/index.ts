import { corsHeaders, jsonResponse } from "../_shared/admin.ts";
import { createServiceClient } from "../_shared/gumroadMatch.ts";

// Receives the site's contact and training-request forms and forwards them by
// e-mail, so the contact address is never written in the page where robots
// harvest it. The address lives only here (CONTACT_TO secret, with a default).
//
// Anti-spam, in order: honeypot field, minimum fill time, per-IP and global
// hourly caps, and a cap on links in the message. A refused message gets the
// same "ok" answer as a sent one, so a robot learns nothing from the reply.
const RESEND_FROM = "Lampas .ai <noreply@lampasai.com>";
const CONTACT_TO = Deno.env.get("CONTACT_TO") ?? "contact@lampasai.com";
const MIN_FILL_MS = 2500;
const MAX_PER_IP_PER_HOUR = 5;
const MAX_TOTAL_PER_HOUR = 40;
const MAX_LINKS = 2;

const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[a-z]{2,}$/i;

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

interface Field {
  label: string;
  value: string;
}

function build(kind: string, body: Record<string, unknown>): { subject: string; email: string; fields: Field[]; message: string } | null {
  const email = clean(body.email, 200);
  if (!EMAIL_RE.test(email)) return null;

  if (kind === "contact") {
    const firstname = clean(body.firstname, 80);
    const lastname = clean(body.lastname, 80);
    const message = clean(body.message, 5000);
    if (!firstname || !lastname || message.length < 3) return null;
    return {
      subject: `Contact depuis lampasai.com - ${firstname} ${lastname}`,
      email,
      message,
      fields: [
        { label: "Prénom", value: firstname },
        { label: "Nom", value: lastname },
        { label: "Email", value: email },
        { label: "Téléphone", value: clean(body.phone, 40) || "-" },
      ],
    };
  }

  if (kind === "training") {
    const name = clean(body.name, 120);
    const tools = Array.isArray(body.tools) ? body.tools.map((t) => clean(t, 40)).filter(Boolean).slice(0, 10) : [];
    if (!name || tools.length === 0) return null;
    return {
      subject: `Demande de formation - devis - ${name}`,
      email,
      message: clean(body.message, 5000),
      fields: [
        { label: "Nom", value: name },
        { label: "Email", value: email },
        { label: "Outil(s)", value: tools.join(", ") },
        { label: "Niveau", value: clean(body.level, 60) || "-" },
        { label: "Format", value: clean(body.format, 60) || "-" },
      ],
    };
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405);

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return jsonResponse({ error: "invalid" }, 400);

  // Robots: pretend it worked.
  if (clean(body.company_website, 200) || Number(body.elapsedMs) < MIN_FILL_MS) return jsonResponse({ ok: true });

  const built = build(String(body.kind ?? ""), body);
  if (!built) return jsonResponse({ error: "invalid" }, 400);

  const links = (built.message.match(/https?:\/\/|www\./gi) ?? []).length;
  if (links > MAX_LINKS) return jsonResponse({ ok: true });

  const supabase = createServiceClient();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const [perIp, total] = await Promise.all([
    supabase.rpc("record_and_count_rate_limit", { p_bucket: `contact:${ip}`, p_window: "1 hour" }),
    supabase.rpc("record_and_count_rate_limit", { p_bucket: "contact:all", p_window: "1 hour" }),
  ]);
  if ((perIp.data ?? 0) > MAX_PER_IP_PER_HOUR || (total.data ?? 0) > MAX_TOTAL_PER_HOUR) {
    return jsonResponse({ error: "rate_limited" }, 429);
  }

  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.error("contact-message: RESEND_API_KEY is not set");
    return jsonResponse({ error: "unavailable" }, 503);
  }

  const rows = built.fields
    .map(
      (f) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#5B5B70;">${escapeHtml(f.label)}</td><td style="padding:6px 0;color:#14142B;font-weight:600;">${escapeHtml(f.value)}</td></tr>`
    )
    .join("");
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;">
<table cellpadding="0" cellspacing="0">${rows}</table>
${built.message ? `<p style="margin-top:16px;white-space:pre-wrap;color:#14142B;">${escapeHtml(built.message)}</p>` : ""}
<p style="margin-top:20px;font-size:12px;color:#9CA3AF;">Envoyé depuis le formulaire de lampasai.com. Réponds directement à ce mail pour écrire à la personne.</p>
</div>`;
  const text = [...built.fields.map((f) => `${f.label}: ${f.value}`), "", built.message].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: RESEND_FROM, to: CONTACT_TO, reply_to: built.email, subject: built.subject, html, text }),
  });
  if (!res.ok) {
    console.error("contact-message: Resend send failed", res.status, await res.text());
    return jsonResponse({ error: "send_failed" }, 502);
  }
  return jsonResponse({ ok: true });
});
