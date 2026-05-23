# `merge.js` — Cron Expression Merger

Merge two cron expressions using **union** or **intersection** strategies.

## API

### `mergeCron(exprA, exprB, strategy?)`

Merges two valid cron expression strings.

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `exprA` | `string` | — | First cron expression |
| `exprB` | `string` | — | Second cron expression |
| `strategy` | `'union'\|'intersection'` | `'union'` | Merge strategy |

**Returns:** `{ merged: object, expression: string }`

- `merged` — object with keys `minute`, `hour`, `dom`, `month`, `dow`, each an array of matched values
- `expression` — the resulting cron expression string

### `mergeField(a, b, strategy)`

Low-level helper to merge two field value arrays.

## Examples

```js
const { mergeCron } = require('./merge');

// Union: run at 9am OR 5pm
const { expression } = mergeCron('0 9 * * *', '0 17 * * *', 'union');
console.log(expression); // '0 9,17 * * *'

// Intersection: only matching slots
const { expression: expr2 } = mergeCron('0 9 * * 1,2', '0 9 * * 2,3', 'intersection');
console.log(expr2); // '0 9 * * 2'
```

## Strategy Notes

- **union**: includes any time slot from either expression. A wildcard (`*`) on either side yields `*`.
- **intersection**: includes only time slots present in both. A wildcard defers to the other field's values. No overlap falls back to `*`.
