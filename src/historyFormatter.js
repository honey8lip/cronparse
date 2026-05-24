/**
 * historyFormatter.js
 * Format cron run history for display.
 * Defines: formatRunEntry, formatHistoryList, toHistorySummary
 */

import { summarizeHistory } from './cronHistory.js';

const PAD = (n) => String(n).padStart(2, '0');

/**
 * Formats a single Date as a human-readable run entry.
 * @param {Date} date
 * @param {number} index - 1-based position
 * @returns {string}
 */
export function formatRunEntry(date, index = 1) {
  const d = `${date.getFullYear()}-${PAD(date.getMonth() + 1)}-${PAD(date.getDate())}`;
  const t = `${PAD(date.getHours())}:${PAD(date.getMinutes())}`;
  return `#${index}  ${d} ${t}`;
}

/**
 * Formats a list of past run dates into a readable list string.
 * @param {Date[]} runs
 * @returns {string}
 */
export function formatHistoryList(runs) {
  if (!runs || runs.length === 0) return 'No past runs found.';
  return runs.map((r, i) => formatRunEntry(r, i + 1)).join('\n');
}

/**
 * Produces a full history summary string for a cron expression.
 * @param {string} expression
 * @param {number} [count=5]
 * @param {Date} [before]
 * @returns {string}
 */
export function toHistorySummary(expression, count = 5, before = new Date()) {
  const { runs, last, first } = summarizeHistory(expression, count, before);

  if (runs.length === 0) {
    return `No history found for "${expression}" in the past year.`;
  }

  const lines = [
    `History for: ${expression}`,
    `Showing last ${runs.length} run(s):`,
    '',
    formatHistoryList(runs),
    '',
    `Most recent : ${last.toISOString().slice(0, 16).replace('T', ' ')}`,
    `Oldest shown: ${first.toISOString().slice(0, 16).replace('T', ' ')}`,
  ];

  return lines.join('\n');
}
