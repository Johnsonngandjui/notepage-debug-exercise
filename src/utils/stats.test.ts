import type { Block, PageDocument } from '../types/document';
import { computeDocumentStats, estimateReadingTime, todoCompletionPercent } from './stats';

function block(partial: Partial<Block> & { id: string }): Block {
  return {
    type: 'paragraph',
    text: '',
    checked: false,
    createdAt: 0,
    ...partial,
  };
}

function doc(blocks: Block[]): PageDocument {
  return { id: 'doc_test', title: 'Test', blocks, updatedAt: 0 };
}

describe('computeDocumentStats', () => {
  it('reports the number of blocks', () => {
    const stats = computeDocumentStats(
      doc([block({ id: 'a', text: 'one' }), block({ id: 'b', text: 'two' })]),
    );
    expect(stats.blockCount).toBe(2);
  });

  it('counts headings separately from other block types', () => {
    const stats = computeDocumentStats(
      doc([
        block({ id: 'a', type: 'heading', text: 'Overview' }),
        block({ id: 'b', type: 'paragraph', text: 'Body' }),
        block({ id: 'c', type: 'heading', text: 'Details' }),
      ]),
    );
    expect(stats.headingCount).toBe(2);
  });

  it('reports to-do totals and completions', () => {
    const stats = computeDocumentStats(
      doc([
        block({ id: 'a', type: 'todo', text: 'Ship it', checked: true }),
        block({ id: 'b', type: 'todo', text: 'Write docs', checked: false }),
        block({ id: 'c', type: 'todo', text: 'Review', checked: true }),
        block({ id: 'd', type: 'paragraph', text: 'Not a todo' }),
      ]),
    );
    expect(stats.todoCount).toBe(3);
    expect(stats.completedTodoCount).toBe(2);
    expect(todoCompletionPercent(stats)).toBe(67);
  });

  it('counts blocks that hold only whitespace as empty', () => {
    const stats = computeDocumentStats(
      doc([
        block({ id: 'a', text: 'content' }),
        block({ id: 'b', text: '   ' }),
        block({ id: 'c', text: '' }),
      ]),
    );
    expect(stats.emptyBlockCount).toBe(2);
  });

  it('handles a document with no blocks at all', () => {
    const stats = computeDocumentStats(doc([]));
    expect(stats.blockCount).toBe(0);
    expect(stats.wordCount).toBe(0);
    expect(stats.readingTimeMinutes).toBe(0);
  });
});

describe('estimateReadingTime', () => {
  it('is zero for an empty document', () => {
    expect(estimateReadingTime(0)).toBe(0);
  });

  it('never drops below a minute once there is any text', () => {
    expect(estimateReadingTime(1)).toBe(1);
    expect(estimateReadingTime(80)).toBe(1);
  });

  it('scales with the number of words', () => {
    expect(estimateReadingTime(400)).toBe(2);
    expect(estimateReadingTime(1000)).toBe(5);
  });
});

describe('todoCompletionPercent', () => {
  it('is zero when there are no to-dos', () => {
    const stats = computeDocumentStats(doc([block({ id: 'a', text: 'text' })]));
    expect(todoCompletionPercent(stats)).toBe(0);
  });
});
