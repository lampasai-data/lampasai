import type { ReactNode } from "react";

// Small dark label shown under an element on hover and keyboard focus, in
// place of the browser's plain `title` bubble. It opens downwards: the
// dashboard cards clip anything that sticks out of their top edge. `align`
// keeps the label inside the card when the element sits near a side.
export default function Tooltip({
  label,
  align = "center",
  children,
}: {
  label: string;
  align?: "start" | "center" | "end";
  children: ReactNode;
}) {
  const place =
    align === "start" ? "left-0" : align === "end" ? "right-0" : "left-1/2 -translate-x-1/2";
  const arrow =
    align === "start" ? "left-4" : align === "end" ? "right-4" : "left-1/2 -translate-x-1/2";
  return (
    <span className="group/tip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute top-full z-40 mt-2.5 -translate-y-1 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg ring-1 ring-black/10 transition duration-150 group-focus-within/tip:translate-y-0 group-focus-within/tip:opacity-100 group-hover/tip:translate-y-0 group-hover/tip:opacity-100 ${place}`}
      >
        <span aria-hidden="true" className={`absolute -top-1 h-2 w-2 rotate-45 bg-ink ${arrow}`} />
        {label}
      </span>
    </span>
  );
}
