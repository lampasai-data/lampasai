import { supabase } from "./supabase";
import { listCertifications, type CertificationSummary } from "./quizData";

export const ADMIN_EMAIL = "mbairo.allatessem@gmail.com";
export const DAY_MS = 24 * 60 * 60 * 1000;

// Same threshold as the Gumroad catch-up page: a pending sale younger than
// this is probably just waiting for the buyer to sign up.
export const PENDING_STALE_HOURS = 24;
export const EXPIRING_SOON_DAYS = 14;

export interface AdminProfile {
  id: string;
  email: string | null;
  first_name: string | null;
  language: string | null;
  avatar_url: string | null;
  plan: string;
  created_at: string;
}

export interface AdminPurchase {
  user_id: string;
  gumroad_sale_id: string | null;
  certification_id: string;
  amount_cents: number;
  currency: string | null;
  status: string;
  source: string;
  created_at: string;
  expires_at: string;
}

export interface AdminExamResult {
  user_id: string;
  certification_id: string;
  correct_count: number;
  total_count: number;
  points: number;
  completed_at: string;
}

export interface SaleFees {
  priceUsdCents: number;
  feeUsdCents: number;
}

export interface UserActivity {
  firstAnswerAt: string;
  lastAnswerAt: string;
  answers: number;
  correct: number;
  // Distinct UTC days with at least one answer (YYYY-MM-DD).
  activeDays: string[];
}

export interface VoucherUse {
  code: string;
  // A code several people can use, as opposed to a single-use one.
  shared: boolean;
  certification_id: string;
  redeemed_at: string;
}

export interface AdminData {
  certs: CertificationSummary[];
  profiles: AdminProfile[];
  purchases: AdminPurchase[];
  results: AdminExamResult[];
  // Gumroad sale id -> price and fee as Gumroad reports them, in USD cents
  // (price - fee is exactly what lands in the Gumroad balance). Their ratio
  // is currency-independent, so it also gives a euro estimate of the net.
  saleFees: Map<string, SaleFees>;
  // Practice activity per user, from the admin_user_activity() function.
  // `activityLoaded` is false when it could not be read (e.g. function missing).
  activity: Map<string, UserActivity>;
  activityLoaded: boolean;
  // Last sign-in time per user id (from admin_user_last_sign_in()).
  lastSignIn: Map<string, string>;
  // Exam voucher codes each user redeemed.
  voucherUses: Map<string, VoucherUse[]>;
  pendingStaleCount: number;
  // Gumroad events from the last 7 days that need a human look: real
  // errors only - harmless duplicates and heartbeats are filtered out.
  recentGumroadErrors: number;
}

export const EMPTY_ADMIN_DATA: AdminData = {
  certs: [],
  profiles: [],
  purchases: [],
  results: [],
  saleFees: new Map(),
  activity: new Map(),
  activityLoaded: false,
  lastSignIn: new Map(),
  voucherUses: new Map(),
  pendingStaleCount: 0,
  recentGumroadErrors: 0,
};

export function isActivePurchase(p: AdminPurchase, now = Date.now()) {
  return p.status === "paid" && new Date(p.expires_at).getTime() > now;
}

// The avatar column only exists once migration 046 is applied; until then the
// list is read without it rather than failing the whole admin area.
async function loadProfiles(): Promise<AdminProfile[]> {
  if (!supabase) return [];
  const full = await supabase.from("profiles").select("id, email, first_name, language, avatar_url, plan, created_at");
  if (!full.error) return (full.data as AdminProfile[]) ?? [];
  const basic = await supabase.from("profiles").select("id, email, first_name, language, plan, created_at");
  return ((basic.data as Omit<AdminProfile, "avatar_url">[]) ?? []).map((p) => ({ ...p, avatar_url: null }));
}

