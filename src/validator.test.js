const { validate } = require('./validator');

describe('validate', () => {
  test('returns valid for a correct expression', () => {
    const result = validate('0 9 * * 1-5');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.parsed).not.toBeNull();
  });

  test('returns invalid for wrong field count', () => {
    const result = validate('* * *');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/Expected 5 fields/);
  });

  test('detects out-of-range minute', () => {
    const result = validate('99 * * * *');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/minute/);
    expect(result.errors[0]).toMatch(/out of range/);
  });

  test('detects out-of-range hour', () => {
    const result = validate('0 25 * * *');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/hour/);
  });

  test('detects invalid range (start > end)', () => {
    const result = validate('0 17-9 * * *');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/greater than end/);
  });

  test('detects invalid step value', () => {
    const result = validate('*/0 * * * *');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/step value must be a positive integer/);
  });

  test('accepts valid step expression', () => {
    expect(validate('*/5 * * * *').valid).toBe(true);
  });

  test('accepts valid month range with aliases', () => {
    expect(validate('0 0 1 jan-jun *').valid).toBe(true);
  });

  test('returns null parsed on invalid expression', () => {
    const result = validate('99 * * * *');
    expect(result.parsed).toBeNull();
  });
});
