const { cronparse } = require('./index');

describe('cronparse', () => {
  test('returns valid result for a standard expression', () => {
    const result = cronparse('0 9 * * 1');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.description).toBeTruthy();
  });

  test('returns invalid result for a bad expression', () => {
    const result = cronparse('99 99 * * *');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.description).toBeNull();
    expect(result.nextRuns).toHaveLength(0);
  });

  test('returns parsed object for valid expression', () => {
    const result = cronparse('*/5 * * * *');
    expect(result.parsed).toBeDefined();
    expect(result.parsed).toHaveProperty('minute');
  });

  test('returns nextRuns array with one entry by default', () => {
    const from = new Date('2024-01-15T08:00:00Z');
    const result = cronparse('0 9 * * *', { from });
    expect(result.nextRuns).toHaveLength(1);
    expect(result.nextRuns[0]).toBeInstanceOf(Date);
  });

  test('returns multiple nextRuns when previewCount is set', () => {
    const from = new Date('2024-01-15T08:00:00Z');
    const result = cronparse('0 9 * * *', { from, previewCount: 3 });
    expect(result.nextRuns).toHaveLength(3);
    // each subsequent run should be after the previous
    expect(result.nextRuns[1].getTime()).toBeGreaterThan(result.nextRuns[0].getTime());
    expect(result.nextRuns[2].getTime()).toBeGreaterThan(result.nextRuns[1].getTime());
  });

  test('expression is echoed back in result', () => {
    const expr = '30 6 * * 1-5';
    const result = cronparse(expr);
    expect(result.expression).toBe(expr);
  });
});
