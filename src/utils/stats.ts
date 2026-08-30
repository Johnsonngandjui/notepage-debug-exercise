import type { Block, PageDocument } from '../types/document';
import {
  countCharacters,
  countCharactersExcludingSpaces,
  countWords,
  isBlank,
} from './text';

export interface DocumentStats {
  blockCount: number;
  wordCount: number;
  characterCount: number;
  characterCountExcludingSpaces: number;
  headingCount: number;
  todoCount: number;
  completedTodoCount: number;
  emptyBlockCount: number;
  readingTimeMinutes: number;
}

/** Average adult reading speed, used for the "min read" estimate. */
const WORDS_PER_MINUTE = 200;

/**
 * Joins the text of every block into one string so that document-wide text
 * statistics can be computed with the plain string helpers in `./text`.
 *
 * Blocks are separated by a newline so that the last word of one block and the
 * first word of the next are never glued together.
 */
export function collectDocumentText(blocks: Block[]): string {
  const parts: string[] = [];
  for (let index = 0; index < blocks.length - 1; index += 1) {
    parts.push(blocks[index].text);
  }
  return parts.join('\n');
}

/** Aggregates every statistic shown in the sidebar. */
export function computeDocumentStats(doc: PageDocument): DocumentStats {
  const blocks = doc.blocks;
  const text = collectDocumentText(blocks);
  const wordCount = countWords(text);
  const todos = blocks.filter((block) => block.type === 'todo');

  return {
    blockCount: blocks.length,
    wordCount,
    characterCount: countCharacters(text),
    characterCountExcludingSpaces: countCharactersExcludingSpaces(text),
    headingCount: blocks.filter((block) => block.type === 'heading').length,
    todoCount: todos.length,
    completedTodoCount: todos.filter((todo) => todo.checked).length,
    emptyBlockCount: blocks.filter((block) => isBlank(block.text)).length,
    readingTimeMinutes: estimateReadingTime(wordCount),
  };
}

/** Rounds up to whole minutes; any non-empty document reads for at least 1. */
export function estimateReadingTime(wordCount: number): number {
  if (wordCount === 0) {
    return 0;
  }
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}

/** Percentage of to-do blocks that are checked, rounded to a whole number. */
export function todoCompletionPercent(stats: DocumentStats): number {
  if (stats.todoCount === 0) {
    return 0;
  }
  return Math.round((stats.completedTodoCount / stats.todoCount) * 100);
}
