# timezone

Timezone-aware utilities for cron next-run calculations.

## Functions

### `isValidTimezone(tz)`

Returns `true` if the given string is a valid IANA timezone identifier.

```js
isValidTimezone('America/New_York'); // true
isValidTimezone('Fake/Zone');        // false
```

### `toTimezone(date, tz)`

Converts a `Date` object to a new `Date` whose local fields (hours, minutes, etc.) reflect the given IANA timezone.

```js
const utc = new Date('2024-06-15T12:00:00Z');
const local = toTimezone(utc, 'America/New_York');
console.log(local.getHours()); // 8 (UTC-4 in summer)
```

Throws if the timezone is invalid.

### `nextRunInTimezone(expression, tz, from?)`

Returns the next run `Date` for a cron expression evaluated in the context of a specific timezone. Internally converts `from` to the target timezone before computing the next run.

```js
const next = nextRunInTimezone('0 9 * * 1-5', 'Europe/Berlin');
console.log(next); // Next weekday at 9am Berlin time
```

Throws if the timezone string is not valid.

### `listTimezones()`

Returns an array of supported IANA timezone strings using `Intl.supportedValuesOf`. Returns an empty array in environments that do not support this API.

```js
const zones = listTimezones();
console.log(zones.includes('Asia/Tokyo')); // true
```
