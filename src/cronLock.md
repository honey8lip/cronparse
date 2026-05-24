# cronLock

Mutex-style locking for cron expressions. Useful when multiple workers or processes share a cron schedule and you need to prevent duplicate concurrent execution.

## API

### `acquireLock(expression, owner, ttlMs?)`

Attempts to acquire a lock on the given cron expression.

- `expression` — the cron string to lock
- `owner` — identifier for the lock holder (e.g. worker ID)
- `ttlMs` — time-to-live in milliseconds (default: `60000`)

Returns `{ acquired: true, owner, expiresAt }` on success, or `{ acquired: false, owner, expiresAt }` if already locked.

### `releaseLock(expression, owner)`

Releases a lock. Only the owner who acquired it can release it.

Returns `{ released: true }` or `{ released: false, reason }` where reason is `'wrong_owner'` or `'no_lock'`.

### `isLocked(expression)`

Returns `true` if the expression has an active (non-expired) lock.

### `getLock(expression)`

Returns the lock object `{ owner, acquiredAt, expiresAt }` or `null` if not locked.

### `renewLock(expression, owner, ttlMs?)`

Extends the TTL of an existing lock. Only the current owner can renew.

Returns `{ renewed: true, expiresAt }` or `{ renewed: false, reason }`.

### `listLocks()`

Returns an array of all currently active locks with their expressions and metadata. Expired locks are automatically pruned.

### `clearAllLocks()`

Removes all locks. Returns `{ cleared: N }` with the count removed. Useful for testing or shutdown.

## Example

```js
const { acquireLock, releaseLock } = require('./cronLock');

const result = acquireLock('*/5 * * * *', 'worker-42');
if (result.acquired) {
  // safe to run the job
  releaseLock('*/5 * * * *', 'worker-42');
} else {
  console.log(`Locked by ${result.owner} until ${new Date(result.expiresAt)}`);
}
```
