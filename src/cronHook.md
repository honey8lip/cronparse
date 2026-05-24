# cronHook

Lifecycle hooks for cron jobs — register `before`, `after`, and `onError` callbacks that wrap task execution.

## API

### `registerHook(name)`
Registers a named hook (or returns existing). Returns the hook entry.

### `removeHook(name)`
Deletes a hook by name. Returns `true` if removed.

### `getHook(name)`
Returns the hook entry or `null` if not found.

### `listHooks()`
Returns an array of all registered hook names.

### `addBefore(name, fn)`
Adds a `before` callback to the named hook. Called before the task runs.

### `addAfter(name, fn)`
Adds an `after` callback. Called with `(result, context)` after the task succeeds.

### `addOnError(name, fn)`
Adds an `onError` callback. Called with `(error, context)` if the task throws.

### `runWithHooks(name, task, context?)`
Runs `task(context)` wrapped by all registered hooks for `name`. Returns the task result. Re-throws errors after calling `onError` handlers.

### `clearHooks(name)`
Resets all callbacks for a hook without removing it.

### `resetAllHooks()`
Clears the entire hook registry (useful in tests).

## Example

```js
const { addBefore, addAfter, runWithHooks } = require('./cronHook');

addBefore('backup', async (ctx) => {
  console.log('Starting backup at', ctx.startedAt);
});

addAfter('backup', async (result, ctx) => {
  console.log('Backup done, files:', result.count);
});

await runWithHooks('backup', async (ctx) => {
  // ... perform backup ...
  return { count: 42 };
}, { startedAt: new Date() });
```
