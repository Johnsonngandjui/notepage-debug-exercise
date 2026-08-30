import type { Block, PageDocument } from '../types/document';
import { createInitialState, documentReducer } from './documentReducer';
import type { EditorState } from './documentReducer';
import type { EditorAction } from './actions';

function block(id: string, text: string, overrides: Partial<Block> = {}): Block {
  return { id, type: 'paragraph', text, checked: false, createdAt: 0, ...overrides };
}

function makeDocument(blocks: Block[]): PageDocument {
  return { id: 'doc_reducer', title: 'Reducer fixture', blocks, updatedAt: 0 };
}

function makeState(blocks: Block[], activeBlockId?: string | null): EditorState {
  const state = createInitialState(makeDocument(blocks));
  if (activeBlockId !== undefined) {
    return { ...state, activeBlockId };
  }
  return state;
}

function run(state: EditorState, ...actions: EditorAction[]): EditorState {
  return actions.reduce(documentReducer, state);
}

const baseBlocks = [block('a', 'Alpha'), block('b', 'Bravo'), block('c', 'Charlie')];

describe('createInitialState', () => {
  it('selects the first block of the document', () => {
    expect(createInitialState(makeDocument(baseBlocks)).activeBlockId).toBe('a');
  });

  it('selects nothing when the document is empty', () => {
    expect(createInitialState(makeDocument([])).activeBlockId).toBeNull();
  });
});

describe('SET_TITLE', () => {
  it('renames the page', () => {
    const next = run(makeState(baseBlocks), { type: 'SET_TITLE', title: 'Q3 planning' });
    expect(next.document.title).toBe('Q3 planning');
  });
});

describe('UPDATE_BLOCK_TEXT', () => {
  it('rewrites only the targeted block', () => {
    const next = run(makeState(baseBlocks), {
      type: 'UPDATE_BLOCK_TEXT',
      blockId: 'b',
      text: 'Bravo edited',
    });
    expect(next.document.blocks.map((item) => item.text)).toEqual([
      'Alpha',
      'Bravo edited',
      'Charlie',
    ]);
  });

  it('ignores unknown block ids', () => {
    const state = makeState(baseBlocks);
    const next = run(state, { type: 'UPDATE_BLOCK_TEXT', blockId: 'zzz', text: 'nope' });
    expect(next).toBe(state);
  });
});

describe('SET_BLOCK_TYPE', () => {
  it('changes the type of a block', () => {
    const next = run(makeState(baseBlocks), {
      type: 'SET_BLOCK_TYPE',
      blockId: 'a',
      blockType: 'heading',
    });
    expect(next.document.blocks[0].type).toBe('heading');
  });

  it('clears the checked flag when a to-do becomes something else', () => {
    const state = makeState([block('t', 'Task', { type: 'todo', checked: true })]);
    const next = run(state, { type: 'SET_BLOCK_TYPE', blockId: 't', blockType: 'paragraph' });
    expect(next.document.blocks[0].checked).toBe(false);
  });
});

describe('TOGGLE_TODO', () => {
  it('flips the checked flag of a to-do block', () => {
    const state = makeState([block('t', 'Task', { type: 'todo' })]);
    const next = run(state, { type: 'TOGGLE_TODO', blockId: 't' });
    expect(next.document.blocks[0].checked).toBe(true);
  });

  it('leaves non to-do blocks alone', () => {
    const next = run(makeState(baseBlocks), { type: 'TOGGLE_TODO', blockId: 'a' });
    expect(next.document.blocks[0].checked).toBe(false);
  });
});

describe('INSERT_BLOCK', () => {
  it('inserts directly below the active block', () => {
    const next = run(makeState(baseBlocks, 'a'), { type: 'INSERT_BLOCK' });
    expect(next.document.blocks).toHaveLength(4);
    expect(next.document.blocks[1].text).toBe('');
  });

  it('appends to the end when nothing is selected', () => {
    const next = run(makeState(baseBlocks, null), { type: 'INSERT_BLOCK' });
    expect(next.document.blocks[3].text).toBe('');
  });

  it('selects the newly created block', () => {
    const next = run(makeState(baseBlocks, 'a'), { type: 'INSERT_BLOCK' });
    expect(next.activeBlockId).toBe(next.document.blocks[1].id);
  });
});

