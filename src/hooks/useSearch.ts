import { useMemo, useState } from 'react';
import type { PageDocument } from '../types/document';
import { matchingBlockIds, searchDocument } from '../utils/search';
import type { SearchResults } from '../utils/search';

export interface SearchController {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResults;
  matchedIds: Set<string>;
}

/** Owns the search box state and the derived match set. */
export function useSearch(doc: PageDocument): SearchController {
  const [query, setQuery] = useState('');

  const results = useMemo(() => searchDocument(doc, query), [doc, query]);
  const matchedIds = useMemo(() => matchingBlockIds(results), [results]);

  return { query, setQuery, results, matchedIds };
}
