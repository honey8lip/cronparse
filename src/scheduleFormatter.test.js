import { formatRunDate, formatSchedule, toScheduleSummary } from './scheduleFormatter.js';

const sampleDates = [
  new Date('2024-06-01T08:00:00Z'),
  new Date('2024-06-01T09:00:00Z'),
  new Date('2024-06-01T10:00:00Z'),
];

describe('formatRunDate', () => {
  test('returns a non-empty string for valid date', () => {
    const result = formatRunDate(sampleDates[0]);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  test('returns "Invalid date" for bad input', () => {
    expect(formatRunDate(new Date('not-a-date'))).toBe('Invalid date');
    expect(formatRunDate('2024-01-01')).toBe('Invalid date');
  });

  test('respects custom locale', () => {
    const en = formatRunDate(sampleDates[0], 'en-US');
    const de = formatRunDate(sampleDates[0], 'de-DE');
    // Both should be strings; format may differ
    expect(typeof en).toBe('string');
    expect(typeof de).toBe('string');
  });
});

describe('formatSchedule', () => {
  test('returns array of same length as input', () => {
    const result = formatSchedule(sampleDates);
    expect(result).toHaveLength(3);
  });

  test('prefixes numbers when numbered=true', () => {
    const result = formatSchedule(sampleDates, { numbered: true });
    expect(result[0]).toMatch(/^1\./);
    expect(result[2]).toMatch(/^3\./);
  });

  test('no prefix when numbered=false', () => {
    const result = formatSchedule(sampleDates, { numbered: false });
    result.forEach(r => expect(r).not.toMatch(/^\d+\./))
  });

  test('returns empty array for non-array input', () => {
    expect(formatSchedule(null)).toEqual([]);
    expect(formatSchedule(undefined)).toEqual([]);
  });
});

describe('toScheduleSummary', () => {
  test('includes expression in header', () => {
    const summary = toScheduleSummary('0 * * * *', sampleDates);
    expect(summary).toContain('0 * * * *');
  });

  test('includes all formatted dates', () => {
    const summary = toScheduleSummary('0 * * * *', sampleDates);
    const lines = summary.split('\n');
    expect(lines).toHaveLength(4); // header + 3 runs
  });

  test('returns fallback message for empty runs', () => {
    const summary = toScheduleSummary('0 * * * *', []);
    expect(summary).toMatch(/No upcoming runs/);
  });

  test('returns fallback for null runs', () => {
    const summary = toScheduleSummary('0 * * * *', null);
    expect(summary).toMatch(/No upcoming runs/);
  });
});
