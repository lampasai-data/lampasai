import { useEffect } from "react";
import type { SetURLSearchParams } from "react-router-dom";
import { getPurchasedCertificationIds, type PurchasedCertificationAccess } from "./quizData";

const POLL_ATTEMPTS = 5;
const POLL_INTERVAL_MS = 2000;

// After a Stripe/Gumroad checkout redirects back with ?checkout=success,
// the purchase webhook may not have landed yet - poll a few times so access
// unlocks without the user having to manually refresh, then strip the query
// param. Shared by Dashboard (full certifications list) and
// CertificationQuiz (single certification's exam mode gating).
export function useCheckoutSuccessPoll(
  user: { id: string } | null,
  searchParams: URLSearchParams,
  setSearchParams: SetURLSearchParams,
  onTick: (ids: Map<string, PurchasedCertificationAccess>) => void,
  onStart?: () => void
) {
  const checkoutParam = searchParams.get("checkout");

  useEffect(() => {
    if (!user || checkoutParam !== "success") return;
    onStart?.();
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      onTick(await getPurchasedCertificationIds(user.id));
      if (attempts >= POLL_ATTEMPTS) clearInterval(interval);
    }, POLL_INTERVAL_MS);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("checkout");
        return next;
      },
      { replace: true }
    );
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, checkoutParam]);
}
