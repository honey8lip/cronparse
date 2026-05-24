# cronTemplate

Build cron expressions from reusable named templates with variable substitution.

## API

### `registerTemplate(name, pattern, vars?)`

Register a named template. `pattern` is a cron string where variable names act as placeholders. `vars` is an array of placeholder names.

```js
registerTemplate('daily-at', 'MINUTE HOUR * * *', ['MINUTE', 'HOUR']);
```

### `resolveTemplate(name, values)`

Substitute variables into the template and return a valid cron expression. Throws if a variable is missing or the result is invalid.

```js
resolveTemplate('daily-at', { MINUTE: '0', HOUR: '9' });
// => '0 9 * * *'

resolveTemplate('every-n-minutes', { N: '15' });
// => '*/15 * * * *'
```

### `isTemplate(name)`

Returns `true` if the template is registered.

### `removeTemplate(name)`

Removes a template by name. Returns `true` if it existed.

### `listTemplates()`

Returns an array of all registered template names.

### `getTemplate(name)`

Returns `{ pattern, vars }` for the given template, or `null` if not found.

## Built-in Templates

| Name | Pattern | Variables |
|---|---|---|
| `every-n-minutes` | `*/N * * * *` | `N` |
| `daily-at` | `MINUTE HOUR * * *` | `MINUTE`, `HOUR` |
| `weekly-on` | `MINUTE HOUR * * DOW` | `MINUTE`, `HOUR`, `DOW` |
| `monthly-on` | `MINUTE HOUR DOM * *` | `MINUTE`, `HOUR`, `DOM` |

## Notes

- Resolved expressions are validated before being returned.
- Variable names are replaced globally using `String.replace` with a `RegExp`.
- Custom templates can override built-in names.
