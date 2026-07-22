import { useState, type FormEvent } from "react";
import { useLanguage } from "../i18n";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const { t } = useLanguage();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    e.currentTarget.reset();
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <span className="text-xs font-medium uppercase tracking-widest text-violet-400">
          {t.contact.tag}
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold text-white md:text-4xl">
          {t.contact.title}
        </h2>
        <p className="mt-5 leading-relaxed text-white/60">{t.contact.lead}</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-7"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              name="firstname"
              placeholder={t.contact.firstname}
              required
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-400/50 focus:outline-none"
            />
            <input
              type="text"
              name="lastname"
              placeholder={t.contact.lastname}
              required
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-400/50 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="email"
              name="email"
              placeholder={t.contact.email}
              required
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-400/50 focus:outline-none"
            />
            <input
              type="tel"
              name="phone"
              placeholder={t.contact.phone}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-400/50 focus:outline-none"
            />
          </div>
          <textarea
            name="message"
            placeholder={t.contact.message}
            rows={5}
            required
            className="resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-400/50 focus:outline-none"
          />
          <button
            type="submit"
            disabled={sent}
            className="mt-2 rounded-full bg-violet-500 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-violet-400 disabled:opacity-70"
          >
            {sent ? t.contact.sent : t.contact.submit}
          </button>
        </form>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
          <h3 className="font-display text-lg font-medium text-white">
            {t.contact.infoTitle}
          </h3>
          <div className="mt-4 flex flex-col gap-2 text-sm text-white/65">
            <p>{t.contact.city}</p>
            <a href="tel:+33621987501" className="hover:text-white">
              +33 6 21 98 75 01
            </a>
            <a href="mailto:contact@lampasai.com" className="hover:text-white">
              contact@lampasai.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
