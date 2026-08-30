/**
 * Low level text helpers.
 *
 * These operate on a single string and know nothing about blocks or documents.
 */

/**
 * Counts words in a string.
 *
 * A "word" is a run of non-whitespace characters, so `well-known` and `don't`
 * each count once.
 */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return 0;
  }
  return trimmed.split(/\s+/).length;
}

/** Counts every character, whitespace included. */
export function countCharacters(text: string): number {
  return text.length;
}

/** Counts characters with all whitespace removed. */
export function countCharactersExcludingSpaces(text: string): number {
  return text.replace(/\s/g, '').length;
}

/** Lower-cases and trims a value so it can be compared case-insensitively. */
export function normalizeForSearch(value: string): string {
  return value.trim().toLowerCase();
}

/** Shortens `text` to at most `maxLength` characters, adding an ellipsis. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

/** True when a block's text holds nothing but whitespace. */
export function isBlank(text: string): boolean {
  return text.trim().length === 0;
}
