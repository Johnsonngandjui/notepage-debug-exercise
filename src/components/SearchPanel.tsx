import type { SearchResults } from '../utils/search';
import type { EditorAction } from '../state/actions';

interface SearchPanelProps {
  query: string;
  onQueryChange: (query: string) => void;
  results: SearchResults;
  dispatch: React.Dispatch<EditorAction>;
}

export function SearchPanel({ query, onQueryChange, results, dispatch }: SearchPanelProps) {
  return (
    <section className="panel">
      <h2 className="panel__heading">Search</h2>
      <input
        className="panel__input"
        aria-label="Search blocks"
        placeholder="Find in page…"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />

      {results.isActive ? (
        <p className="panel__summary">
          {results.totalOccurrences} match{results.totalOccurrences === 1 ? '' : 'es'} in{' '}
          {results.matches.length} block{results.matches.length === 1 ? '' : 's'}
        </p>
      ) : (
        <p className="panel__summary panel__summary--muted">Type to search this page.</p>
      )}

      <ul className="result-list">
        {results.matches.map((match) => (
          <li key={match.blockId}>
            <button
              type="button"
              className="result-list__item"
              onClick={() => dispatch({ type: 'SET_ACTIVE_BLOCK', blockId: match.blockId })}
            >
              <span className="result-list__index">#{match.blockIndex + 1}</span>
              <span className="result-list__preview">{match.preview}</span>
              <span className="result-list__count">{match.occurrences}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
