const { describeField, formatValue, humanize } = require('./humanize');

describe('formatValue', () => {
  test('returns "every minute" for wildcard minute field', () => {
    expect(formatValue('*', 'minute')).toBe('every minute');
  });

  test('returns "every hour" for wildcard hour field', () => {
    expect(formatValue('*', 'hour')).toBe('every hour');
  });

  test('formats a specific minute value', () => {
    expect(formatValue('30', 'minute')).toBe('at minute 30');
  });

  test('formats a specific hour value', () => {
    expect(formatValue('9', 'hour')).toBe('at 9:00');
  });
});

describe('describeField', () => {
  test('describes a step expression', () => {
    expect(describeField('*/5', 'minute')).toBe('every 5 minutes');
  });

  test('describes a range expression', () => {
    expect(describeField('1-5', 'weekday')).toBe('Monday through Friday');
  });

  test('describes a list expression', () => {
    expect(describeField('1,3,5', 'weekday')).toBe('Monday, Wednesday, Friday');
  });

  test('returns wildcard description for *', () => {
    expect(describeField('*', 'month')).toBe('every month');
  });
});

describe('humanize', () => {
  test('humanizes a simple every-minute cron', () => {
    expect(humanize('* * * * *')).toBe('Every minute');
  });

  test('humanizes a daily cron at midnight', () => {
    expect(humanize('0 0 * * *')).toBe('Every day at 0:00');
  });

  test('humanizes a weekday-specific cron', () => {
    expect(humanize('0 9 * * 1')).toBe('Every Monday at 9:00');
  });

  test('humanizes a monthly cron', () => {
    expect(humanize('0 0 1 * *')).toBe('On day 1 of every month at 0:00');
  });

  test('returns error string for invalid expression', () => {
    expect(humanize('invalid')).toMatch(/invalid/i);
  });
});
