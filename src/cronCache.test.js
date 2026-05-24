const {
  setCache,
  getCache,
  hasCache,
  removeCache,
  clearCache,
  cacheSize,
  listCacheKeys,
  getCacheStats,
} = require('./cronCache');

beforeEach(() => clearCache());

test('stores and retrieves a value', () => {
  setCache('* * * * *', {}, { parsed: true });
  expect(getCache('* * * * *', {})).toEqual({ parsed: true });
});

test('returns undefined for missing key', () => {
  expect(getCache('0 9 * * 1', {})).toBeUndefined();
});

test('hasCache returns true when entry exists', () => {
  setCache('0 0 * * *', {}, 'daily');
  expect(hasCache('0 0 * * *', {})).toBe(true);
});

test('hasCache returns false when entry missing', () => {
  expect(hasCache('0 0 * * *', {})).toBe(false);
});

test('removeCache deletes an entry', () => {
  setCache('5 4 * * *', {}, 'value');
  removeCache('5 4 * * *', {});
  expect(hasCache('5 4 * * *', {})).toBe(false);
});

test('cacheSize tracks number of entries', () => {
  setCache('a', {}, 1);
  setCache('b', {}, 2);
  expect(cacheSize()).toBe(2);
});

test('clearCache empties all entries', () => {
  setCache('x', {}, 'foo');
  setCache('y', {}, 'bar');
  clearCache();
  expect(cacheSize()).toBe(0);
});

test('context is part of the cache key', () => {
  setCache('0 9 * * *', { tz: 'UTC' }, 'utc-result');
  setCache('0 9 * * *', { tz: 'US/Eastern' }, 'eastern-result');
  expect(getCache('0 9 * * *', { tz: 'UTC' })).toBe('utc-result');
  expect(getCache('0 9 * * *', { tz: 'US/Eastern' })).toBe('eastern-result');
});

test('listCacheKeys returns parsed keys', () => {
  setCache('* * * * *', {}, true);
  const keys = listCacheKeys();
  expect(keys.length).toBe(1);
  expect(keys[0].expression).toBe('* * * * *');
});

test('getCacheStats returns size and entry ages', () => {
  setCache('0 0 1 * *', {}, 'monthly');
  const stats = getCacheStats();
  expect(stats.size).toBe(1);
  expect(stats.maxSize).toBe(256);
  expect(stats.entries[0].ageMs).toBeGreaterThanOrEqual(0);
});
