/**
 * cronMetrics.js — Track execution counts, durations, and stats for cron expressions
 */

const store = new Map();

function makeEntry(expression) {
  return {
    expression,
    totalRuns: 0,
    successCount: 0,
    failureCount: 0,
    totalDurationMs: 0,
    minDurationMs: null,
    maxDurationMs: null,
    lastRunAt: null,
    lastStatus: null,
  };
}

function getOrCreate(expression) {
  if (!store.has(expression)) {
    store.set(expression, makeEntry(expression));
  }
  return store.get(expression);
}

function recordRun(expression, { durationMs = 0, success = true, runAt = new Date() } = {}) {
  const entry = getOrCreate(expression);
  entry.totalRuns += 1;
  entry.totalDurationMs += durationMs;
  entry.lastRunAt = runAt instanceof Date ? runAt.toISOString() : runAt;
  entry.lastStatus = success ? 'success' : 'failure';
  if (success) entry.successCount += 1;
  else entry.failureCount += 1;
  if (entry.minDurationMs === null || durationMs < entry.minDurationMs) entry.minDurationMs = durationMs;
  if (entry.maxDurationMs === null || durationMs > entry.maxDurationMs) entry.maxDurationMs = durationMs;
  return entry;
}

function getMetrics(expression) {
  return store.get(expression) || null;
}

function resetMetrics(expression) {
  if (!store.has(expression)) return false;
  store.set(expression, makeEntry(expression));
  return true;
}

function removeMetrics(expression) {
  return store.delete(expression);
}

function listMetrics() {
  return Array.from(store.values());
}

function averageDuration(expression) {
  const entry = store.get(expression);
  if (!entry || entry.totalRuns === 0) return null;
  return Math.round(entry.totalDurationMs / entry.totalRuns);
}

function successRate(expression) {
  const entry = store.get(expression);
  if (!entry || entry.totalRuns === 0) return null;
  return parseFloat(((entry.successCount / entry.totalRuns) * 100).toFixed(2));
}

module.exports = {
  recordRun,
  getMetrics,
  resetMetrics,
  removeMetrics,
  listMetrics,
  averageDuration,
  successRate,
};
