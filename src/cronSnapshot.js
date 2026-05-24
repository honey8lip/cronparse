/**
 * cronSnapshot.js
 * Capture and restore cron expression state snapshots
 */

import { parseCron } from './parser.js';
import { stringify } from './stringify.js';
import { normalize } from './normalize.js';

const snapshots = new Map();

/**
 * Take a named snapshot of a cron expression
 * @param {string} name - snapshot identifier
 * @param {string} expression - cron expression
 * @param {object} [meta] - optional metadata
 * @returns {object} snapshot entry
 */
export function takeSnapshot(name, expression, meta = {}) {
  const parsed = parseCron(expression);
  const normalized = normalize(expression);
  const entry = {
    name,
    expression,
    normalized,
    parsed,
    meta,
    createdAt: new Date().toISOString(),
  };
  snapshots.set(name, entry);
  return entry;
}

/**
 * Retrieve a snapshot by name
 * @param {string} name
 * @returns {object|null}
 */
export function getSnapshot(name) {
  return snapshots.get(name) ?? null;
}

/**
 * Remove a snapshot by name
 * @param {string} name
 * @returns {boolean} true if removed
 */
export function removeSnapshot(name) {
  return snapshots.delete(name);
}

/**
 * List all snapshot names
 * @returns {string[]}
 */
export function listSnapshots() {
  return Array.from(snapshots.keys());
}

/**
 * Restore (return) the expression from a snapshot
 * @param {string} name
 * @returns {string|null}
 */
export function restoreSnapshot(name) {
  const entry = snapshots.get(name);
  if (!entry) return null;
  return entry.expression;
}

/**
 * Diff two snapshots by name, returning changed fields
 * @param {string} nameA
 * @param {string} nameB
 * @returns {object} { changed: string[], a: object, b: object }
 */
export function diffSnapshots(nameA, nameB) {
  const a = snapshots.get(nameA);
  const b = snapshots.get(nameB);
  if (!a || !b) throw new Error(`Snapshot not found: ${!a ? nameA : nameB}`);

  const fields = ['minute', 'hour', 'dom', 'month', 'dow'];
  const changed = fields.filter(f => stringify(a.parsed[f]) !== stringify(b.parsed[f]));

  return { changed, a: a.parsed, b: b.parsed };
}

/**
 * Clear all snapshots
 */
export function clearSnapshots() {
  snapshots.clear();
}
