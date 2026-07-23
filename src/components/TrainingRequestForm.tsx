import { useRef, useState, type FormEvent } from "react";
import { useLanguage } from "../i18n";

const MIN_SUBMIT_DELAY_MS = 2500;
const TOOLS = ["Power BI", "Snowflake", "dbt"];

export default function TrainingRequestForm() {
  const [sent, setSent] = useState(false);
  const [tooFast, setTooFast] = useState(false);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const { t } = useLanguage();
  const mountedAt = useRef(Date.now());

  function toggleTool(tool: string) {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((v) => v !== tool) : [...prev, tool]
    );
  }

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

    if (selectedTools.length === 0) return;

    const body = [
      `Nom: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Outil(s): ${selectedTools.join(", ")}`,
      `Niveau: ${data.get("level")}`,
      `Format: ${data.get("format")}`,
      `Précisions: ${data.get("message") || "-"}`,
    ].join("\n");
    window.location.href = `mailto:contact@lampasai.com?subject=${encodeURIComponent(
      "Demande de formation - devis"
    )}&body=${encodeURIComponent(body)}`;

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
                {tool}
              </button>
            );
          })}
        </div>
        {selectedTools.length === 0 && (
          <p className="mt-1.5 text-xs text-muted">{t.formations.requestToolHint}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            {t.formations.requestLevelLabel}
          </label>
          <select
            name="level"
            required
            defaultValue=""
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink focus:border-teal focus:outline-none"
          >
            <option value="" disabled>
              -
            </option>
            <option value={t.formations.levelBeginner}>{t.formations.levelBeginner}</option>
            <option value={t.formations.levelIntermediate}>
              {t.formations.levelIntermediate}
            </option>
            <option value={t.formations.levelAdvanced}>{t.formations.levelAdvanced}</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            {t.formations.requestFormatLabel}
          </label>
          <select
            name="format"
            required
            defaultValue=""
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink focus:border-teal focus:outline-none"
          >
            <option value="" disabled>
              -
            </option>
            <option value={t.formations.formatOnsite}>{t.formations.formatOnsite}</option>
            <option value={t.formations.formatRemote}>{t.formations.formatRemote}</option>
          </select>
        </div>
      </div>

      <textarea
        name="message"
        placeholder={t.formations.requestMessagePlaceholder}
        rows={4}
        className="resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-teal focus:outline-none"
      />

      {tooFast && <p className="text-sm text-amber">{t.formations.requestTooFast}</p>}

      <button
        type="submit"
        disabled={sent || selectedTools.length === 0}
        className="brand-gradient mt-2 self-start rounded-full px-7 py-3.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40"
      >
        {sent ? t.formations.requestSent : t.formations.requestSubmit}
      </button>
    </form>
  );
}
