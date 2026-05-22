/**
 * humanize.js
 * Converts a parsed cron object into a human-readable description.
 */

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

/**
 * Formats a single field's values into a readable string.
 * @param {Object} field - Parsed field object from parseField
 * @param {string} type - One of: 'minute', 'hour', 'dom', 'month', 'dow'
 * @returns {string}
 */
function describeField(field, type) {
  const labels = { minute: 'minute', hour: 'hour', dom: 'day of month', month: 'month', dow: 'day of week' };
  const label = labels[type] || type;

  if (field.all) {
    return `every ${label}`;
  }

  if (field.step && field.all === false) {
    const base = field.range
      ? `from ${formatValue(field.range[0], type)} through ${formatValue(field.range[1], type)}`
      : 'every';
    return `${base} every ${field.step} ${label}${field.step > 1 ? 's' : ''}`;
  }

  if (field.range) {
    return `every ${label} from ${formatValue(field.range[0], type)} through ${formatValue(field.range[1], type)}`;
  }

  if (Array.isArray(field.values) && field.values.length > 0) {
    const formatted = field.values.map(v => formatValue(v, type));
    if (formatted.length === 1) return `at ${label} ${formatted[0]}`;
    const last = formatted.pop();
    return `at ${label}s ${formatted.join(', ')} and ${last}`;
  }

  return `every ${label}`;
}

/**
 * Formats a numeric value with its human-readable label for months/days.
 * @param {number} value
 * @param {string} type
 * @returns {string}
 */
function formatValue(value, type) {
  if (type === 'month') return MONTH_NAMES[value - 1] || String(value);
  if (type === 'dow') return DAY_NAMES[value] || String(value);
  if (type === 'hour') {
    const suffix = value < 12 ? 'AM' : 'PM';
    const h = value % 12 === 0 ? 12 : value % 12;
    return `${h} ${suffix}`;
  }
  return String(value);
}

/**
 * Converts a parsed cron expression into a human-readable sentence.
 * @param {Object} parsed - Result of parseCron()
 * @returns {string}
 */
function humanize(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid parsed cron object');
  }

  const { minute, hour, dom, month, dow } = parsed;

  const parts = [];

  // Time description
  if (minute.all && hour.all) {
    parts.push('every minute');
  } else if (minute.all) {
    parts.push(`every minute during ${describeField(hour, 'hour')}`);
  } else {
    const minuteDesc = describeField(minute, 'minute');
    const hourDesc = hour.all ? 'every hour' : describeField(hour, 'hour');
    parts.push(`${minuteDesc} past ${hourDesc}`);
  }

  // Day of month / day of week
  const domAll = dom.all;
  const dowAll = dow.all;

  if (!domAll && !dowAll) {
    parts.push(`on ${describeField(dom, 'dom')} and ${describeField(dow, 'dow')}`);
  } else if (!domAll) {
    parts.push(`on ${describeField(dom, 'dom')}`);
  } else if (!dowAll) {
    parts.push(`on ${describeField(dow, 'dow')}`);
  }

  // Month
  if (!month.all) {
    parts.push(`in ${describeField(month, 'month')}`);
  }

  return parts.join(', ');
}

module.exports = { humanize, describeField, formatValue };
