const { formatFieldValue, toSummary, toExpression } = require('./formatter');

describe('formatFieldValue', () => {
  test('wildcard returns every <field>', () => {
    expect(formatFieldValue('*', 'minute')).toBe('every minute');
    expect(formatFieldValue('*', 'hour')).toBe('every hour');
  });

  test('step value returns every N <field>s', () => {
    expect(formatFieldValue('*/5', 'minute')).toBe('every 5 minutes');
    expect(formatFieldValue('*/2', 'hour')).toBe('every 2 hours');
  });

  test('range returns start through end', () => {
    expect(formatFieldValue('1-5', 'dayOfWeek')).toBe('Monday through Friday');
    expect(formatFieldValue('3-6', 'month')).toBe('March through June');
    expect(formatFieldValue('9-17', 'hour')).toBe('9 through 17');
  });

  test('list returns comma-separated with and', () => {
    expect(formatFieldValue('1,3,5', 'dayOfWeek')).toBe('Monday, Wednesday and Friday');
    expect(formatFieldValue('1,6', 'month')).toBe('January and June');
    expect(formatFieldValue('0,30', 'minute')).toBe('0 and 30');
  });

  test('single month value returns month name', () => {
    expect(formatFieldValue('1', 'month')).toBe('January');
    expect(formatFieldValue('12', 'month')).toBe('December');
  });

  test('single dayOfWeek value returns day name', () => {
    expect(formatFieldValue('0', 'dayOfWeek')).toBe('Sunday');
    expect(formatFieldValue('5', 'dayOfWeek')).toBe('Friday');
  });

  test('plain numeric value returns as-is for minute/hour', () => {
    expect(formatFieldValue('30', 'minute')).toBe('30');
    expect(formatFieldValue('9', 'hour')).toBe('9');
  });

  test('throws on null or undefined value', () => {
    expect(() => formatFieldValue(null, 'minute')).toThrow();
    expect(() => formatFieldValue(undefined, 'hour')).toThrow();
  });

  test('throws on unrecognized field name', () => {
    expect(() => formatFieldValue('*', 'second')).toThrow();
    expect(() => formatFieldValue('5', 'year')).toThrow();
  });
});

describe('toSummary', () => {
  test('returns summary object with raw and label for each field', () => {
    const parsed = { minute: '*/5', hour: '9', dayOfMonth: '*', month: '1', dayOfWeek: '1-5' };
    const summary = toSummary(parsed);
    expect(summary.minute.raw).toBe('*/5');
    expect(summary.minute.label).toBe('every 5 minutes');
    expect(summary.month.label).toBe('January');
    expect(summary.dayOfWeek.label).toBe('Monday through Friday');
  });
});

describe('toExpression', () => {
  test('reconstructs cron string from parsed object', () => {
    const parsed = { minute: '0', hour: '12', dayOfMonth: '*', month: '*', dayOfWeek: '1' };
    expect(toExpression(parsed)).toBe('0 12 * * 1');
  });

  test('falls back to * for missing fields', () => {
    const parsed = { minute: '0', hour: '6', dayOfMonth: '*', month: '*', dayOfWeek: undefined };
    expect(toExpression(parsed)).toBe('0 6 * * *');
  });
});
