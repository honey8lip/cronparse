/**
 * cronMiddleware.js
 * Middleware pipeline for cron job execution hooks (before/after/error)
 */

const _middlewares = new Map();

function makeMiddlewareEntry(name, hooks) {
  return {
    name,
    before: hooks.before || null,
    after: hooks.after || null,
    onError: hooks.onError || null,
    createdAt: Date.now()
  };
}

function registerMiddleware(name, hooks = {}) {
  if (!name || typeof name !== 'string') throw new Error('Middleware name required');
  if (_middlewares.has(name)) throw new Error(`Middleware '${name}' already registered`);
  const entry = makeMiddlewareEntry(name, hooks);
  _middlewares.set(name, entry);
  return entry;
}

function removeMiddleware(name) {
  return _middlewares.delete(name);
}

function getMiddleware(name) {
  return _middlewares.get(name) || null;
}

function listMiddlewares() {
  return Array.from(_middlewares.values());
}

async function applyMiddleware(name, context) {
  const entry = _middlewares.get(name);
  if (!entry) throw new Error(`Middleware '${name}' not found`);

  const ctx = { ...context, result: null, error: null };

  try {
    if (typeof entry.before === 'function') {
      await entry.before(ctx);
    }

    if (typeof context.run === 'function') {
      ctx.result = await context.run(ctx);
    }

    if (typeof entry.after === 'function') {
      await entry.after(ctx);
    }
  } catch (err) {
    ctx.error = err;
    if (typeof entry.onError === 'function') {
      await entry.onError(ctx);
    } else {
      throw err;
    }
  }

  return ctx;
}

function clearMiddlewares() {
  _middlewares.clear();
}

module.exports = {
  makeMiddlewareEntry,
  registerMiddleware,
  removeMiddleware,
  getMiddleware,
  listMiddlewares,
  applyMiddleware,
  clearMiddlewares
};
