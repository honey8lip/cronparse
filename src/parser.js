/**
 * Parses a cron expression string into its component fields.
 * Supports standard 5-field cron: minute hour day month weekday
 */

const FIELD_NAMES = ['minute', 'hour', 'day', 'month', 'weekday'];

const FIELD_RANGES = {
  minute:  { min: 0, max: 59 },
  hour:    { min: 0, max: 23 },
  day:     { min: 1, max: 31 },
  month:   { min: 1, max: 12 },
  weekday: { min: 0, max: 7 },
};

const MONTH_ALIASES = {
  jan:1, feb:2, mar:3, apr:4, may:5, jun:6,
  jul:7, aug:8, sep:9, oct:10, nov:11, dec:12,
};

const WEEKDAY_ALIASES = {
  sun:0, mon:1, tue:2, wed:3, thu:4, fri:5, sat:6,
};

function resolveAlias(value, aliases) {
  const lower = value.toLowerCase();
  return aliases[lower] !== undefined ? String(aliases[lower]) : value;
}

function parseField(raw, fieldName) {
  const aliases = fieldName === 'month' ? MONTH_ALIASES
    : fieldName === 'weekday' ? WEEKDAY_ALIASES
    : {};

  const resolved = raw.split(',').map(part => {
    const stepMatch = part.match(/^(.+)\/([0-9]+)$/);
    if (stepMatch) {
      return { type: 'step', base: resolveAlias(stepMatch[1], aliases), step: parseInt(stepMatch[2], 10) };
    }
    const rangeMatch = part.match(/^(.+)-(.+)$/);
    if (rangeMatch) {
      return { type: 'range', from: resolveAlias(rangeMatch[1], aliases), to: resolveAlias(rangeMatch[2], aliases) };
    }
    if (part === '*') return { type: 'wildcard' };
    return { type: 'value', value: resolveAlias(part, aliases) };
  });

  return { field: fieldName, raw, parts: resolved, range: FIELD_RANGES[fieldName] };
}

function parseCron(expression) {
  if (typeof expression !== 'string') throw new TypeError('Expression must be a string');
  const fields = expression.trim().split(/\s+/);
  if (fields.length !== 5) throw new Error(`Expected 5 fields, got ${fields.length}`);
  return fields.map((raw, i) => parseField(raw, FIELD_NAMES[i]));
}

module.exports = { parseCron, parseField, FIELD_NAMES, FIELD_RANGES };
