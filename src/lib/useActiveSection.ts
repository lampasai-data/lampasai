import { useEffect, useState } from "react";

/**
 * Renvoie l'id de la section qui croise le milieu du viewport.
 * Sert à souligner l'onglet correspondant dans la nav.
 */
export function useActiveSection(ids: string[], enabled = true) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }

    const sections = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    // Marge haut/bas de 50% : la « zone de détection » se réduit à une ligne
    // au milieu de l'écran, et seule la section qui la traverse est active.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [key, enabled]);

  return active;
}
