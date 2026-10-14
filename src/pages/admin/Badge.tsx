export type BadgeTone = "amber" | "teal" | "green" | "muted" | "danger";

const TONES: Record<BadgeTone, string> = {
  amber: "bg-amber/20 text-amber-ink",
  teal: "bg-teal/15 text-teal-dark",
  green: "bg-green/15 text-green-ink",
  muted: "bg-black/[0.06] text-muted",
  danger: "bg-red-500/12 text-danger-ink",
};

// Tinted pill with a leading dot, same idea as the Wonjo back-office badges.
export default function Badge({ tone, children }: { tone: BadgeTone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${TONES[tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
