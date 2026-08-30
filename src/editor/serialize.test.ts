import type { PageDocument } from '../types/document';
import { serializeBlock, toMarkdown } from './serialize';

const doc: PageDocument = {
  id: 'doc_md',
  title: 'Release notes',
  blocks: [
    { id: 'a', type: 'heading', text: 'Summary', checked: false, createdAt: 0 },
    { id: 'b', type: 'paragraph', text: 'We shipped it.', checked: false, createdAt: 0 },
    { id: 'c', type: 'todo', text: 'Tell support', checked: true, createdAt: 0 },
    { id: 'd', type: 'todo', text: 'Update the changelog', checked: false, createdAt: 0 },
    { id: 'e', type: 'bulleted', text: 'Faster search', checked: false, createdAt: 0 },
  ],
  updatedAt: 0,
};

describe('serializeBlock', () => {
  it('prefixes each block type correctly', () => {
    expect(serializeBlock(doc.blocks[0])).toBe('## Summary');
    expect(serializeBlock(doc.blocks[1])).toBe('We shipped it.');
    expect(serializeBlock(doc.blocks[2])).toBe('- [x] Tell support');
    expect(serializeBlock(doc.blocks[3])).toBe('- [ ] Update the changelog');
    expect(serializeBlock(doc.blocks[4])).toBe('- Faster search');
  });
});

describe('toMarkdown', () => {
  it('starts with the document title', () => {
    expect(toMarkdown(doc).split('\n')[0]).toBe('# Release notes');
  });

  it('emits one line per block', () => {
    const lines = toMarkdown(doc).split('\n');
    expect(lines).toHaveLength(doc.blocks.length + 2);
  });
});
