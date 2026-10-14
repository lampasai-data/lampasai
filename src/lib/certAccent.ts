// Each certification gets its own accent colour, so cards do not look alike.
const ACCENT: Record<string, string> = { "power-bi": "#d6bb4e", snowflake: "#5fb0d1" };

export const accentOf = (slug: string) => ACCENT[slug] ?? "#4a8896";
