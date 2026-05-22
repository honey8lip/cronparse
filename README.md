# cronparse

> Human-readable cron expression parser and validator with next-run preview

---

## Installation

```bash
npm install cronparse
```

## Usage

```javascript
import { parse, validate, nextRun } from 'cronparse';

// Parse a cron expression into a human-readable description
const description = parse('0 9 * * 1-5');
console.log(description);
// → "At 09:00, Monday through Friday"

// Validate a cron expression
const isValid = validate('*/15 * * * *');
console.log(isValid); // → true

// Preview the next scheduled run times
const upcoming = nextRun('30 8 * * 1', { count: 3 });
console.log(upcoming);
// → [
//     2024-03-04T08:30:00.000Z,
//     2024-03-11T08:30:00.000Z,
//     2024-03-18T08:30:00.000Z
//   ]
```

### Supported Syntax

| Expression    | Description                  |
|---------------|------------------------------|
| `* * * * *`   | Every minute                 |
| `0 0 * * *`   | Every day at midnight        |
| `*/5 * * * *` | Every 5 minutes              |
| `0 9 * * 1-5` | Weekdays at 9:00 AM          |

## API

- **`parse(expression)`** — Returns a human-readable string for the given cron expression.
- **`validate(expression)`** — Returns `true` if the expression is valid, `false` otherwise.
- **`nextRun(expression, options?)`** — Returns an array of upcoming `Date` objects.

## License

[MIT](./LICENSE)