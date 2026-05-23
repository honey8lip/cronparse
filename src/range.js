/**
 * range.js — utilities for expanding and inspecting cron field ranges
 */

const FIELD_LIMITS = {
  minute:  { min: 0, max: 59 },
  hour:    { min: 0, max: 23 },
  dom:     { min: 1, max: 31 },
  month:   { min: 1, max: 12 },
  dow:     { min: 0, max: 7 },
};

/**
 * Expand a single cron field token into an array of matching integers.
 * Supports: *, n, n-m, n/s, n-m/s
 */
function expandToken(token, fieldName) {
  const { min, max } = FIELD_LIMITS[fieldName];

  if (token === '*') {
    return range(min, max);
  }

  if (token.includes('/')) {
    const [base, stepStr] = token.split('/');
    const step = parseInt(stepStr, 10);
    const [lo, hi] = base === '*' ? [min, max] : base.split('-').map(Number);
    return range(lo, hi ?? lo).filter((n) => (n - lo) % step === 0);
  }

  if (token.includes('-')) {
    const [lo, hi] = token.split('-').map(Number);
    return range(lo, hi);
  }

  return [parseInt(token, 10)];
}

/**
 * Expand a full cron field (may contain commas) into a sorted unique array.
 */
function expandField(field, fieldName) {
  if (!FIELD_LIMITS[fieldName]) {
    throw new Error(`Unknown field: ${fieldName}`);
  }
  const values = field
    .split(',')
    .flatMap((token) => expandToken(token.trim(), fieldName));
  return [...new Set(values)].sort((a, b) => a - b);
}

/**
 * Return true if two cron fields resolve to the same set of values.
 */
function rangesEqual(fieldA, fieldB, fieldName) {
  const a = expandField(fieldA, fieldName);
  const b = expandField(fieldB, fieldName);
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/**
 * Return the intersection of two fields as an expanded array.
 */
function rangeIntersect(fieldA, fieldB, fieldName) {
  const a = new Set(expandField(fieldA, fieldName));
  return expandField(fieldB, fieldName).filter((v) => a.has(v));
}

function range(lo, hi) {
  const result = [];
  for (let i = lo; i <= hi; i++) result.push(i);
  return result;
}

module.exports = { expandField, rangesEqual, rangeIntersect, FIELD_LIMITS };
