import { useRef, useState, type FormEvent } from "react";
import { useLanguage } from "../i18n";
import Reveal from "./Reveal";

const MIN_SUBMIT_DELAY_MS = 2500;

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [tooFast, setTooFast] = useState(false);
  const { t } = useLanguage();
  const mountedAt = useRef(Date.now());

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTooFast(false);

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: a field only bots fill in (hidden from real users via CSS).
    if (data.get("company_website")) {
      form.reset();
      return;
    }

    // Time-trap: real humans take at least a couple of seconds to fill a form.
    if (Date.now() - mountedAt.current < MIN_SUBMIT_DELAY_MS) {
      setTooFast(true);
      return;
    }

    setSent(true);
    form.reset();
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <section id="contact" className="border-t border-black/5">
      <div className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="max-w-2xl">
        <h2 className="font-display text-4xl font-semibold text-ink md:text-5xl">
          {t.contact.title}
        </h2>
        <p className="mt-5 leading-relaxed text-muted">{t.contact.lead}</p>
      </Reveal>

      <Reveal delay={120} className="mt-12 max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-black/8 bg-white p-7 shadow-sm"
        >
          {/* Honeypot field: hidden from sighted users, invisible-but-focusable trap for bots. */}
          <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="company_website">Company website</label>
            <input
              id="company_website"
              name="company_website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              name="firstname"
              placeholder={t.contact.firstname}
              required
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-teal focus:outline-none"
            />
            <input
              type="text"
              name="lastname"
              placeholder={t.contact.lastname}
              required
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-teal focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="email"
              name="email"
              placeholder={t.contact.email}
              required
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-teal focus:outline-none"
            />
            <input
              type="tel"
              name="phone"
              placeholder={t.contact.phone}
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-teal focus:outline-none"
            />
          </div>
          <textarea
            name="message"
            placeholder={t.contact.message}
            rows={5}
            required
            className="resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-teal focus:outline-none"
          />
          {tooFast && (
            <p className="text-sm text-amber">{t.contact.tooFast}</p>
          )}
          <button
            type="submit"
            disabled={sent}
            className="brand-gradient mt-2 rounded-full px-7 py-3.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-70"
          >
            {sent ? t.contact.sent : t.contact.submit}
          </button>
        </form>
      </Reveal>
      </div>
    </section>
  );
}
