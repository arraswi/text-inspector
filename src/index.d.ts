export interface TextAnalysis {
  words: number;
  characters: number;
  lines: number;
  paragraphs: number;
  readingSeconds: number;
  topWords: Array<{ word: string; count: number }>;
}
export function analyzeText(text: string, options?: { wordsPerMinute?: number }): TextAnalysis;
