import type { Block, PageDocument } from '../types/document';

/** Markdown prefix used when exporting a block. */
function prefixFor(block: Block): string {
  switch (block.type) {
    case 'heading':
      return '## ';
    case 'todo':
      return block.checked ? '- [x] ' : '- [ ] ';
    case 'bulleted':
      return '- ';
    case 'paragraph':
    default:
      return '';
  }
}

/** Renders a single block as a line of Markdown. */
export function serializeBlock(block: Block): string {
  return `${prefixFor(block)}${block.text}`;
}

/** Renders the whole page as Markdown, ready for the "Copy as Markdown" button. */
export function toMarkdown(doc: PageDocument): string {
  const lines = doc.blocks.map(serializeBlock);
  return [`# ${doc.title}`, '', ...lines].join('\n');
}
