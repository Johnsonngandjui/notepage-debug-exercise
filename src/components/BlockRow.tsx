import { useEffect, useRef } from 'react';
import type { Block, BlockType } from '../types/document';
import { BLOCK_TYPES, BLOCK_TYPE_LABELS } from '../types/document';
import type { EditorAction } from '../state/actions';

interface BlockRowProps {
  block: Block;
  index: number;
  isActive: boolean;
  isMatch: boolean;
  dispatch: React.Dispatch<EditorAction>;
}

const PLACEHOLDER: Record<BlockType, string> = {
  paragraph: "Type something, or press 'Add block'",
  heading: 'Heading',
  todo: 'To-do',
  bulleted: 'List item',
};

export function BlockRow({ block, index, isActive, isMatch, dispatch }: BlockRowProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const node = inputRef.current;
    if (isActive && node !== null && document.activeElement !== node) {
      node.focus();
    }
  }, [isActive]);

  const classes = ['block-row'];
  if (isActive) classes.push('block-row--active');
  if (isMatch) classes.push('block-row--match');

  return (
    <li className={classes.join(' ')} data-testid={`block-${block.id}`}>
      <div className="block-row__gutter">
        <span className="block-row__index">{index + 1}</span>
        {block.type === 'todo' ? (
          <input
            type="checkbox"
            aria-label={`Toggle ${block.text || 'to-do'}`}
            checked={block.checked}
            onChange={() => dispatch({ type: 'TOGGLE_TODO', blockId: block.id })}
          />
        ) : null}
      </div>

      <textarea
        ref={inputRef}
        className={`block-row__input block-row__input--${block.type}`}
        rows={block.type === 'heading' ? 1 : 2}
        value={block.text}
        placeholder={PLACEHOLDER[block.type]}
        onFocus={() => dispatch({ type: 'SET_ACTIVE_BLOCK', blockId: block.id })}
        onChange={(event) =>
          dispatch({ type: 'UPDATE_BLOCK_TEXT', blockId: block.id, text: event.target.value })
        }
      />

      <div className="block-row__actions">
        <select
          aria-label="Block type"
          value={block.type}
          onChange={(event) =>
            dispatch({
              type: 'SET_BLOCK_TYPE',
              blockId: block.id,
              blockType: event.target.value as BlockType,
            })
          }
        >
          {BLOCK_TYPES.map((type) => (
            <option key={type} value={type}>
              {BLOCK_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
        <button type="button" title="Move up" onClick={() => dispatch({ type: 'MOVE_BLOCK', blockId: block.id, direction: -1 })}>
          ↑
        </button>
        <button type="button" title="Move down" onClick={() => dispatch({ type: 'MOVE_BLOCK', blockId: block.id, direction: 1 })}>
          ↓
        </button>
        <button type="button" title="Duplicate block" onClick={() => dispatch({ type: 'DUPLICATE_BLOCK', blockId: block.id })}>
          ⧉
        </button>
        <button type="button" title="Delete block" onClick={() => dispatch({ type: 'REMOVE_BLOCK', blockId: block.id })}>
          ✕
        </button>
      </div>
    </li>
  );
}
