import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  // React Router doesn't reset scroll position on navigation like a real
  // page load would - without this, navigating to a new route keeps
  // whatever scroll offset the previous page was left at. Using
  // useLayoutEffect (rather than useEffect) applies the jump before the
  // browser paints the new route, so there's no visible flash of the new
  // page's content at the old scroll offset.
  useLayoutEffect(() => {
    if (hash) return;
    // `html` has `scroll-behavior: smooth` globally, which would otherwise
    // animate this jump and visibly scroll through the whole previous page
    // (including the footer) - "instant" bypasses that for this reset only.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth" });
    });
    return () => cancelAnimationFrame(raf);
  }, [hash]);

  return null;
}
