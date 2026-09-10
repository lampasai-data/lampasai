import type { LocalizedText } from "../data/types";
import type { Lang } from "../i18n";

export function localize(text: LocalizedText, lang: Lang): string {
  return text[lang] ?? text.fr;
}

// Scores reach four digits (a full exam run is worth well over a thousand
// points), and "1155 pts" reads as a blur. Grouping is locale-specific -
// French separates with a narrow no-break space, English with a comma - so it
// belongs next to localize() rather than in a hand-rolled regex.
export function formatNumber(value: number, lang: Lang): string {
  return value.toLocaleString(lang === "fr" ? "fr-FR" : "en-US");
}
