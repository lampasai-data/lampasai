export interface LocalizedText {
  fr: string;
  en: string;
}

export interface Question {
  id: string;
  question: LocalizedText;
  options: LocalizedText[];
  correctIndexes: number[];
  explanation?: LocalizedText;
}
