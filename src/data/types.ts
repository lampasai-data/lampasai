export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndexes: number[];
  explanation?: string;
}
