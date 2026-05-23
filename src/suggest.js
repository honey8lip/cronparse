/**
 * suggest.js — Generate cron expression suggestions based on common patterns
 */

const SUGGESTIONS = [
  { label: 'Every minute', expression: '* * * * *' },
  { label: 'Every 5 minutes', expression: '*/5 * * * *' },
  { label: 'Every 15 minutes', expression: '*/15 * * * *' },
  { label: 'Every 30 minutes', expression: '*/30 * * * *' },
  { label: 'Every hour', expression: '0 * * * *' },
  { label: 'Every 6 hours', expression: '0 */6 * * *' },
  { label: 'Every 12 hours', expression: '0 */12 * * *' },
  { label: 'Once a day at midnight', expression: '0 0 * * *' },
  { label: 'Once a day at noon', expression: '0 12 * * *' },
  { label: 'Every weekday at 9am', expression: '0 9 * * 1-5' },
  { label: 'Every Monday', expression: '0 0 * * 1' },
  { label: 'Every weekend', expression: '0 0 * * 6,0' },
  { label: 'First day of the month', expression: '0 0 1 * *' },
  { label: 'Last day of the month', expression: '0 0 28-31 * *' },
  { label: 'Every quarter', expression: '0 0 1 */3 *' },
  { label: 'Once a year', expression: '0 0 1 1 *' },
];

/**
 * Returns all built-in suggestions.
 * @returns {{ label: string, expression: string }[]}
 */
function listSuggestions() {
  return [...SUGGESTIONS];
}

/**
 * Finds suggestions whose label matches the query (case-insensitive).
 * @param {string} query
 * @returns {{ label: string, expression: string }[]}
 */
function searchSuggestions(query) {
  if (!query || typeof query !== 'string') return listSuggestions();
  const lower = query.toLowerCase();
  return SUGGESTIONS.filter(s => s.label.toLowerCase().includes(lower));
}

/**
 * Given a partial cron expression, suggests completions by matching fields.
 * @param {string} partial - e.g. '*/5' or '0 9'
 * @returns {{ label: string, expression: string }[]}
 */
function suggestFromPartial(partial) {
  if (!partial || typeof partial !== 'string') return listSuggestions();
  const trimmed = partial.trim();
  return SUGGESTIONS.filter(s => s.expression.startsWith(trimmed));
}

module.exports = { listSuggestions, searchSuggestions, suggestFromPartial };
