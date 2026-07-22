import { useState } from "react";
import { useLanguage } from "../i18n";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const links = [
    { href: "#home", label: t.nav.home },
    { href: "#about", label: t.nav.about },
    { href: "#insights", label: t.nav.insights },
    { href: "#team", label: t.nav.team },
    { href: "#clients", label: t.nav.clients },
    { href: "#services", label: t.nav.services },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#05070d]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#home" className="font-display text-xl font-semibold tracking-tight">
          lampas<span className="text-violet-400">.ai</span>
        </a>

        <ul className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition hover:text-white">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <LangSwitch lang={lang} setLang={setLang} />
          <a
            href="#contact"
            className="rounded-full bg-violet-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-violet-400"
          >
            {t.nav.contact}
          </a>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LangSwitch lang={lang} setLang={setLang} />
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="text-2xl text-white"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-white/10 bg-[#05070d] px-6 py-4 text-white/80 md:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-2 py-3 hover:bg-white/5"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-full bg-violet-500 px-4 py-3 text-center font-medium text-white"
            >
              {t.nav.contact}
            </a>
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
    <div className="flex items-center rounded-full border border-white/15 bg-white/[0.03] p-0.5 text-xs font-medium">
      {(["fr", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`rounded-full px-2.5 py-1 uppercase transition ${
            lang === code
              ? "bg-violet-500 text-white"
              : "text-white/50 hover:text-white"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
