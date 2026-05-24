/**
 * bounds.js — Field boundary definitions and value clamping utilities
 */

const FIELD_BOUNDS = {
  minute:     { min: 0,  max: 59,  name: 'minute' },
  hour:       { min: 0,  max: 23,  name: 'hour' },
  dom:        { min: 1,  max: 31,  name: 'day of month' },
  month:      { min: 1,  max: 12,  name: 'month' },
  dow:        { min: 0,  max: 7,   name: 'day of week' },
  second:     { min: 0,  max: 59,  name: 'second' },
};

/**
 * Get bounds for a named field.
 * @param {string} field
 * @returns {{ min: number, max: number, name: string }}
 */
function getBounds(field) {
  const bounds = FIELD_BOUNDS[field];
  if (!bounds) throw new Error(`Unknown field: "${field}"`);
  return bounds;
}

/**
 * Clamp a value to the valid range for a field.
 * @param {string} field
 * @param {number} value
 * @returns {number}
 */
function clamp(field, value) {
  const { min, max } = getBounds(field);
  return Math.min(max, Math.max(min, value));
}

/**
 * Check whether a numeric value is within bounds for a field.
 * @param {string} field
 * @param {number} value
 * @returns {boolean}
 */
function inBounds(field, value) {
  const { min, max } = getBounds(field);
  return Number.isInteger(value) && value >= min && value <= max;
}

/**
 * Return all valid integer values for a field.
 * @param {string} field
 * @returns {number[]}
 */
function allValues(field) {
  const { min, max } = getBounds(field);
  return Array.from({ length: max - min + 1 }, (_, i) => min + i);
}

/**
 * Return the field name for display.
 * @param {string} field
 * @returns {string}
 */
function fieldLabel(field) {
  return getBounds(field).name;
}

module.exports = { FIELD_BOUNDS, getBounds, clamp, inBounds, allValues, fieldLabel };
