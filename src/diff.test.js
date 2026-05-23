import { diffFields, diffCron } from './diff.js';

describe('diffFields', () => {
  it('returns empty array when parsed crons are identical', () => {
    const a = { minute: '0', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '*' };
    const b = { minute: '0', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '*' };
    expect(diffFields(a, b)).toEqual([]);
  });

  it('detects a single changed field', () => {
    const a = { minute: '0', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '*' };
    const b = { minute: '30', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '*' };
    expect(diffFields(a, b)).toEqual(['minute']);
  });

  it('detects multiple changed fields', () => {
    const a = { minute: '0', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '1' };
    const b = { minute: '15', hour: '17', dayOfMonth: '*', month: '*', dayOfWeek: '5' };
    expect(diffFields(a, b)).toEqual(['minute', 'hour', 'dayOfWeek']);
  });
});

describe('diffCron', () => {
  it('returns no differences for identical expressions', () => {
    const result = diffCron('0 9 * * *', '0 9 * * *');
    expect(result.changed).toHaveLength(0);
    expect(result.summary).toEqual(['No differences found.']);
  });

  it('returns summary for changed hour', () => {
    const result = diffCron('0 9 * * *', '0 17 * * *');
    expect(result.changed).toContain('hour');
    expect(result.summary.length).toBeGreaterThan(0);
    expect(result.summary[0]).toMatch(/hour/);
  });

  it('throws on invalid expression', () => {
    expect(() => diffCron('not valid', '0 9 * * *')).toThrow();
  });

  it('describes multiple field changes', () => {
    const result = diffCron('0 9 * * 1', '30 18 * * 5');
    expect(result.changed).toEqual(expect.arrayContaining(['minute', 'hour', 'dayOfWeek']));
    expect(result.summary).toHaveLength(3);
  });
});
