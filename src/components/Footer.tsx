import { useLanguage } from "../i18n";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
      <p>{t.footer.copyright}</p>
    </footer>
  );
}
