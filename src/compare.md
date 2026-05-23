# compare

Compare two cron expressions to determine their scheduling relationship.

## API

### `fieldsEqual(a, b)`

Checks whether two cron field expressions are semantically equivalent — i.e., they match the same set of values.

```js
import { fieldsEqual } from './compare.js';

fieldsEqual('1,2,3', '1-3'); // true
fieldsEqual('*/2', '0,2,4,...'); // true
fieldsEqual('5', '6');         // false
```

### `compareCron(exprA, exprB)`

Compares two full cron expressions and returns a string describing their relationship:

| Result | Meaning |
|--------|---------|
| `'equal'` | Both expressions match the exact same schedule |
| `'subset'` | `exprA` fires only on times that `exprB` also fires |
| `'superset'` | `exprA` fires on all times `exprB` fires, plus more |
| `'overlap'` | Both fire at some common times, but neither contains the other |
| `'disjoint'` | The two expressions never fire at the same time |

```js
import { compareCron } from './compare.js';

compareCron('0 9 * * *', '0 9 * * 1');  // 'superset'
compareCron('0 9 * * 1', '0 9 * * 2');  // 'disjoint'
compareCron('0 9,10 * * *', '0 10,11 * * *'); // 'overlap'
```

## Notes

- Field expansion handles `,` lists, `-` ranges, and `/` steps.
- Wildcard `*` fields are treated as matching all possible values in context.
- Comparison is field-by-field; cross-field interactions (e.g. day + weekday OR logic) are not modeled.
