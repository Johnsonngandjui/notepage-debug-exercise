import type { Block, PageDocument } from '../types/document';
import { countOccurrences, matchingBlockIds, searchDocument } from './search';

function block(id: string, text: string): Block {
  return { id, type: 'paragraph', text, checked: false, createdAt: 0 };
}

const sample: PageDocument = {
  id: 'doc_search',
  title: 'Search fixture',
  blocks: [
    block('a', 'Launch plan for the editor'),
    block('b', 'The editor ships on Friday'),
    block('c', 'Nothing to see here'),
    block('d', 'editor editor editor'),
  ],
  updatedAt: 0,
};

describe('countOccurrences', () => {
  it('counts every occurrence, ignoring case', () => {
    expect(countOccurrences('Editor editor EDITOR', 'editor')).toBe(3);
  });

  it('returns 0 for an empty needle', () => {
    expect(countOccurrences('anything', '')).toBe(0);
    expect(countOccurrences('anything', '   ')).toBe(0);
  });

  it('does not count overlapping matches twice', () => {
    expect(countOccurrences('aaaa', 'aa')).toBe(2);
  });
});

describe('searchDocument', () => {
  it('is inactive for a blank query', () => {
    const results = searchDocument(sample, '   ');
    expect(results.isActive).toBe(false);
    expect(results.matches).toHaveLength(0);
  });

  it('returns one entry per matching block', () => {
    const results = searchDocument(sample, 'editor');
    expect(results.matches.map((match) => match.blockId)).toEqual(['a', 'b', 'd']);
  });

  it('sums occurrences across the document', () => {
    const results = searchDocument(sample, 'editor');
    expect(results.totalOccurrences).toBe(5);
  });

  it('records the position of each matching block', () => {
    const results = searchDocument(sample, 'Friday');
    expect(results.matches[0].blockIndex).toBe(1);
  });

  it('exposes matching ids as a set', () => {
    const ids = matchingBlockIds(searchDocument(sample, 'editor'));
    expect(ids.has('a')).toBe(true);
    expect(ids.has('c')).toBe(false);
  });
});
