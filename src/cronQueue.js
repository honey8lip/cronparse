// cronQueue.js — manage a prioritized queue of scheduled cron jobs

const queues = new Map();

function makeEntry(expression, priority = 0, meta = {}) {
  return { expression, priority, meta, addedAt: Date.now() };
}

function createQueue(name) {
  if (queues.has(name)) throw new Error(`Queue "${name}" already exists`);
  queues.set(name, []);
  return { name, entries: [] };
}

function getQueue(name) {
  if (!queues.has(name)) throw new Error(`Queue "${name}" not found`);
  return queues.get(name);
}

function addToQueue(name, expression, priority = 0, meta = {}) {
  const queue = getQueue(name);
  const entry = makeEntry(expression, priority, meta);
  queue.push(entry);
  queue.sort((a, b) => b.priority - a.priority);
  return entry;
}

function removeFromQueue(name, expression) {
  const queue = getQueue(name);
  const idx = queue.findIndex(e => e.expression === expression);
  if (idx === -1) return false;
  queue.splice(idx, 1);
  return true;
}

function peekQueue(name) {
  const queue = getQueue(name);
  return queue.length > 0 ? { ...queue[0] } : null;
}

function dequeue(name) {
  const queue = getQueue(name);
  if (queue.length === 0) return null;
  return queue.shift();
}

function listQueue(name) {
  return getQueue(name).map(e => ({ ...e }));
}

function clearQueue(name) {
  const queue = getQueue(name);
  queue.length = 0;
}

function removeQueue(name) {
  if (!queues.has(name)) return false;
  queues.delete(name);
  return true;
}

function listQueueNames() {
  return [...queues.keys()];
}

module.exports = {
  createQueue,
  getQueue,
  addToQueue,
  removeFromQueue,
  peekQueue,
  dequeue,
  listQueue,
  clearQueue,
  removeQueue,
  listQueueNames
};
