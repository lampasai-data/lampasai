import { useEffect, useRef, useState } from "react";

export default function CustomSelect({
  options,
  value,
  onChange,
  disabled,
  placeholder,
  className = "",
  triggerClassName = "border-black/15 bg-white",
  optionsClassName = "",
}: {
  options: string[];
  value: number | null;
  onChange: (index: number) => void;
  disabled?: boolean;
  placeholder: string;
  className?: string;
  triggerClassName?: string;
  optionsClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        title={value !== null ? options[value] : undefined}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left font-sans text-sm transition disabled:cursor-default ${triggerClassName} ${
          value === null ? "text-muted" : ""
        }`}
      >
        <span className="truncate">{value !== null ? options[value] : placeholder}</span>
        {!disabled && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {open && !disabled && (
        <div
          className={`absolute left-0 top-full z-20 mt-1 max-h-56 w-max max-w-[80vw] min-w-full overflow-auto rounded-lg border border-black/10 bg-white py-1 font-sans text-sm shadow-lg ${optionsClassName}`}
        >
          {options.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                onChange(i);
                setOpen(false);
              }}
              className={`block w-full whitespace-nowrap px-3 py-2 text-left transition hover:bg-teal/5 ${
                value === i ? "bg-teal/5 text-teal-dark" : "text-ink"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
