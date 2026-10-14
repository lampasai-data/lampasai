import { ADMIN_EMAIL, DAY_MS, EXPIRING_SOON_DAYS, isActivePurchase, type AdminData, type AdminPurchase } from "./adminData";

export type UserSegment =
  | "expiring_soon"
  | "paid_inactive"
  | "recently_expired"
  | "hot_leads"
  | "refunded"
  | "dormant_signups"
  | "cleanup";
// "cleanup" is a working list for the Users page, not an alert.
export type AlertCode = "gumroad_pending" | "gumroad_errors" | Exclude<UserSegment, "cleanup">;
export type AlertPriority = "urgent" | "important" | "info";

export interface AdminAlert {
  code: AlertCode;
  priority: AlertPriority;
  count: number;
  to: string;
  // Set for alerts that open the Users page pre-filtered on a segment.
  segment?: UserSegment;
}

const INACTIVE_DAYS = 7;
const MIN_AGE_BEFORE_INACTIVE_DAYS = 3;
const RECENTLY_EXPIRED_DAYS = 30;
const HOT_LEAD_DAYS = 14;
// A fresh account has had no time to do anything yet.
export const DORMANT_GRACE_DAYS = 3;
// Clean-up candidates: untouched this long, and signed up at least this long ago.
export const CLEANUP_DAYS = 30;

// Voucher access is a free one-month exam unlock: the retention alerts below
// are about customers who actually paid.
const isPaidPurchase = (p: AdminPurchase) => p.status === "paid" && p.source !== "voucher";

function groupByUser<T extends { user_id: string }>(rows: T[]) {
  const map = new Map<string, T[]>();
  for (const r of rows) {
    const list = map.get(r.user_id) ?? [];
    list.push(r);
    map.set(r.user_id, list);
  }
  return map;
}

// Ids of the users that fall in a segment. Shared by the alert counts and by
// the Users page filter, so the number on an alert always matches the list
// it opens. The admin's own account is left out: it is a test account.
export function segmentUserIds(data: AdminData, segment: UserSegment, now = Date.now()): Set<string> {
  const adminIds = new Set(
    data.profiles.filter((p) => p.email?.toLowerCase() === ADMIN_EMAIL).map((p) => p.id)
  );
  const purchases = groupByUser(data.purchases);
  const results = groupByUser(data.results);
  const ids = new Set<string>();

  if (segment === "refunded") {
    for (const p of data.purchases) if (p.status === "refunded") ids.add(p.user_id);
  }

  for (const profile of data.profiles) {
    if (adminIds.has(profile.id)) continue;
    const userPurchases = purchases.get(profile.id) ?? [];
    const userResults = results.get(profile.id) ?? [];
    const paid = userPurchases.filter(isPaidPurchase);
    const activePaid = paid.filter((p) => isActivePurchase(p, now));
    // Latest sign of life: an exam or a practice answer.
    const lastExam = Math.max(
      userResults.reduce((max, r) => Math.max(max, new Date(r.completed_at).getTime()), 0),
      data.activity.has(profile.id) ? new Date(data.activity.get(profile.id)!.lastAnswerAt).getTime() : 0
    );

    if (segment === "expiring_soon") {
      const lastExpiry = activePaid.reduce((max, p) => Math.max(max, new Date(p.expires_at).getTime()), 0);
      if (activePaid.length > 0 && lastExpiry - now < EXPIRING_SOON_DAYS * DAY_MS) ids.add(profile.id);
    } else if (segment === "paid_inactive") {
      const newest = activePaid.reduce((max, p) => Math.max(max, new Date(p.created_at).getTime()), 0);
      if (
        activePaid.length > 0 &&
        now - newest > MIN_AGE_BEFORE_INACTIVE_DAYS * DAY_MS &&
        now - lastExam > INACTIVE_DAYS * DAY_MS
      ) {
        ids.add(profile.id);
      }
    } else if (segment === "recently_expired") {
      const lastExpiry = paid.reduce((max, p) => Math.max(max, new Date(p.expires_at).getTime()), 0);
      if (paid.length > 0 && activePaid.length === 0 && now - lastExpiry < RECENTLY_EXPIRED_DAYS * DAY_MS) {
        ids.add(profile.id);
      }
    } else if (segment === "dormant_signups") {
      // Signed up, then nothing: no practice answer, no exam, and no access of
      // any kind (paid or voucher).
      const age = now - new Date(profile.created_at).getTime();
      const practised = data.activity.has(profile.id);
      if (
        userPurchases.length === 0 &&
        userResults.length === 0 &&
        !practised &&
        age > DORMANT_GRACE_DAYS * DAY_MS
      ) {
        ids.add(profile.id);
      }
    } else if (segment === "cleanup") {
      // Safe to delete: never bought (paid or refunded), no access still
      // running, and no sign of life for a month. The delete function
      // re-checks the first two rules on the server.
      const age = now - new Date(profile.created_at).getTime();
      const everBought = userPurchases.some((p) => p.source !== "voucher");
      const hasActive = userPurchases.some((p) => isActivePurchase(p, now));
      if (!everBought && !hasActive && age > CLEANUP_DAYS * DAY_MS && now - lastExam > CLEANUP_DAYS * DAY_MS) {
        ids.add(profile.id);
      }
    } else if (segment === "hot_leads") {
      if (paid.length === 0 && lastExam > 0 && now - lastExam < HOT_LEAD_DAYS * DAY_MS) ids.add(profile.id);
    }
  }
  return ids;
}

export function computeAlerts(data: AdminData, now = Date.now()): AdminAlert[] {
  const alerts: AdminAlert[] = [];
  const add = (a: AdminAlert) => a.count > 0 && alerts.push(a);

  add({ code: "gumroad_pending", priority: "urgent", count: data.pendingStaleCount, to: "/admin/gumroad" });
  add({ code: "gumroad_errors", priority: "urgent", count: data.recentGumroadErrors, to: "/admin/gumroad" });

  const userAlerts: [Exclude<UserSegment, "cleanup">, AlertPriority][] = [
    ["expiring_soon", "important"],
    ["paid_inactive", "important"],
    ["recently_expired", "info"],
    ["hot_leads", "info"],
    ["refunded", "info"],
    ["dormant_signups", "info"],
  ];
  for (const [segment, priority] of userAlerts) {
    add({
      code: segment,
      priority,
      count: segmentUserIds(data, segment, now).size,
      to: "/admin/utilisateurs",
      segment,
    });
  }
  return alerts;
}

// Alerts that deserve a badge in the menu: things to act on, not "for info".
export const actionableCount = (alerts: AdminAlert[]) =>
  alerts.filter((a) => a.priority !== "info").reduce((sum, a) => sum + a.count, 0);
