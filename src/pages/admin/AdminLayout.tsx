import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../i18n";
import { ADMIN_T } from "../adminI18n";
import { actionableCount, computeAlerts } from "../../lib/adminAlerts";
import { supabase } from "../../lib/supabase";
import { useAdminTheme } from "../../lib/useAdminTheme";
import {
  EMPTY_ADMIN_DATA,
  loadAdminData,
  type AdminData,
} from "../../lib/adminData";
import type { AdminContextValue } from "./useAdminContext";
// Transparent line-art logo (the original has an opaque white square behind
// it). Its black outline would vanish on a dark surface, so in dark mode it
// sits on a white round badge instead.
import markLight from "../../assets/lampas-mark-light.png";
import {
  IconCart,
  IconDashboard,
  IconHome,
  IconLogout,
  IconMail,
  IconMessage,
  IconMoon,
  IconSun,
  IconPanelClose,
  IconPanelOpen,
  IconShield,
  IconTicket,
  IconUsers,
} from "./AdminIcons";

const COLLAPSED_KEY = "lampasai-admin-sidebar-collapsed";

export default function AdminLayout() {
  const { user, ready, profileReady, isAdmin, signOut } = useAuth();
  const { lang } = useLanguage();
  const a = ADMIN_T[lang];

  const [data, setData] = useState<AdminData>(EMPTY_ADMIN_DATA);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    setData(await loadAdminData());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAdmin) reload();
  }, [isAdmin, reload]);

  // Open security alerts (the most serious level) get a badge on the Audit
  // link. A failed read just shows no badge.
  const [securityAlerts, setSecurityAlerts] = useState(0);
  useEffect(() => {
    if (!isAdmin || !supabase) return;
    supabase
      .from("security_signals")
      .select("id", { count: "exact", head: true })
      .is("handled_at", null)
      .eq("severity", "alert")
      .then(({ count }) => setSecurityAlerts(count ?? 0));
  }, [isAdmin]);

  // Messages from users still waiting for an answer.
  const [feedbackOpen, setFeedbackOpen] = useState(0);
  useEffect(() => {
    if (!isAdmin || !supabase) return;
    supabase
      .from("user_feedback")
      .select("id", { count: "exact", head: true })
      .is("handled_at", null)
      .then(({ count }) => setFeedbackOpen(count ?? 0));
  }, [isAdmin]);

  // Desktop-only: the side menu folds down to its icons. Remembered per
  // browser; storage can be unavailable (private window), so it is optional.
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSED_KEY) === "1";
    } catch {
      return false;
    }
  });
  function toggleSidebar() {
    setCollapsed((prev) => {
      try {
        localStorage.setItem(COLLAPSED_KEY, prev ? "0" : "1");
      } catch {
        // ignore - the preference just won't persist
      }
      return !prev;
    });
  }

  const { theme, toggle: toggleTheme } = useAdminTheme();
  const themeLabel = theme === "dark" ? a.switchToLight : a.switchToDark;

  const alerts = useMemo(() => computeAlerts(data), [data]);
  const alertBadge = actionableCount(alerts);

  // Wait for the server to answer am_i_admin before deciding to redirect.
  if (!ready || !profileReady) return null;
  if (!user || !isAdmin) return <Navigate to="/formations" replace />;

  const links = [
    { to: "/admin", label: a.navStats, icon: <IconDashboard />, end: true, badge: alertBadge },
    { to: "/admin/utilisateurs", label: a.navUsers, icon: <IconUsers /> },
    { to: "/admin/gumroad", label: a.navSales, icon: <IconCart /> },
    { to: "/admin/vouchers", label: a.navVouchers, icon: <IconTicket /> },
    { to: "/admin/emails", label: a.navEmails, icon: <IconMail /> },
    { to: "/admin/feedback", label: a.navFeedback, icon: <IconMessage />, badge: feedbackOpen },
    { to: "/admin/audit", label: a.navAudit, icon: <IconShield />, badge: securityAlerts },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
      collapsed ? "lg:justify-center" : ""
    } ${isActive ? "bg-teal/12 text-teal-dark" : "text-muted hover:bg-black/[0.04] hover:text-ink"}`;

  // Text that only exists while the menu is open on desktop (always shown on mobile).
  const label = collapsed ? "lg:hidden" : "";

  return (
    <div className="admin-root min-h-screen lg:flex" data-theme={theme}>
      <aside
        className={`border-b border-black/8 bg-white/70 backdrop-blur transition-[width] duration-200 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:border-r lg:border-b-0 ${
          collapsed ? "lg:w-[76px]" : "lg:w-60"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-4 pt-4 lg:px-4 lg:pt-6">
          <div className={`flex items-center gap-2.5 ${collapsed ? "lg:hidden" : ""}`}>
            {/* The drawing fills ~34px of the 44px image and sits ~2px left of its
                centre, so the white badge is sized on the drawing (42px) and the
                image nudged to centre the drawing in it. */}
            <span
              className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full ${
                theme === "dark" ? "h-[42px] w-[42px] bg-[#ffffff]" : "h-11 w-11"
              }`}
            >
              <img
                src={markLight}
                alt="Lampas .ai"
                className="h-11 w-11 max-w-none object-contain"
                style={theme === "dark" ? { transform: "translate(2.2px, 0.5px)" } : undefined}
              />
            </span>
            <div>
              <p className="font-display text-base font-semibold leading-tight text-ink">Lampas .ai</p>
              <p className="hidden text-xs text-muted lg:block">{a.adminArea}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleSidebar}
            title={collapsed ? a.expandMenu : a.collapseMenu}
            aria-label={collapsed ? a.expandMenu : a.collapseMenu}
            aria-expanded={!collapsed}
            className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-black/[0.05] hover:text-ink lg:flex ${
              collapsed ? "lg:mx-auto" : ""
            }`}
          >
            {collapsed ? <IconPanelOpen /> : <IconPanelClose />}
          </button>
          <div className="flex items-center gap-3 text-xs lg:hidden">
            <NavLink to="/formations" className="text-muted hover:text-ink">
              {a.backToSite}
            </NavLink>
            <button type="button" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel} className="text-muted hover:text-ink">
              {theme === "dark" ? <IconSun /> : <IconMoon />}
            </button>
            <button type="button" onClick={() => signOut()} className="text-muted hover:text-ink">
              {a.logout}
            </button>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 py-3 lg:mt-4 lg:flex-col lg:overflow-visible">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass} title={collapsed ? l.label : undefined}>
              {l.icon}
              <span className={label}>{l.label}</span>
              {l.badge ? (
                <span
                  className={`ml-auto rounded-full bg-amber/25 px-1.5 text-[11px] font-bold text-amber-ink ${
                    collapsed ? "lg:absolute lg:top-0.5 lg:right-1.5 lg:ml-0 lg:px-1 lg:text-[10px]" : ""
                  }`}
                >
                  {l.badge}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        <div className="hidden space-y-1 px-3 pb-5 text-sm lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
          <NavLink
            to="/formations"
            title={collapsed ? a.backToSite : undefined}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-muted hover:bg-black/[0.04] hover:text-ink ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <IconHome />
            <span className={label}>{a.backToSite}</span>
          </NavLink>
          {/* Same layout as the Wonjo back office: two equal bordered buttons
              across the full width (stacked and centred when folded). */}
          <div className={`flex gap-2 pt-1 ${collapsed ? "flex-col items-center" : ""}`}>
            <button
              type="button"
              onClick={toggleTheme}
              title={themeLabel}
              aria-label={themeLabel}
              className={`flex h-[34px] items-center justify-center rounded-[10px] border border-black/10 bg-white text-muted transition hover:border-teal hover:bg-black/[0.04] hover:text-teal-dark ${
                collapsed ? "w-[34px] flex-none" : "flex-1"
              }`}
            >
              {theme === "dark" ? <IconSun /> : <IconMoon />}
            </button>
            <button
              type="button"
              onClick={() => signOut()}
              title={a.logout}
              aria-label={a.logout}
              className={`flex h-[34px] items-center justify-center rounded-[10px] border border-red-500/35 bg-white text-danger-ink transition hover:border-[#e5484d] hover:bg-[#e5484d] hover:text-[#ffffff] ${
                collapsed ? "w-[34px] flex-none" : "flex-1"
              }`}
            >
              <IconLogout />
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <Outlet context={{ data, alerts, loading, reload } satisfies AdminContextValue} />
      </main>
    </div>
  );
}
