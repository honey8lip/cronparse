const {
  registerMiddleware,
  removeMiddleware,
  getMiddleware,
  listMiddlewares,
  applyMiddleware,
  clearMiddlewares
} = require('./cronMiddleware');

beforeEach(() => clearMiddlewares());

test('registers a middleware with before/after hooks', () => {
  const mw = registerMiddleware('logger', {
    before: (ctx) => { ctx.started = true; },
    after: (ctx) => { ctx.finished = true; }
  });
  expect(mw.name).toBe('logger');
  expect(typeof mw.before).toBe('function');
  expect(typeof mw.after).toBe('function');
  expect(mw.onError).toBeNull();
});

test('throws if name is missing', () => {
  expect(() => registerMiddleware()).toThrow('Middleware name required');
});

test('throws on duplicate registration', () => {
  registerMiddleware('dup', {});
  expect(() => registerMiddleware('dup', {})).toThrow("Middleware 'dup' already registered");
});

test('getMiddleware returns null for unknown', () => {
  expect(getMiddleware('ghost')).toBeNull();
});

test('removeMiddleware removes it', () => {
  registerMiddleware('temp', {});
  expect(removeMiddleware('temp')).toBe(true);
  expect(getMiddleware('temp')).toBeNull();
});

test('listMiddlewares returns all registered', () => {
  registerMiddleware('a', {});
  registerMiddleware('b', {});
  const names = listMiddlewares().map(m => m.name);
  expect(names).toContain('a');
  expect(names).toContain('b');
});

test('applyMiddleware calls before, run, and after', async () => {
  const log = [];
  registerMiddleware('trace', {
    before: () => log.push('before'),
    after: () => log.push('after')
  });
  const ctx = { run: () => { log.push('run'); return 42; } };
  const result = await applyMiddleware('trace', ctx);
  expect(log).toEqual(['before', 'run', 'after']);
  expect(result.result).toBe(42);
});

test('applyMiddleware calls onError on failure', async () => {
  let caught = null;
  registerMiddleware('safe', {
    onError: (ctx) => { caught = ctx.error; }
  });
  const ctx = { run: () => { throw new Error('boom'); } };
  const result = await applyMiddleware('safe', ctx);
  expect(caught).toBeInstanceOf(Error);
  expect(caught.message).toBe('boom');
});

test('applyMiddleware rethrows if no onError', async () => {
  registerMiddleware('strict', {});
  const ctx = { run: () => { throw new Error('fail'); } };
  await expect(applyMiddleware('strict', ctx)).rejects.toThrow('fail');
});

test('applyMiddleware throws if middleware not found', async () => {
  await expect(applyMiddleware('missing', {})).rejects.toThrow("Middleware 'missing' not found");
});
