import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PENDING_GUMROAD_PURCHASE_KEY } from "../lib/paymentConfig";

// Mounted once at the app root. Gumroad never redirects back to our domain
// on its own, so a buyer can land back on lampasai.com on any page, any
// amount of time later. As soon as that happens (detected here via the flag
// UpgradeModal sets right before sending them to Gumroad) and they're
// signed in, bounce them into the Dashboard's existing "?checkout=success"
// polling/banner flow - the same one the Stripe return path already uses -
// instead of leaving them on a page that still looks locked.
export default function GumroadReturnHandler() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;
    if (!sessionStorage.getItem(PENDING_GUMROAD_PURCHASE_KEY)) return;
    sessionStorage.removeItem(PENDING_GUMROAD_PURCHASE_KEY);
    if (location.pathname === "/formations" && new URLSearchParams(location.search).get("checkout")) {
      return;
    }
    navigate("/formations?checkout=success", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return null;
}
