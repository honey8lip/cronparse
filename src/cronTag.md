# cronTag

Attach human-readable labels and metadata to cron expressions. Useful for building dashboards, audit logs, or any UI that needs to display named schedules.

## API

### `tagCron(expression, label, meta?)`

Associates a label (and optional metadata object) with a cron expression string.

```js
const { tagCron } = require('./cronTag');

tagCron('0 9 * * 1-5', 'Weekday standup', { team: 'engineering' });
// => { expression: '0 9 * * 1-5', label: 'Weekday standup', meta: { team: 'engineering' } }
```

### `getTag(expression)`

Returns the tag entry for a given expression, or `null` if not found.

```js
getTag('0 9 * * 1-5');
// => { expression: '0 9 * * 1-5', label: 'Weekday standup', meta: { team: 'engineering' } }
```

### `removeTag(expression)`

Removes the tag for an expression. Returns `true` if removed, `false` if not found.

```js
removeTag('0 9 * * 1-5'); // => true
```

### `listTags(filter?)`

Returns all tagged expressions. Optionally pass a string to filter by label (case-insensitive substring match).

```js
listTags();           // all tags
listTags('standup');  // only tags whose label contains 'standup'
```

### `updateTag(expression, updates)`

Update the `label` and/or `meta` of an existing tag. Meta is merged (shallow). Returns the updated entry or `null`.

```js
updateTag('0 9 * * 1-5', { label: 'Morning standup', meta: { channel: '#eng' } });
```

### `clearTags()`

Removes all tags. Primarily intended for use in tests.

## Notes

- Tags are stored in memory. For persistence, serialize the result of `listTags()` and re-hydrate on startup.
- Expressions are trimmed before storage, so `' * * * * * '` and `'* * * * *'` refer to the same key.
