# normalize

The `normalize` module prepares a raw cron expression for further processing by resolving aliases, collapsing whitespace, and filling in any missing fields.

## API

### `normalize(expression: string): NormalizeResult`

Main entry point. Returns an object with:

| Field | Type | Description |
|-------|------|-------------|
| `expression` | `string` | Fully normalized 5-field expression |
| `fields` | `string[]` | Array of the 5 individual fields |
| `wasAlias` | `boolean` | `true` if the input was a preset alias |

```js
const { normalize } = require('./normalize');

normalize('@daily');
// { expression: '0 0 * * *', fields: ['0','0','*','*','*'], wasAlias: true }

normalize('*/15 *');
// { expression: '*/15 * * * *', fields: ['*/15','*','*','*','*'], wasAlias: false }
```

### `expandAlias(expression: string): string | null`

Returns the expanded 5-field string for a known alias, or `null` otherwise. Comparison is case-insensitive.

Supported aliases:

| Alias | Equivalent |
|-------|------------|
| `@yearly` / `@annually` | `0 0 1 1 *` |
| `@monthly` | `0 0 1 * *` |
| `@weekly` | `0 0 * * 0` |
| `@daily` / `@midnight` | `0 0 * * *` |
| `@hourly` | `0 * * * *` |

### `normalizeWhitespace(expression: string): string`

Trims and collapses internal whitespace to single spaces.

### `fillDefaults(fields: string[]): string[]`

Pads a fields array to exactly 5 elements using `'*'` as the default for any missing position.

## Integration

`normalize` is intended to be called before `parseCron`, `validate`, or `humanize` so that all downstream modules receive a clean, predictable 5-field string.
