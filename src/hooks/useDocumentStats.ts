import { useMemo } from 'react';
import type { PageDocument } from '../types/document';
import { computeDocumentStats } from '../utils/stats';
import type { DocumentStats } from '../utils/stats';

/** Recomputes the sidebar statistics whenever the document changes. */
export function useDocumentStats(doc: PageDocument): DocumentStats {
  return useMemo(() => computeDocumentStats(doc), [doc]);
}
