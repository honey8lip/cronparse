import { getSchedule, getScheduleInRange } from './schedule.js';

describe('getSchedule', () => {
  test('returns correct number of runs', () => {
    const { runs, errors } = getSchedule('* * * * *', 3, new Date('2024-01-01T00:00:00Z'));
    expect(errors).toHaveLength(0);
    expect(runs).toHaveLength(3);
  });

  test('runs are in ascending order', () => {
    const { runs } = getSchedule('0 * * * *', 5, new Date('2024-01-01T00:00:00Z'));
    for (let i = 1; i < runs.length; i++) {
      expect(runs[i] > runs[i - 1]).toBe(true);
    }
  });

  test('defaults count to 5', () => {
    const { runs } = getSchedule('* * * * *', undefined, new Date('2024-01-01T00:00:00Z'));
    expect(runs).toHaveLength(5);
  });

  test('returns errors for invalid expression', () => {
    const { runs, errors } = getSchedule('invalid cron');
    expect(runs).toHaveLength(0);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('rejects count out of range', () => {
    const { runs, errors } = getSchedule('* * * * *', 200);
    expect(runs).toHaveLength(0);
    expect(errors[0]).toMatch(/count/);
  });

  test('handles hourly cron correctly', () => {
    const from = new Date('2024-03-15T10:00:00Z');
    const { runs } = getSchedule('0 * * * *', 2, from);
    expect(runs[0].getUTCHours()).toBe(11);
    expect(runs[1].getUTCHours()).toBe(12);
  });
});

describe('getScheduleInRange', () => {
  test('returns runs within range', () => {
    const start = new Date('2024-01-01T00:00:00Z');
    const end = new Date('2024-01-01T01:00:00Z');
    const { runs, errors } = getScheduleInRange('* * * * *', start, end);
    expect(errors).toHaveLength(0);
    expect(runs.length).toBeGreaterThan(0);
    runs.forEach(r => {
      expect(r >= start).toBe(true);
      expect(r < end).toBe(true);
    });
  });

  test('returns error if start >= end', () => {
    const d = new Date();
    const { errors } = getScheduleInRange('* * * * *', d, d);
    expect(errors[0]).toMatch(/start must be before end/);
  });

  test('returns error for non-Date inputs', () => {
    const { errors } = getScheduleInRange('* * * * *', 'now', 'later');
    expect(errors[0]).toMatch(/Date objects/);
  });

  test('returns error for invalid expression', () => {
    const { errors } = getScheduleInRange('bad expr', new Date(), new Date(Date.now() + 60000));
    expect(errors.length).toBeGreaterThan(0);
  });
});
