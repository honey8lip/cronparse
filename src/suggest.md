# suggest

The `suggest` module provides human-friendly cron expression suggestions, useful for building autocomplete UIs or CLI helpers.

## API

### `listSuggestions()`

Returns all built-in suggestions as an array of `{ label, expression }` objects.

```js
const { listSuggestions } = require('./suggest');
listSuggestions();
// [
//   { label: 'Every minute', expression: '* * * * *' },
//   { label: 'Every 5 minutes', expression: '*/5 * * * *' },
//   ...
// ]
```

### `searchSuggestions(query)`

Filters suggestions by matching `query` (case-insensitive) against suggestion labels.

```js
searchSuggestions('hour');
// [
//   { label: 'Every hour', expression: '0 * * * *' },
//   { label: 'Every 6 hours', expression: '0 */6 * * *' },
//   { label: 'Every 12 hours', expression: '0 */12 * * *' },
// ]
```

### `suggestFromPartial(partial)`

Returns suggestions whose expression starts with the given partial string. Useful for expression-based autocomplete.

```js
suggestFromPartial('0 0');
// suggestions whose expression begins with '0 0'
```

## Notes

- All functions return copies of the internal data — mutations are safe.
- Passing `null`, `undefined`, or an empty string to any function returns the full list.
