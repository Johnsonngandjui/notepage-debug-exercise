import { parseDocument } from './persistence';

const valid = JSON.stringify({
  id: 'doc_1',
  title: 'Saved page',
  updatedAt: 12,
  blocks: [{ id: 'b1', type: 'todo', text: 'Task', checked: true, createdAt: 3 }],
});

describe('parseDocument', () => {
  it('round-trips a valid document', () => {
    const doc = parseDocument(valid);
    expect(doc?.title).toBe('Saved page');
    expect(doc?.blocks[0].checked).toBe(true);
  });

  it('rejects malformed JSON', () => {
    expect(parseDocument('{ not json')).toBeNull();
  });

  it('rejects a document with an unknown block type', () => {
    const raw = JSON.stringify({
      id: 'doc_1',
      title: 'Saved page',
      updatedAt: 0,
      blocks: [{ id: 'b1', type: 'table', text: '', checked: false, createdAt: 0 }],
    });
    expect(parseDocument(raw)).toBeNull();
  });

  it('rejects a document without a blocks array', () => {
    expect(parseDocument(JSON.stringify({ id: 'a', title: 'b' }))).toBeNull();
  });
});
