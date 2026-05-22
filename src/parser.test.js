const { parseCron, parseField } = require('./parser');

describe('parseCron', () => {
  test('parses a standard cron expression into 5 fields', () => {
    const result = parseCron('0 9 * * 1');
    expect(result).toHaveLength(5);
    expect(result[0].field).toBe('minute');
    expect(result[1].field).toBe('hour');
    expect(result[4].field).toBe('weekday');
  });

  test('throws on wrong number of fields', () => {
    expect(() => parseCron('* * *')).toThrow('Expected 5 fields');
  });

  test('throws on non-string input', () => {
    expect(() => parseCron(42)).toThrow('Expression must be a string');
  });

  test('parses wildcard field', () => {
    const [field] = parseCron('* 0 * * *');
    expect(field.parts[0].type).toBe('wildcard');
  });

  test('parses range field', () => {
    const result = parseCron('0 9-17 * * *');
    expect(result[1].parts[0]).toMatchObject({ type: 'range', from: '9', to: '17' });
  });

  test('parses step field', () => {
    const result = parseCron('*/15 * * * *');
    expect(result[0].parts[0]).toMatchObject({ type: 'step', base: '*', step: 15 });
  });

  test('parses comma-separated values', () => {
    const result = parseCron('0 8,12,18 * * *');
    expect(result[1].parts).toHaveLength(3);
    expect(result[1].parts[1]).toMatchObject({ type: 'value', value: '12' });
  });

  test('resolves month name aliases', () => {
    const result = parseCron('0 0 1 jan *');
    expect(result[3].parts[0]).toMatchObject({ type: 'value', value: '1' });
  });

  test('resolves weekday name aliases', () => {
    const result = parseCron('0 0 * * mon');
    expect(result[4].parts[0]).toMatchObject({ type: 'value', value: '1' });
  });
});
