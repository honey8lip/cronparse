const { isValidTimezone, toTimezone, nextRunInTimezone } = require('./timezone');

describe('isValidTimezone', () => {
  test('returns true for valid timezone', () => {
    expect(isValidTimezone('America/New_York')).toBe(true);
    expect(isValidTimezone('Europe/London')).toBe(true);
    expect(isValidTimezone('UTC')).toBe(true);
  });

  test('returns false for invalid timezone', () => {
    expect(isValidTimezone('Mars/Olympus')).toBe(false);
    expect(isValidTimezone('')).toBe(false);
    expect(isValidTimezone('Fake/Zone')).toBe(false);
  });
});

describe('toTimezone', () => {
  test('converts a UTC date to a timezone-local date object', () => {
    const utc = new Date('2024-06-15T12:00:00Z');
    const result = toTimezone(utc, 'UTC');
    expect(result).toBeInstanceOf(Date);
    expect(result.getHours()).toBe(12);
    expect(result.getMinutes()).toBe(0);
  });

  test('throws for invalid timezone', () => {
    const date = new Date();
    expect(() => toTimezone(date, 'Not/Valid')).toThrow('Invalid timezone');
  });

  test('returns correct local time for America/New_York (UTC-5 in winter)', () => {
    const utc = new Date('2024-01-15T17:00:00Z'); // noon EST
    const result = toTimezone(utc, 'America/New_York');
    expect(result.getHours()).toBe(12);
  });
});

describe('nextRunInTimezone', () => {
  test('returns a Date for a valid expression and timezone', () => {
    const result = nextRunInTimezone('*/5 * * * *', 'UTC', new Date('2024-01-01T00:00:00Z'));
    expect(result).toBeInstanceOf(Date);
  });

  test('throws for invalid timezone', () => {
    expect(() => nextRunInTimezone('* * * * *', 'Bad/Zone')).toThrow('Invalid timezone');
  });

  test('next run is in the future relative to from date', () => {
    const from = new Date('2024-03-10T08:00:00Z');
    const result = nextRunInTimezone('0 9 * * *', 'UTC', from);
    expect(result).not.toBeNull();
    expect(result.getTime()).toBeGreaterThan(from.getTime());
  });
});
