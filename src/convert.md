# convert

Utilities for converting cron expressions between different formats.

## Functions

### `toSixField(expr, second?)`

Converts a standard 5-field cron expression to a 6-field expression by prepending a seconds field.

```js
toSixField('*/5 * * * *')        // => '0 */5 * * * *'
toSixField('0 12 * * 1', '30')   // => '30 0 12 * * 1'
```

### `toFiveField(expr)`

Converts a 6-field cron expression to a standard 5-field expression by dropping the seconds field.

```js
toFiveField('0 */5 * * * *')  // => '*/5 * * * *'
```

### `toNamedFields(expr)`

Converts a 5- or 6-field cron expression into an object with named keys.

**5-field keys:** `minute`, `hour`, `dayOfMonth`, `month`, `dayOfWeek`

**6-field keys:** `second`, `minute`, `hour`, `dayOfMonth`, `month`, `dayOfWeek`

```js
toNamedFields('*/5 * * * *')
// => { minute: '*/5', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' }
```

### `fromNamedFields(fields)`

Converts a named-field object back into a cron expression string. Automatically detects 5- or 6-field format based on the presence of a `second` key.

```js
fromNamedFields({ minute: '0', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '1-5' })
// => '0 9 * * 1-5'
```

## Notes

- All functions throw `TypeError` for non-string or non-object inputs.
- Field count mismatches throw a descriptive `Error`.
