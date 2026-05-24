const { createEmitter, on, off, emit, listEvents, removeEmitter, clearAll, listEmitters } = require('./cronEvent');

beforeEach(() => clearAll());

test('createEmitter registers a new emitter', () => {
  const e = createEmitter('job1');
  expect(e.id).toBe('job1');
  expect(listEmitters()).toContain('job1');
});

test('createEmitter returns existing emitter on duplicate id', () => {
  const a = createEmitter('job2');
  const b = createEmitter('job2');
  expect(a).toBe(b);
});

test('on registers a handler and emit calls it', () => {
  const calls = [];
  on('job3', 'run', payload => calls.push(payload));
  emit('job3', 'run', { time: 1 });
  expect(calls).toEqual([{ time: 1 }]);
});

test('emit returns number of handlers called', () => {
  on('job4', 'run', () => {});
  on('job4', 'run', () => {});
  expect(emit('job4', 'run', {})).toBe(2);
});

test('emit returns 0 for unknown emitter', () => {
  expect(emit('ghost', 'run', {})).toBe(0);
});

test('off removes a specific handler', () => {
  const calls = [];
  const h = () => calls.push(1);
  on('job5', 'run', h);
  off('job5', 'run', h);
  emit('job5', 'run', {});
  expect(calls).toHaveLength(0);
});

test('off returns false for unknown emitter', () => {
  expect(off('nope', 'run', () => {})).toBe(false);
});

test('listEvents returns active event names', () => {
  on('job6', 'run', () => {});
  on('job6', 'error', () => {});
  expect(listEvents('job6').sort()).toEqual(['error', 'run']);
});

test('listEvents returns empty for unknown id', () => {
  expect(listEvents('missing')).toEqual([]);
});

test('removeEmitter deletes the emitter', () => {
  createEmitter('job7');
  removeEmitter('job7');
  expect(listEmitters()).not.toContain('job7');
});

test('listEmitters returns all registered ids', () => {
  createEmitter('a');
  createEmitter('b');
  expect(listEmitters()).toEqual(expect.arrayContaining(['a', 'b']));
});
