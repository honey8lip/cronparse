const { expandField, rangesEqual, rangeIntersect } = require('./range');

describe('expandField', () => {
  test('wildcard expands to full range for minute', () => {
    const result = expandField('*', 'minute');
    expect(result).toHaveLength(60);
    expect(result[0]).toBe(0);
    expect(result[59]).toBe(59);
  });

  test('single value', () => {
    expect(expandField('5', 'hour')).toEqual([5]);
  });

  test('range token', () => {
    expect(expandField('1-4', 'dom')).toEqual([1, 2, 3, 4]);
  });

  test('step on wildcard', () => {
    expect(expandField('*/15', 'minute')).toEqual([0, 15, 30, 45]);
  });

  test('step on range', () => {
    expect(expandField('0-12/4', 'hour')).toEqual([0, 4, 8, 12]);
  });

  test('comma-separated list', () => {
    expect(expandField('1,3,5', 'dow')).toEqual([1, 3, 5]);
  });

  test('mixed comma and range', () => {
    expect(expandField('1-3,7', 'month')).toEqual([1, 2, 3, 7]);
  });

  test('deduplicates values', () => {
    expect(expandField('1,1,2', 'minute')).toEqual([1, 2]);
  });

  test('throws for unknown field', () => {
    expect(() => expandField('*', 'second')).toThrow('Unknown field: second');
  });
});

describe('rangesEqual', () => {
  test('equivalent expressions are equal', () => {
    expect(rangesEqual('*/2', '0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58', 'minute')).toBe(true);
  });

  test('different fields are not equal', () => {
    expect(rangesEqual('1-3', '1-4', 'dom')).toBe(false);
  });

  test('same literal values are equal', () => {
    expect(rangesEqual('5', '5', 'hour')).toBe(true);
  });
});

describe('rangeIntersect', () => {
  test('intersects two ranges', () => {
    expect(rangeIntersect('1-5', '3-7', 'dom')).toEqual([3, 4, 5]);
  });

  test('no overlap returns empty array', () => {
    expect(rangeIntersect('1-3', '5-7', 'dow')).toEqual([]);
  });

  test('wildcard intersected with specific', () => {
    expect(rangeIntersect('*', '6,12,18', 'hour')).toEqual([6, 12, 18]);
  });
});
