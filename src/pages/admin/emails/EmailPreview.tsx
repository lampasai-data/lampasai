import { useLanguage } from "../../../i18n";
import markLight from "../../../assets/lampas-mark-light.png";
import { EMAIL_T } from "../../adminEmailsI18n";

// Look of the real e-mail (same brand header, card and footer as the sending
// code). Always light, whatever the admin theme: an inbox is not themed, so
// colours here are fixed hex values rather than theme tokens.
export default function EmailPreview({
  firstName,
  paragraphs,
  ctaLabel,
  promotion = false,
  emailLang,
}: {
  firstName: string;
  paragraphs: string[];
  ctaLabel?: string;
  promotion?: boolean;
  // Language of the e-mail itself (not of the admin UI): greeting and footer follow it.
  emailLang?: "fr" | "en";
}) {
  const { lang } = useLanguage();
  const p = EMAIL_T[emailLang ?? lang].preview;
  return (
    <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl border border-[#e6e4de] bg-[#f8f7ff] p-3 text-[#14142B]">
      <div className="overflow-hidden rounded-xl bg-[#ffffff] shadow-sm">
        <div className="flex items-center gap-2.5 bg-[#f4f1ea] px-6 py-4">
          <img src={markLight} alt="" className="h-9 w-auto object-contain" />
          <span className="font-display text-base font-bold tracking-tight">Lampas .ai</span>
        </div>
        <div className="px-6 py-5">
          <h4 className="m-0 mb-3 text-[19px] font-bold">
            {p.hello}
            {firstName ? ` ${firstName}` : ""}
          </h4>
          {paragraphs.length === 0 ? (
            <p className="m-0 text-sm text-[#9CA3AF]">{p.example}</p>
          ) : (
            paragraphs.map((para, i) => (
              <p key={i} className="m-0 mb-3 text-sm leading-relaxed text-[#5B5B70]">
                {para.split("\n").map((line, j, all) => (
                  <span key={j}>
                    {line}
                    {j < all.length - 1 && <br />}
                  </span>
                ))}
              </p>
            ))
          )}
          {ctaLabel && (
            <span className="mt-2 inline-block rounded-full bg-[#4A8896] px-6 py-2.5 text-sm font-semibold text-[#ffffff]">
              {ctaLabel}
            </span>
          )}
          {promotion && (
            <p className="m-0 mt-5 text-xs leading-relaxed text-[#9CA3AF]">
              {p.unsubscribeFooter}
              <br />
              <u>{p.unsubscribe}</u>
            </p>
          )}
        </div>
        <div className="border-t border-[#F0F0F0] px-6 py-4 text-center text-xs text-[#9CA3AF]">
          © 2026 <b className="text-[#4A8896]">Lampas .ai</b> · <u>Nous contacter</u>
          <br />
          {p.footer}
        </div>
      </div>
    </div>
  );
}
