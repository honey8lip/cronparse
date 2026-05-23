const { toSixField, toFiveField, toNamedFields, fromNamedFields } = require('./convert');

describe('toSixField', () => {
  it('prepends default 0 seconds to a 5-field expression', () => {
    expect(toSixField('*/5 * * * *')).toBe('0 */5 * * * *');
  });

  it('prepends a custom seconds value', () => {
    expect(toSixField('0 12 * * 1', '30')).toBe('30 0 12 * * 1');
  });

  it('throws if not 5 fields', () => {
    expect(() => toSixField('* * * *')).toThrow('Expected 5 fields');
  });

  it('throws if input is not a string', () => {
    expect(() => toSixField(123)).toThrow(TypeError);
  });
});

describe('toFiveField', () => {
  it('drops the seconds field from a 6-field expression', () => {
    expect(toFiveField('0 */5 * * * *')).toBe('*/5 * * * *');
  });

  it('throws if not 6 fields', () => {
    expect(() => toFiveField('* * * * *')).toThrow('Expected 6 fields');
  });

  it('throws if input is not a string', () => {
    expect(() => toFiveField(null)).toThrow(TypeError);
  });
});

describe('toNamedFields', () => {
  it('maps 5-field expression to named fields', () => {
    expect(toNamedFields('*/5 * * * *')).toEqual({
      minute: '*/5', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*'
    });
  });

  it('maps 6-field expression to named fields including second', () => {
    const result = toNamedFields('30 0 12 * * 1');
    expect(result.second).toBe('30');
    expect(result.minute).toBe('0');
    expect(result.hour).toBe('12');
  });

  it('throws on unexpected field count', () => {
    expect(() => toNamedFields('* * *')).toThrow('Expected 5 or 6 fields');
  });
});

describe('fromNamedFields', () => {
  it('converts a 5-field named object back to expression', () => {
    const fields = { minute: '*/5', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' };
    expect(fromNamedFields(fields)).toBe('*/5 * * * *');
  });

  it('converts a 6-field named object back to expression', () => {
    const fields = { second: '0', minute: '*/5', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' };
    expect(fromNamedFields(fields)).toBe('0 */5 * * * *');
  });

  it('throws on missing fields', () => {
    expect(() => fromNamedFields({ minute: '*' })).toThrow('Missing fields');
  });

  it('throws if not an object', () => {
    expect(() => fromNamedFields('bad')).toThrow(TypeError);
  });
});
