/**
 * cronLock.js — Mutex-style locking for cron expressions to prevent concurrent scheduling conflicts
 */

const locks = new Map();

function acquireLock(expression, owner, ttlMs = 60000) {
  const existing = locks.get(expression);
  const now = Date.now();

  if (existing && existing.expiresAt > now) {
    return { acquired: false, owner: existing.owner, expiresAt: existing.expiresAt };
  }

  const lock = { owner, acquiredAt: now, expiresAt: now + ttlMs };
  locks.set(expression, lock);
  return { acquired: true, owner, expiresAt: lock.expiresAt };
}

function releaseLock(expression, owner) {
  const existing = locks.get(expression);
  if (!existing) return { released: false, reason: 'no_lock' };
  if (existing.owner !== owner) return { released: false, reason: 'wrong_owner' };
  locks.delete(expression);
  return { released: true };
}

function isLocked(expression) {
  const existing = locks.get(expression);
  if (!existing) return false;
  if (existing.expiresAt <= Date.now()) {
    locks.delete(expression);
    return false;
  }
  return true;
}

function getLock(expression) {
  const existing = locks.get(expression);
  if (!existing) return null;
  if (existing.expiresAt <= Date.now()) {
    locks.delete(expression);
    return null;
  }
  return { ...existing };
}

function renewLock(expression, owner, ttlMs = 60000) {
  const existing = locks.get(expression);
  if (!existing || existing.owner !== owner) {
    return { renewed: false, reason: existing ? 'wrong_owner' : 'no_lock' };
  }
  existing.expiresAt = Date.now() + ttlMs;
  return { renewed: true, expiresAt: existing.expiresAt };
}

function listLocks() {
  const now = Date.now();
  const result = [];
  for (const [expression, lock] of locks.entries()) {
    if (lock.expiresAt > now) {
      result.push({ expression, ...lock });
    } else {
      locks.delete(expression);
    }
  }
  return result;
}

function clearAllLocks() {
  const count = locks.size;
  locks.clear();
  return { cleared: count };
}

module.exports = {
  acquireLock,
  releaseLock,
  isLocked,
  getLock,
  renewLock,
  listLocks,
  clearAllLocks,
};
