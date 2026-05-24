const {
  registerRateLimit,
  removeRateLimit,
  getRateLimit,
  isRateLimited,
  recordRun,
  resetRateLimit,
  getRemainingRuns,
  listRateLimits
} = require('./cronRateLimit');

const BASE_TIME = 1_700_000_000_000;
const WINDOW = 60_000; // 1 minute

beforeEach(() => {
  // clean up between tests
  listRateLimits().forEach(({ id }) => removeRateLimit(id));
});

test('registerRateLimit stores entry', () => {
  const result = registerRateLimit('job1', 5, WINDOW);
  expect(result).toEqual({ id: 'job1', maxRuns: 5, windowMs: WINDOW });
  expect(getRateLimit('job1')).toMatchObject({ maxRuns: 5, windowMs: WINDOW });
});

test('registerRateLimit throws on invalid args', () => {
  expect(() => registerRateLimit(null, 5, WINDOW)).toThrow();
  expect(() => registerRateLimit('x', 'five', WINDOW)).toThrow();
});

test('getRateLimit returns null for unknown id', () => {
  expect(getRateLimit('nope')).toBeNull();
});

test('isRateLimited returns false when under limit', () => {
  registerRateLimit('job2', 3, WINDOW);
  expect(isRateLimited('job2', BASE_TIME)).toBe(false);
});

test('recordRun allows runs up to maxRuns', () => {
  registerRateLimit('job3', 2, WINDOW);
  expect(recordRun('job3', BASE_TIME).allowed).toBe(true);
  expect(recordRun('job3', BASE_TIME + 1000).allowed).toBe(true);
  const third = recordRun('job3', BASE_TIME + 2000);
  expect(third.allowed).toBe(false);
});

test('recordRun resets count in new window', () => {
  registerRateLimit('job4', 1, WINDOW);
  recordRun('job4', BASE_TIME);
  // next window
  const nextWindow = BASE_TIME + WINDOW;
  const result = recordRun('job4', nextWindow);
  expect(result.allowed).toBe(true);
});

test('recordRun throws for unknown id', () => {
  expect(() => recordRun('ghost', BASE_TIME)).toThrow();
});

test('getRemainingRuns returns correct count', () => {
  registerRateLimit('job5', 3, WINDOW);
  recordRun('job5', BASE_TIME);
  expect(getRemainingRuns('job5', BASE_TIME)).toBe(2);
});

test('getRemainingRuns returns null for unknown id', () => {
  expect(getRemainingRuns('nope')).toBeNull();
});

test('resetRateLimit clears run history', () => {
  registerRateLimit('job6', 1, WINDOW);
  recordRun('job6', BASE_TIME);
  expect(isRateLimited('job6', BASE_TIME)).toBe(true);
  resetRateLimit('job6');
  expect(isRateLimited('job6', BASE_TIME)).toBe(false);
});

test('removeRateLimit removes entry', () => {
  registerRateLimit('job7', 2, WINDOW);
  expect(removeRateLimit('job7')).toBe(true);
  expect(getRateLimit('job7')).toBeNull();
});

test('listRateLimits returns all entries', () => {
  registerRateLimit('a', 5, WINDOW);
  registerRateLimit('b', 10, WINDOW);
  const list = listRateLimits();
  expect(list.length).toBe(2);
  expect(list.map(e => e.id)).toEqual(expect.arrayContaining(['a', 'b']));
});
