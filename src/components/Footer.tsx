import { useLanguage } from "../i18n";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-black/5 px-6 py-8 text-center text-sm text-muted">
      <a
        href="https://www.linkedin.com/company/lampasai"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Lampas AI sur LinkedIn"
        className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-muted shadow-sm transition hover:border-teal/30 hover:text-teal-dark"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z" />
        </svg>
      </a>
      <p>{t.footer.copyright}</p>
    </footer>
  );
}
