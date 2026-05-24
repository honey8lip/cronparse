/**
 * cronThrottle.js — Rate-limiting and throttle control for cron jobs.
 * Prevents a job from running more frequently than a defined minimum interval.
 */

const throttles = new Map();

function makeThrottleEntry(expression, minIntervalMs, options = {}) {
  return {
    expression,
    minIntervalMs,
    label: options.label || expression,
    lastRun: options.lastRun || null,
    skippedCount: 0,
    createdAt: Date.now(),
  };
}

function registerThrottle(id, expression, minIntervalMs, options = {}) {
  if (!id || typeof id !== 'string') throw new Error('id must be a non-empty string');
  if (typeof minIntervalMs !== 'number' || minIntervalMs <= 0)
    throw new Error('minIntervalMs must be a positive number');
  const entry = makeThrottleEntry(expression, minIntervalMs, options);
  throttles.set(id, entry);
  return entry;
}

function removeThrottle(id) {
  return throttles.delete(id);
}

function getThrottle(id) {
  return throttles.get(id) || null;
}

function isThrottled(id, now = Date.now()) {
  const entry = throttles.get(id);
  if (!entry) return false;
  if (entry.lastRun === null) return false;
  return now - entry.lastRun < entry.minIntervalMs;
}

function recordRun(id, now = Date.now()) {
  const entry = throttles.get(id);
  if (!entry) throw new Error(`No throttle registered for id: ${id}`);
  entry.lastRun = now;
  return entry;
}

function recordSkip(id) {
  const entry = throttles.get(id);
  if (!entry) throw new Error(`No throttle registered for id: ${id}`);
  entry.skippedCount += 1;
  return entry;
}

function resetThrottle(id) {
  const entry = throttles.get(id);
  if (!entry) return false;
  entry.lastRun = null;
  entry.skippedCount = 0;
  return true;
}

function listThrottles() {
  return Array.from(throttles.entries()).map(([id, entry]) => ({ id, ...entry }));
}

function clearAllThrottles() {
  throttles.clear();
}

module.exports = {
  registerThrottle,
  removeThrottle,
  getThrottle,
  isThrottled,
  recordRun,
  recordSkip,
  resetThrottle,
  listThrottles,
  clearAllThrottles,
};
