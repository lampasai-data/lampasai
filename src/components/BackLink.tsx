import { Link } from "react-router-dom";

// Pill-shaped "back" button: arrow and label inside one bordered capsule.
export default function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 rounded-full border border-black/10 bg-white py-2 pr-4 pl-3 text-sm font-medium text-ink shadow-sm transition hover:border-teal/40 hover:bg-teal/5 hover:text-teal-dark"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 transition group-hover:-translate-x-0.5" aria-hidden="true">
        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </Link>
  );
}
