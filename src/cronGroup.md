# cronGroup

Group and manage multiple named cron expressions as a collection.

## Functions

### `createGroup(entries)`

Create a group from an array of `{ name, expression }` objects. Throws if any expression is invalid or a name is missing.

```js
const group = createGroup([
  { name: 'daily', expression: '0 9 * * *' },
  { name: 'hourly', expression: '0 * * * *' },
]);
// { daily: '0 9 * * *', hourly: '0 * * * *' }
```

### `addToGroup(group, name, expression)`

Add or replace a named entry. Returns a new group object (immutable).

```js
const updated = addToGroup(group, 'weekly', '0 9 * * 1');
```

### `removeFromGroup(group, name)`

Remove a named entry. Returns a new group object.

```js
const smaller = removeFromGroup(group, 'hourly');
```

### `groupNextRuns(group, from?)`

Get the next run time for every expression in the group.

```js
const runs = groupNextRuns(group, new Date());
// [
//   { name: 'daily', expression: '0 9 * * *', nextRun: Date },
//   { name: 'hourly', expression: '0 * * * *', nextRun: Date },
// ]
```

### `sortGroupByNextRun(group, from?)`

Return group entries sorted by their next run time (earliest first).

```js
const sorted = sortGroupByNextRun(group);
```

### `listGroupNames(group)`

Return an array of all names in the group.

```js
listGroupNames(group); // ['daily', 'hourly']
```

## Notes

- Groups are plain objects (`{ name: expression }`) — easy to serialize/store.
- All mutating operations return new objects; originals are never modified.
