import { fieldOverlaps, canOverlap, overlapSummary } from './overlap.js';

describe('fieldOverlaps', () => {
  test('returns overlapping values per field', () => {
    const a = { minute: '0', hour: '9-17', dom: '*', month: '*', dow: '1-5' };
    const b = { minute: '0', hour: '12-18', dom: '*', month: '*', dow: '1-3' };
    const result = fieldOverlaps(a, b);
    expect(result.minute).toEqual([0]);
    expect(result.hour).toEqual([12, 13, 14, 15, 16, 17]);
    expect(result.dow).toEqual([1, 2, 3]);
  });

  test('wildcard fields overlap fully', () => {
    const a = { minute: '*', hour: '*', dom: '*', month: '*', dow: '*' };
    const b = { minute: '0', hour: '6', dom: '*', month: '*', dow: '*' };
    const result = fieldOverlaps(a, b);
    expect(result.minute).toContain(0);
    expect(result.hour).toContain(6);
  });
});

describe('canOverlap', () => {
  test('returns true for overlapping expressions', () => {
    expect(canOverlap('0 9-17 * * 1-5', '0 12 * * 1-3')).toBe(true);
  });

  test('returns false when minutes do not overlap', () => {
    expect(canOverlap('0 * * * *', '30 * * * *')).toBe(false);
  });

  test('returns false when hours do not overlap', () => {
    expect(canOverlap('0 9 * * *', '0 10 * * *')).toBe(false);
  });

  test('returns false when dow does not overlap', () => {
    expect(canOverlap('0 9 * * 1-3', '0 9 * * 4-5')).toBe(false);
  });

  test('identical expressions always overlap', () => {
    expect(canOverlap('*/5 * * * *', '*/5 * * * *')).toBe(true);
  });
});

describe('overlapSummary', () => {
  test('returns overlaps flag and conflicts list', () => {
    const result = overlapSummary('0 9 * * 1-5', '0 9 * * 1-5');
    expect(result.overlaps).toBe(true);
    expect(result.conflicts.length).toBeGreaterThan(0);
  });

  test('non-overlapping expressions have overlaps=false', () => {
    const result = overlapSummary('0 9 * * *', '0 10 * * *');
    expect(result.overlaps).toBe(false);
  });

  test('conflicts include field and values', () => {
    const result = overlapSummary('0 9-12 * * *', '0 11-15 * * *');
    const hourConflict = result.conflicts.find(c => c.field === 'hour');
    expect(hourConflict).toBeDefined();
    expect(hourConflict.values).toEqual([11, 12]);
  });
});
