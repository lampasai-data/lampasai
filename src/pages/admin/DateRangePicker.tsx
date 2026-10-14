import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../../i18n";
import {
  PRESET_IDS,
  endOfDay,
  presetRange,
  startOfDay,
  type DateRange,
} from "../../lib/dateRange";
import { ADMIN_T, adminLocale } from "../adminI18n";

const sameDay = (a: Date, b: Date) => a.getTime() === b.getTime();

// Period picker: quick presets on the left, a two-click range calendar on the
// right. Future days are disabled; picking the second day applies the range.
export default function DateRangePicker({
  value,
  onChange,
}: {
  value: DateRange;
  onChange: (range: DateRange) => void;
}) {
  const { lang } = useLanguage();
  const a = ADMIN_T[lang];
  const locale = adminLocale(lang);
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => startOfDay(value.to));
  const [pending, setPending] = useState<Date | null>(null);
  const [hover, setHover] = useState<Date | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const today = startOfDay(new Date());

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle() {
    if (!open) {
      setMonth(startOfDay(value.to));
      setPending(null);
      setHover(null);
    }
    setOpen((o) => !o);
  }

  const fmtShort = (d: Date) => d.toLocaleDateString(locale, { day: "numeric", month: "short" });
  const label =
    value.preset === "custom"
      ? `${fmtShort(value.from)} – ${fmtShort(value.to)}`
      : a.dr.presets[value.preset];

  // The range being drawn: the pending first click + hovered day, else the applied range.
  const shown = useMemo(() => {
    if (pending) {
      const other = hover ?? pending;
      return pending <= other ? { from: pending, to: other } : { from: other, to: pending };
    }
    return { from: startOfDay(value.from), to: startOfDay(value.to) };
  }, [pending, hover, value]);

  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const leading = first.getDay(); // Sunday-first grid
  const cells: (Date | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
  ];
  const atCurrentMonth = first.getFullYear() === today.getFullYear() && first.getMonth() === today.getMonth();

  // Sunday-first narrow weekday letters (Jan 4 2026 is a Sunday).
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Date(2026, 0, 4 + i).toLocaleDateString(locale, { weekday: "narrow" })
  );

  function pick(day: Date) {
    if (!pending) {
      setPending(day);
      return;
    }
    const [from, to] = pending <= day ? [pending, day] : [day, pending];
    onChange({ from, to: endOfDay(to), preset: "custom" });
    setPending(null);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`inline-flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-ink transition ${
          open ? "bg-black/[0.08]" : "bg-black/[0.04] hover:bg-black/[0.07]"
        }`}
      >
        {label}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`transition ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={a.dr.period}
          className="absolute right-0 z-40 mt-2 flex max-w-[calc(100vw-2rem)] flex-col gap-4 rounded-3xl border border-black/10 bg-white p-4 shadow-2xl sm:flex-row"
        >
          <ul className="flex shrink-0 flex-row gap-1 overflow-x-auto sm:w-48 sm:flex-col sm:overflow-visible">
            {PRESET_IDS.map((id) => {
              const active = value.preset === id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(presetRange(id));
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-left text-[15px] whitespace-nowrap transition ${
                      active ? "bg-black/[0.07] font-medium text-ink" : "text-ink/80 hover:bg-black/[0.04]"
                    }`}
                  >
                    {a.dr.presets[id]}
                    {active && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m5 12 5 5 9-10" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="w-[17.5rem] shrink-0">
            <div className="flex items-center justify-between px-1 pb-3">
              <button
                type="button"
                aria-label={a.dr.prevMonth}
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-black/[0.05] hover:text-ink"
              >
                ‹
              </button>
              <span className="text-[15px] font-semibold text-ink capitalize">
                {month.toLocaleDateString(locale, { month: "long", year: "numeric" })}
              </span>
              <button
                type="button"
                aria-label={a.dr.nextMonth}
                disabled={atCurrentMonth}
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-black/[0.05] hover:text-ink disabled:opacity-30"
              >
                ›
              </button>
            </div>

            <div className="grid grid-cols-7 text-center text-xs font-medium text-muted">
              {weekdays.map((w, i) => (
                <span key={i} className="py-2 uppercase">
                  {w}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7" onMouseLeave={() => setHover(null)}>
              {cells.map((day, i) => {
                if (!day) return <span key={`b${i}`} />;
                const future = day > today;
                const isEdge = sameDay(day, shown.from) || sameDay(day, shown.to);
                const inside = day >= shown.from && day <= shown.to;
                return (
                  <button
                    key={day.getTime()}
                    type="button"
                    disabled={future}
                    onClick={() => pick(day)}
                    onMouseEnter={() => pending && setHover(day)}
                    className={`relative flex h-10 items-center justify-center text-sm transition ${
                      future
                        ? "cursor-default text-black/20"
                        : isEdge
                          ? "rounded-lg bg-ink font-semibold text-white"
                          : inside
                            ? "bg-black/[0.07] text-ink"
                            : "rounded-lg text-ink hover:bg-black/[0.05]"
                    }`}
                  >
                    {day.getDate()}
                    {sameDay(day, today) && (
                      <span
                        className={`absolute bottom-1 h-1 w-1 rounded-full ${isEdge ? "bg-white/70" : "bg-muted"}`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            {pending && <p className="mt-3 px-1 text-xs text-muted">{a.dr.pickEnd}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
