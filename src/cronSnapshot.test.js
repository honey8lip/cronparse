import {
  takeSnapshot,
  getSnapshot,
  removeSnapshot,
  listSnapshots,
  restoreSnapshot,
  diffSnapshots,
  clearSnapshots,
} from './cronSnapshot.js';

beforeEach(() => {
  clearSnapshots();
});

describe('takeSnapshot', () => {
  it('stores a snapshot and returns entry', () => {
    const entry = takeSnapshot('daily', '0 9 * * *');
    expect(entry.name).toBe('daily');
    expect(entry.expression).toBe('0 9 * * *');
    expect(entry.parsed).toBeDefined();
    expect(entry.createdAt).toBeDefined();
  });

  it('stores optional meta', () => {
    const entry = takeSnapshot('weekly', '0 9 * * 1', { owner: 'alice' });
    expect(entry.meta.owner).toBe('alice');
  });

  it('overwrites existing snapshot with same name', () => {
    takeSnapshot('job', '0 8 * * *');
    takeSnapshot('job', '0 10 * * *');
    expect(getSnapshot('job').expression).toBe('0 10 * * *');
  });
});

describe('getSnapshot', () => {
  it('returns null for unknown snapshot', () => {
    expect(getSnapshot('nope')).toBeNull();
  });

  it('returns snapshot entry by name', () => {
    takeSnapshot('s1', '*/5 * * * *');
    const entry = getSnapshot('s1');
    expect(entry.expression).toBe('*/5 * * * *');
  });
});

describe('removeSnapshot', () => {
  it('removes an existing snapshot', () => {
    takeSnapshot('tmp', '0 0 * * *');
    expect(removeSnapshot('tmp')).toBe(true);
    expect(getSnapshot('tmp')).toBeNull();
  });

  it('returns false for missing snapshot', () => {
    expect(removeSnapshot('ghost')).toBe(false);
  });
});

describe('listSnapshots', () => {
  it('returns all snapshot names', () => {
    takeSnapshot('a', '0 1 * * *');
    takeSnapshot('b', '0 2 * * *');
    expect(listSnapshots()).toEqual(expect.arrayContaining(['a', 'b']));
    expect(listSnapshots().length).toBe(2);
  });
});

describe('restoreSnapshot', () => {
  it('returns the expression string', () => {
    takeSnapshot('r1', '30 6 * * 1-5');
    expect(restoreSnapshot('r1')).toBe('30 6 * * 1-5');
  });

  it('returns null for unknown name', () => {
    expect(restoreSnapshot('unknown')).toBeNull();
  });
});

describe('diffSnapshots', () => {
  it('detects changed fields between two snapshots', () => {
    takeSnapshot('v1', '0 9 * * *');
    takeSnapshot('v2', '0 10 * * *');
    const { changed } = diffSnapshots('v1', 'v2');
    expect(changed).toContain('hour');
    expect(changed).not.toContain('minute');
  });

  it('returns empty changed array for identical expressions', () => {
    takeSnapshot('x', '0 9 * * *');
    takeSnapshot('y', '0 9 * * *');
    const { changed } = diffSnapshots('x', 'y');
    expect(changed).toHaveLength(0);
  });

  it('throws if a snapshot is missing', () => {
    takeSnapshot('only', '0 9 * * *');
    expect(() => diffSnapshots('only', 'missing')).toThrow('Snapshot not found');
  });
});
