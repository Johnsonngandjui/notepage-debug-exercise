import type { Block } from '../types/document';
import type { EditorAction } from '../state/actions';
import { BlockRow } from './BlockRow';

interface BlockListProps {
  blocks: Block[];
  activeBlockId: string | null;
  matchedIds: Set<string>;
  searchActive: boolean;
  dispatch: React.Dispatch<EditorAction>;
}

export function BlockList({
  blocks,
  activeBlockId,
  matchedIds,
  searchActive,
  dispatch,
}: BlockListProps) {
  if (blocks.length === 0) {
    return <p className="empty-state">This page has no blocks yet.</p>;
  }

  return (
    <ol className="block-list">
      {blocks.map((block, index) => (
        <BlockRow
          key={block.id}
          block={block}
          index={index}
          isActive={block.id === activeBlockId}
          isMatch={searchActive && matchedIds.has(block.id)}
          dispatch={dispatch}
        />
      ))}
    </ol>
  );
}
