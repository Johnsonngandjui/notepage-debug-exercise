/**
 * Core domain types for a Notepage document.
 *
 * A document is an ordered list of blocks. Every block carries its own text;
 * there is no nesting, which keeps the editor model deliberately flat.
 */

export type BlockType = 'paragraph' | 'heading' | 'todo' | 'bulleted';

export interface Block {
  id: string;
  type: BlockType;
  text: string;
  /** Only meaningful for `todo` blocks; ignored for every other type. */
  checked: boolean;
  createdAt: number;
}

export interface PageDocument {
  id: string;
  title: string;
  blocks: Block[];
  updatedAt: number;
}

export const BLOCK_TYPES: BlockType[] = ['paragraph', 'heading', 'todo', 'bulleted'];

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  paragraph: 'Text',
  heading: 'Heading',
  todo: 'To-do',
  bulleted: 'Bullet',
};
