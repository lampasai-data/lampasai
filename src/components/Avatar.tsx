import { useState } from "react";

// Profile picture, or the initials of the first name when there is none (or
// when the picture fails to load). The tint depends on the name so the same
// person always gets the same colour.
const TINTS = ["bg-teal/20 text-teal-dark", "bg-amber/25 text-amber-ink", "bg-green/20 text-green-ink", "bg-black/[0.08] text-ink"];

function initialsOf(firstName: string | null | undefined, email: string | null | undefined) {
  const words = (firstName ?? "").trim().split(/\s+/).filter(Boolean);
  const letters = words.length > 0 ? words.slice(0, 2).map((w) => w[0]) : [(email ?? "?").trim()[0] ?? "?"];
  return letters.join("").toUpperCase();
}

export default function Avatar({
  src,
  firstName,
  email,
  size = 32,
}: {
  src?: string | null;
  firstName?: string | null;
  email?: string | null;
  size?: number;
}) {
  const [broken, setBroken] = useState(false);
  const seed = firstName || email || "?";
  const tint = TINTS[[...seed].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % TINTS.length];
  const style = { width: size, height: size, fontSize: Math.round(size * 0.38) };

  if (src && !broken) {
    return (
      <img
        src={src}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        style={style}
        className="shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      style={style}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold ${tint}`}
    >
      {initialsOf(firstName, email)}
    </span>
  );
}
