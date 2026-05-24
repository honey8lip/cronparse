/**
 * cronWatch.js — Watch a cron expression and emit events when it fires
 */

const { nextRun } = require('./nextRun');

const watchers = new Map();
let watcherIdCounter = 1;

function createWatcher(expression, callback, options = {}) {
  const id = watcherIdCounter++;
  const { timezone = null, maxFires = Infinity, label = null } = options;

  const watcher = {
    id,
    expression,
    callback,
    timezone,
    maxFires,
    label,
    fireCount: 0,
    active: true,
    timerId: null,
  };

  scheduleNext(watcher);
  watchers.set(id, watcher);
  return id;
}

function scheduleNext(watcher) {
  if (!watcher.active) return;

  const now = new Date();
  const next = nextRun(watcher.expression, now);
  if (!next) return;

  const delay = next.getTime() - now.getTime();

  watcher.timerId = setTimeout(() => {
    if (!watcher.active) return;

    watcher.fireCount++;
    try {
      watcher.callback({ id: watcher.id, expression: watcher.expression, firedAt: new Date(), fireCount: watcher.fireCount });
    } catch (e) {
      // swallow callback errors
    }

    if (watcher.fireCount >= watcher.maxFires) {
      stopWatcher(watcher.id);
    } else {
      scheduleNext(watcher);
    }
  }, delay);
}

function stopWatcher(id) {
  const watcher = watchers.get(id);
  if (!watcher) return false;
  watcher.active = false;
  if (watcher.timerId !== null) clearTimeout(watcher.timerId);
  watchers.delete(id);
  return true;
}

function getWatcher(id) {
  return watchers.get(id) || null;
}

function listWatchers() {
  return Array.from(watchers.values()).map(({ id, expression, label, fireCount, active }) => ({
    id, expression, label, fireCount, active,
  }));
}

function stopAll() {
  for (const id of watchers.keys()) stopWatcher(id);
}

module.exports = { createWatcher, stopWatcher, getWatcher, listWatchers, stopAll };
