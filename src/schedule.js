/**
 * schedule.js
 * Generates a list of upcoming run times for a cron expression.
 */

import { nextRun } from './nextRun.js';
import { validate } from './validator.js';

/**
 * Returns the next `count` run times after `fromDate`.
 * @param {string} expression - Cron expression
 * @param {number} count - Number of upcoming runs to return
 * @param {Date} fromDate - Start date (defaults to now)
 * @returns {{ runs: Date[], errors: string[] }}
 */
export function getSchedule(expression, count = 5, fromDate = new Date()) {
  const { valid, errors } = validate(expression);
  if (!valid) {
    return { runs: [], errors };
  }

  if (count < 1 || count > 100) {
    return { runs: [], errors: ['count must be between 1 and 100'] };
  }

  const runs = [];
  let cursor = new Date(fromDate);

  for (let i = 0; i < count; i++) {
    const next = nextRun(expression, cursor);
    if (!next) break;
    runs.push(next);
    cursor = new Date(next.getTime() + 1000); // advance by 1s to avoid duplicates
  }

  return { runs, errors: [] };
}

/**
 * Returns runs within a date range.
 * @param {string} expression
 * @param {Date} start
 * @param {Date} end
 * @returns {{ runs: Date[], errors: string[] }}
 */
export function getScheduleInRange(expression, start, end) {
  if (!(start instanceof Date) || !(end instanceof Date)) {
    return { runs: [], errors: ['start and end must be Date objects'] };
  }
  if (start >= end) {
    return { runs: [], errors: ['start must be before end'] };
  }

  const { valid, errors } = validate(expression);
  if (!valid) {
    return { runs: [], errors };
  }

  const runs = [];
  let cursor = new Date(start);

  while (cursor < end) {
    const next = nextRun(expression, cursor);
    if (!next || next >= end) break;
    runs.push(next);
    cursor = new Date(next.getTime() + 1000);
    if (runs.length >= 1000) break; // safety cap
  }

  return { runs, errors: [] };
}
