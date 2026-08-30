import type { Block } from '../types/document';
import type { DocumentStats } from '../utils/stats';
import type { SearchResults } from '../utils/search';
import type { EditorAction } from '../state/actions';
import { StatsPanel } from './StatsPanel';
import { SearchPanel } from './SearchPanel';
import { OutlinePanel } from './OutlinePanel';

interface SidebarProps {
  blocks: Block[];
  activeBlockId: string | null;
  activeBlockLabel: string;
  stats: DocumentStats;
  query: string;
  onQueryChange: (query: string) => void;
  results: SearchResults;
  dispatch: React.Dispatch<EditorAction>;
}

export function Sidebar({
  blocks,
  activeBlockId,
  activeBlockLabel,
  stats,
  query,
  onQueryChange,
  results,
  dispatch,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <StatsPanel stats={stats} activeBlockLabel={activeBlockLabel} />
      <SearchPanel
        query={query}
        onQueryChange={onQueryChange}
        results={results}
        dispatch={dispatch}
      />
      <OutlinePanel blocks={blocks} activeBlockId={activeBlockId} dispatch={dispatch} />
    </aside>
  );
}
