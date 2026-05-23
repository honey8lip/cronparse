/**
 * scheduleFormatter.js
 * Formats schedule run lists into human-readable output.
 */

const DEFAULT_LOCALE = 'en-US';
const DEFAULT_OPTIONS = {
  dateStyle: 'medium',
  timeStyle: 'short',
  hour12: false,
};

/**
 * Formats a single Date into a readable string.
 * @param {Date} date
 * @param {string} locale
 * @param {Intl.DateTimeFormatOptions} options
 * @returns {string}
 */
export function formatRunDate(date, locale = DEFAULT_LOCALE, options = DEFAULT_OPTIONS) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid date';
  }
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Formats an array of run dates into a numbered list of strings.
 * @param {Date[]} runs
 * @param {object} opts
 * @param {string} [opts.locale]
 * @param {Intl.DateTimeFormatOptions} [opts.dateOptions]
 * @param {boolean} [opts.numbered=true]
 * @returns {string[]}
 */
export function formatSchedule(runs, { locale, dateOptions, numbered = true } = {}) {
  if (!Array.isArray(runs)) return [];
  return runs.map((date, i) => {
    const formatted = formatRunDate(date, locale, dateOptions);
    return numbered ? `${i + 1}. ${formatted}` : formatted;
  });
}

/**
 * Returns a plain-text summary block for a schedule.
 * @param {string} expression
 * @param {Date[]} runs
 * @param {object} opts
 * @returns {string}
 */
export function toScheduleSummary(expression, runs, opts = {}) {
  if (!runs || runs.length === 0) {
    return `No upcoming runs found for: ${expression}`;
  }
  const lines = [
    `Upcoming runs for "${expression}":`,
    ...formatSchedule(runs, opts),
  ];
  return lines.join('\n');
}
