/**
 * Analyze Unicode text. Reading time is an estimate, not a measured duration.
 * @param {string} text
 * @param {{ wordsPerMinute?: number }} [options]
 */
export function analyzeText(text, { wordsPerMinute = 200 } = {}) {
  if (typeof text !== 'string') throw new TypeError('O texto deve ser uma string.');
  if (!Number.isFinite(wordsPerMinute) || wordsPerMinute <= 0) {
    throw new RangeError('A velocidade de leitura deve ser um número positivo.');
  }
  const normalized = text.normalize('NFC');
  const words = Array.from(new Intl.Segmenter('pt-BR', { granularity: 'word' })
    .segment(normalized)).filter(part => part.isWordLike).map(part => part.segment);
  const frequency = new Map();
  for (const word of words) {
    const key = word.toLocaleLowerCase('pt-BR');
    frequency.set(key, (frequency.get(key) ?? 0) + 1);
  }
  const characters = Array.from(new Intl.Segmenter('pt-BR', { granularity: 'grapheme' })
    .segment(normalized)).length;
  return {
    words: words.length,
    characters,
    lines: normalized === '' ? 0 : normalized.split(/\r\n|\n|\r/).length,
    paragraphs: normalized.trim() ? normalized.trim().split(/(?:\r?\n|\r)\s*(?:\r?\n|\r)/).filter(p => p.trim()).length : 0,
    readingSeconds: Math.ceil(words.length / wordsPerMinute * 60),
    topWords: [...frequency].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt-BR'))
      .slice(0, 10).map(([word, count]) => ({ word, count })),
  };
}
