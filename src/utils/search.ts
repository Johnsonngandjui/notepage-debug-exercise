import type { Block, PageDocument } from '../types/document';
import { normalizeForSearch, truncate } from './text';

export interface SearchMatch {
  blockId: string;
  blockIndex: number;
  occurrences: number;
  preview: string;
}

export interface SearchResults {
  query: string;
  isActive: boolean;
  totalOccurrences: number;
  matches: SearchMatch[];
}

const PREVIEW_LENGTH = 70;

/** Counts non-overlapping, case-insensitive occurrences of `needle`. */
export function countOccurrences(haystack: string, needle: string): number {
  const target = normalizeForSearch(needle);
  if (target.length === 0) {
    return 0;
  }

  const source = haystack.toLowerCase();
  let count = 0;
  let cursor = source.indexOf(target);
  while (cursor !== -1) {
    count += 1;
    cursor = source.indexOf(target, cursor + target.length);
  }
  return count;
}

/** True when the block's text contains the query, ignoring case. */
export function blockMatchesQuery(block: Block, query: string): boolean {
  return countOccurrences(block.text, query) > 0;
}

/**
 * Runs a case-insensitive substring search across every block in the document.
 * An empty query produces an inactive result set rather than "everything".
 */
export function searchDocument(doc: PageDocument, rawQuery: string): SearchResults {
  const query = normalizeForSearch(rawQuery);
  if (query.length === 0) {
    return { query: '', isActive: false, totalOccurrences: 0, matches: [] };
  }

  const matches: SearchMatch[] = [];
  doc.blocks.forEach((block, blockIndex) => {
    const occurrences = countOccurrences(block.text, query);
    if (occurrences > 0) {
      matches.push({
        blockId: block.id,
        blockIndex,
        occurrences,
        preview: truncate(block.text.trim(), PREVIEW_LENGTH),
      });
    }
  });

  return {
    query,
    isActive: true,
    totalOccurrences: matches.reduce((total, match) => total + match.occurrences, 0),
    matches,
  };
}

/** Ids of every matching block, handy for highlighting rows in the editor. */
export function matchingBlockIds(results: SearchResults): Set<string> {
  return new Set(results.matches.map((match) => match.blockId));
}
