/**
 * timezone.js — Timezone-aware next-run calculation helpers
 */

const { nextRun } = require('./nextRun');

/**
 * Returns a list of valid IANA timezone strings (subset of common ones).
 */
function listTimezones() {
  return Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : [];
}

/**
 * Checks whether a timezone string is valid.
 * @param {string} tz
 * @returns {boolean}
 */
function isValidTimezone(tz) {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/**
 * Converts a UTC Date to a specific timezone, returning a new Date
 * whose local time reflects the target timezone.
 * @param {Date} date
 * @param {string} tz
 * @returns {Date}
 */
function toTimezone(date, tz) {
  if (!isValidTimezone(tz)) {
    throw new Error(`Invalid timezone: ${tz}`);
  }
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  }).formatToParts(date);

  const get = (type) => parts.find(p => p.type === type)?.value;
  const month = parseInt(get('month'), 10) - 1;
  const day = parseInt(get('day'), 10);
  const year = parseInt(get('year'), 10);
  const hour = parseInt(get('hour'), 10) % 24;
  const minute = parseInt(get('minute'), 10);
  const second = parseInt(get('second'), 10);

  return new Date(year, month, day, hour, minute, second);
}

/**
 * Returns the next run date for a cron expression in a given timezone.
 * @param {string} expression
 * @param {string} tz - IANA timezone string
 * @param {Date} [from]
 * @returns {Date|null}
 */
function nextRunInTimezone(expression, tz, from = new Date()) {
  if (!isValidTimezone(tz)) {
    throw new Error(`Invalid timezone: ${tz}`);
  }
  const localFrom = toTimezone(from, tz);
  const result = nextRun(expression, localFrom);
  return result;
}

module.exports = { listTimezones, isValidTimezone, toTimezone, nextRunInTimezone };
