# cronFilter

Filter and query collections of cron expressions by field criteria.

## API

### `registerFilter(name, criteria)`
Register a named filter with a criteria object mapping field names to patterns.

```js
registerFilter('business-hours', { hour: '9-17', dow: '1-5' });
```

### `removeFilter(name)`
Remove a registered filter by name. Returns `true` if removed.

### `getFilter(name)`
Retrieve a registered filter by name, or `null` if not found.

### `listFilters()`
Return all registered filters as an array.

### `filterCrons(expressions, criteria)`
Filter an array of cron expression strings against an ad-hoc criteria object.

```js
filterCrons(['0 * * * *', '30 6 * * *'], { minute: '0' });
// => ['0 * * * *']
```

### `applyFilter(expressions, filterName)`
Apply a registered named filter to an array of expressions.

```js
applyFilter(['0 9 * * 1-5', '0 12 * * *'], 'business-hours');
```

### `clearFilters()`
Remove all registered filters.

## Criteria Object

Keys are field names: `minute`, `hour`, `dom`, `month`, `dow`.
Values are cron field patterns (e.g. `'0'`, `'1-5'`, `'*/2'`).

Only specified fields are checked; unspecified fields match any value.
