/**
 * cronMath.js — arithmetic operations on cron expressions
 * Supports shifting, scaling, and offsetting cron fields
 */

import { parseCron } from './parser.js';
import { stringify } from './stringify.js';
import { getBounds, clamp } from './bounds.js';

const FIELDS = ['minute', 'hour', 'dom', 'month', 'dow'];

/**
 * Shift a single numeric or step token by an offset, wrapping within bounds.
 */
export function shiftToken(token, offset, min, max) {
  if (token === '*') return '*';
  const range = max - min + 1;
  if (token.includes('/')) {
    const [base, step] = token.split('/');
    const shiftedBase = base === '*' ? base : String(((parseInt(base, 10) - min + offset % range + range) % range) + min);
    return `${shiftedBase}/${step}`;
  }
  if (token.includes('-')) {
    const [lo, hi] = token.split('-').map(Number);
    const newLo = ((lo - min + offset % range + range) % range) + min;
    const newHi = ((hi - min + offset % range + range) % range) + min;
    return `${newLo}-${newHi}`;
  }
  const val = parseInt(token, 10);
  if (isNaN(val)) return token;
  const shifted = ((val - min + offset % range + range) % range) + min;
  return String(clamp(shifted, min, max));
}

/**
 * Shift all values in a field string by a given offset.
 */
export function shiftField(fieldStr, fieldName, offset) {
  const { min, max } = getBounds(fieldName);
  return fieldStr
    .split(',')
    .map(token => shiftToken(token.trim(), offset, min, max))
    .join(',');
}

/**
 * Shift a full cron expression by offsets per field.
 * offsets: { minute, hour, dom, month, dow } — all optional
 */
export function shiftCron(expression, offsets = {}) {
  const parsed = parseCron(expression);
  const result = {};
  for (const field of FIELDS) {
    const offset = offsets[field] ?? 0;
    result[field] = offset !== 0
      ? shiftField(parsed[field], field, offset)
      : parsed[field];
  }
  return stringify(result);
}

/**
 * Add a fixed number of minutes to a cron expression's minute/hour fields.
 */
export function addMinutes(expression, minutes) {
  const parsed = parseCron(expression);
  const currentMinute = parseInt(parsed.minute, 10);
  const currentHour = parseInt(parsed.hour, 10);

  if (isNaN(currentMinute) || isNaN(currentHour)) {
    // Can't safely shift wildcard/complex fields
    return expression;
  }

  const totalMinutes = currentHour * 60 + currentMinute + minutes;
  const newMinute = ((totalMinutes % 1440) + 1440) % 1440 % 60;
  const newHour = Math.floor(((totalMinutes % 1440) + 1440) % 1440 / 60);

  return stringify({ ...parsed, minute: String(newMinute), hour: String(newHour) });
}
