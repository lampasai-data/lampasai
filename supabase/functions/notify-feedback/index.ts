import { createServiceClient } from "../_shared/gumroadMatch.ts";
import {
  emailPage,
  emailCardOpen,
  emailCardClose,
  emailHeader,
  emailFrameOpen,
  emailFrameClose,
  emailBody,
} from "../_shared/email-layout.ts";

// Tells the team by e-mail that a user sent an opinion or a help request
// (FeedbackModal -> submit_feedback). Called by the database itself, through
// the trg_user_feedback_notify trigger (migration 051), never by the browser:
// no JWT, a shared secret instead (same pattern as send-expiry-reminders).
// Reply-To is the sender, so answering the mail answers the user.
const RESEND_FROM = "Lampas .ai <noreply@lampasai.com>";
const NOTIFY_TO = Deno.env.get("FEEDBACK_NOTIFY_TO") ?? "contact@lampasai.com";
const ADMIN_URL = "https://lampasai.com/admin/feedback";

const KIND_LABEL: Record<string, string> = {
  review: "Avis",
  idea: "Idée",
  problem: "Problème",
  help: "Demande d'aide",
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const secret = req.headers.get("X-Feedback-Secret");
  if (!secret || secret !== Deno.env.get("FEEDBACK_NOTIFY_SECRET")) {
    return json({ error: "Unauthorized" }, 401);
  }

  const { id } = await req.json().catch(() => ({ id: null }));
  if (typeof id !== "string") return json({ error: "id is required" }, 400);

  const supabase = createServiceClient();
  const { data: fb, error } = await supabase
    .from("user_feedback")
    .select("id, user_id, kind, rating, message, page, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error || !fb) return json({ error: "not_found" }, 404);

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, first_name")
    .eq("id", fb.user_id)
    .maybeSingle();

  const kind = KIND_LABEL[fb.kind] ?? fb.kind;
  const who = [profile?.first_name, profile?.email].filter(Boolean).join(" · ") || "Utilisateur inconnu";
  const stars = fb.rating ? "★".repeat(fb.rating) + "☆".repeat(5 - fb.rating) : null;
  const subject = `[Lampas .ai] ${kind}${stars ? ` ${stars}` : ""} - ${profile?.first_name || profile?.email || "utilisateur"}`;

  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 12px 4px 0;font-size:12px;color:#9CA3AF;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:4px 0;font-size:13px;color:#14142B;">${value}</td></tr>`;

  const content = `
<h1 style="margin:0 0 14px;font-size:20px;font-weight:700;color:#14142B;">${escapeHtml(kind)}${stars ? ` <span style="color:#F2B01E;">${stars}</span>` : ""}</h1>
<table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 16px;">
  ${row("De", escapeHtml(who))}
  ${row("Page", escapeHtml(fb.page ?? "-"))}
  ${row("Reçu le", escapeHtml(new Date(fb.created_at).toLocaleString("fr-FR", { timeZone: "Europe/Paris" })))}
</table>
<div style="margin:0 0 20px;padding:14px 16px;border-radius:12px;background-color:#F5F7F8;font-size:14px;line-height:1.6;color:#14142B;white-space:pre-wrap;">${escapeHtml(fb.message)}</div>
<p style="margin:0 0 20px;font-size:13px;color:#5B5B70;">${
    profile?.email ? "Réponds directement à cet e-mail pour écrire à la personne." : "Adresse de la personne introuvable."
  }</p>
<table cellpadding="0" cellspacing="0" role="presentation"><tr><td style="border-radius:999px;background-color:#4A8896;">
  <a href="${ADMIN_URL}" style="display:inline-block;padding:10px 24px;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;">Ouvrir dans l'admin</a>
</td></tr></table>`;

  const html = emailPage(`
${emailCardOpen()}
        <tr>
${emailHeader()}
        </tr>
${emailFrameOpen()}
${emailBody(content)}
${emailFrameClose()}
${emailCardClose()}
  `);

  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) return json({ error: "RESEND_API_KEY is not set" }, 500);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: NOTIFY_TO,
      subject,
      html,
      ...(profile?.email ? { reply_to: profile.email } : {}),
    }),
  });
  if (!res.ok) {
    console.error("Resend send failed", res.status, await res.text());
    return json({ error: "send_failed" }, 502);
  }
  return json({ ok: true });
});
