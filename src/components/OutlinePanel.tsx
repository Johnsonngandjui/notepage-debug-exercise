import type { Block } from '../types/document';
import type { EditorAction } from '../state/actions';
import { truncate } from '../utils/text';

interface OutlinePanelProps {
  blocks: Block[];
  activeBlockId: string | null;
  dispatch: React.Dispatch<EditorAction>;
}

export function OutlinePanel({ blocks, activeBlockId, dispatch }: OutlinePanelProps) {
  const headings = blocks
    .map((block, index) => ({ block, index }))
    .filter((entry) => entry.block.type === 'heading');

  return (
    <section className="panel">
      <h2 className="panel__heading">Outline</h2>
      {headings.length === 0 ? (
        <p className="panel__summary panel__summary--muted">No headings on this page.</p>
      ) : (
        <ul className="result-list">
          {headings.map(({ block, index }) => (
            <li key={block.id}>
              <button
                type="button"
                className={
                  block.id === activeBlockId
                    ? 'result-list__item result-list__item--active'
                    : 'result-list__item'
                }
                onClick={() => dispatch({ type: 'SET_ACTIVE_BLOCK', blockId: block.id })}
              >
                <span className="result-list__index">#{index + 1}</span>
                <span className="result-list__preview">
                  {truncate(block.text.trim() || 'Untitled heading', 40)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
