/**
 * stringify.js — Convert a parsed cron object back to a cron expression string
 */

const FIELD_ORDER = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];
const FIELD_ORDER_6 = ['second', 'minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];

const MONTH_NAMES = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const DOW_NAMES = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

/**
 * Stringify a single parsed field back to cron syntax.
 * @param {Object|string} field - parsed field or raw string
 * @returns {string}
 */
function stringifyField(field) {
  if (typeof field === 'string') return field;
  if (!field || field.raw !== undefined) return field.raw ?? '*';

  const { type, value, step, from, to, values } = field;

  if (type === 'wildcard') {
    return step ? `*/${step}` : '*';
  }

  if (type === 'range') {
    const base = `${from}-${to}`;
    return step ? `${base}/${step}` : base;
  }

  if (type === 'list') {
    return (values || []).map(stringifyField).join(',');
  }

  if (type === 'step') {
    return `${from}/${step}`;
  }

  if (type === 'value') {
    return step ? `${value}/${step}` : String(value);
  }

  return String(value ?? '*');
}

/**
 * Convert a parsed cron object back to an expression string.
 * Supports both 5-field and 6-field (with seconds) formats.
 *
 * @param {Object} parsed - parsed cron object with named fields
 * @param {Object} [options]
 * @param {boolean} [options.seconds=false] - include seconds field
 * @returns {string}
 */
function stringify(parsed, options = {}) {
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('stringify: expected a parsed cron object');
  }

  const order = options.seconds ? FIELD_ORDER_6 : FIELD_ORDER;

  const parts = order.map((fieldName) => {
    const field = parsed[fieldName];
    if (field === undefined || field === null) return '*';
    return stringifyField(field);
  });

  return parts.join(' ');
}

module.exports = { stringifyField, stringify };
