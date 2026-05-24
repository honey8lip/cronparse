# cronAlias

Manage builtin and user-defined cron aliases like `@daily`, `@hourly`, and custom ones.

## API

### `registerAlias(name, expression)`

Register a custom alias. The name must start with `@`.

```js
registerAlias('@workdays', '0 9 * * 1-5');
```

### `removeAlias(name)`

Remove a user-defined alias. Returns `true` if removed, `false` if not found.

```js
removeAlias('@workdays'); // true
```

### `resolveAlias(name)`

Resolve an alias to its cron expression. Returns `null` if not found.
User-defined aliases take precedence over builtins.

```js
resolveAlias('@daily');     // '0 0 * * *'
resolveAlias('@workdays');  // '0 9 * * 1-5'
resolveAlias('@unknown');   // null
```

### `isAlias(name)`

Check whether a string is a known alias.

```js
isAlias('@monthly'); // true
isAlias('0 * * * *'); // false
```

### `listAliases()`

Return all aliases (builtin + user) as an array of objects:

```js
[
  { name: '@daily', expression: '0 0 * * *', source: 'builtin' },
  { name: '@workdays', expression: '0 9 * * 1-5', source: 'user' },
]
```

### `clearUserAliases()`

Remove all user-defined aliases (useful for testing or reset).

## Built-in Aliases

| Alias        | Expression    |
|--------------|---------------|
| `@yearly`    | `0 0 1 1 *`   |
| `@annually`  | `0 0 1 1 *`   |
| `@monthly`   | `0 0 1 * *`   |
| `@weekly`    | `0 0 * * 0`   |
| `@daily`     | `0 0 * * *`   |
| `@midnight`  | `0 0 * * *`   |
| `@hourly`    | `0 * * * *`   |
