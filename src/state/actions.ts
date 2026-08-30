import type { BlockType, PageDocument } from '../types/document';

export type EditorAction =
  | { type: 'SET_TITLE'; title: string }
  | { type: 'UPDATE_BLOCK_TEXT'; blockId: string; text: string }
  | { type: 'SET_BLOCK_TYPE'; blockId: string; blockType: BlockType }
  | { type: 'TOGGLE_TODO'; blockId: string }
  | { type: 'INSERT_BLOCK'; blockType?: BlockType }
  | { type: 'REMOVE_BLOCK'; blockId: string }
  | { type: 'DUPLICATE_BLOCK'; blockId: string }
  | { type: 'MOVE_BLOCK'; blockId: string; direction: 1 | -1 }
  | { type: 'SET_ACTIVE_BLOCK'; blockId: string | null }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'REPLACE_DOCUMENT'; document: PageDocument };
