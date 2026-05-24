import {
  createGroup,
  addToGroup,
  removeFromGroup,
  groupNextRuns,
  sortGroupByNextRun,
  listGroupNames,
} from './cronGroup.js';

const BASE_DATE = new Date('2024-01-15T10:00:00Z');

describe('createGroup', () => {
  it('creates a group from valid entries', () => {
    const group = createGroup([
      { name: 'daily', expression: '0 9 * * *' },
      { name: 'hourly', expression: '0 * * * *' },
    ]);
    expect(group.daily).toBe('0 9 * * *');
    expect(group.hourly).toBe('0 * * * *');
  });

  it('throws on invalid expression', () => {
    expect(() => createGroup([{ name: 'bad', expression: 'not-a-cron' }])).toThrow();
  });

  it('throws on missing name', () => {
    expect(() => createGroup([{ expression: '0 * * * *' }])).toThrow();
  });

  it('returns empty object for empty input', () => {
    expect(createGroup()).toEqual({});
  });
});

describe('addToGroup', () => {
  it('adds a new entry', () => {
    const g = addToGroup({}, 'weekly', '0 9 * * 1');
    expect(g.weekly).toBe('0 9 * * 1');
  });

  it('does not mutate original group', () => {
    const g = { daily: '0 9 * * *' };
    const g2 = addToGroup(g, 'hourly', '0 * * * *');
    expect(g).not.toHaveProperty('hourly');
    expect(g2).toHaveProperty('hourly');
  });

  it('throws on invalid expression', () => {
    expect(() => addToGroup({}, 'bad', 'x x x x x')).toThrow();
  });
});

describe('removeFromGroup', () => {
  it('removes an entry', () => {
    const g = { daily: '0 9 * * *', hourly: '0 * * * *' };
    const g2 = removeFromGroup(g, 'daily');
    expect(g2).not.toHaveProperty('daily');
    expect(g2).toHaveProperty('hourly');
  });

  it('does not mutate original', () => {
    const g = { daily: '0 9 * * *' };
    removeFromGroup(g, 'daily');
    expect(g).toHaveProperty('daily');
  });
});

describe('groupNextRuns', () => {
  it('returns next run for each entry', () => {
    const g = { daily: '0 9 * * *', hourly: '0 * * * *' };
    const runs = groupNextRuns(g, BASE_DATE);
    expect(runs).toHaveLength(2);
    runs.forEach(r => {
      expect(r).toHaveProperty('name');
      expect(r).toHaveProperty('expression');
      expect(r.nextRun).toBeInstanceOf(Date);
    });
  });
});

describe('sortGroupByNextRun', () => {
  it('sorts entries by next run ascending', () => {
    const g = { daily: '0 9 * * *', hourly: '0 * * * *' };
    const sorted = sortGroupByNextRun(g, BASE_DATE);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].nextRun >= sorted[i - 1].nextRun).toBe(true);
    }
  });
});

describe('listGroupNames', () => {
  it('lists all names', () => {
    const g = { a: '* * * * *', b: '0 9 * * *' };
    expect(listGroupNames(g)).toEqual(['a', 'b']);
  });
});
