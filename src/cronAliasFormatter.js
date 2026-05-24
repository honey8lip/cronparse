/**
 * cronAliasFormatter.js — Format alias entries for display
 */

const { listAliases, resolveAlias } = require('./cronAlias');
const { humanize } = require('./humanize');

/**
 * Format a single alias entry as a readable string.
 * @param {{name: string, expression: string, source: string}} entry
 * @returns {string}
 */
function formatAliasEntry(entry) {
  let description = '';
  try {
    description = humanize(entry.expression);
  } catch {
    description = entry.expression;
  }
  const tag = entry.source === 'user' ? '[custom]' : '[builtin]';
  return `${entry.name.padEnd(14)} ${tag.padEnd(10)} ${entry.expression.padEnd(16)} — ${description}`;
}

/**
 * Format all aliases as a table string.
 * @returns {string}
 */
function formatAliasList() {
  const entries = listAliases();
  if (entries.length === 0) return 'No aliases defined.';
  const header = `${'Alias'.padEnd(14)} ${'Source'.padEnd(10)} ${'Expression'.padEnd(16)}   Description`;
  const divider = '-'.repeat(header.length);
  const rows = entries.map(formatAliasEntry);
  return [header, divider, ...rows].join('\n');
}

/**
 * Summarize a single alias by name.
 * @param {string} name
 * @returns {string|null}
 */
function summarizeAlias(name) {
  const expression = resolveAlias(name);
  if (!expression) return null;
  let description = '';
  try {
    description = humanize(expression);
  } catch {
    description = expression;
  }
  return `${name} → ${expression} (${description})`;
}

module.exports = { formatAliasEntry, formatAliasList, summarizeAlias };
