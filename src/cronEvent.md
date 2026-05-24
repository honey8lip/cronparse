# cronEvent

A lightweight event emitter system for attaching lifecycle hooks to cron jobs.

## Functions

### `createEmitter(id)`
Registers a new emitter with the given `id`. Returns the existing emitter if one already exists.

### `on(id, event, handler)`
Attaches a `handler` function to the specified `event` on emitter `id`. Returns the emitter id.

### `off(id, event, handler)`
Removes a specific `handler` from an event. Returns `true` on success, `false` if emitter not found.

### `emit(id, event, payload)`
Fires all handlers registered under `event` for emitter `id`, passing `payload`. Returns the number of handlers invoked.

### `listEvents(id)`
Returns an array of event names that have at least one active handler on emitter `id`.

### `removeEmitter(id)`
Deletes the emitter and all its listeners. Returns `true` if removed.

### `listEmitters()`
Returns an array of all registered emitter ids.

### `clearAll()`
Removes all registered emitters. Useful for testing.

## Example

```js
const { on, emit, removeEmitter } = require('./cronEvent');

on('daily-job', 'run', ({ time }) => console.log('Ran at', time));
on('daily-job', 'error', ({ err }) => console.error('Failed:', err));

emit('daily-job', 'run', { time: new Date() });

removeEmitter('daily-job');
```
