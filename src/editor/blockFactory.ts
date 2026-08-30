import type { Block, BlockType } from '../types/document';
import { createId } from '../utils/ids';

/** Creates a brand new block that has never been part of a document. */
export function createBlock(type: BlockType = 'paragraph', text = ''): Block {
  return {
    id: createId('block'),
    type,
    text,
    checked: false,
    createdAt: Date.now(),
  };
}

/** Convenience wrapper for the placeholder block an empty page always keeps. */
export function createEmptyParagraph(): Block {
  return createBlock('paragraph', '');
}

/**
 * Copies a block so the copy can be inserted elsewhere in the same document.
 * The copy keeps the original's type, text and checked state but is otherwise
 * an independent block.
 */
export function cloneBlock(block: Block): Block {
  return {
    ...block,
    createdAt: Date.now(),
  };
}

/** Changes a block's type, clearing state that does not apply to the new type. */
export function withBlockType(block: Block, type: BlockType): Block {
  return {
    ...block,
    type,
    checked: type === 'todo' ? block.checked : false,
  };
}
