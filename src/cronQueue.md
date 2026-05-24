# cronQueue

Manage a prioritized queue of scheduled cron expressions.

## API

### `createQueue(name)`
Creates a new named queue. Throws if a queue with that name already exists.

### `addToQueue(name, expression, priority?, meta?)`
Adds a cron expression to the queue. Entries are automatically sorted by `priority` (descending). Returns the created entry.

### `peekQueue(name)`
Returns a copy of the highest-priority entry without removing it. Returns `null` if the queue is empty.

### `dequeue(name)`
Removes and returns the highest-priority entry. Returns `null` if the queue is empty.

### `removeFromQueue(name, expression)`
Removes the first entry matching the given expression. Returns `true` if removed, `false` otherwise.

### `listQueue(name)`
Returns a copy of all entries in priority order.

### `clearQueue(name)`
Removes all entries from the queue without deleting the queue itself.

### `removeQueue(name)`
Deletes the queue entirely. Returns `true` on success.

### `listQueueNames()`
Returns an array of all registered queue names.

## Example

```js
const { createQueue, addToQueue, dequeue } = require('./cronQueue');

createQueue('tasks');
addToQueue('tasks', '0 9 * * 1-5', 5, { label: 'weekday morning' });
addToQueue('tasks', '*/30 * * * *', 1, { label: 'every 30 min' });

const next = dequeue('tasks');
console.log(next.meta.label); // 'weekday morning'
```
