/**
 * presets.js
 * Common named cron presets with their expressions and descriptions.
 */

const PRESETS = [
  { name: '@yearly',   alias: '@annually', expression: '0 0 1 1 *',   description: 'Once a year at midnight on January 1st' },
  { name: '@monthly',  alias: null,         expression: '0 0 1 * *',   description: 'Once a month at midnight on the 1st' },
  { name: '@weekly',   alias: null,         expression: '0 0 * * 0',   description: 'Once a week at midnight on Sunday' },
  { name: '@daily',    alias: '@midnight',  expression: '0 0 * * *',   description: 'Once a day at midnight' },
  { name: '@hourly',   alias: null,         expression: '0 * * * *',   description: 'Once an hour at the start of the hour' },
  { name: '@reboot',   alias: null,         expression: null,           description: 'Run once at startup' },
];

/**
 * Resolve a preset name or alias to its expression.
 * @param {string} name - preset name like @daily
 * @returns {string|null} cron expression or null if not found / no expression
 */
function resolvePreset(name) {
  const lower = name.toLowerCase();
  const match = PRESETS.find(
    (p) => p.name === lower || (p.alias && p.alias === lower)
  );
  return match ? match.expression : null;
}

/**
 * Check if a string is a known preset name.
 * @param {string} name
 * @returns {boolean}
 */
function isPreset(name) {
  const lower = name.toLowerCase();
  return PRESETS.some((p) => p.name === lower || (p.alias && p.alias === lower));
}

/**
 * Get full preset info by name.
 * @param {string} name
 * @returns {object|null}
 */
function getPreset(name) {
  const lower = name.toLowerCase();
  return PRESETS.find((p) => p.name === lower || (p.alias && p.alias === lower)) || null;
}

module.exports = { PRESETS, resolvePreset, isPreset, getPreset };
