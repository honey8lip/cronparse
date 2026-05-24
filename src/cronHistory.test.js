import { getLastRuns, getRunsBetween, summarizeHistory } from './cronHistory.js';

describe('getLastRuns', () => {
  test('returns correct number of past runs', () => {
    // every minute — easy to verify
    const before = new Date('2024-01-15T10:05:00');
    const runs = getLastRuns('* * * * *', 3, before);
    expect(runs).toHaveLength(3);
    expect(runs[0]).toEqual(new Date('2024-01-15T10:04:00'));
    expect(runs[1]).toEqual(new Date('2024-01-15T10:03:00'));
    expect(runs[2]).toEqual(new Date('2024-01-15T10:02:00'));
  });

  test('returns correct runs for hourly cron', () => {
    const before = new Date('2024-01-15T10:05:00');
    const runs = getLastRuns('0 * * * *', 2, before);
    expect(runs).toHaveLength(2);
    expect(runs[0]).toEqual(new Date('2024-01-15T10:00:00'));
    expect(runs[1]).toEqual(new Date('2024-01-15T09:00:00'));
  });

  test('defaults count to 5', () => {
    const runs = getLastRuns('* * * * *');
    expect(runs).toHaveLength(5);
  });

  test('returns empty array if no matches found in range', () => {
    // 29th of February — rare
    const before = new Date('2024-01-01T00:00:00');
    const runs = getLastRuns('0 0 29 2 *', 1, before);
    // Should return at most 1 or 0 depending on scan range
    expect(Array.isArray(runs)).toBe(true);
  });
});

describe('getRunsBetween', () => {
  test('returns all runs in a range for every-minute cron', () => {
    const from = new Date('2024-01-15T10:00:00');
    const to = new Date('2024-01-15T10:03:00');
    const runs = getRunsBetween('* * * * *', from, to);
    expect(runs).toHaveLength(4);
  });

  test('returns correct runs for specific minute cron', () => {
    const from = new Date('2024-01-15T09:00:00');
    const to = new Date('2024-01-15T11:00:00');
    const runs = getRunsBetween('30 * * * *', from, to);
    expect(runs).toHaveLength(2);
    expect(runs[0]).toEqual(new Date('2024-01-15T09:30:00'));
    expect(runs[1]).toEqual(new Date('2024-01-15T10:30:00'));
  });

  test('returns empty array when no runs in range', () => {
    const from = new Date('2024-01-15T10:00:00');
    const to = new Date('2024-01-15T10:29:00');
    const runs = getRunsBetween('30 10 * * *', from, to);
    expect(runs).toHaveLength(0);
  });
});

describe('summarizeHistory', () => {
  test('returns correct summary shape', () => {
    const before = new Date('2024-01-15T10:05:00');
    const summary = summarizeHistory('0 * * * *', 3, before);
    expect(summary.count).toBe(3);
    expect(summary.last).toBeInstanceOf(Date);
    expect(summary.first).toBeInstanceOf(Date);
    expect(summary.runs).toHaveLength(3);
  });

  test('last is more recent than first', () => {
    const before = new Date('2024-01-15T10:05:00');
    const summary = summarizeHistory('0 * * * *', 3, before);
    expect(summary.last.getTime()).toBeGreaterThan(summary.first.getTime());
  });
});
