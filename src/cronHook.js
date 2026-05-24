// cronHook.js — lifecycle hooks for cron expressions (before/after run callbacks)

const hooks = new Map();

function makeHookEntry(name) {
  return { name, before: [], after: [], onError: [] };
}

function registerHook(name) {
  if (!hooks.has(name)) {
    hooks.set(name, makeHookEntry(name));
  }
  return hooks.get(name);
}

function removeHook(name) {
  return hooks.delete(name);
}

function getHook(name) {
  return hooks.get(name) || null;
}

function listHooks() {
  return Array.from(hooks.keys());
}

function addBefore(name, fn) {
  const entry = registerHook(name);
  entry.before.push(fn);
  return entry.before.length;
}

function addAfter(name, fn) {
  const entry = registerHook(name);
  entry.after.push(fn);
  return entry.after.length;
}

function addOnError(name, fn) {
  const entry = registerHook(name);
  entry.onError.push(fn);
  return entry.onError.length;
}

async function runWithHooks(name, task, context = {}) {
  const entry = hooks.get(name);
  const before = entry ? entry.before : [];
  const after = entry ? entry.after : [];
  const onError = entry ? entry.onError : [];

  for (const fn of before) {
    await fn(context);
  }

  let result;
  try {
    result = await task(context);
  } catch (err) {
    for (const fn of onError) {
      await fn(err, context);
    }
    throw err;
  }

  for (const fn of after) {
    await fn(result, context);
  }

  return result;
}

function clearHooks(name) {
  if (hooks.has(name)) {
    hooks.set(name, makeHookEntry(name));
    return true;
  }
  return false;
}

function resetAllHooks() {
  hooks.clear();
}

module.exports = {
  registerHook,
  removeHook,
  getHook,
  listHooks,
  addBefore,
  addAfter,
  addOnError,
  runWithHooks,
  clearHooks,
  resetAllHooks
};
