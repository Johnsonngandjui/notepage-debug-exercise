import type { Block, BlockType, PageDocument } from '../types/document';
import { createBlock } from '../editor/blockFactory';
import { createId } from '../utils/ids';

interface Seed {
  type: BlockType;
  text: string;
  checked?: boolean;
}

const SEEDS: Seed[] = [
  { type: 'heading', text: 'Weekly sync notes' },
  {
    type: 'paragraph',
    text: 'We reviewed the editor rewrite and agreed to keep the block model flat for now.',
  },
  { type: 'paragraph', text: '' },
  { type: 'heading', text: 'Decisions' },
  { type: 'bulleted', text: 'Blocks stay flat, no nesting until the sync engine lands.' },
  { type: 'bulleted', text: 'Search stays client side; the corpus is tiny.' },
  { type: 'bulleted', text: 'Undo is one step per action rather than per keystroke batch.' },
  { type: 'heading', text: 'Follow ups' },
  { type: 'todo', text: 'Write the migration note for existing pages', checked: true },
  { type: 'todo', text: 'Measure editor input latency on a large page', checked: false },
  { type: 'todo', text: 'Decide what the sidebar should show for an empty page', checked: false },
  {
    type: 'paragraph',
    text: 'Next review is on Thursday, so bring the latency numbers and the migration note.',
  },
];

function seedToBlock(seed: Seed): Block {
  const created = createBlock(seed.type, seed.text);
  return { ...created, checked: seed.checked ?? false };
}

/** The page every fresh session starts from. */
export function createSampleDocument(): PageDocument {
  return {
    id: createId('doc'),
    title: 'Weekly sync notes',
    blocks: SEEDS.map(seedToBlock),
    updatedAt: Date.now(),
  };
}
