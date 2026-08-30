import type { Block } from '../types/document';

/** Index of `blockId` inside `blocks`, or -1 when it is not present. */
export function findBlockIndex(blocks: Block[], blockId: string | null): number {
  if (blockId === null) {
    return -1;
  }
  return blocks.findIndex((block) => block.id === blockId);
}

/** Keeps `index` inside `[0, length - 1]`. Returns 0 for an empty list. */
export function clampIndex(index: number, length: number): number {
  if (length <= 0) {
    return 0;
  }
  return Math.min(Math.max(index, 0), length - 1);
}

/**
 * Id of the block one step above (`-1`) or below (`+1`) the current one.
 * Returns null at the ends of the document so navigation does not wrap.
 */
export function getAdjacentBlockId(
  blocks: Block[],
  currentId: string | null,
  direction: 1 | -1,
): string | null {
  const currentIndex = findBlockIndex(blocks, currentId);
  if (currentIndex === -1) {
    return blocks.length > 0 ? blocks[0].id : null;
  }

  const nextIndex = currentIndex + direction;
  if (nextIndex < 0 || nextIndex >= blocks.length) {
    return null;
  }
  return blocks[nextIndex].id;
}

/**
 * Decides which block should be selected after a block is deleted.
 *
 * `blocks` is the list *after* the removal and `removedIndex` is the position
 * the deleted block used to occupy. Selection follows the deletion upwards.
 */
export function resolveActiveBlockAfterRemoval(
  blocks: Block[],
  removedIndex: number,
): string | null {
  if (blocks.length === 0) {
    return null;
  }
  const targetIndex = removedIndex - 1;
  if (targetIndex < 0 || targetIndex >= blocks.length) {
    return null;
  }
  return blocks[targetIndex].id;
}

/** Position of a block for display purposes, e.g. "Block 3 of 12". */
export function describeBlockPosition(blocks: Block[], blockId: string | null): string {
  const index = findBlockIndex(blocks, blockId);
  if (index === -1) {
    return 'None';
  }
  return `Block ${index + 1} of ${blocks.length}`;
}
