import { useEffect } from 'react';
import type { Block } from '../types/document';
import type { EditorAction } from '../state/actions';
import { getAdjacentBlockId } from '../editor/selection';

/**
 * Alt+ArrowUp / Alt+ArrowDown move the selection between blocks without
 * fighting the caret movement inside a textarea.
 */
export function useKeyboardNavigation(
  blocks: Block[],
  activeBlockId: string | null,
  dispatch: React.Dispatch<EditorAction>,
): void {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (!event.altKey) {
        return;
      }
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
        return;
      }

      const direction = event.key === 'ArrowDown' ? 1 : -1;
      const nextId = getAdjacentBlockId(blocks, activeBlockId, direction);
      if (nextId !== null) {
        event.preventDefault();
        dispatch({ type: 'SET_ACTIVE_BLOCK', blockId: nextId });
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [blocks, activeBlockId, dispatch]);
}