// Read-only: everything here goes through the admin SELECT policies that
// already exist (profiles, certification_purchases, exam_results, Gumroad
// tables). Nothing in the admin area writes to access-related rows except
// the pre-existing, explicit actions on the Gumroad and Vouchers pages.
export async function loadAdminData(): Promise<AdminData> {
  if (!supabase) return EMPTY_ADMIN_DATA;

  const staleThreshold = new Date(Date.now() - PENDING_STALE_HOURS * 60 * 60 * 1000).toISOString();
  const sinceLogs = new Date(Date.now() - 7 * DAY_MS).toISOString();

  const [certs, profiles, purchases, results, pending, logs, feeLogs, activityRes, signInRes, voucherRes, redemptionRes] = await Promise.all([
    listCertifications(),
    loadProfiles(),
    supabase
      .from("certification_purchases")
      .select("user_id, gumroad_sale_id, certification_id, amount_cents, currency, status, source, created_at, expires_at"),
    supabase
      .from("exam_results")
      .select("user_id, certification_id, correct_count, total_count, points, completed_at"),
    supabase
      .from("pending_gumroad_purchases")
      .select("id", { count: "exact", head: true })
      .is("resolved_at", null)
      .lt("created_at", staleThreshold),
    supabase
      .from("gumroad_webhook_logs")
      .select("match_result, verification_result, error_message")
      .gte("received_at", sinceLogs)
      .limit(500),
    // Fees are read from the stored webhook payloads (the ping, and the API
    // sale kept alongside it): nothing extra to maintain in the purchases table.
    supabase
      .from("gumroad_webhook_logs")
      .select(
        "gumroad_sale_id, ping_price:payload->>price, ping_fee:payload->>gumroad_fee, api_price:payload->api_sale->>price, api_fee:payload->api_sale->>gumroad_fee"
      )
      .eq("verification_result", "verified")
      .not("gumroad_sale_id", "is", null)
      .limit(2000),
    supabase.rpc("admin_user_activity"),
    supabase.rpc("admin_user_last_sign_in"),
    supabase.from("exam_vouchers").select("id, code, certification_id, max_redemptions").limit(5000),
    supabase.from("exam_voucher_redemptions").select("voucher_id, user_id, redeemed_at").limit(20000),
  ]);

  const activity = new Map<string, UserActivity>();
  for (const row of (activityRes.data as {
    user_id: string;
    first_answer_at: string;
    last_answer_at: string;
    answers: number;
    correct: number;
    active_days: string[];
  }[]) ?? []) {
    activity.set(row.user_id, {
      firstAnswerAt: row.first_answer_at,
      lastAnswerAt: row.last_answer_at,
      answers: Number(row.answers),
      correct: Number(row.correct),
      activeDays: row.active_days ?? [],
    });
  }

  const lastSignIn = new Map<string, string>();
  for (const row of (signInRes.data as { user_id: string; last_sign_in_at: string | null }[]) ?? []) {
    if (row.last_sign_in_at) lastSignIn.set(row.user_id, row.last_sign_in_at);
  }

  const vouchersById = new Map(
    ((voucherRes.data as { id: string; code: string; certification_id: string; max_redemptions: number }[]) ?? []).map(
      (v) => [v.id, v]
    )
  );
  const voucherUses = new Map<string, VoucherUse[]>();
  for (const r of (redemptionRes.data as { voucher_id: string; user_id: string; redeemed_at: string }[]) ?? []) {
    const v = vouchersById.get(r.voucher_id);
    if (!v) continue;
    const list = voucherUses.get(r.user_id) ?? [];
    list.push({
      code: v.code,
      shared: v.max_redemptions > 1,
      certification_id: v.certification_id,
      redeemed_at: r.redeemed_at,
    });
    voucherUses.set(r.user_id, list);
  }

  const saleFees = new Map<string, SaleFees>();
  for (const row of (feeLogs.data as {
    gumroad_sale_id: string;
    ping_price: string | null;
    ping_fee: string | null;
    api_price: string | null;
    api_fee: string | null;
  }[]) ?? []) {
    const price = Number(row.api_price ?? row.ping_price);
    const fee = Number(row.api_fee ?? row.ping_fee);
    const hasBoth = (row.api_price ?? row.ping_price) != null && (row.api_fee ?? row.ping_fee) != null;
    if (hasBoth && price > 0 && fee >= 0 && fee <= price) {
      saleFees.set(row.gumroad_sale_id, { priceUsdCents: price, feeUsdCents: fee });
    }
  }

  const errorLogs = ((logs.data as {
    match_result: string;
    verification_result: string;
    error_message: string | null;
  }[]) ?? []).filter((l) => {
    const isDuplicate =
      l.match_result === "duplicate" ||
      Boolean(l.error_message?.includes("certification_purchases_gumroad_sale_id_key"));
    if (isDuplicate) return false;
    return (
      l.match_result.startsWith("error") ||
      l.verification_result === "error" ||
      l.verification_result === "failed"
    );
  });

  return {
    certs,
    profiles,
    purchases: (purchases.data as AdminPurchase[]) ?? [],
    results: (results.data as AdminExamResult[]) ?? [],
    saleFees,
    activity,
    activityLoaded: !activityRes.error,
    lastSignIn,
    voucherUses,
    pendingStaleCount: pending.count ?? 0,
    recentGumroadErrors: errorLogs.length,
  };
}
