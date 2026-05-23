const { audit, WARNINGS } = require('./audit');

describe('audit', () => {
  test('returns valid for a well-formed expression', () => {
    const result = audit('0 9 * * 1');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('returns invalid for a malformed expression', () => {
    const result = audit('invalid expression');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('warns when expression runs every minute', () => {
    const result = audit('* * * * *');
    expect(result.valid).toBe(true);
    expect(result.warnings).toContain(WARNINGS.ALWAYS_RUNS);
  });

  test('warns when both dom and dow are specified', () => {
    const result = audit('0 9 15 * 1');
    expect(result.valid).toBe(true);
    expect(result.warnings).toContain(WARNINGS.DOM_AND_DOW);
  });

  test('warns when expression runs more than once per hour via wildcard minute', () => {
    const result = audit('* 9 * * *');
    expect(result.warnings).toContain(WARNINGS.FREQUENT_RUNS);
  });

  test('warns when expression runs frequently via small step', () => {
    const result = audit('*/5 * * * *');
    expect(result.warnings).toContain(WARNINGS.FREQUENT_RUNS);
  });

  test('does not warn about frequent runs for */15', () => {
    const result = audit('*/15 9 * * *');
    expect(result.warnings).not.toContain(WARNINGS.FREQUENT_RUNS);
  });

  test('warns when aliases are used', () => {
    const result = audit('0 9 * jan mon');
    expect(result.warnings).toContain(WARNINGS.DEPRECATED_ALIAS);
  });

  test('returns parsed field info on valid expression', () => {
    const result = audit('30 6 * * *');
    expect(result.valid).toBe(true);
    expect(result.info.fields).toBeDefined();
    expect(result.info.fieldCount).toBeGreaterThan(0);
  });

  test('returns no warnings for a clean low-frequency expression', () => {
    const result = audit('0 3 * * *');
    expect(result.valid).toBe(true);
    expect(result.warnings).toHaveLength(0);
  });
});
