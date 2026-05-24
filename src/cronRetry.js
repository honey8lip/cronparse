/**
 * cronRetry.js — Retry policy management for cron jobs
 * Defines retry strategies, tracks attempts, and computes next retry time.
 */

const retryStore = new Map();

const STRATEGIES = ['fixed', 'exponential', 'linear'];

function createRetryPolicy(id, options = {}) {
  if (!id || typeof id !== 'string') throw new Error('id must be a non-empty string');
  const strategy = options.strategy || 'fixed';
  if (!STRATEGIES.includes(strategy)) throw new Error(`Unknown strategy: ${strategy}`);
  const policy = {
    id,
    strategy,
    maxAttempts: options.maxAttempts ?? 3,
    delayMs: options.delayMs ?? 1000,
    attempts: 0,
    lastAttemptAt: null,
    lastError: null,
    exhausted: false,
  };
  retryStore.set(id, policy);
  return { ...policy };
}

function recordAttempt(id, error = null) {
  const policy = retryStore.get(id);
  if (!policy) throw new Error(`No retry policy found for id: ${id}`);
  policy.attempts += 1;
  policy.lastAttemptAt = new Date();
  policy.lastError = error ? String(error) : null;
  if (policy.attempts >= policy.maxAttempts) policy.exhausted = true;
  retryStore.set(id, policy);
  return { ...policy };
}

function getNextRetryDelay(id) {
  const policy = retryStore.get(id);
  if (!policy) throw new Error(`No retry policy found for id: ${id}`);
  if (policy.exhausted) return null;
  const n = policy.attempts;
  if (policy.strategy === 'fixed') return policy.delayMs;
  if (policy.strategy === 'linear') return policy.delayMs * (n + 1);
  if (policy.strategy === 'exponential') return policy.delayMs * Math.pow(2, n);
  return policy.delayMs;
}

function resetRetry(id) {
  const policy = retryStore.get(id);
  if (!policy) throw new Error(`No retry policy found for id: ${id}`);
  policy.attempts = 0;
  policy.lastAttemptAt = null;
  policy.lastError = null;
  policy.exhausted = false;
  retryStore.set(id, policy);
  return { ...policy };
}

function removeRetryPolicy(id) {
  return retryStore.delete(id);
}

function getRetryPolicy(id) {
  const policy = retryStore.get(id);
  if (!policy) return null;
  return { ...policy };
}

function listRetryPolicies() {
  return [...retryStore.values()].map(p => ({ ...p }));
}

module.exports = {
  createRetryPolicy,
  recordAttempt,
  getNextRetryDelay,
  resetRetry,
  removeRetryPolicy,
  getRetryPolicy,
  listRetryPolicies,
};