describe('REMOVE_BLOCK', () => {
  it('removes the block', () => {
    const next = run(makeState(baseBlocks, 'b'), { type: 'REMOVE_BLOCK', blockId: 'b' });
    expect(next.document.blocks.map((item) => item.id)).toEqual(['a', 'c']);
  });

  it('keeps one empty paragraph when the last block is removed', () => {
    const next = run(makeState([block('only', 'Only')]), {
      type: 'REMOVE_BLOCK',
      blockId: 'only',
    });
    expect(next.document.blocks).toHaveLength(1);
    expect(next.document.blocks[0].text).toBe('');
  });

  it('moves the selection to the block above the deleted one', () => {
    const next = run(makeState(baseBlocks, 'c'), { type: 'REMOVE_BLOCK', blockId: 'c' });
    expect(next.activeBlockId).toBe('b');
  });
});

describe('DUPLICATE_BLOCK', () => {
  it('inserts the copy directly below the original', () => {
    const next = run(makeState(baseBlocks, 'b'), { type: 'DUPLICATE_BLOCK', blockId: 'b' });
    expect(next.document.blocks.map((item) => item.text)).toEqual([
      'Alpha',
      'Bravo',
      'Bravo',
      'Charlie',
    ]);
  });

  it('copies the type and checked state', () => {
    const state = makeState([block('t', 'Task', { type: 'todo', checked: true })], 't');
    const next = run(state, { type: 'DUPLICATE_BLOCK', blockId: 't' });
    expect(next.document.blocks[1].type).toBe('todo');
    expect(next.document.blocks[1].checked).toBe(true);
  });

  it('leaves the original untouched when the copy is edited afterwards', () => {
    const duplicated = run(makeState(baseBlocks, 'b'), {
      type: 'DUPLICATE_BLOCK',
      blockId: 'b',
    });
    const copyId = duplicated.document.blocks[2].id;

    const edited = run(duplicated, {
      type: 'UPDATE_BLOCK_TEXT',
      blockId: copyId,
      text: 'Bravo copy',
    });

    expect(edited.document.blocks.map((item) => item.text)).toEqual([
      'Alpha',
      'Bravo',
      'Bravo copy',
      'Charlie',
    ]);
  });
});

describe('MOVE_BLOCK', () => {
  it('moves a block down', () => {
    const next = run(makeState(baseBlocks, 'a'), {
      type: 'MOVE_BLOCK',
      blockId: 'a',
      direction: 1,
    });
    expect(next.document.blocks.map((item) => item.id)).toEqual(['b', 'a', 'c']);
  });

  it('moves a block up', () => {
    const next = run(makeState(baseBlocks, 'c'), {
      type: 'MOVE_BLOCK',
      blockId: 'c',
      direction: -1,
    });
    expect(next.document.blocks.map((item) => item.id)).toEqual(['a', 'c', 'b']);
  });

  it('does nothing at the edges of the document', () => {
    const state = makeState(baseBlocks, 'a');
    expect(run(state, { type: 'MOVE_BLOCK', blockId: 'a', direction: -1 })).toBe(state);
    expect(run(state, { type: 'MOVE_BLOCK', blockId: 'c', direction: 1 })).toBe(state);
  });
});

describe('SET_ACTIVE_BLOCK', () => {
  it('changes the selection without touching the document', () => {
    const state = makeState(baseBlocks, 'a');
    const next = run(state, { type: 'SET_ACTIVE_BLOCK', blockId: 'c' });
    expect(next.activeBlockId).toBe('c');
    expect(next.document).toBe(state.document);
  });

  it('is a no-op when the block is already selected', () => {
    const state = makeState(baseBlocks, 'a');
    expect(run(state, { type: 'SET_ACTIVE_BLOCK', blockId: 'a' })).toBe(state);
  });
});

describe('REPLACE_DOCUMENT', () => {
  it('swaps in a new document and clears history', () => {
    const state = run(makeState(baseBlocks), { type: 'SET_TITLE', title: 'Changed' });
    const replaced = run(state, {
      type: 'REPLACE_DOCUMENT',
      document: makeDocument([block('x', 'Fresh')]),
    });
    expect(replaced.document.blocks[0].id).toBe('x');
    expect(replaced.history).toHaveLength(0);
  });
});
