/**
 * normalize.js
 * Normalize cron expressions: expand aliases, fill defaults, canonicalize whitespace.
 */

const ALIASES = {
  '@yearly':   '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly':  '0 0 1 * *',
  '@weekly':   '0 0 * * 0',
  '@daily':    '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly':   '0 * * * *',
};

const FIELD_DEFAULTS = ['*', '*', '*', '*', '*'];

/**
 * Expand a preset alias to its 5-field expression.
 * Returns null if the input is not a known alias.
 */
function expandAlias(expression) {
  const trimmed = expression.trim().toLowerCase();
  return ALIASES[trimmed] || null;
}

/**
 * Normalize whitespace within each field and between fields.
 */
function normalizeWhitespace(expression) {
  return expression
    .trim()
    .split(/\s+/)
    .join(' ');
}

/**
 * Fill missing trailing fields with '*' so the result always has 5 fields.
 */
function fillDefaults(fields) {
  const filled = [...fields];
  while (filled.length < 5) {
    filled.push(FIELD_DEFAULTS[filled.length]);
  }
  return filled;
}

/**
 * Normalize a cron expression string.
 * - Expands aliases (@daily etc.)
 * - Trims and collapses whitespace
 * - Fills missing fields with '*'
 * Returns { expression, fields, wasAlias }
 */
function normalize(expression) {
  if (typeof expression !== 'string') {
    throw new TypeError('expression must be a string');
  }

  const aliasExpanded = expandAlias(expression);
  const wasAlias = aliasExpanded !== null;
  const resolved = wasAlias ? aliasExpanded : normalizeWhitespace(expression);

  const fields = fillDefaults(resolved.split(/\s+/));
  const normalized = fields.join(' ');

  return { expression: normalized, fields, wasAlias };
}

module.exports = { expandAlias, normalizeWhitespace, fillDefaults, normalize };
