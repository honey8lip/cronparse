const { getBounds, clamp, inBounds, allValues, fieldLabel, FIELD_BOUNDS } = require('./bounds');

describe('getBounds', () => {
  it('returns correct bounds for minute', () => {
    expect(getBounds('minute')).toEqual({ min: 0, max: 59, name: 'minute' });
  });

  it('returns correct bounds for month', () => {
    expect(getBounds('month')).toEqual({ min: 1, max: 12, name: 'month' });
  });

  it('returns correct bounds for dow', () => {
    expect(getBounds('dow')).toEqual({ min: 0, max: 7, name: 'day of week' });
  });

  it('throws for unknown field', () => {
    expect(() => getBounds('year')).toThrow('Unknown field: "year"');
  });
});

describe('clamp', () => {
  it('clamps value below min to min', () => {
    expect(clamp('minute', -5)).toBe(0);
  });

  it('clamps value above max to max', () => {
    expect(clamp('hour', 99)).toBe(23);
  });

  it('returns value unchanged when in range', () => {
    expect(clamp('dom', 15)).toBe(15);
  });

  it('clamps month lower bound', () => {
    expect(clamp('month', 0)).toBe(1);
  });
});

describe('inBounds', () => {
  it('returns true for valid value', () => {
    expect(inBounds('minute', 30)).toBe(true);
  });

  it('returns false for out-of-range value', () => {
    expect(inBounds('hour', 24)).toBe(false);
  });

  it('returns false for non-integer', () => {
    expect(inBounds('minute', 1.5)).toBe(false);
  });

  it('returns true for boundary values', () => {
    expect(inBounds('dom', 1)).toBe(true);
    expect(inBounds('dom', 31)).toBe(true);
  });
});

describe('allValues', () => {
  it('returns all minute values', () => {
    const vals = allValues('minute');
    expect(vals.length).toBe(60);
    expect(vals[0]).toBe(0);
    expect(vals[59]).toBe(59);
  });

  it('returns all month values', () => {
    const vals = allValues('month');
    expect(vals).toEqual([1,2,3,4,5,6,7,8,9,10,11,12]);
  });
});

describe('fieldLabel', () => {
  it('returns human-readable label', () => {
    expect(fieldLabel('dom')).toBe('day of month');
    expect(fieldLabel('dow')).toBe('day of week');
    expect(fieldLabel('hour')).toBe('hour');
  });
});
