import type { EditorAction } from '../state/actions';

interface ToolbarProps {
  title: string;
  canUndo: boolean;
  canRedo: boolean;
  dispatch: React.Dispatch<EditorAction>;
  onReset: () => void;
  onCopyMarkdown: () => void;
}

export function Toolbar({
  title,
  canUndo,
  canRedo,
  dispatch,
  onReset,
  onCopyMarkdown,
}: ToolbarProps) {
  return (
    <header className="toolbar">
      <input
        className="toolbar__title"
        aria-label="Page title"
        value={title}
        onChange={(event) => dispatch({ type: 'SET_TITLE', title: event.target.value })}
      />
      <div className="toolbar__buttons">
        <button type="button" onClick={() => dispatch({ type: 'INSERT_BLOCK' })}>
          + Add block
        </button>
        <button type="button" onClick={() => dispatch({ type: 'INSERT_BLOCK', blockType: 'todo' })}>
          + To-do
        </button>
        <button type="button" disabled={!canUndo} onClick={() => dispatch({ type: 'UNDO' })}>
          Undo
        </button>
        <button type="button" disabled={!canRedo} onClick={() => dispatch({ type: 'REDO' })}>
          Redo
        </button>
        <button type="button" onClick={onCopyMarkdown}>
          Copy as Markdown
        </button>
        <button type="button" onClick={onReset}>
          Reset page
        </button>
      </div>
    </header>
  );
}
