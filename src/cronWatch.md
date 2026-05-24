# cronWatch

Watch a cron expression and trigger a callback each time it would fire.

## API

### `createWatcher(expression, callback, options?)`

Schedules a watcher that calls `callback` whenever the cron expression fires.

**Options:**
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `label` | string | `null` | Human-readable name for the watcher |
| `maxFires` | number | `Infinity` | Stop after this many fires |
| `timezone` | string | `null` | Reserved for timezone support |

Returns a numeric watcher `id`.

**Callback payload:**
```js
{
  id: 1,
  expression: '*/5 * * * *',
  firedAt: Date,
  fireCount: 1
}
```

### `stopWatcher(id)`

Stops and removes a watcher by id. Returns `true` if found, `false` otherwise.

### `getWatcher(id)`

Returns the watcher object for the given id, or `null`.

### `listWatchers()`

Returns an array of all active watchers with `{ id, expression, label, fireCount, active }`.

### `stopAll()`

Stops and removes all active watchers.

## Example

```js
const { createWatcher, stopWatcher } = require('./cronWatch');

const id = createWatcher('*/1 * * * *', ({ firedAt, fireCount }) => {
  console.log(`Fired at ${firedAt.toISOString()} (count: ${fireCount})`);
}, { label: 'every-minute', maxFires: 3 });

// later
stopWatcher(id);
```
