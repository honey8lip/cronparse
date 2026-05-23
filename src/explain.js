/**
 * explain.js — Generates a structured breakdown of each cron field
 * with human-readable labels and value descriptions.
 */

const FIELD_NAMES = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];

const FIELD_LABELS = {
  minute: 'Minute',
  hour: 'Hour',
  dayOfMonth: 'Day of Month',
  month: 'Month',
  dayOfWeek: 'Day of Week',
};

const FIELD_RANGES = {
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  dayOfMonth: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  dayOfWeek: { min: 0, max: 6 },
};

function describeValue(field, parsed) {
  if (parsed.all) return 'every value';

  const parts = [];

  if (parsed.values && parsed.values.length > 0) {
    parts.push(`specific values: ${parsed.values.join(', ')}`);
  }

  if (parsed.ranges && parsed.ranges.length > 0) {
    const rangeStrs = parsed.ranges.map(r => `${r.start}-${r.end}`);
    parts.push(`ranges: ${rangeStrs.join(', ')}`);
  }

  if (parsed.steps && parsed.steps.length > 0) {
    const stepStrs = parsed.steps.map(s =>
      s.start === '*' ? `every ${s.step}` : `every ${s.step} starting at ${s.start}`
    );
    parts.push(`steps: ${stepStrs.join(', ')}`);
  }

  return parts.length > 0 ? parts.join('; ') : 'unknown';
}

/**
 * Returns a structured explanation of a parsed cron object.
 * @param {object} parsed - Result of parseCron()
 * @returns {object[]} Array of field explanation objects
 */
function explain(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('explain() requires a parsed cron object');
  }

  return FIELD_NAMES.map(field => {
    const fieldData = parsed[field];
    const range = FIELD_RANGES[field];
    return {
      field,
      label: FIELD_LABELS[field],
      raw: fieldData ? fieldData.raw : '*',
      description: fieldData ? describeValue(field, fieldData) : 'every value',
      range,
    };
  });
}

module.exports = { explain, describeValue, FIELD_NAMES, FIELD_LABELS, FIELD_RANGES };
