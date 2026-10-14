// Each certification gets its own accent colour, so cards do not look alike.
const ACCENT: Record<string, string> = { "power-bi": "#f2c811", snowflake: "#29b5e8" };

export const accentOf = (slug: string) => ACCENT[slug] ?? "#4a8896";
