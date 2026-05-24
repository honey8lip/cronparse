/**
 * cronTemplate.js
 * Build cron expressions from named templates with variable substitution.
 */

const { validate } = require('./validator');
const { stringify } = require('./stringify');

const templates = new Map();

/**
 * Register a named template with optional variable placeholders.
 * e.g. registerTemplate('daily-at', 'HOUR MINUTE * * *', ['HOUR', 'MINUTE'])
 */
function registerTemplate(name, pattern, vars = []) {
  if (!name || typeof name !== 'string') throw new Error('Template name must be a non-empty string');
  if (!pattern || typeof pattern !== 'string') throw new Error('Template pattern must be a string');
  templates.set(name, { pattern, vars });
}

/**
 * Remove a registered template by name.
 */
function removeTemplate(name) {
  return templates.delete(name);
}

/**
 * Check if a template is registered.
 */
function isTemplate(name) {
  return templates.has(name);
}

/**
 * Resolve a template by substituting variables and returning the cron string.
 */
function resolveTemplate(name, values = {}) {
  if (!templates.has(name)) throw new Error(`Unknown template: "${name}"`);
  const { pattern, vars } = templates.get(name);

  let result = pattern;
  for (const key of vars) {
    if (!(key in values)) throw new Error(`Missing variable "${key}" for template "${name}"`);
    result = result.replace(new RegExp(key, 'g'), String(values[key]));
  }

  const { valid, errors } = validate(result);
  if (!valid) throw new Error(`Resolved template is invalid: ${errors.join(', ')}`);

  return result;
}

/**
 * List all registered template names.
 */
function listTemplates() {
  return Array.from(templates.keys());
}

/**
 * Get the raw pattern and vars for a template.
 */
function getTemplate(name) {
  if (!templates.has(name)) return null;
  return { ...templates.get(name) };
}

// Register some built-in templates
registerTemplate('every-n-minutes', '*/N * * * *', ['N']);
registerTemplate('daily-at', 'MINUTE HOUR * * *', ['MINUTE', 'HOUR']);
registerTemplate('weekly-on', 'MINUTE HOUR * * DOW', ['MINUTE', 'HOUR', 'DOW']);
registerTemplate('monthly-on', 'MINUTE HOUR DOM * *', ['MINUTE', 'HOUR', 'DOM']);

module.exports = {
  registerTemplate,
  removeTemplate,
  isTemplate,
  resolveTemplate,
  listTemplates,
  getTemplate,
};
