/**
 * cronCache.js — Cache layer for parsed cron expressions and next-run results
 */

const cache = new Map();
const MAX_SIZE = 256;

function makeKey(expression, context = {}) {
  return JSON.stringify({ expression, ...context });
}

function evictOldest() {
  const firstKey = cache.keys().next().value;
  if (firstKey !== undefined) cache.delete(firstKey);
}

function setCache(expression, context, value) {
  const key = makeKey(expression, context);
  if (cache.size >= MAX_SIZE) evictOldest();
  cache.set(key, { value, cachedAt: Date.now() });
  return value;
}

function getCache(expression, context = {}) {
  const key = makeKey(expression, context);
  const entry = cache.get(key);
  return entry ? entry.value : undefined;
}

function hasCache(expression, context = {}) {
  return cache.has(makeKey(expression, context));
}

function removeCache(expression, context = {}) {
  return cache.delete(makeKey(expression, context));
}

function clearCache() {
  cache.clear();
}

function cacheSize() {
  return cache.size;
}

function listCacheKeys() {
  return Array.from(cache.keys()).map((k) => JSON.parse(k));
}

function getCacheStats() {
  const entries = Array.from(cache.entries());
  const now = Date.now();
  return {
    size: cache.size,
    maxSize: MAX_SIZE,
    entries: entries.map(([key, { cachedAt }]) => ({
      key: JSON.parse(key),
      ageMs: now - cachedAt,
    })),
  };
}

module.exports = {
  setCache,
  getCache,
  hasCache,
  removeCache,
  clearCache,
  cacheSize,
  listCacheKeys,
  getCacheStats,
};
