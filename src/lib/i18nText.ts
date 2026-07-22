import type { LocalizedText } from "../data/types";
import type { Lang } from "../i18n";

export function localize(text: LocalizedText, lang: Lang): string {
  return text[lang] ?? text.fr;
}
