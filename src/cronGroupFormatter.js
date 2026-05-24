/**
 * cronGroupFormatter.js — Format a cron group for display
 */

import { humanize } from './humanize.js';
import { sortGroupByNextRun } from './cronGroup.js';

/**
 * Format a single group entry as a readable string
 * @param {string} name
 * @param {string} expression
 * @param {Date} nextRunDate
 * @returns {string}
 */
export function formatGroupEntry(name, expression, nextRunDate) {
  const desc = humanize(expression);
  const next = nextRunDate ? nextRunDate.toISOString() : 'unknown';
  return `[${name}] ${expression} — ${desc} (next: ${next})`;
}

/**
 * Format all entries in a group as an array of readable strings
 * @param {Object} group
 * @param {Date} [from]
 * @returns {string[]}
 */
export function formatGroup(group, from = new Date()) {
  return sortGroupByNextRun(group, from).map(({ name, expression, nextRun }) =>
    formatGroupEntry(name, expression, nextRun)
  );
}

/**
 * Format a group as a plain-text summary block
 * @param {Object} group
 * @param {Date} [from]
 * @returns {string}
 */
export function toGroupSummary(group, from = new Date()) {
  const lines = formatGroup(group, from);
  if (lines.length === 0) return '(empty group)';
  const header = `Cron Group (${lines.length} schedule${lines.length !== 1 ? 's' : ''})`;
  const separator = '-'.repeat(header.length);
  return [header, separator, ...lines].join('\n');
}

/**
 * Format a group as a JSON-serializable array
 * @param {Object} group
 * @param {Date} [from]
 * @returns {Array<{name: string, expression: string, description: string, nextRun: string}>}
 */
export function toGroupJSON(group, from = new Date()) {
  return sortGroupByNextRun(group, from).map(({ name, expression, nextRun }) => ({
    name,
    expression,
    description: humanize(expression),
    nextRun: nextRun ? nextRun.toISOString() : null,
  }));
}
