/**
 * cronFilter.js — Filter and query cron expressions by field criteria
 */

const { parseCron } = require('./parser');
const { matchesFieldValue } = require('./matchers');

const filters = new Map();

function registerFilter(name, criteria) {
  if (!name || typeof name !== 'string') throw new Error('Filter name must be a non-empty string');
  if (!criteria || typeof criteria !== 'object') throw new Error('Criteria must be an object');
  filters.set(name, { name, criteria, createdAt: new Date().toISOString() });
  return filters.get(name);
}

function removeFilter(name) {
  return filters.delete(name);
}

function getFilter(name) {
  return filters.get(name) || null;
}

function listFilters() {
  return Array.from(filters.values());
}

function matchesCriteria(parsed, criteria) {
  const fieldMap = { minute: 0, hour: 1, dom: 2, month: 3, dow: 4 };
  for (const [field, pattern] of Object.entries(criteria)) {
    const idx = fieldMap[field];
    if (idx === undefined) continue;
    const fieldValue = parsed.fields[idx];
    if (!matchesFieldValue(fieldValue, pattern, idx)) return false;
  }
  return true;
}

function filterCrons(expressions, criteria) {
  if (!Array.isArray(expressions)) throw new Error('Expressions must be an array');
  return expressions.filter(expr => {
    try {
      const parsed = parseCron(expr);
      return matchesCriteria(parsed, criteria);
    } catch {
      return false;
    }
  });
}

function applyFilter(expressions, filterName) {
  const filter = filters.get(filterName);
  if (!filter) throw new Error(`Filter "${filterName}" not found`);
  return filterCrons(expressions, filter.criteria);
}

function clearFilters() {
  filters.clear();
}

module.exports = {
  registerFilter,
  removeFilter,
  getFilter,
  listFilters,
  filterCrons,
  applyFilter,
  clearFilters
};
