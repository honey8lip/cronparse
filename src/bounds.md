# bounds

Field boundary definitions and value clamping utilities for cron fields.

## FIELD_BOUNDS

A map of field names to their `{ min, max, name }` descriptors.

Supported fields: `minute`, `hour`, `dom`, `month`, `dow`, `second`.

## getBounds(field)

Returns the `{ min, max, name }` object for the given field name.
Throws if the field is unknown.

```js
getBounds('hour'); // { min: 0, max: 23, name: 'hour' }
```

## clamp(field, value)

Clamps a numeric value to the valid range for the specified field.

```js
clamp('minute', -1);  // 0
clamp('hour', 99);    // 23
clamp('dom', 15);     // 15
```

## inBounds(field, value)

Returns `true` if `value` is an integer within the field's valid range.

```js
inBounds('minute', 30); // true
inBounds('hour', 24);   // false
```

## allValues(field)

Returns an array of every valid integer value for the field.

```js
allValues('month'); // [1, 2, 3, ..., 12]
```

## fieldLabel(field)

Returns the human-readable display name for a field.

```js
fieldLabel('dom'); // 'day of month'
fieldLabel('dow'); // 'day of week'
```
