import { createServiceClient } from "../_shared/gumroadMatch.ts";
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

// Daily sweep (pg_cron -> pg_net, see 021_expiry_reminders.sql) that emails
// anyone whose certification access expires in exactly 7 or 1 day(s), via
// Resend. Each milestone is guarded by its own *_sent_at column so a given
// purchase/voucher redemption is only ever reminded once per milestone,
// regardless of how many times the sweep runs. Authenticated with a shared
// secret since it isn't a Supabase-JWT-protected call - same pattern as
// gumroad-reconcile.
const RESEND_FROM = "Lampas .ai <noreply@lampasai.com>";
const SITE_URL = "https://lampasai.com";

// French date convention: "1er janvier", not "1 janvier".
function formatFrenchDate(date: Date): string {
  const day = date.getDate();
  const rest = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  return `${day === 1 ? "1er" : day} ${rest}`;
}

interface Milestone {
  days: number;
  column: "reminder_7d_sent_at" | "reminder_1d_sent_at";
  subject: string;
  body: string;
}

const MILESTONES: Milestone[] = [
  {
    days: 7,
    column: "reminder_7d_sent_at",
    subject: "Ton accès {cert} expire dans 7 jours",
    body: "Ton accès illimité à <strong>{cert}</strong> expire le <strong>{date}</strong> (dans 7 jours). Renouvelle-le pour continuer à t'entraîner sans interruption.",
  },
  {
    days: 1,
    column: "reminder_1d_sent_at",
    subject: "Dernier jour : ton accès {cert} expire demain",
    body: "Ton accès illimité à <strong>{cert}</strong> expire <strong>demain, le {date}</strong>. C'est le moment de renouveler si tu veux continuer à t'entraîner en mode examen.",
  },
];

function renderEmailHtml(firstName: string | null, body: string, ctaUrl: string): string {
  const content = `
${emailSalutation(firstName)}
<p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#5B5B70;">${body}</p>
<table cellpadding="0" cellspacing="0" role="presentation"><tr><td style="border-radius:999px;background-color:#4A8896;">
  <a href="${ctaUrl}" style="display:inline-block;padding:12px 28px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;">Renouveler mon accès</a>
</td></tr></table>`;

  return emailPage(`
${emailCardOpen()}
        <tr>
${emailHeader()}
        </tr>
${emailFrameOpen()}
${emailBody(content)}
${emailFooter()}
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
      .select("id, email, first_name")
      .in(
        "id",
        rows.map((r) => r.user_id)
      );
    const profileByUserId = new Map(
      (profileRows ?? []).map((p) => [
        p.id,
        { email: p.email as string | null, firstName: p.first_name as string | null },
      ])
    );

    let sent = 0;
    for (const row of rows) {
      const cert = row.certifications as unknown as { name: string } | null;
      const profile = profileByUserId.get(row.user_id);
      if (!profile?.email || !cert) continue;

      const expiresDate = formatFrenchDate(new Date(row.expires_at));
      const subject = milestone.subject.replace("{cert}", cert.name);
      const html = renderEmailHtml(
        profile.firstName,
        milestone.body.replace("{cert}", cert.name).replace("{date}", expiresDate),
        `${SITE_URL}/formations`
      );

      const ok = await sendEmail(profile.email, subject, html);
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
