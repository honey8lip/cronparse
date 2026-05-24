const { createWatcher, stopWatcher, getWatcher, listWatchers, stopAll } = require('./cronWatch');

afterEach(() => {
  stopAll();
});

describe('createWatcher', () => {
  it('returns a numeric id', () => {
    const id = createWatcher('* * * * *', () => {});
    expect(typeof id).toBe('number');
    stopWatcher(id);
  });

  it('stores watcher with label and expression', () => {
    const id = createWatcher('0 9 * * 1', () => {}, { label: 'weekly' });
    const w = getWatcher(id);
    expect(w.expression).toBe('0 9 * * 1');
    expect(w.label).toBe('weekly');
    stopWatcher(id);
  });

  it('watcher starts active', () => {
    const id = createWatcher('* * * * *', () => {});
    const w = getWatcher(id);
    expect(w.active).toBe(true);
    stopWatcher(id);
  });

  it('fireCount starts at 0', () => {
    const id = createWatcher('* * * * *', () => {});
    const w = getWatcher(id);
    expect(w.fireCount).toBe(0);
    stopWatcher(id);
  });
});

describe('stopWatcher', () => {
  it('returns true when watcher exists', () => {
    const id = createWatcher('* * * * *', () => {});
    expect(stopWatcher(id)).toBe(true);
  });

  it('returns false for unknown id', () => {
    expect(stopWatcher(99999)).toBe(false);
  });

  it('removes watcher from list', () => {
    const id = createWatcher('* * * * *', () => {});
    stopWatcher(id);
    expect(getWatcher(id)).toBeNull();
  });
});

describe('listWatchers', () => {
  it('returns all active watchers', () => {
    const id1 = createWatcher('* * * * *', () => {}, { label: 'a' });
    const id2 = createWatcher('0 * * * *', () => {}, { label: 'b' });
    const list = listWatchers();
    expect(list.length).toBeGreaterThanOrEqual(2);
    const ids = list.map(w => w.id);
    expect(ids).toContain(id1);
    expect(ids).toContain(id2);
    stopWatcher(id1);
    stopWatcher(id2);
  });

  it('returns empty array when no watchers', () => {
    expect(listWatchers()).toEqual([]);
  });
});

describe('stopAll', () => {
  it('clears all watchers', () => {
    createWatcher('* * * * *', () => {});
    createWatcher('0 * * * *', () => {});
    stopAll();
    expect(listWatchers()).toEqual([]);
  });
});
