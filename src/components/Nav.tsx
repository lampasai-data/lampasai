import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useActiveSection } from "../lib/useActiveSection";
import { useLanguage } from "../i18n";
import { useAuth } from "../context/AuthContext";
import lampasLogo from "../assets/lampas-logo.png";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { user, profile, signOut, openAuthModal } = useAuth();

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
        <Link to="/" className="flex shrink-0 items-center gap-2 font-display text-xl font-semibold tracking-tight text-ink">
          <img src={lampasLogo} alt="Lampas .ai" className="h-14 w-auto object-contain" />
          Lampas <span className="brand-gradient-text">.ai</span>
        </Link>

        <div className="ml-auto hidden items-center gap-6 lg:flex">
          <ul className="flex items-center gap-8 text-sm text-muted">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={`nav-link ${activeId === link.id ? "is-active" : ""}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/formations"
                className={`nav-link ${pathname.startsWith("/formations") ? "is-active" : ""}`}
              >
                {t.nav.formations}
              </Link>
            </li>
          </ul>

          {user ? (
            <div className="flex items-center gap-3">
              {profile?.first_name && (
                <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-teal/15 text-sm font-semibold text-teal-dark">
                  {profile.first_name.charAt(0).toUpperCase()}
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green" />
                </span>
              )}
              {user.email?.toLowerCase() === "mbairo.allatessem@gmail.com" && (
                <>
                  <Link
                    to="/admin/gumroad"
                    title="Admin Gumroad"
                    className="text-muted transition hover:text-ink"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                      <path
                        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                  <Link
                    to="/admin/vouchers"
                    title="Vouchers examen"
                    className="text-muted transition hover:text-ink"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                      <path
                        d="M4 7a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 000 6v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 000-6V7z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <path d="M10 6.5v11" stroke="currentColor" strokeWidth="1.6" strokeDasharray="1.6 1.6" />
                    </svg>
                  </Link>
                </>
              )}
              <button
                type="button"
                onClick={signOut}
                className="rounded-full border border-black/10 px-3 py-1.5 text-sm text-muted transition hover:border-black/20 hover:text-ink"
              >
                {t.nav.logout}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openAuthModal}
              className="brand-gradient rounded-full px-4 py-1.5 text-sm text-white shadow-sm transition hover:opacity-90"
            >
              {t.nav.login}
            </button>
          )}
          <div className="border-l border-black/10 pl-4">
            <LangSwitch lang={lang} setLang={setLang} />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3 lg:hidden">
          <LangSwitch lang={lang} setLang={setLang} />
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
        <ul className="flex flex-col gap-1 border-t border-black/5 bg-white px-6 py-4 text-ink lg:hidden">
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
          {user?.email?.toLowerCase() === "mbairo.allatessem@gmail.com" && (
            <>
              <li>
                <Link
                  to="/admin/gumroad"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-3 hover:bg-black/[0.03]"
                >
                  Admin Gumroad
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/vouchers"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-3 hover:bg-black/[0.03]"
                >
                  Vouchers examen
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
          lang === "fr" ? "text-white" : "text-teal-dark"
        }`}
      >
        fr
      </span>
      <span
        className={`relative z-10 flex-1 text-center text-[11px] font-bold uppercase transition-colors ${
          lang === "en" ? "text-white" : "text-teal-dark"
        }`}
      >
        en
      </span>
    </button>
  );
}
