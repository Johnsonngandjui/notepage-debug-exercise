import type { PageDocument } from '../types/document';
import { cloneBlock, createBlock, createEmptyParagraph, withBlockType } from '../editor/blockFactory';
import { findBlockIndex, resolveActiveBlockAfterRemoval } from '../editor/selection';
import type { EditorAction } from './actions';

export interface HistoryEntry {
  document: PageDocument;
  activeBlockId: string | null;
}

export interface EditorState {
  document: PageDocument;
  activeBlockId: string | null;
  history: HistoryEntry[];
  future: HistoryEntry[];
}

/** How many undo steps we keep. Older steps fall off the front of the stack. */
export const HISTORY_LIMIT = 100;

export function createInitialState(doc: PageDocument): EditorState {
  return {
    document: doc,
    activeBlockId: doc.blocks.length > 0 ? doc.blocks[0].id : null,
    history: [],
    future: [],
  };
}

function snapshot(state: EditorState): HistoryEntry {
  return { document: state.document, activeBlockId: state.activeBlockId };
}

/**
 * Applies a document-changing update, recording an undo step and dropping any
 * redo steps that the new edit has invalidated.
 */
function commit(
  previous: EditorState,
  changes: { document: PageDocument; activeBlockId?: string | null },
): EditorState {
  const merged: EditorState = {
    ...previous,
    ...changes,
    document: { ...changes.document, updatedAt: Date.now() },
  };

  return {
    ...merged,
    history: [...previous.history, snapshot(merged)].slice(-HISTORY_LIMIT),
    future: [],
  };
}

function replaceBlocks(doc: PageDocument, blocks: PageDocument['blocks']): PageDocument {
  return { ...doc, blocks };
}

export function documentReducer(state: EditorState, action: EditorAction): EditorState {
  const blocks = state.document.blocks;

  switch (action.type) {
    case 'SET_TITLE': {
      return commit(state, { document: { ...state.document, title: action.title } });
    }

    case 'UPDATE_BLOCK_TEXT': {
      const index = findBlockIndex(blocks, action.blockId);
      if (index === -1) {
        return state;
      }
      const next = blocks.map((block) =>
        block.id === action.blockId ? { ...block, text: action.text } : block,
      );
      return commit(state, { document: replaceBlocks(state.document, next) });
    }

    case 'SET_BLOCK_TYPE': {
      const index = findBlockIndex(blocks, action.blockId);
      if (index === -1) {
        return state;
      }
      const next = blocks.map((block) =>
        block.id === action.blockId ? withBlockType(block, action.blockType) : block,
      );
      return commit(state, { document: replaceBlocks(state.document, next) });
    }

    case 'TOGGLE_TODO': {
      const next = blocks.map((block) =>
        block.id === action.blockId && block.type === 'todo'
          ? { ...block, checked: !block.checked }
          : block,
      );
      return commit(state, { document: replaceBlocks(state.document, next) });
    }

    case 'INSERT_BLOCK': {
      const created = createBlock(action.blockType ?? 'paragraph');
      const activeIndex = findBlockIndex(blocks, state.activeBlockId);
      const insertAt = activeIndex === -1 ? blocks.length : activeIndex + 1;
      const next = [...blocks.slice(0, insertAt), created, ...blocks.slice(insertAt)];
      return commit(state, {
        document: replaceBlocks(state.document, next),
        activeBlockId: created.id,
      });
    }

    case 'REMOVE_BLOCK': {
      const removedIndex = findBlockIndex(blocks, action.blockId);
      if (removedIndex === -1) {
        return state;
      }
      let next = blocks.filter((block) => block.id !== action.blockId);
      if (next.length === 0) {
        next = [createEmptyParagraph()];
      }
      return commit(state, {
        document: replaceBlocks(state.document, next),
        activeBlockId: resolveActiveBlockAfterRemoval(next, removedIndex),
      });
    }

    case 'DUPLICATE_BLOCK': {
      const index = findBlockIndex(blocks, action.blockId);
      if (index === -1) {
        return state;
      }
      const copy = cloneBlock(blocks[index]);
      const next = [...blocks.slice(0, index + 1), copy, ...blocks.slice(index + 1)];
      return commit(state, {
        document: replaceBlocks(state.document, next),
        activeBlockId: copy.id,
      });
    }

    case 'MOVE_BLOCK': {
      const index = findBlockIndex(blocks, action.blockId);
      if (index === -1) {
        return state;
      }
      const target = index + action.direction;
      if (target < 0 || target >= blocks.length) {
        return state;
      }
      const next = [...blocks];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return commit(state, {
        document: replaceBlocks(state.document, next),
        activeBlockId: moved.id,
      });
    }

    case 'SET_ACTIVE_BLOCK': {
      if (action.blockId === state.activeBlockId) {
        return state;
      }
      return { ...state, activeBlockId: action.blockId };
    }

    case 'UNDO': {
      const previous = state.history[state.history.length - 1];
      if (previous === undefined) {
        return state;
      }
      return {
        document: previous.document,
        activeBlockId: previous.activeBlockId,
        history: state.history.slice(0, -1),
        future: [...state.future, snapshot(state)].slice(-HISTORY_LIMIT),
      };
    }

    case 'REDO': {
      const upcoming = state.future[state.future.length - 1];
      if (upcoming === undefined) {
        return state;
      }
      return {
        document: upcoming.document,
        activeBlockId: upcoming.activeBlockId,
        history: [...state.history, snapshot(state)].slice(-HISTORY_LIMIT),
        future: state.future.slice(0, -1),
      };
    }

    case 'REPLACE_DOCUMENT': {
      const doc = action.document;
      return {
        document: doc,
        activeBlockId: doc.blocks.length > 0 ? doc.blocks[0].id : null,
        history: [],
        future: [],
      };
    }

    default:
      return state;
  }
}
