/**
 * diff.js — Compare two cron expressions and describe what changed
 */

import { parseCron } from './parser.js';
import { describeField } from './humanize.js';

const FIELD_NAMES = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];

/**
 * Returns an array of changed fields between two parsed cron objects.
 * @param {object} a - parsed cron A
 * @param {object} b - parsed cron B
 * @returns {string[]} list of field names that differ
 */
export function diffFields(a, b) {
  return FIELD_NAMES.filter(field => a[field] !== b[field]);
}

/**
 * Produces a human-readable summary of differences between two cron expressions.
 * @param {string} exprA
 * @param {string} exprB
 * @returns {{ changed: string[], summary: string[] }}
 */
export function diffCron(exprA, exprB) {
  const parsedA = parseCron(exprA);
  const parsedB = parseCron(exprB);

  if (!parsedA || !parsedB) {
    throw new Error('One or both cron expressions could not be parsed.');
  }

  const changed = diffFields(parsedA, parsedB);

  if (changed.length === 0) {
    return { changed: [], summary: ['No differences found.'] };
  }

  const summary = changed.map(field => {
    const from = describeField(field, parsedA[field]);
    const to = describeField(field, parsedB[field]);
    return `${field}: "${from}" → "${to}"`;
  });

  return { changed, summary };
}
