import { createServiceClient } from "../_shared/gumroadMatch.ts";

// Daily sweep (pg_cron -> pg_net, see 021_expiry_reminders.sql) that emails
// anyone whose certification access expires in exactly 7 or 1 day(s), via
// Resend. Each milestone is guarded by its own *_sent_at column so a given
// purchase/voucher redemption is only ever reminded once per milestone,
// regardless of how many times the sweep runs. Authenticated with a shared
// secret since it isn't a Supabase-JWT-protected call - same pattern as
// gumroad-reconcile.
const RESEND_FROM = "Lampas .ai <noreply@lampasai.com>";
const SITE_URL = "https://lampasai.com";

interface Milestone {
  days: number;
  column: "reminder_7d_sent_at" | "reminder_1d_sent_at";
  subject: string;
  heading: string;
  body: string;
}

const MILESTONES: Milestone[] = [
  {
    days: 7,
    column: "reminder_7d_sent_at",
    subject: "Ton accès {cert} expire dans 7 jours",
    heading: "Ton accès expire bientôt",
    body: "Ton accès illimité à <strong>{cert}</strong> expire le <strong>{date}</strong> (dans 7 jours). Renouvelle-le dès maintenant pour continuer à t'entraîner sans interruption.",
  },
  {
    days: 1,
    column: "reminder_1d_sent_at",
    subject: "Dernier jour : ton accès {cert} expire demain",
    heading: "Dernier jour !",
    body: "Ton accès illimité à <strong>{cert}</strong> expire <strong>demain, le {date}</strong>. C'est le moment de renouveler si tu veux garder ton entraînement au mode examen et le classement.",
  },
];

function renderEmailHtml(heading: string, body: string, ctaUrl: string): string {
  return `
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #14142b;">
      <h1 style="font-size: 20px; margin: 0 0 16px;">${heading}</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #5b5b70;">${body}</p>
      <a href="${ctaUrl}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #4a8896; color: #ffffff; text-decoration: none; border-radius: 999px; font-size: 14px; font-weight: 500;">
        Renouveler mon accès
      </a>
      <p style="margin-top: 32px; font-size: 12px; color: #9a9aab;">Lampas .ai</p>
    </div>
  `;
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: RESEND_FROM, to, subject, html }),
  });
  if (!res.ok) {
    console.error("Resend send failed", res.status, await res.text());
    return false;
  }
  return true;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const secret = req.headers.get("X-Reminder-Secret");
  if (!secret || secret !== Deno.env.get("EXPIRY_REMINDER_SECRET")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createServiceClient();
  const results: Record<string, number> = {};

  for (const milestone of MILESTONES) {
    const dayStart = new Date();
    dayStart.setUTCDate(dayStart.getUTCDate() + milestone.days);
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

    const { data: rows, error } = await supabase
      .from("certification_purchases")
      .select("id, user_id, expires_at, certifications(name)")
      .eq("status", "paid")
      .is(milestone.column, null)
      .gte("expires_at", dayStart.toISOString())
      .lt("expires_at", dayEnd.toISOString());

    if (error) {
      console.error(`Failed to query milestone ${milestone.days}d`, error);
      continue;
    }
    if (!rows || rows.length === 0) {
      results[`${milestone.days}d`] = 0;
      continue;
    }

    // certification_purchases.user_id and profiles.id both reference
    // auth.users independently - there's no direct FK between the two
    // tables for PostgREST to embed, so profiles are fetched separately.
    const { data: profileRows } = await supabase
      .from("profiles")
      .select("id, email")
      .in(
        "id",
        rows.map((r) => r.user_id)
      );
    const emailByUserId = new Map((profileRows ?? []).map((p) => [p.id, p.email as string | null]));

    let sent = 0;
    for (const row of rows) {
      const cert = row.certifications as unknown as { name: string } | null;
      const email = emailByUserId.get(row.user_id);
      if (!email || !cert) continue;

      const expiresDate = new Date(row.expires_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const subject = milestone.subject.replace("{cert}", cert.name);
      const html = renderEmailHtml(
        milestone.heading,
        milestone.body.replace("{cert}", cert.name).replace("{date}", expiresDate),
        `${SITE_URL}/formations`
      );

      const ok = await sendEmail(email, subject, html);
      if (ok) {
        await supabase
          .from("certification_purchases")
          .update({ [milestone.column]: new Date().toISOString() })
          .eq("id", row.id);
        sent++;
      }
    }
    results[`${milestone.days}d`] = sent;
  }

  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" },
  });
});
