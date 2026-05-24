// cronEvent.js — lightweight event emitter for cron lifecycle hooks

const registry = new Map();

function createEmitter(id) {
  if (registry.has(id)) return registry.get(id);
  const emitter = { id, listeners: {} };
  registry.set(id, emitter);
  return emitter;
}

function on(id, event, handler) {
  const emitter = createEmitter(id);
  if (!emitter.listeners[event]) emitter.listeners[event] = [];
  emitter.listeners[event].push(handler);
  return id;
}

function off(id, event, handler) {
  const emitter = registry.get(id);
  if (!emitter || !emitter.listeners[event]) return false;
  emitter.listeners[event] = emitter.listeners[event].filter(h => h !== handler);
  return true;
}

function emit(id, event, payload) {
  const emitter = registry.get(id);
  if (!emitter || !emitter.listeners[event]) return 0;
  const handlers = emitter.listeners[event];
  handlers.forEach(h => h(payload));
  return handlers.length;
}

function listEvents(id) {
  const emitter = registry.get(id);
  if (!emitter) return [];
  return Object.keys(emitter.listeners).filter(e => emitter.listeners[e].length > 0);
}

function removeEmitter(id) {
  return registry.delete(id);
}

function clearAll() {
  registry.clear();
}

function listEmitters() {
  return Array.from(registry.keys());
}

/**
 * Remove all listeners for a specific event on an emitter.
 * Returns the number of listeners that were removed, or -1 if the emitter doesn't exist.
 */
function clearEvent(id, event) {
  const emitter = registry.get(id);
  if (!emitter) return -1;
  const count = emitter.listeners[event] ? emitter.listeners[event].length : 0;
  delete emitter.listeners[event];
  return count;
}

module.exports = { createEmitter, on, off, emit, listEvents, removeEmitter, clearAll, listEmitters, clearEvent };
