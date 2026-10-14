import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useActiveSection } from "../lib/useActiveSection";
import { useLanguage } from "../i18n";
import { useAuth } from "../context/AuthContext";
import lampasLogo from "../assets/lampas-logo.png";
import UserMenu from "./UserMenu";
import { USER_T } from "../userAreaI18n";
import { useTheme } from "../lib/theme";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { user, isAdmin, signOut, openAuthModal } = useAuth();

  const { pathname } = useLocation();
  const onHome = pathname === "/";

  const links = [
    { href: "/#home", id: "home", label: t.nav.home },
    { href: "/#about", id: "about", label: t.nav.about },
    { href: "/#insights", id: "insights", label: t.nav.insights },
    { href: "/#team", id: "team", label: t.nav.team },
    { href: "/#services", id: "services", label: t.nav.services },
  ];

  const activeId = useActiveSection(
    links.map((link) => link.id),
    onHome
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
        {/* Icon-only, hidden from a11y/tab order - the text link right next
            to it is the real "go home" target with a proper label, so this
            is just the decorative mark. Kept as its own flex item (not
            grouped with the text) specifically so it can be centered
            against the *whole* row height via the row's items-center,
            instead of being pulled up to sit on the text baseline below. */}
        <Link to="/" aria-hidden="true" tabIndex={-1} className="logo-badge shrink-0 self-center">
          <img src={lampasLogo} alt="" className="h-14 w-auto object-contain" />
        </Link>

        {/* Groups the wordmark with the nav links so items-baseline aligns
            their text baselines with each other - then this whole group
            (only as tall as its own short line of text) is centered by the
            row's items-center against the much taller logo image, instead
            of the group's baseline itself trying to double as the image's
            center line. */}
        <div className="ml-2 flex items-baseline">
          <Link
            to="/"
            className="shrink-0 font-display text-xl font-semibold tracking-tight text-ink"
          >
            Lampas <span className="brand-gradient-text">.ai</span>
          </Link>

          {/* Both gaps below are fixed margins, not ml-auto - so neither the
              logo-to-links gap nor the links-to-auth gap depends on how wide
              the trailing auth cluster is (avatar + admin icons +
              "Déconnexion" vs. just "Se connecter") or how short the link
              labels get in English. The tradeoff: on a very wide viewport,
              this whole block sits left-anchored rather than the auth
              cluster being pinned to the far right edge - preferred over a
              gap that visibly grows/shrinks next to the links. */}
          <ul className="ml-8 hidden items-center gap-6 text-sm text-muted xl:flex">
          {links.map((link) => (
            <li key={link.href} className="whitespace-nowrap">
              <Link
                to={link.href}
                className={`nav-link ${activeId === link.id ? "is-active" : ""}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="whitespace-nowrap">
            <Link
              to="/formations"
              className={`nav-link ${pathname.startsWith("/formations") ? "is-active" : ""}`}
            >
              {t.nav.formations}
            </Link>
          </li>
          </ul>
        </div>

        <div className="ml-6 hidden items-center gap-4 xl:flex">
          {user ? (
            <UserMenu />
          ) : (
            <button
              type="button"
              onClick={openAuthModal}
              className="brand-gradient rounded-full px-4 py-1.5 text-sm text-white shadow-sm transition hover:opacity-90"
            >
              {t.nav.login}
            </button>
          )}
          <div className="flex items-center gap-2 border-l border-black/10 pl-4">
            <LangSwitch lang={lang} setLang={setLang} />
            <ThemeSwitch lang={lang} />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 xl:hidden">
          <LangSwitch lang={lang} setLang={setLang} />
          <ThemeSwitch lang={lang} compact />
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="text-2xl text-ink"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-black/5 bg-white px-6 py-4 text-ink xl:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-2 py-3 hover:bg-black/[0.03] ${
                  activeId === link.id
                    ? "border-l-2 border-teal bg-teal/[0.06] font-medium"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/formations"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-2 py-3 hover:bg-black/[0.03]"
            >
              {t.nav.formations}
            </Link>
          </li>
          {user && (
            <li>
              <Link
                to="/profil"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-2 py-3 hover:bg-black/[0.03]"
              >
                {USER_T[lang].profile.menu}
              </Link>
            </li>
          )}
          {isAdmin && (
            <>
              <li>
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-3 hover:bg-black/[0.03]"
                >
                  Administration
                </Link>
              </li>
            </>
          )}
          <li>
            {user ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  signOut();
                }}
                className="mt-2 block w-full rounded-full border border-black/10 px-4 py-3 text-center font-medium text-muted"
              >
                {t.nav.logout}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openAuthModal();
                }}
                className="brand-gradient mt-2 block w-full rounded-full px-4 py-3 text-center font-medium text-white"
              >
                {t.nav.login}
              </button>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
}

function LangSwitch({
  lang,
  setLang,
}: {
  lang: "fr" | "en";
  setLang: (lang: "fr" | "en") => void;
}) {
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "fr" ? "en" : "fr")}
      title={lang === "fr" ? "Switch to English" : "Passer en français"}
      aria-pressed={lang === "en"}
      className="relative inline-flex h-8 w-[4.5rem] items-center rounded-full border border-teal/25 bg-teal/[0.08] p-1"
    >
      <span
        className="absolute top-1 h-6 w-8 rounded-full bg-teal shadow-sm transition-transform duration-200 ease-out"
        style={{ transform: lang === "en" ? "translateX(100%)" : "translateX(0)" }}
      />
      <span
        className={`relative z-10 flex-1 text-center text-[11px] font-bold uppercase transition-colors ${
          lang === "fr" ? "keep-light-colors text-white" : "text-teal-dark"
        }`}
      >
        fr
      </span>
      <span
        className={`relative z-10 flex-1 text-center text-[11px] font-bold uppercase transition-colors ${
          lang === "en" ? "keep-light-colors text-white" : "text-teal-dark"
        }`}
      >
        en
      </span>
    </button>
  );
}

// Light/dark, styled like LangSwitch: the knob slides under the active icon.
// On small screens (compact) it is a single round button showing the theme
// it switches to, so the row still fits next to the logo.
function ThemeSwitch({ lang, compact = false }: { lang: "fr" | "en"; compact?: boolean }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  const label =
    lang === "fr"
      ? dark ? "Passer en thème clair" : "Passer en thème sombre"
      : dark ? "Switch to light theme" : "Switch to dark theme";
  if (compact) {
    return (
      <button
        type="button"
        onClick={toggle}
        title={label}
        aria-label={label}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-teal/25 bg-teal/[0.08] text-teal-dark"
      >
        {dark ? <SunIcon /> : <MoonIcon />}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={toggle}
      title={label}
      aria-label={label}
      aria-pressed={dark}
      className="relative inline-flex h-8 w-[4.5rem] items-center rounded-full border border-teal/25 bg-teal/[0.08] p-1"
    >
      <span
        className="absolute top-1 h-6 w-8 rounded-full bg-teal shadow-sm transition-transform duration-200 ease-out"
        style={{ transform: dark ? "translateX(100%)" : "translateX(0)" }}
      />
      <span className={`relative z-10 flex flex-1 justify-center transition-colors ${dark ? "text-teal-dark" : "keep-light-colors text-white"}`}>
        <SunIcon />
      </span>
      <span className={`relative z-10 flex flex-1 justify-center transition-colors ${dark ? "keep-light-colors text-white" : "text-teal-dark"}`}>
        <MoonIcon />
      </span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
      {/* Same icon as the admin theme switch (AdminIcons IconMoon). */}
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none" />
    </svg>
  );
}
