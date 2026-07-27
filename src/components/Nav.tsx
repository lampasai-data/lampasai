import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n";
import { useAuth } from "../context/AuthContext";
import lampasLogo from "../assets/lampas-logo.png";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { user, profile, signOut, openAuthModal } = useAuth();

  const links = [
    { href: "/#home", label: t.nav.home },
    { href: "/#about", label: t.nav.about },
    { href: "/#insights", label: t.nav.insights },
    { href: "/#team", label: t.nav.team },
    { href: "/#services", label: t.nav.services },
  ];

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
                <Link to={link.href} className="transition hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/formations" className="transition hover:text-ink">
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
              <button
                type="button"
                onClick={signOut}
                className="rounded-full border border-black/10 px-3 py-1.5 text-sm text-muted transition hover:border-black/20 hover:text-ink"
              >
                Déconnexion
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
                className="block rounded-lg px-2 py-3 hover:bg-black/[0.03]"
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
                Déconnexion
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
