import { useTheme, type Theme } from "./theme";

export type AdminTheme = Theme;

// The admin area follows the site-wide theme (lib/theme.ts): one choice, the
// same switch in the site nav and in the admin sidebar.
export function useAdminTheme() {
  return useTheme();
}
