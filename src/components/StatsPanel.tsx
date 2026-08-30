import type { DocumentStats } from '../utils/stats';
import { todoCompletionPercent } from '../utils/stats';

interface StatsPanelProps {
  stats: DocumentStats;
  activeBlockLabel: string;
}

interface RowProps {
  label: string;
  value: string | number;
}

function Row({ label, value }: RowProps) {
  return (
    <div className="stat-row">
      <span className="stat-row__label">{label}</span>
      <span className="stat-row__value">{value}</span>
    </div>
  );
}

export function StatsPanel({ stats, activeBlockLabel }: StatsPanelProps) {
  return (
    <section className="panel">
      <h2 className="panel__heading">Page stats</h2>
      <Row label="Words" value={stats.wordCount} />
      <Row label="Characters" value={stats.characterCount} />
      <Row label="Characters (no spaces)" value={stats.characterCountExcludingSpaces} />
      <Row label="Blocks" value={stats.blockCount} />
      <Row label="Headings" value={stats.headingCount} />
      <Row label="Empty blocks" value={stats.emptyBlockCount} />
      <Row
        label="To-dos"
        value={`${stats.completedTodoCount}/${stats.todoCount} (${todoCompletionPercent(stats)}%)`}
      />
      <Row label="Reading time" value={`${stats.readingTimeMinutes} min`} />
      <Row label="Selection" value={activeBlockLabel} />
    </section>
  );
}
