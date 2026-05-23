const { nextRun, matchesField } = require('./nextRun');
const { parseCron } = require('./parser');

describe('matchesField', () => {
  test('wildcard always matches', () => {
    expect(matchesField(5, { type: 'wildcard' })).toBe(true);
    expect(matchesField(59, { type: 'wildcard' })).toBe(true);
  });

  test('value matches exact', () => {
    expect(matchesField(5, { type: 'value', value: 5 })).toBe(true);
    expect(matchesField(6, { type: 'value', value: 5 })).toBe(false);
  });

  test('range matches within bounds', () => {
    const field = { type: 'range', from: 1, to: 5 };
    expect(matchesField(1, field)).toBe(true);
    expect(matchesField(5, field)).toBe(true);
    expect(matchesField(6, field)).toBe(false);
  });

  test('step matches correct intervals', () => {
    const field = { type: 'step', start: 0, step: 15 };
    expect(matchesField(0, field)).toBe(true);
    expect(matchesField(15, field)).toBe(true);
    expect(matchesField(30, field)).toBe(true);
    expect(matchesField(7, field)).toBe(false);
  });

  test('list matches any member', () => {
    const field = {
      type: 'list',
      values: [{ type: 'value', value: 1 }, { type: 'value', value: 3 }],
    };
    expect(matchesField(1, field)).toBe(true);
    expect(matchesField(3, field)).toBe(true);
    expect(matchesField(2, field)).toBe(false);
  });
});

describe('nextRun', () => {
  test('returns next run for every-minute cron', () => {
    const parsed = parseCron('* * * * *');
    const from = new Date('2024-01-15T10:00:00Z');
    const [next] = nextRun(parsed, from, 1);
    expect(next).toEqual(new Date('2024-01-15T10:01:00Z'));
  });

  test('returns multiple next runs', () => {
    const parsed = parseCron('0 * * * *'); // top of every hour
    const from = new Date('2024-01-15T10:30:00Z');
    const runs = nextRun(parsed, from, 3);
    expect(runs).toHaveLength(3);
    expect(runs[0]).toEqual(new Date('2024-01-15T11:00:00Z'));
    expect(runs[1]).toEqual(new Date('2024-01-15T12:00:00Z'));
    expect(runs[2]).toEqual(new Date('2024-01-15T13:00:00Z'));
  });

  test('handles specific minute and hour', () => {
    const parsed = parseCron('30 9 * * *');
    const from = new Date('2024-01-15T09:00:00Z');
    const [next] = nextRun(parsed, from, 1);
    expect(next).toEqual(new Date('2024-01-15T09:30:00Z'));
  });
});
