let sequence = 0;

/**
 * Generates a process-unique id. Ids are opaque strings; nothing in the app may
 * depend on their shape or ordering.
 */
export function createId(prefix: string): string {
  sequence += 1;
  return `${prefix}_${sequence.toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
