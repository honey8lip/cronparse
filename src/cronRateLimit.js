// cronRateLimit.js — rate limiting for cron expressions (max runs per window)

const rateLimits = new Map();

function makeWindowKey(id, windowStart) {
  return `${id}::${windowStart}`;
}

function getWindowStart(now, windowMs) {
  return Math.floor(now / windowMs) * windowMs;
}

function registerRateLimit(id, maxRuns, windowMs) {
  if (!id || typeof maxRuns !== 'number' || typeof windowMs !== 'number') {
    throw new Error('registerRateLimit requires id, maxRuns, and windowMs');
  }
  rateLimits.set(id, { maxRuns, windowMs, runs: [] });
  return { id, maxRuns, windowMs };
}

function removeRateLimit(id) {
  return rateLimits.delete(id);
}

function getRateLimit(id) {
  return rateLimits.get(id) || null;
}

function isRateLimited(id, now = Date.now()) {
  const entry = rateLimits.get(id);
  if (!entry) return false;
  const windowStart = getWindowStart(now, entry.windowMs);
  const runsInWindow = entry.runs.filter(ts => ts >= windowStart);
  return runsInWindow.length >= entry.maxRuns;
}

function recordRun(id, now = Date.now()) {
  const entry = rateLimits.get(id);
  if (!entry) throw new Error(`No rate limit registered for id: ${id}`);
  if (isRateLimited(id, now)) {
    return { allowed: false, runsInWindow: entry.runs.filter(ts => ts >= getWindowStart(now, entry.windowMs)).length };
  }
  entry.runs.push(now);
  // prune old runs outside the window
  const windowStart = getWindowStart(now, entry.windowMs);
  entry.runs = entry.runs.filter(ts => ts >= windowStart);
  return { allowed: true, runsInWindow: entry.runs.length };
}

function resetRateLimit(id) {
  const entry = rateLimits.get(id);
  if (!entry) return false;
  entry.runs = [];
  return true;
}

function getRemainingRuns(id, now = Date.now()) {
  const entry = rateLimits.get(id);
  if (!entry) return null;
  const windowStart = getWindowStart(now, entry.windowMs);
  const runsInWindow = entry.runs.filter(ts => ts >= windowStart).length;
  return Math.max(0, entry.maxRuns - runsInWindow);
}

function listRateLimits() {
  return Array.from(rateLimits.entries()).map(([id, entry]) => ({
    id,
    maxRuns: entry.maxRuns,
    windowMs: entry.windowMs,
    totalTrackedRuns: entry.runs.length
  }));
}

module.exports = {
  registerRateLimit,
  removeRateLimit,
  getRateLimit,
  isRateLimited,
  recordRun,
  resetRateLimit,
  getRemainingRuns,
  listRateLimits
};
