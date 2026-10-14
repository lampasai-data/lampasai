import { useRef, useState, type FormEvent } from "react";
import { useLanguage } from "../i18n";
import { sendContactMessage } from "../lib/contact";
import { TOOLS, TOOL_LOGOS } from "../data/toolLogos";

const MIN_SUBMIT_DELAY_MS = 2500;

// Pill choices instead of a native <select>: the browser's dropdown list cannot
// be styled, and with two or three options everything fits on screen anyway.
// Real radio inputs underneath, so the form data, the required check and the
// keyboard behaviour stay native.
function ChoiceGroup({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <fieldset>
      <legend className="mb-1.5 block text-xs font-medium text-muted">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option, i) => (
          <label
            key={option}
            className="cursor-pointer rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-ink/80 transition hover:border-teal/30 has-[:checked]:border-teal/50 has-[:checked]:bg-teal/10 has-[:checked]:text-teal-dark has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal/30"
          >
            <input type="radio" name={name} value={option} required={i === 0} className="sr-only" />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function TrainingRequestForm({ title, lead }: { title?: string; lead?: string }) {
  const [sent, setSent] = useState(false);
  const [tooFast, setTooFast] = useState(false);
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const { t } = useLanguage();
  const mountedAt = useRef(Date.now());

  function toggleTool(tool: string) {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((v) => v !== tool) : [...prev, tool]
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTooFast(false);
    setFailure(null);

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

    if (selectedTools.length === 0) return;

    setSending(true);
    const result = await sendContactMessage({
      kind: "training",
      name: data.get("name"),
      email: data.get("email"),
      tools: selectedTools,
      level: data.get("level"),
      format: data.get("format"),
      message: data.get("message"),
      company_website: data.get("company_website"),
      elapsedMs: Date.now() - mountedAt.current,
    });
    setSending(false);
    if (result !== "ok") {
      setFailure(result === "rate_limited" ? t.formations.requestRateLimited : t.formations.requestSendError);
      return;
    }

    setSent(true);
    form.reset();
    setSelectedTools([]);
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col gap-4 rounded-2xl border border-black/8 bg-white p-7 shadow-sm"
    >
      {title && (
        <div className="mb-1">
          <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
          {lead && <p className="mt-2 text-sm leading-relaxed text-muted">{lead}</p>}
        </div>
      )}

      {/* Honeypot field: hidden from sighted users, invisible-but-focusable trap for bots. */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="tr_company_website">Company website</label>
        <input
          id="tr_company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          type="text"
          name="name"
          placeholder={t.formations.requestName}
          required
          className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-teal focus:outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder={t.formations.requestEmail}
          required
          className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-teal focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted">
          {t.formations.requestTool}
        </label>
        <div className="flex flex-wrap gap-2">
          {TOOLS.map((tool) => {
            const isSelected = selectedTools.includes(tool);
            return (
              <button
                key={tool}
                type="button"
                onClick={() => toggleTool(tool)}
                aria-pressed={isSelected}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isSelected
                    ? "border-teal/50 bg-teal/10 text-teal-dark"
                    : "border-black/10 bg-white text-ink/80 hover:border-teal/30"
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
                    isSelected ? "border-teal bg-teal text-white" : "border-black/20"
                  }`}
                >
                  {isSelected && "✓"}
                </span>
                {/* White disc behind the logo: black-ink logos (Linux, dbt) vanish on dark. */}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ffffff] p-[3px] ring-1 ring-black/[0.08]">
                  <img src={TOOL_LOGOS[tool]} alt="" className="h-full w-full object-contain" />
                </span>
                {tool}
              </button>
            );
          })}
        </div>
        {selectedTools.length === 0 && (
          <p className="mt-1.5 text-xs text-muted">{t.formations.requestToolHint}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <ChoiceGroup
          name="level"
          label={t.formations.requestLevelLabel}
          options={[t.formations.levelBeginner, t.formations.levelIntermediate, t.formations.levelAdvanced]}
        />
        <ChoiceGroup
          name="format"
          label={t.formations.requestFormatLabel}
          options={[t.formations.formatOnsite, t.formations.formatRemote]}
        />
      </div>

      <textarea
        name="message"
        placeholder={t.formations.requestMessagePlaceholder}
        rows={4}
        className="resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-teal focus:outline-none"
      />

      {tooFast && <p className="text-sm text-amber">{t.formations.requestTooFast}</p>}
      {failure && <p className="text-sm text-danger-ink">{failure}</p>}

      <button
        type="submit"
        disabled={sent || sending || selectedTools.length === 0}
        className="brand-gradient mt-2 self-start rounded-full px-7 py-3.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40"
      >
        {sent ? t.formations.requestSent : sending ? t.formations.requestSending : t.formations.requestSubmit}
      </button>
    </form>
  );
}
