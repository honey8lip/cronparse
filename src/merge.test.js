const { mergeField, mergeCron } = require('./merge');

describe('mergeField', () => {
  test('union of two value arrays', () => {
    expect(mergeField(['1', '2'], ['2', '3'], 'union')).toEqual(['1', '2', '3']);
  });

  test('union with wildcard returns wildcard', () => {
    expect(mergeField(['*'], ['1', '2'], 'union')).toEqual(['*']);
    expect(mergeField(['1', '2'], ['*'], 'union')).toEqual(['*']);
  });

  test('intersection of two value arrays', () => {
    expect(mergeField(['1', '2', '3'], ['2', '3', '4'], 'intersection')).toEqual(['2', '3']);
  });

  test('intersection with wildcard defers to the other side', () => {
    expect(mergeField(['*'], ['1', '5'], 'intersection')).toEqual(['1', '5']);
    expect(mergeField(['1', '5'], ['*'], 'intersection')).toEqual(['1', '5']);
  });

  test('intersection with no common values returns wildcard fallback', () => {
    expect(mergeField(['1'], ['2'], 'intersection')).toEqual(['*']);
  });

  test('throws on unknown strategy', () => {
    expect(() => mergeField(['1'], ['2'], 'xor')).toThrow('Unknown merge strategy');
  });
});

describe('mergeCron', () => {
  test('union of two simple expressions', () => {
    const { expression } = mergeCron('0 9 * * 1', '0 17 * * 5', 'union');
    expect(expression).toBe('0 9,17 * * 1,5');
  });

  test('intersection narrows fields', () => {
    const { expression } = mergeCron('0,30 9 * * 1,2', '0,30 9 * * 2,3', 'intersection');
    expect(expression).toBe('0,30 9 * * 2');
  });

  test('merged object has all five fields', () => {
    const { merged } = mergeCron('* * * * *', '0 0 * * *', 'union');
    expect(Object.keys(merged)).toEqual(['minute', 'hour', 'dom', 'month', 'dow']);
  });

  test('defaults to union strategy', () => {
    const { expression } = mergeCron('0 6 * * *', '0 18 * * *');
    expect(expression).toBe('0 6,18 * * *');
  });
});
