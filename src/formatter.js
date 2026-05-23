/**
 * formatter.js
 * Formats parsed cron expressions into various output representations.
 */

const FIELD_NAMES = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

/**
 * Format a single cron field value for display.
 * @param {string} value - raw field value
 * @param {string} field - field name
 * @returns {string}
 */
function formatFieldValue(value, field) {
  if (value === '*') return 'every ' + field;

  if (value.includes('/')) {
    const [, step] = value.split('/');
    return `every ${step} ${field}s`;
  }

  if (value.includes('-')) {
    const [start, end] = value.split('-');
    const labelFn = field === 'month' ? (v) => MONTH_NAMES[parseInt(v) - 1] || v
      : field === 'dayOfWeek' ? (v) => DAY_NAMES[parseInt(v)] || v
      : (v) => v;
    return `${labelFn(start)} through ${labelFn(end)}`;
  }

  if (value.includes(',')) {
    const parts = value.split(',');
    const labelFn = field === 'month' ? (v) => MONTH_NAMES[parseInt(v) - 1] || v
      : field === 'dayOfWeek' ? (v) => DAY_NAMES[parseInt(v)] || v
      : (v) => v;
    const labeled = parts.map(labelFn);
    if (labeled.length === 1) return labeled[0];
    return labeled.slice(0, -1).join(', ') + ' and ' + labeled[labeled.length - 1];
  }

  if (field === 'month') return MONTH_NAMES[parseInt(value) - 1] || value;
  if (field === 'dayOfWeek') return DAY_NAMES[parseInt(value)] || value;

  return value;
}

/**
 * Convert a parsed cron object to a structured summary.
 * @param {object} parsed - result of parseCron
 * @returns {object}
 */
function toSummary(parsed) {
  const summary = {};
  for (const field of FIELD_NAMES) {
    summary[field] = {
      raw: parsed[field],
      label: formatFieldValue(parsed[field], field)
    };
  }
  return summary;
}

/**
 * Convert a parsed cron object back to a cron string.
 * @param {object} parsed
 * @returns {string}
 */
function toExpression(parsed) {
  return FIELD_NAMES.map((f) => parsed[f] || '*').join(' ');
}

module.exports = { formatFieldValue, toSummary, toExpression, FIELD_NAMES, MONTH_NAMES, DAY_NAMES };
