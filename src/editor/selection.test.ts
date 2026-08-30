import type { Block } from '../types/document';
import {
  clampIndex,
  describeBlockPosition,
  findBlockIndex,
  getAdjacentBlockId,
  resolveActiveBlockAfterRemoval,
} from './selection';

function block(id: string): Block {
  return { id, type: 'paragraph', text: id, checked: false, createdAt: 0 };
}

const blocks = [block('a'), block('b'), block('c'), block('d')];

describe('findBlockIndex', () => {
  it('finds an existing block', () => {
    expect(findBlockIndex(blocks, 'c')).toBe(2);
  });

  it('returns -1 for unknown or null ids', () => {
    expect(findBlockIndex(blocks, 'zzz')).toBe(-1);
    expect(findBlockIndex(blocks, null)).toBe(-1);
  });
});

describe('clampIndex', () => {
  it('keeps an index inside the list', () => {
    expect(clampIndex(-3, 4)).toBe(0);
    expect(clampIndex(9, 4)).toBe(3);
    expect(clampIndex(2, 4)).toBe(2);
  });

  it('returns 0 for an empty list', () => {
    expect(clampIndex(5, 0)).toBe(0);
  });
});

describe('getAdjacentBlockId', () => {
  it('moves down the document', () => {
    expect(getAdjacentBlockId(blocks, 'b', 1)).toBe('c');
  });

  it('moves up the document', () => {
    expect(getAdjacentBlockId(blocks, 'b', -1)).toBe('a');
  });

  it('does not wrap at either end', () => {
    expect(getAdjacentBlockId(blocks, 'a', -1)).toBeNull();
    expect(getAdjacentBlockId(blocks, 'd', 1)).toBeNull();
  });

  it('falls back to the first block when nothing is selected', () => {
    expect(getAdjacentBlockId(blocks, null, 1)).toBe('a');
  });
});

describe('resolveActiveBlockAfterRemoval', () => {
  it('selects the block above the one that was deleted', () => {
    const remaining = [block('a'), block('b'), block('d')];
    expect(resolveActiveBlockAfterRemoval(remaining, 2)).toBe('b');
  });

  it('selects the new last block when the final block is deleted', () => {
    const remaining = [block('a'), block('b'), block('c')];
    expect(resolveActiveBlockAfterRemoval(remaining, 3)).toBe('c');
  });

  it('returns null when the document has no blocks left', () => {
    expect(resolveActiveBlockAfterRemoval([], 0)).toBeNull();
  });
});

describe('describeBlockPosition', () => {
  it('describes a one-based position', () => {
    expect(describeBlockPosition(blocks, 'c')).toBe('Block 3 of 4');
  });

  it('reports None when nothing is selected', () => {
    expect(describeBlockPosition(blocks, null)).toBe('None');
  });
});
