import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n";
import { useAuth } from "../context/AuthContext";
import lampasLogo from "../assets/lampas-logo.png";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { user, profile, signOut } = useAuth();

  const links = [
    { href: "/#home", label: t.nav.home },
    { href: "/#about", label: t.nav.about },
    { href: "/#insights", label: t.nav.insights },
    { href: "/#team", label: t.nav.team },
    { href: "/#services", label: t.nav.services },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-ink">
          <img src={lampasLogo} alt="Lampas AI" className="h-14 w-auto object-contain" />
          Lampas <span className="brand-gradient-text">ai</span>
        </Link>

        <ul className="hidden items-center gap-8 text-sm text-muted lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition hover:text-ink">
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link to="/formations" className="transition hover:text-ink">
              {t.nav.formations}
            </Link>
          </li>
        </ul>

        <div className="hidden items-center gap-4 lg:flex">
          <LangSwitch lang={lang} setLang={setLang} />
          {user ? (
            <div className="flex items-center gap-3">
              {profile?.first_name && (
                <span className="text-sm text-muted">
                  Bienvenue <span className="font-medium text-ink">{profile.first_name}</span>
                </span>
              )}
              <button
                type="button"
                onClick={signOut}
                className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-muted transition hover:border-black/20 hover:text-ink"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <a
              href="/#contact"
              className="brand-gradient rounded-full px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
            >
              {t.nav.contact}
            </a>
          )}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
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
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-2 py-3 hover:bg-black/[0.03]"
              >
                {link.label}
              </a>
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
              <a
                href="/#contact"
                onClick={() => setOpen(false)}
                className="brand-gradient mt-2 block rounded-full px-4 py-3 text-center font-medium text-white"
              >
                {t.nav.contact}
              </a>
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
      className="rounded-full border border-black/10 bg-black/[0.02] px-3 py-1.5 text-xs font-semibold uppercase text-ink/80 transition hover:border-black/20 hover:text-ink"
    >
      {lang}
    </button>
  );
}
