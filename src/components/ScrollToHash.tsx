import { useEffect, useLayoutEffect, useRef } from "react";
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

  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    // Arriver d'une autre page (ou d'un chargement direct) doit poser la vue
    // sur la section, pas la faire défiler depuis le haut à travers toute la
    // page d'accueil. Le défilement animé n'a de sens qu'entre deux ancres de
    // la page où l'on se trouve déjà.
    const isFirstRun = previousPathname.current === null;
    const cameFromAnotherRoute = !isFirstRun && previousPathname.current !== pathname;
    previousPathname.current = pathname;

    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (!el) return;

    const behavior: ScrollBehavior = isFirstRun || cameFromAnotherRoute ? "instant" : "smooth";
    const raf = requestAnimationFrame(() => {
      el.scrollIntoView({ behavior });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return null;
}
