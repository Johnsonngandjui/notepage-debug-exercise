import { useCallback, useEffect, useMemo, useReducer } from 'react';
import type { PageDocument } from '../types/document';
import type { EditorAction } from '../state/actions';
import { createInitialState, documentReducer } from '../state/documentReducer';
import type { EditorState } from '../state/documentReducer';
import { clearDocument, loadDocument, saveDocument } from '../services/persistence';
import { createSampleDocument } from '../services/sampleDocument';

function initialise(): EditorState {
  const stored = loadDocument();
  return createInitialState(stored ?? createSampleDocument());
}

export interface EditorController {
  state: EditorState;
  document: PageDocument;
  activeBlockId: string | null;
  dispatch: React.Dispatch<EditorAction>;
  canUndo: boolean;
  canRedo: boolean;
  resetDocument: () => void;
}

/** Owns the editor state, wires it to local storage and exposes it to the UI. */
export function useEditorState(): EditorController {
  const [state, dispatch] = useReducer(documentReducer, undefined, initialise);

  useEffect(() => {
    saveDocument(state.document);
  }, [state.document]);

  const resetDocument = useCallback(() => {
    clearDocument();
    dispatch({ type: 'REPLACE_DOCUMENT', document: createSampleDocument() });
  }, []);

  return useMemo(
    () => ({
      state,
      document: state.document,
      activeBlockId: state.activeBlockId,
      dispatch,
      canUndo: state.history.length > 0,
      canRedo: state.future.length > 0,
      resetDocument,
    }),
    [state, resetDocument],
  );
}
