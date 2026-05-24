/**
 * overlap.js — Cron expression overlap detection
 * Determines whether two cron expressions can fire at the same time.
 */

import { parseCron } from './parser.js';
import { fieldOverlap, matchingValues } from './matchers.js';

const FIELD_RANGES = {
  minute: [0, 59],
  hour: [0, 23],
  dom: [1, 31],
  month: [1, 12],
  dow: [0, 6]
};

/**
 * Returns overlapping values for each field between two parsed cron objects.
 * @param {object} parsedA
 * @param {object} parsedB
 * @returns {object} map of field -> overlapping values array
 */
export function fieldOverlaps(parsedA, parsedB) {
  const result = {};
  for (const [field, [min, max]] of Object.entries(FIELD_RANGES)) {
    result[field] = fieldOverlap(
      parsedA[field] ?? '*',
      parsedB[field] ?? '*',
      min,
      max
    );
  }
  return result;
}

/**
 * Returns true if two cron expressions can ever fire at the same time.
 * @param {string} exprA
 * @param {string} exprB
 * @returns {boolean}
 */
export function canOverlap(exprA, exprB) {
  const a = parseCron(exprA);
  const b = parseCron(exprB);
  const overlaps = fieldOverlaps(a, b);
  return Object.values(overlaps).every(arr => arr.length > 0);
}

/**
 * Returns a human-readable summary of where two cron expressions overlap.
 * @param {string} exprA
 * @param {string} exprB
 * @returns {object}
 */
export function overlapSummary(exprA, exprB) {
  const a = parseCron(exprA);
  const b = parseCron(exprB);
  const overlaps = fieldOverlaps(a, b);
  const conflicts = Object.entries(overlaps)
    .filter(([, vals]) => vals.length > 0)
    .map(([field, vals]) => ({ field, values: vals }));
  return {
    overlaps: canOverlap(exprA, exprB),
    conflicts
  };
}

/**
 * Returns the fields that prevent two cron expressions from overlapping.
 * Useful for debugging why two expressions never fire at the same time.
 * @param {string} exprA
 * @param {string} exprB
 * @returns {string[]} list of field names with no overlapping values
 */
export function nonOverlappingFields(exprA, exprB) {
  const a = parseCron(exprA);
  const b = parseCron(exprB);
  const overlaps = fieldOverlaps(a, b);
  return Object.entries(overlaps)
    .filter(([, vals]) => vals.length === 0)
    .map(([field]) => field);
}
