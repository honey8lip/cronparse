const {
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
} = require('./cronHook');

beforeEach(() => resetAllHooks());

test('registerHook creates a new hook entry', () => {
  const entry = registerHook('daily');
  expect(entry.name).toBe('daily');
  expect(entry.before).toEqual([]);
  expect(entry.after).toEqual([]);
  expect(entry.onError).toEqual([]);
});

test('registerHook returns existing entry if already registered', () => {
  const a = registerHook('daily');
  const b = registerHook('daily');
  expect(a).toBe(b);
});

test('getHook returns null for unknown hook', () => {
  expect(getHook('unknown')).toBeNull();
});

test('removeHook deletes a hook', () => {
  registerHook('weekly');
  expect(removeHook('weekly')).toBe(true);
  expect(getHook('weekly')).toBeNull();
});

test('listHooks returns all registered names', () => {
  registerHook('a');
  registerHook('b');
  expect(listHooks()).toEqual(expect.arrayContaining(['a', 'b']));
});

test('addBefore registers a before callback', () => {
  addBefore('job', () => {});
  const entry = getHook('job');
  expect(entry.before).toHaveLength(1);
});

test('addAfter registers an after callback', () => {
  addAfter('job', () => {});
  const entry = getHook('job');
  expect(entry.after).toHaveLength(1);
});

test('runWithHooks calls before and after in order', async () => {
  const order = [];
  addBefore('task', async () => order.push('before'));
  addAfter('task', async () => order.push('after'));
  await runWithHooks('task', async () => order.push('run'));
  expect(order).toEqual(['before', 'run', 'after']);
});

test('runWithHooks calls onError on task failure', async () => {
  const errors = [];
  addOnError('fail', async (err) => errors.push(err.message));
  await expect(
    runWithHooks('fail', async () => { throw new Error('boom'); })
  ).rejects.toThrow('boom');
  expect(errors).toEqual(['boom']);
});

test('runWithHooks works with no registered hook', async () => {
  const result = await runWithHooks('noHook', async () => 42);
  expect(result).toBe(42);
});

test('clearHooks resets callbacks for a hook', () => {
  addBefore('x', () => {});
  clearHooks('x');
  expect(getHook('x').before).toHaveLength(0);
});
