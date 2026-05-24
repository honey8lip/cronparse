/**
 * cronTag.js — Tag and label cron expressions with user-defined metadata
 */

const tags = new Map();

/**
 * Attach a tag (label + optional metadata) to a cron expression string.
 * @param {string} expression
 * @param {string} label
 * @param {object} [meta={}]
 * @returns {{ expression, label, meta }}
 */
function tagCron(expression, label, meta = {}) {
  if (!expression || typeof expression !== 'string') {
    throw new Error('expression must be a non-empty string');
  }
  if (!label || typeof label !== 'string') {
    throw new Error('label must be a non-empty string');
  }
  const entry = { expression: expression.trim(), label: label.trim(), meta };
  tags.set(entry.expression, entry);
  return entry;
}

/**
 * Retrieve the tag entry for a cron expression.
 * @param {string} expression
 * @returns {{ expression, label, meta } | null}
 */
function getTag(expression) {
  return tags.get(expression?.trim()) ?? null;
}

/**
 * Remove the tag for a cron expression.
 * @param {string} expression
 * @returns {boolean}
 */
function removeTag(expression) {
  return tags.delete(expression?.trim());
}

/**
 * List all tagged expressions, optionally filtered by a label substring.
 * @param {string} [filter]
 * @returns {Array<{ expression, label, meta }>}
 */
function listTags(filter) {
  const all = Array.from(tags.values());
  if (!filter) return all;
  const lower = filter.toLowerCase();
  return all.filter(t => t.label.toLowerCase().includes(lower));
}

/**
 * Update the label or meta of an existing tag.
 * @param {string} expression
 * @param {Partial<{ label: string, meta: object }>} updates
 * @returns {{ expression, label, meta } | null}
 */
function updateTag(expression, updates = {}) {
  const key = expression?.trim();
  const existing = tags.get(key);
  if (!existing) return null;
  if (updates.label !== undefined) existing.label = updates.label.trim();
  if (updates.meta !== undefined) existing.meta = { ...existing.meta, ...updates.meta };
  tags.set(key, existing);
  return existing;
}

/**
 * Clear all tags (useful for testing / reset).
 */
function clearTags() {
  tags.clear();
}

module.exports = { tagCron, getTag, removeTag, listTags, updateTag, clearTags };
