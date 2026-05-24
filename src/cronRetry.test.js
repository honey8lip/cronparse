const {
  createRetryPolicy,
  recordAttempt,
  getNextRetryDelay,
  resetRetry,
  removeRetryPolicy,
  getRetryPolicy,
  listRetryPolicies,
} = require('./cronRetry');

beforeEach(() => {
  listRetryPolicies().forEach(p => removeRetryPolicy(p.id));
});

test('creates a retry policy with defaults', () => {
  const p = createRetryPolicy('job1');
  expect(p.id).toBe('job1');
  expect(p.strategy).toBe('fixed');
  expect(p.maxAttempts).toBe(3);
  expect(p.delayMs).toBe(1000);
  expect(p.attempts).toBe(0);
  expect(p.exhausted).toBe(false);
});

test('creates a retry policy with custom options', () => {
  const p = createRetryPolicy('job2', { strategy: 'exponential', maxAttempts: 5, delayMs: 500 });
  expect(p.strategy).toBe('exponential');
  expect(p.maxAttempts).toBe(5);
  expect(p.delayMs).toBe(500);
});

test('throws on unknown strategy', () => {
  expect(() => createRetryPolicy('bad', { strategy: 'random' })).toThrow('Unknown strategy');
});

test('recordAttempt increments attempts and sets lastError', () => {
  createRetryPolicy('job3');
  const result = recordAttempt('job3', 'timeout error');
  expect(result.attempts).toBe(1);
  expect(result.lastError).toBe('timeout error');
  expect(result.lastAttemptAt).toBeInstanceOf(Date);
});

test('recordAttempt marks exhausted when maxAttempts reached', () => {
  createRetryPolicy('job4', { maxAttempts: 2 });
  recordAttempt('job4');
  const result = recordAttempt('job4');
  expect(result.exhausted).toBe(true);
});

test('getNextRetryDelay returns null when exhausted', () => {
  createRetryPolicy('job5', { maxAttempts: 1 });
  recordAttempt('job5');
  expect(getNextRetryDelay('job5')).toBeNull();
});

test('fixed strategy always returns same delay', () => {
  createRetryPolicy('job6', { strategy: 'fixed', delayMs: 2000 });
  expect(getNextRetryDelay('job6')).toBe(2000);
  recordAttempt('job6');
  expect(getNextRetryDelay('job6')).toBe(2000);
});

test('linear strategy scales delay with attempts', () => {
  createRetryPolicy('job7', { strategy: 'linear', delayMs: 1000 });
  expect(getNextRetryDelay('job7')).toBe(1000);
  recordAttempt('job7');
  expect(getNextRetryDelay('job7')).toBe(2000);
});

test('exponential strategy doubles delay each attempt', () => {
  createRetryPolicy('job8', { strategy: 'exponential', delayMs: 500 });
  expect(getNextRetryDelay('job8')).toBe(500);
  recordAttempt('job8');
  expect(getNextRetryDelay('job8')).toBe(1000);
  recordAttempt('job8');
  expect(getNextRetryDelay('job8')).toBe(2000);
});

test('resetRetry clears attempts and exhausted flag', () => {
  createRetryPolicy('job9', { maxAttempts: 1 });
  recordAttempt('job9');
  const reset = resetRetry('job9');
  expect(reset.attempts).toBe(0);
  expect(reset.exhausted).toBe(false);
  expect(reset.lastError).toBeNull();
});

test('getRetryPolicy returns null for unknown id', () => {
  expect(getRetryPolicy('nope')).toBeNull();
});

test('listRetryPolicies returns all policies', () => {
  createRetryPolicy('a');
  createRetryPolicy('b');
  const list = listRetryPolicies();
  expect(list.length).toBe(2);
  expect(list.map(p => p.id)).toEqual(expect.arrayContaining(['a', 'b']));
});
