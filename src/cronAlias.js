/**
 * cronAlias.js — Create, resolve, and manage user-defined cron aliases
 */

const builtinAliases = {
  '@yearly':   '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly':  '0 0 1 * *',
  '@weekly':   '0 0 * * 0',
  '@daily':    '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly':   '0 * * * *',
};

const userAliases = {};

/**
 * Register a custom alias mapping a name to a cron expression.
 * @param {string} name - e.g. '@workdays'
 * @param {string} expression - e.g. '0 9 * * 1-5'
 */
function registerAlias(name, expression) {
  if (!name.startsWith('@')) throw new Error(`Alias name must start with '@': ${name}`);
  if (typeof expression !== 'string' || !expression.trim()) throw new Error('Expression must be a non-empty string');
  userAliases[name.toLowerCase()] = expression.trim();
}

/**
 * Remove a user-defined alias by name.
 * @param {string} name
 * @returns {boolean} true if removed, false if not found
 */
function removeAlias(name) {
  const key = name.toLowerCase();
  if (key in userAliases) {
    delete userAliases[key];
    return true;
  }
  return false;
}

/**
 * Resolve an alias to its cron expression.
 * Checks user aliases first, then builtins.
 * @param {string} name
 * @returns {string|null}
 */
function resolveAlias(name) {
  const key = name.toLowerCase();
  return userAliases[key] ?? builtinAliases[key] ?? null;
}

/**
 * Check whether a string is a known alias (builtin or user-defined).
 * @param {string} name
 * @returns {boolean}
 */
function isAlias(name) {
  const key = name.toLowerCase();
  return key in userAliases || key in builtinAliases;
}

/**
 * List all aliases (builtin + user-defined) as an array of { name, expression } objects.
 * @returns {Array<{name: string, expression: string, source: 'builtin'|'user'}>}
 */
function listAliases() {
  const result = [];
  for (const [name, expression] of Object.entries(builtinAliases)) {
    result.push({ name, expression, source: 'builtin' });
  }
  for (const [name, expression] of Object.entries(userAliases)) {
    result.push({ name, expression, source: 'user' });
  }
  return result;
}

/**
 * Clear all user-defined aliases.
 */
function clearUserAliases() {
  for (const key of Object.keys(userAliases)) {
    delete userAliases[key];
  }
}

module.exports = { registerAlias, removeAlias, resolveAlias, isAlias, listAliases, clearUserAliases };
