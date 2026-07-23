export interface LocalizedText {
  fr: string;
  en: string;
}

/** A drag-and-drop target: a labeled slot that must receive one item from the shared pool. */
export interface MatchTarget {
  label: LocalizedText;
  /** Index (into `pool`) of the item that correctly fills this target. */
  correctPoolIndex: number;
}

/** A hotspot blank: a single dropdown with its own candidate options. */
export interface HotspotBlank {
  /** Optional label shown before the dropdown (e.g. a line of a DAX expression). */
  label?: LocalizedText;
  options: LocalizedText[];
  /** Index (into this blank's `options`) of the correct choice. */
  correctIndex: number;
}

export interface Question {
  id: string;
  /**
   * "choice" (default): pick one or more options.
   * "order": drag items into the correct order.
   * "match": drag items from a shared pool onto labeled targets.
   * "hotspot": pick the correct option in each dropdown of an answer area.
   */
  type?: "choice" | "order" | "match" | "hotspot";
  question: LocalizedText;
  /** For "choice"/"order" questions: the selectable/orderable options. */
  options?: LocalizedText[];
  /** For "choice" questions: indexes (into options) of the correct answer(s). */
  correctIndexes?: number[];
  /** For "order" questions: the target order, as a permutation of option indexes. */
  correctOrder?: number[];
  /** For "match" questions: the shared pool of draggable items. */
  pool?: LocalizedText[];
  /** For "match" questions: the labeled targets to fill from the pool. */
  targets?: MatchTarget[];
  /** For "hotspot" questions: the ordered list of dropdown blanks. */
  blanks?: HotspotBlank[];
  explanation?: LocalizedText;
}
