import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const THEME_KEY = "lampasai-theme";
// The admin area had its own switch before the site got one: an admin who
// already picked a theme there keeps it.
const LEGACY_ADMIN_KEY = "lampasai-admin-theme";

function readStored(): Theme | null {
  try {
    const v = localStorage.getItem(THEME_KEY) ?? localStorage.getItem(LEGACY_ADMIN_KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
}

// Light unless the visitor chose dark: the brand is designed light first, and
// nobody's site changes look without a click. index.html applies the stored
// choice before the first paint, so there is no flash on load.
let current: Theme = readStored() ?? "light";
const listeners = new Set<() => void>();

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}
if (typeof document !== "undefined") apply(current);

export function setTheme(theme: Theme) {
  current = theme;
  apply(theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore - the choice just won't persist
  }
  listeners.forEach((l) => l());
}

export function useTheme() {
  const theme = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => current,
    () => "light" as Theme
  );
  return { theme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") };
}
