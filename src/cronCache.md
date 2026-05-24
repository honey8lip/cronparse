# cronCache

A lightweight in-memory LRU-style cache for storing parsed cron expressions and computed results like next-run times.

## Functions

### `setCache(expression, context, value)`
Stores a value under a key derived from `expression` and `context`. Evicts the oldest entry when the cache exceeds 256 items.

### `getCache(expression, context)`
Retrieves a cached value. Returns `undefined` if not found.

### `hasCache(expression, context)`
Returns `true` if an entry exists for the given expression and context.

### `removeCache(expression, context)`
Deletes a specific cache entry.

### `clearCache()`
Removes all entries from the cache.

### `cacheSize()`
Returns the current number of cached entries.

### `listCacheKeys()`
Returns an array of all cache keys as parsed objects `{ expression, ...context }`.

### `getCacheStats()`
Returns an object with `size`, `maxSize`, and an `entries` array showing each key and its age in milliseconds.

## Example

```js
const { setCache, getCache } = require('./cronCache');

const parsed = parseCron('0 9 * * 1');
setCache('0 9 * * 1', {}, parsed);

// later...
const cached = getCache('0 9 * * 1', {});
// => reuse without re-parsing
```

## Notes

- The cache is module-level (shared across imports).
- Context objects are serialized via `JSON.stringify`, so key order matters.
- Max size is 256 entries; oldest entry is evicted when the limit is reached.
