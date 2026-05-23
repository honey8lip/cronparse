/**
 * audit.js — Analyze a cron expression and return warnings, issues, and suggestions
 */

const { parseCron } = require('./parser');
const { validate } = require('./validator');

const WARNINGS = {
  ALWAYS_RUNS: 'Expression runs every minute — this may cause high load.',
  DOM_AND_DOW: 'Both day-of-month and day-of-week are specified; behavior may vary by implementation.',
  FREQUENT_RUNS: 'Expression runs more than once per hour — verify this is intentional.',
  DEPRECATED_ALIAS: 'Numeric day/month values are preferred over aliases for clarity.',
};

function isWildcard(field) {
  return field === '*' || field === '?';
}

function isEveryMinute(parsed) {
  return (
    isWildcard(parsed.minute) &&
    isWildcard(parsed.hour) &&
    isWildcard(parsed.dom) &&
    isWildcard(parsed.month) &&
    isWildcard(parsed.dow)
  );
}

function hasBothDomAndDow(parsed) {
  return !isWildcard(parsed.dom) && !isWildcard(parsed.dow);
}

function isFrequent(parsed) {
  if (isWildcard(parsed.minute)) return true;
  if (typeof parsed.minute === 'string' && parsed.minute.startsWith('*/')) {
    const step = parseInt(parsed.minute.split('/')[1], 10);
    return !isNaN(step) && step < 15;
  }
  return false;
}

function hasAliases(expression) {
  return /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|sun|mon|tue|wed|thu|fri|sat)\b/i.test(expression);
}

/**
 * Audit a cron expression and return a structured report.
 * @param {string} expression
 * @returns {{ valid: boolean, errors: string[], warnings: string[], info: object }}
 */
function audit(expression) {
  const errors = [];
  const warnings = [];

  const validationResult = validate(expression);
  if (!validationResult.valid) {
    return {
      valid: false,
      errors: validationResult.errors || ['Invalid cron expression.'],
      warnings: [],
      info: {},
    };
  }

  let parsed;
  try {
    parsed = parseCron(expression);
  } catch (e) {
    return { valid: false, errors: [e.message], warnings: [], info: {} };
  }

  if (isEveryMinute(parsed)) warnings.push(WARNINGS.ALWAYS_RUNS);
  if (hasBothDomAndDow(parsed)) warnings.push(WARNINGS.DOM_AND_DOW);
  if (isFrequent(parsed)) warnings.push(WARNINGS.FREQUENT_RUNS);
  if (hasAliases(expression)) warnings.push(WARNINGS.DEPRECATED_ALIAS);

  return {
    valid: true,
    errors,
    warnings,
    info: {
      fields: parsed,
      fieldCount: Object.keys(parsed).length,
    },
  };
}

module.exports = { audit, WARNINGS };
