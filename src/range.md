# range

Utilities for expanding and inspecting cron field ranges.

## Functions

### `expandField(field, fieldName)`

Expands a cron field string into a sorted array of matching integers.

```js
const { expandField } = require('./range');

expandField('*/15', 'minute');   // [0, 15, 30, 45]
expandField('1-5', 'dom');       // [1, 2, 3, 4, 5]
expandField('1,3,5', 'dow');     // [1, 3, 5]
expandField('0-12/4', 'hour');   // [0, 4, 8, 12]
```

Supported token formats:

| Format    | Example   | Description              |
|-----------|-----------|--------------------------|
| `*`       | `*`       | All values in range      |
| `n`       | `5`       | Single value             |
| `n-m`     | `1-5`     | Inclusive range          |
| `*/s`     | `*/10`    | Every s from min         |
| `n-m/s`   | `0-30/5`  | Every s within range     |
| `a,b,...` | `1,3,5`   | Comma-separated list     |

### `rangesEqual(fieldA, fieldB, fieldName)`

Returns `true` if two field expressions resolve to identical value sets.

```js
rangesEqual('*/2', '0,2,4,...', 'minute'); // true
rangesEqual('1-3', '1-4', 'dom');          // false
```

### `rangeIntersect(fieldA, fieldB, fieldName)`

Returns the sorted array of values present in both fields.

```js
rangeIntersect('1-5', '3-7', 'dom');  // [3, 4, 5]
rangeIntersect('*', '6,12', 'hour'); // [6, 12]
```

## Field Limits

| Field  | Min | Max |
|--------|-----|-----|
| minute | 0   | 59  |
| hour   | 0   | 23  |
| dom    | 1   | 31  |
| month  | 1   | 12  |
| dow    | 0   | 7   |
