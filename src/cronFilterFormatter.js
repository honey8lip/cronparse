/**
 * cronFilterFormatter.js — Format filter info and results for display
 */

function formatCriteriaEntry([field, pattern]) {
  return `${field}: ${pattern}`;
}

function formatFilterEntry(filter) {
  if (!filter) return 'Filter: (none)';
  const criteria = Object.entries(filter.criteria).map(formatCriteriaEntry).join(', ');
  return `Filter "${filter.name}" [${criteria}] (created: ${filter.createdAt})`;
}

function formatFilterList(filters) {
  if (!filters || filters.length === 0) return 'No filters registered.';
  return filters.map(formatFilterEntry).join('\n');
}

function formatFilterResult(filterName, matched, total) {
  return `Filter "${filterName}": ${matched} of ${total} expression(s) matched.`;
}

function toFilterJSON(filter) {
  if (!filter) return null;
  return {
    name: filter.name,
    criteria: filter.criteria,
    createdAt: filter.createdAt
  };
}

module.exports = {
  formatFilterEntry,
  formatFilterList,
  formatFilterResult,
  toFilterJSON
};
