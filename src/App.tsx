import { useCallback } from 'react';
import { BlockList } from './components/BlockList';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { describeBlockPosition } from './editor/selection';
import { toMarkdown } from './editor/serialize';
import { useDocumentStats } from './hooks/useDocumentStats';
import { useEditorState } from './hooks/useEditorState';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { useSearch } from './hooks/useSearch';

export default function App() {
  const { document: doc, activeBlockId, dispatch, canUndo, canRedo, resetDocument } =
    useEditorState();
  const stats = useDocumentStats(doc);
  const { query, setQuery, results, matchedIds } = useSearch(doc);

  useKeyboardNavigation(doc.blocks, activeBlockId, dispatch);

  const copyMarkdown = useCallback(() => {
    const markdown = toMarkdown(doc);
    if (navigator.clipboard !== undefined) {
      void navigator.clipboard.writeText(markdown);
    }
    console.log(markdown);
  }, [doc]);

  return (
    <div className="app">
      <Toolbar
        title={doc.title}
        canUndo={canUndo}
        canRedo={canRedo}
        dispatch={dispatch}
        onReset={resetDocument}
        onCopyMarkdown={copyMarkdown}
      />

      <main className="layout">
        <div className="editor">
          <BlockList
            blocks={doc.blocks}
            activeBlockId={activeBlockId}
            matchedIds={matchedIds}
            searchActive={results.isActive}
            dispatch={dispatch}
          />
          <p className="hint">Alt + ↑ / ↓ moves the selection between blocks.</p>
        </div>

        <Sidebar
          blocks={doc.blocks}
          activeBlockId={activeBlockId}
          activeBlockLabel={describeBlockPosition(doc.blocks, activeBlockId)}
          stats={stats}
          query={query}
          onQueryChange={setQuery}
          results={results}
          dispatch={dispatch}
        />
      </main>
    </div>
  );
}
