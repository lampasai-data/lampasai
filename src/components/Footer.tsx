import { Link } from "react-router-dom";
import { useLanguage } from "../i18n";
import lampasLogo from "../assets/Logo_Lampas_AI_flavicon.png";

export default function Footer() {
  const { t } = useLanguage();

  const links = [
    { href: "/#home", label: t.nav.home },
    { href: "/#about", label: t.nav.about },
    { href: "/#insights", label: t.nav.insights },
    { href: "/#team", label: t.nav.team },
    { href: "/#services", label: t.nav.services },
  ];

  return (
    <footer className="bg-ink">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pt-14 pb-8 sm:grid-cols-3">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-white">
            <img src={lampasLogo} alt="Lampas .ai" className="h-10 w-auto object-contain" />
            Lampas <span className="brand-gradient-text">.ai</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">{t.footer.tagline}</p>
          <a
            href="https://www.linkedin.com/company/lampasai"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Lampas .ai sur LinkedIn"
            className="mt-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/60 shadow-sm transition hover:border-teal/40 hover:text-teal"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z" />
            </svg>
          </a>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal">
            {t.footer.navTitle}
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2 text-sm text-white/60">
            {links.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/formations" className="transition hover:text-white">
                {t.nav.formations}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal">
            {t.footer.contactTitle}
          </p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-white/60">
            <li>
              <Link to="/#contact" className="transition hover:text-white">
                {t.footer.contactLink}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-white/70">
        {t.footer.copyright(new Date().getFullYear())}
      </div>
    </footer>
  );
}
