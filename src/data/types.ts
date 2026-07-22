export interface LocalizedText {
  fr: string;
  en: string;
}

export interface Question {
  id: string;
  /** "choice" (default): pick one or more options. "order": drag items into the correct order. */
  type?: "choice" | "order";
  question: LocalizedText;
  options: LocalizedText[];
  /** For "choice" questions: indexes (into options) of the correct answer(s). */
  correctIndexes: number[];
  /** For "order" questions: the target order, as a permutation of option indexes. */
  correctOrder?: number[];
  explanation?: LocalizedText;
}
