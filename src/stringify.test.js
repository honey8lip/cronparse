const { stringifyField, stringify } = require('./stringify');

describe('stringifyField', () => {
  it('returns * for wildcard field', () => {
    expect(stringifyField({ type: 'wildcard' })).toBe('*');
  });

  it('returns */N for wildcard with step', () => {
    expect(stringifyField({ type: 'wildcard', step: 5 })).toBe('*/5');
  });

  it('returns range', () => {
    expect(stringifyField({ type: 'range', from: 1, to: 5 })).toBe('1-5');
  });

  it('returns range with step', () => {
    expect(stringifyField({ type: 'range', from: 0, to: 23, step: 2 })).toBe('0-23/2');
  });

  it('returns list', () => {
    expect(stringifyField({
      type: 'list',
      values: [
        { type: 'value', value: 1 },
        { type: 'value', value: 3 },
        { type: 'value', value: 5 }
      ]
    })).toBe('1,3,5');
  });

  it('returns single value', () => {
    expect(stringifyField({ type: 'value', value: 15 })).toBe('15');
  });

  it('returns step from value', () => {
    expect(stringifyField({ type: 'step', from: 0, step: 15 })).toBe('0/15');
  });

  it('handles raw string passthrough', () => {
    expect(stringifyField('5')).toBe('5');
  });

  it('returns raw if present on object', () => {
    expect(stringifyField({ raw: '10-20' })).toBe('10-20');
  });
});

describe('stringify', () => {
  it('reconstructs a simple 5-field expression', () => {
    const parsed = {
      minute: { type: 'value', value: 30 },
      hour: { type: 'value', value: 9 },
      dayOfMonth: { type: 'wildcard' },
      month: { type: 'wildcard' },
      dayOfWeek: { type: 'value', value: 1 }
    };
    expect(stringify(parsed)).toBe('30 9 * * 1');
  });

  it('fills missing fields with *', () => {
    const parsed = {
      minute: { type: 'wildcard' },
      hour: { type: 'wildcard' }
    };
    expect(stringify(parsed)).toBe('* * * * *');
  });

  it('supports 6-field with seconds', () => {
    const parsed = {
      second: { type: 'value', value: 0 },
      minute: { type: 'value', value: 0 },
      hour: { type: 'value', value: 12 },
      dayOfMonth: { type: 'wildcard' },
      month: { type: 'wildcard' },
      dayOfWeek: { type: 'wildcard' }
    };
    expect(stringify(parsed, { seconds: true })).toBe('0 0 12 * * *');
  });

  it('throws on invalid input', () => {
    expect(() => stringify(null)).toThrow();
    expect(() => stringify('bad')).toThrow();
  });
});
