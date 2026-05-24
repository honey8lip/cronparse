import { formatRunEntry, formatHistoryList, toHistorySummary } from './historyFormatter.js';

describe('formatRunEntry', () => {
  test('formats a date correctly', () => {
    const d = new Date('2024-03-07T14:05:00');
    expect(formatRunEntry(d, 1)).toBe('#1  2024-03-07 14:05');
  });

  test('pads single-digit month, day, hour, minute', () => {
    const d = new Date('2024-01-02T03:04:00');
    expect(formatRunEntry(d, 2)).toBe('#2  2024-01-02 03:04');
  });

  test('defaults index to 1', () => {
    const d = new Date('2024-06-15T09:30:00');
    expect(formatRunEntry(d)).toContain('#1');
  });
});

describe('formatHistoryList', () => {
  test('returns no-runs message for empty array', () => {
    expect(formatHistoryList([])).toBe('No past runs found.');
  });

  test('returns no-runs message for null', () => {
    expect(formatHistoryList(null)).toBe('No past runs found.');
  });

  test('formats multiple runs', () => {
    const dates = [
      new Date('2024-01-15T10:00:00'),
      new Date('2024-01-15T09:00:00'),
    ];
    const result = formatHistoryList(dates);
    expect(result).toContain('#1  2024-01-15 10:00');
    expect(result).toContain('#2  2024-01-15 09:00');
  });

  test('each entry is on its own line', () => {
    const dates = [
      new Date('2024-01-15T10:00:00'),
      new Date('2024-01-15T09:00:00'),
    ];
    const lines = formatHistoryList(dates).split('\n');
    expect(lines).toHaveLength(2);
  });
});

describe('toHistorySummary', () => {
  test('includes expression in output', () => {
    const before = new Date('2024-01-15T10:05:00');
    const result = toHistorySummary('0 * * * *', 2, before);
    expect(result).toContain('0 * * * *');
  });

  test('includes run count', () => {
    const before = new Date('2024-01-15T10:05:00');
    const result = toHistorySummary('0 * * * *', 2, before);
    expect(result).toContain('2');
  });

  test('includes most recent and oldest labels', () => {
    const before = new Date('2024-01-15T10:05:00');
    const result = toHistorySummary('0 * * * *', 3, before);
    expect(result).toContain('Most recent');
    expect(result).toContain('Oldest shown');
  });

  test('handles no-history case gracefully', () => {
    // Very rare expression, before a date where it won't have fired
    const before = new Date('2024-01-01T00:00:00');
    const result = toHistorySummary('0 0 29 2 *', 1, before);
    expect(typeof result).toBe('string');
  });
});
