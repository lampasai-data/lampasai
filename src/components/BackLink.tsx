import { Link } from "react-router-dom";

export default function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2.5 text-sm font-medium text-muted transition hover:text-ink"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white shadow-sm transition group-hover:border-teal/30 group-hover:bg-teal/5">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {label}
    </Link>
  );
}
