# cronMiddleware

Middleware hooks for cron job execution — run logic before, after, or on error around a job.

## API

### `registerMiddleware(name, hooks)`
Registers a named middleware with optional `before`, `after`, and `onError` async hooks.

```js
registerMiddleware('logger', {
  before: async (ctx) => console.log('Starting', ctx.cron),
  after: async (ctx) => console.log('Done', ctx.result),
  onError: async (ctx) => console.error('Failed', ctx.error)
});
```

### `applyMiddleware(name, context)`
Runs the middleware lifecycle around `context.run`. Returns the enriched context.

```js
const ctx = await applyMiddleware('logger', {
  cron: '* * * * *',
  run: async () => doWork()
});
console.log(ctx.result);
```

### `getMiddleware(name)`
Returns the registered middleware entry or `null`.

### `removeMiddleware(name)`
Removes a middleware by name. Returns `true` if removed.

### `listMiddlewares()`
Returns all registered middleware entries as an array.

### `clearMiddlewares()`
Removes all registered middlewares (useful in tests).

## Context Object

| Property  | Description                          |
|-----------|--------------------------------------|
| `run`     | Function to execute (provided by caller) |
| `result`  | Return value of `run` after execution |
| `error`   | Error thrown by `run`, if any        |

## Notes
- If `onError` is not defined and `run` throws, the error is re-thrown.
- All hooks are `async`-compatible.
