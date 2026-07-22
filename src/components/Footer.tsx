import { useLanguage } from "../i18n";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-black/5 px-6 py-8 text-center text-sm text-muted">
      <p>{t.footer.copyright}</p>
    </footer>
  );
}
