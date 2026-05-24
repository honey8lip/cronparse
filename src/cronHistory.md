# cronHistory

Track and query past run times for a cron expression.

## Functions

### `getLastRuns(expression, count, before)`

Returns the last `count` run times before a reference date.

```js
import { getLastRuns } from './cronHistory.js';

const runs = getLastRuns('0 9 * * 1-5', 3);
// [
//   2024-01-15T09:00:00,
//   2024-01-12T09:00:00,
//   2024-01-11T09:00:00
// ]
```

**Parameters:**
- `expression` `{string}` — valid cron expression
- `count` `{number}` — number of past runs to return (default: `5`)
- `before` `{Date}` — reference point (default: `now`)

**Returns:** `Date[]` sorted most-recent first.

---

### `getRunsBetween(expression, from, to)`

Returns all run times within a date range (inclusive).

```js
import { getRunsBetween } from './cronHistory.js';

const from = new Date('2024-01-15T00:00:00');
const to   = new Date('2024-01-15T23:59:00');
const runs = getRunsBetween('0 */6 * * *', from, to);
// [ 00:00, 06:00, 12:00, 18:00 ]
```

---

### `summarizeHistory(expression, count, before)`

Returns a summary object with metadata about past runs.

```js
const summary = summarizeHistory('*/15 * * * *', 10);
// {
//   count: 10,
//   last:  Date,   // most recent run
//   first: Date,   // oldest in the set
//   runs:  Date[]
// }
```

---

## Notes

- Scanning is limited to approximately one year back to avoid infinite loops.
- Seconds are always zeroed out; only minute-level resolution is supported.
- Combine with `getSchedule` from `schedule.js` for forward-looking queries.
