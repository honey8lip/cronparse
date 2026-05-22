/**
 * Validates parsed cron fields for out-of-range values and invalid syntax.
 */

const { parseCron } = require('./parser');

function validatePart(part, range, fieldName) {
  const errors = [];
  const { min, max } = range;

  const checkNum = (val, label) => {
    const n = parseInt(val, 10);
    if (isNaN(n)) {
      errors.push(`${fieldName}: invalid value "${val}"`);
    } else if (n < min || n > max) {
      errors.push(`${fieldName}: ${label} ${n} out of range [${min}-${max}]`);
    }
  };

  if (part.type === 'value') {
    checkNum(part.value, 'value');
  } else if (part.type === 'range') {
    checkNum(part.from, 'range start');
    checkNum(part.to, 'range end');
    if (!errors.length && parseInt(part.from, 10) > parseInt(part.to, 10)) {
      errors.push(`${fieldName}: range start ${part.from} is greater than end ${part.to}`);
    }
  } else if (part.type === 'step') {
    if (part.base !== '*') checkNum(part.base, 'step base');
    if (isNaN(part.step) || part.step < 1) {
      errors.push(`${fieldName}: step value must be a positive integer`);
    }
  }

  return errors;
}

function validateParsed(parsed) {
  const errors = [];
  for (const field of parsed) {
    for (const part of field.parts) {
      errors.push(...validatePart(part, field.range, field.field));
    }
  }
  return errors;
}

function validate(expression) {
  try {
    const parsed = parseCron(expression);
    const errors = validateParsed(parsed);
    return { valid: errors.length === 0, errors, parsed: errors.length === 0 ? parsed : null };
  } catch (err) {
    return { valid: false, errors: [err.message], parsed: null };
  }
}

module.exports = { validate, validateParsed };
