/**
 * cronHistory.js
 * Track and query past run history for a cron expression.
 * Defines: getLastRuns, getRunsBetween, summarizeHistory
 */

import { parseCron } from './parser.js';
import { matchesCron } from './nextRun.js';

/**
 * Returns the last N run times before a given date.
 * @param {string} expression - cron expression
 * @param {number} count - number of past runs to return
 * @param {Date} [before] - reference date (defaults to now)
 * @returns {Date[]}
 */
export function getLastRuns(expression, count = 5, before = new Date()) {
  const parsed = parseCron(expression);
  const results = [];
  const cursor = new Date(before);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() - 1);

  const limit = count * 60 * 24 * 366; // max minutes to scan (1 year)
  let steps = 0;

  while (results.length < count && steps < limit) {
    if (matchesCron(parsed, cursor)) {
      results.push(new Date(cursor));
    }
    cursor.setMinutes(cursor.getMinutes() - 1);
    steps++;
  }

  return results;
}

/**
 * Returns all run times within a date range.
 * @param {string} expression
 * @param {Date} from
 * @param {Date} to
 * @returns {Date[]}
 */
export function getRunsBetween(expression, from, to) {
  const parsed = parseCron(expression);
  const results = [];
  const cursor = new Date(from);
  cursor.setSeconds(0, 0);

  while (cursor <= to) {
    if (matchesCron(parsed, cursor)) {
      results.push(new Date(cursor));
    }
    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  return results;
}

/**
 * Returns a summary of run history.
 * @param {string} expression
 * @param {number} count
 * @param {Date} [before]
 * @returns {{ count: number, first: Date|null, last: Date|null, runs: Date[] }}
 */
export function summarizeHistory(expression, count = 10, before = new Date()) {
  const runs = getLastRuns(expression, count, before);
  return {
    count: runs.length,
    last: runs[0] ?? null,
    first: runs[runs.length - 1] ?? null,
    runs,
  };
}
