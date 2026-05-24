# cronMath

Arithmetic operations on cron expressions — shift, offset, and adjust field values programmatically.

## Functions

### `shiftToken(token, offset, min, max)`

Shifts a single cron token (number, range, or step) by `offset`, wrapping within `[min, max]`.

```js
shiftToken('5', 3, 0, 59)   // '8'
shiftToken('58', 3, 0, 59)  // '1'  (wraps)
shiftToken('*/5', 2, 0, 59) // '*/5' (wildcard base preserved)
```

### `shiftField(fieldStr, fieldName, offset)`

Shifts all comma-separated tokens in a field string.

```js
shiftField('0,15,30', 'minute', 5) // '5,20,35'
shiftField('22,23', 'hour', 3)     // '1,2'
```

### `shiftCron(expression, offsets)`

Shifts a full cron expression by per-field offsets. All offset keys are optional.

```js
shiftCron('0 9 * * *', { minute: 30 })       // '30 9 * * *'
shiftCron('0 9 1 * *', { hour: 1, dom: 2 })  // '0 10 3 * *'
```

### `addMinutes(expression, minutes)`

Adds a fixed number of minutes to a cron expression, adjusting both `minute` and `hour` fields. Only works when both fields are plain numbers.

```js
addMinutes('0 9 * * *', 30)   // '30 9 * * *'
addMinutes('45 9 * * *', 30)  // '15 10 * * *'
addMinutes('30 23 * * *', 60) // '30 0 * * *'
```

## Notes

- Wildcard (`*`) fields are never modified by `shiftToken`.
- `addMinutes` returns the original expression unchanged if `minute` or `hour` is not a plain integer.
- All shifts wrap within the valid range for the given field.
