# matchers

Field-level pattern matching utilities for cron expressions.

## Functions

### `matchesToken(value, token)`

Checks whether a numeric `value` matches a single cron token such as `*`, `5`, `1-5`, or `*/2`.

```js
matchesToken(3, '1-5');  // true
matchesToken(6, '*/2');  // true
matchesToken(3, '*/2');  // false
```

### `matchesFieldValue(value, fieldStr)`

Checks whether a numeric `value` matches a full cron field string (may include commas).

```js
matchesFieldValue(3, '1,3,5');   // true
matchesFieldValue(4, '1,3,5');   // false
matchesFieldValue(30, '*/15');   // true
```

### `matchingValues(fieldStr, min, max)`

Returns all integers in `[min, max]` that match the given field string.

```js
matchingValues('*/15', 0, 59);  // [0, 15, 30, 45]
matchingValues('1-3', 0, 59);   // [1, 2, 3]
```

### `fieldsMatch(fieldA, fieldB, min, max)`

Returns `true` if both field strings match exactly the same set of values.

```js
fieldsMatch('1,2,3', '1-3', 0, 59);  // true
```

### `isSubsetOf(fieldA, fieldB, min, max)`

Returns `true` if every value matched by `fieldA` is also matched by `fieldB`.

```js
isSubsetOf('1,3', '1-5', 0, 59);  // true
```

### `fieldOverlap(fieldA, fieldB, min, max)`

Returns the array of values matched by both field strings.

```js
fieldOverlap('1-5', '3-7', 0, 59);  // [3, 4, 5]
```
