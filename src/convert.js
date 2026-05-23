/**
 * convert.js — Convert between cron expression formats
 * e.g. 6-field (with seconds) <-> 5-field standard
 */

const FIELD_NAMES_5 = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];
const FIELD_NAMES_6 = ['second', 'minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];

/**
 * Convert a 5-field cron to a 6-field cron by prepending a seconds field.
 * @param {string} expr - Standard 5-field cron expression
 * @param {string} [second='0'] - Seconds field to prepend
 * @returns {string} 6-field cron expression
 */
function toSixField(expr, second = '0') {
  if (typeof expr !== 'string') throw new TypeError('Expression must be a string');
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) throw new Error(`Expected 5 fields, got ${parts.length}`);
  return [second, ...parts].join(' ');
}

/**
 * Convert a 6-field cron to a 5-field cron by dropping the seconds field.
 * @param {string} expr - 6-field cron expression
 * @returns {string} Standard 5-field cron expression
 */
function toFiveField(expr) {
  if (typeof expr !== 'string') throw new TypeError('Expression must be a string');
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 6) throw new Error(`Expected 6 fields, got ${parts.length}`);
  return parts.slice(1).join(' ');
}

/**
 * Convert a cron expression to a named-field object.
 * @param {string} expr - 5 or 6 field cron expression
 * @returns {Object} Named field map
 */
function toNamedFields(expr) {
  if (typeof expr !== 'string') throw new TypeError('Expression must be a string');
  const parts = expr.trim().split(/\s+/);
  if (parts.length === 5) {
    return Object.fromEntries(FIELD_NAMES_5.map((name, i) => [name, parts[i]]));
  }
  if (parts.length === 6) {
    return Object.fromEntries(FIELD_NAMES_6.map((name, i) => [name, parts[i]]));
  }
  throw new Error(`Expected 5 or 6 fields, got ${parts.length}`);
}

/**
 * Convert a named-field object back to a cron expression string.
 * @param {Object} fields - Named field map
 * @returns {string} Cron expression
 */
function fromNamedFields(fields) {
  if (!fields || typeof fields !== 'object') throw new TypeError('Fields must be an object');
  const has6 = 'second' in fields;
  const names = has6 ? FIELD_NAMES_6 : FIELD_NAMES_5;
  const missing = names.filter(n => !(n in fields));
  if (missing.length > 0) throw new Error(`Missing fields: ${missing.join(', ')}`);
  return names.map(n => fields[n]).join(' ');
}

module.exports = { toSixField, toFiveField, toNamedFields, fromNamedFields };
