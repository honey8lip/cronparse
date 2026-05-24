const {
  createQueue,
  addToQueue,
  removeFromQueue,
  peekQueue,
  dequeue,
  listQueue,
  clearQueue,
  removeQueue,
  listQueueNames
} = require('./cronQueue');

beforeEach(() => {
  listQueueNames().forEach(n => removeQueue(n));
});

test('createQueue creates a new queue', () => {
  createQueue('main');
  expect(listQueueNames()).toContain('main');
});

test('createQueue throws on duplicate name', () => {
  createQueue('dup');
  expect(() => createQueue('dup')).toThrow('already exists');
});

test('addToQueue inserts entries sorted by priority', () => {
  createQueue('jobs');
  addToQueue('jobs', '0 * * * *', 1);
  addToQueue('jobs', '*/5 * * * *', 5);
  addToQueue('jobs', '0 0 * * *', 3);
  const list = listQueue('jobs');
  expect(list[0].priority).toBe(5);
  expect(list[1].priority).toBe(3);
  expect(list[2].priority).toBe(1);
});

test('peekQueue returns top entry without removing', () => {
  createQueue('peek');
  addToQueue('peek', '* * * * *', 2);
  const top = peekQueue('peek');
  expect(top.expression).toBe('* * * * *');
  expect(listQueue('peek')).toHaveLength(1);
});

test('peekQueue returns null on empty queue', () => {
  createQueue('empty');
  expect(peekQueue('empty')).toBeNull();
});

test('dequeue removes and returns top entry', () => {
  createQueue('dq');
  addToQueue('dq', '0 0 * * *', 10);
  addToQueue('dq', '*/10 * * * *', 1);
  const entry = dequeue('dq');
  expect(entry.priority).toBe(10);
  expect(listQueue('dq')).toHaveLength(1);
});

test('removeFromQueue removes matching expression', () => {
  createQueue('rm');
  addToQueue('rm', '0 9 * * 1', 2);
  addToQueue('rm', '0 17 * * 5', 2);
  const removed = removeFromQueue('rm', '0 9 * * 1');
  expect(removed).toBe(true);
  expect(listQueue('rm').map(e => e.expression)).not.toContain('0 9 * * 1');
});

test('removeFromQueue returns false if not found', () => {
  createQueue('nope');
  expect(removeFromQueue('nope', '* * * * *')).toBe(false);
});

test('clearQueue empties the queue', () => {
  createQueue('clr');
  addToQueue('clr', '* * * * *');
  addToQueue('clr', '0 0 * * *');
  clearQueue('clr');
  expect(listQueue('clr')).toHaveLength(0);
});

test('addToQueue stores meta data', () => {
  createQueue('meta');
  addToQueue('meta', '0 12 * * *', 0, { label: 'noon' });
  expect(listQueue('meta')[0].meta.label).toBe('noon');
});
