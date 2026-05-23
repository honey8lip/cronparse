const {
  expandAlias,
  normalizeWhitespace,
  fillDefaults,
  normalize,
} = require('./normalize');

describe('expandAlias', () => {
  test('expands @daily', () => {
    expect(expandAlias('@daily')).toBe('0 0 * * *');
  });

  test('expands @yearly and @annually to same value', () => {
    expect(expandAlias('@yearly')).toBe(expandAlias('@annually'));
  });

  test('expands @hourly', () => {
    expect(expandAlias('@hourly')).toBe('0 * * * *');
  });

  test('returns null for non-alias', () => {
    expect(expandAlias('0 * * * *')).toBeNull();
  });

  test('is case-insensitive', () => {
    expect(expandAlias('@DAILY')).toBe('0 0 * * *');
  });
});

describe('normalizeWhitespace', () => {
  test('trims leading/trailing whitespace', () => {
    expect(normalizeWhitespace('  0 * * * *  ')).toBe('0 * * * *');
  });

  test('collapses multiple spaces', () => {
    expect(normalizeWhitespace('0  *   *  *  *')).toBe('0 * * * *');
  });
});

describe('fillDefaults', () => {
  test('does not change a 5-field array', () => {
    expect(fillDefaults(['0', '1', '2', '3', '4'])).toEqual(['0', '1', '2', '3', '4']);
  });

  test('fills missing fields with *', () => {
    expect(fillDefaults(['0', '0'])).toEqual(['0', '0', '*', '*', '*']);
  });

  test('handles empty array', () => {
    expect(fillDefaults([])).toEqual(['*', '*', '*', '*', '*']);
  });
});

describe('normalize', () => {
  test('normalizes a standard expression', () => {
    const result = normalize('0 0 * * *');
    expect(result.expression).toBe('0 0 * * *');
    expect(result.wasAlias).toBe(false);
  });

  test('expands alias and flags wasAlias', () => {
    const result = normalize('@daily');
    expect(result.expression).toBe('0 0 * * *');
    expect(result.wasAlias).toBe(true);
  });

  test('fills missing fields', () => {
    const result = normalize('0 0');
    expect(result.fields).toHaveLength(5);
    expect(result.expression).toBe('0 0 * * *');
  });

  test('throws on non-string input', () => {
    expect(() => normalize(42)).toThrow(TypeError);
  });
});
