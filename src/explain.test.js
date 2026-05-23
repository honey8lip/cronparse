const { explain, describeValue } = require('./explain');

describe('describeValue', () => {
  it('returns "every value" for wildcard', () => {
    expect(describeValue('minute', { all: true })).toBe('every value');
  });

  it('describes specific values', () => {
    const result = describeValue('hour', { values: [9, 17] });
    expect(result).toContain('specific values: 9, 17');
  });

  it('describes ranges', () => {
    const result = describeValue('minute', { ranges: [{ start: 0, end: 30 }] });
    expect(result).toContain('ranges: 0-30');
  });

  it('describes step values', () => {
    const result = describeValue('minute', { steps: [{ start: '*', step: 15 }] });
    expect(result).toContain('every 15');
  });

  it('describes step with start', () => {
    const result = describeValue('minute', { steps: [{ start: 5, step: 10 }] });
    expect(result).toContain('every 10 starting at 5');
  });

  it('returns "unknown" for empty parsed field', () => {
    expect(describeValue('month', {})).toBe('unknown');
  });
});

describe('explain', () => {
  it('throws if no argument given', () => {
    expect(() => explain(null)).toThrow();
  });

  it('returns an array of 5 field explanations', () => {
    const parsed = {
      minute: { raw: '*', all: true },
      hour: { raw: '9', values: [9] },
      dayOfMonth: { raw: '*', all: true },
      month: { raw: '*', all: true },
      dayOfWeek: { raw: '1-5', ranges: [{ start: 1, end: 5 }] },
    };
    const result = explain(parsed);
    expect(result).toHaveLength(5);
  });

  it('includes correct labels and fields', () => {
    const parsed = {
      minute: { raw: '*/15', steps: [{ start: '*', step: 15 }] },
      hour: { raw: '*', all: true },
      dayOfMonth: { raw: '*', all: true },
      month: { raw: '*', all: true },
      dayOfWeek: { raw: '*', all: true },
    };
    const result = explain(parsed);
    const minuteField = result.find(f => f.field === 'minute');
    expect(minuteField.label).toBe('Minute');
    expect(minuteField.raw).toBe('*/15');
    expect(minuteField.description).toContain('every 15');
    expect(minuteField.range).toEqual({ min: 0, max: 59 });
  });

  it('handles missing field data gracefully', () => {
    const parsed = {};
    const result = explain(parsed);
    expect(result[0].description).toBe('every value');
    expect(result[0].raw).toBe('*');
  });
});
