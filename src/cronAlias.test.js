const {
  registerAlias,
  removeAlias,
  resolveAlias,
  isAlias,
  listAliases,
  clearUserAliases,
} = require('./cronAlias');

beforeEach(() => clearUserAliases());

describe('resolveAlias', () => {
  test('resolves builtin @daily', () => {
    expect(resolveAlias('@daily')).toBe('0 0 * * *');
  });

  test('resolves builtin @hourly', () => {
    expect(resolveAlias('@hourly')).toBe('0 * * * *');
  });

  test('returns null for unknown alias', () => {
    expect(resolveAlias('@unknown')).toBeNull();
  });

  test('resolves user-defined alias', () => {
    registerAlias('@workdays', '0 9 * * 1-5');
    expect(resolveAlias('@workdays')).toBe('0 9 * * 1-5');
  });

  test('user alias overrides builtin if same name', () => {
    registerAlias('@daily', '0 6 * * *');
    expect(resolveAlias('@daily')).toBe('0 6 * * *');
  });
});

describe('isAlias', () => {
  test('returns true for builtin aliases', () => {
    expect(isAlias('@monthly')).toBe(true);
  });

  test('returns false for non-alias strings', () => {
    expect(isAlias('0 * * * *')).toBe(false);
  });

  test('returns true for registered user alias', () => {
    registerAlias('@nightly', '0 2 * * *');
    expect(isAlias('@nightly')).toBe(true);
  });
});

describe('registerAlias', () => {
  test('throws if name does not start with @', () => {
    expect(() => registerAlias('daily', '0 0 * * *')).toThrow();
  });

  test('throws if expression is empty', () => {
    expect(() => registerAlias('@test', '')).toThrow();
  });
});

describe('removeAlias', () => {
  test('removes a user alias and returns true', () => {
    registerAlias('@temp', '*/5 * * * *');
    expect(removeAlias('@temp')).toBe(true);
    expect(resolveAlias('@temp')).toBeNull();
  });

  test('returns false for non-existent alias', () => {
    expect(removeAlias('@ghost')).toBe(false);
  });
});

describe('listAliases', () => {
  test('includes builtin aliases', () => {
    const names = listAliases().map(a => a.name);
    expect(names).toContain('@daily');
    expect(names).toContain('@hourly');
  });

  test('includes user-defined aliases with source=user', () => {
    registerAlias('@custom', '30 8 * * 1-5');
    const entry = listAliases().find(a => a.name === '@custom');
    expect(entry).toBeDefined();
    expect(entry.source).toBe('user');
    expect(entry.expression).toBe('30 8 * * 1-5');
  });

  test('builtin entries have source=builtin', () => {
    const entry = listAliases().find(a => a.name === '@weekly');
    expect(entry.source).toBe('builtin');
  });
});
