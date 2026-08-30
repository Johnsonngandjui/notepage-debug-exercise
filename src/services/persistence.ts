import type { Block, BlockType, PageDocument } from '../types/document';
import { BLOCK_TYPES } from '../types/document';

const STORAGE_KEY = 'notepage:document:v1';

function isBlockType(value: unknown): value is BlockType {
  return typeof value === 'string' && (BLOCK_TYPES as string[]).includes(value);
}

function parseBlock(value: unknown): Block | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.id !== 'string' || typeof candidate.text !== 'string') {
    return null;
  }
  if (!isBlockType(candidate.type)) {
    return null;
  }
  return {
    id: candidate.id,
    type: candidate.type,
    text: candidate.text,
    checked: candidate.checked === true,
    createdAt: typeof candidate.createdAt === 'number' ? candidate.createdAt : 0,
  };
}

/** Parses persisted JSON, returning null when anything looks wrong. */
export function parseDocument(raw: string): PageDocument | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }
    const candidate = parsed as Record<string, unknown>;
    if (typeof candidate.id !== 'string' || typeof candidate.title !== 'string') {
      return null;
    }
    if (!Array.isArray(candidate.blocks)) {
      return null;
    }

    const blocks: Block[] = [];
    for (const entry of candidate.blocks) {
      const block = parseBlock(entry);
      if (block === null) {
        return null;
      }
      blocks.push(block);
    }

    return {
      id: candidate.id,
      title: candidate.title,
      blocks,
      updatedAt: typeof candidate.updatedAt === 'number' ? candidate.updatedAt : 0,
    };
  } catch {
    return null;
  }
}

function storage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function loadDocument(): PageDocument | null {
  const store = storage();
  if (store === null) {
    return null;
  }
  const raw = store.getItem(STORAGE_KEY);
  return raw === null ? null : parseDocument(raw);
}

export function saveDocument(doc: PageDocument): void {
  const store = storage();
  if (store === null) {
    return;
  }
  try {
    store.setItem(STORAGE_KEY, JSON.stringify(doc));
  } catch {
    // Quota errors are not worth interrupting the editor for.
  }
}

export function clearDocument(): void {
  const store = storage();
  if (store === null) {
    return;
  }
  try {
    store.removeItem(STORAGE_KEY);
  } catch {
    // Ignore.
  }
}
