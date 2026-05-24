const {
  registerThrottle,
  removeThrottle,
  getThrottle,
  isThrottled,
  recordRun,
  recordSkip,
  resetThrottle,
  listThrottles,
  clearAllThrottles,
} = require('./cronThrottle');

beforeEach(() => clearAllThrottles());

describe('registerThrottle', () => {
  it('registers a throttle entry', () => {
    const entry = registerThrottle('job1', '* * * * *', 60000);
    expect(entry.expression).toBe('* * * * *');
    expect(entry.minIntervalMs).toBe(60000);
    expect(entry.lastRun).toBeNull();
    expect(entry.skippedCount).toBe(0);
  });

  it('uses label from options', () => {
    const entry = registerThrottle('job2', '0 * * * *', 3600000, { label: 'Hourly Job' });
    expect(entry.label).toBe('Hourly Job');
  });

  it('throws on invalid id', () => {
    expect(() => registerThrottle('', '* * * * *', 1000)).toThrow();
  });

  it('throws on invalid minIntervalMs', () => {
    expect(() => registerThrottle('job3', '* * * * *', -1)).toThrow();
    expect(() => registerThrottle('job4', '* * * * *', 0)).toThrow();
  });
});

describe('isThrottled', () => {
  it('returns false if no throttle registered', () => {
    expect(isThrottled('nonexistent')).toBe(false);
  });

  it('returns false if never run', () => {
    registerThrottle('job1', '* * * * *', 60000);
    expect(isThrottled('job1')).toBe(false);
  });

  it('returns true if within interval', () => {
    const now = Date.now();
    registerThrottle('job1', '* * * * *', 60000);
    recordRun('job1', now - 1000);
    expect(isThrottled('job1', now)).toBe(true);
  });

  it('returns false if interval has passed', () => {
    const now = Date.now();
    registerThrottle('job1', '* * * * *', 60000);
    recordRun('job1', now - 90000);
    expect(isThrottled('job1', now)).toBe(false);
  });
});

describe('recordRun and recordSkip', () => {
  it('updates lastRun on recordRun', () => {
    registerThrottle('job1', '* * * * *', 5000);
    const now = Date.now();
    const entry = recordRun('job1', now);
    expect(entry.lastRun).toBe(now);
  });

  it('increments skippedCount on recordSkip', () => {
    registerThrottle('job1', '* * * * *', 5000);
    recordSkip('job1');
    recordSkip('job1');
    expect(getThrottle('job1').skippedCount).toBe(2);
  });

  it('throws recordRun for unknown id', () => {
    expect(() => recordRun('nope')).toThrow();
  });
});

describe('resetThrottle', () => {
  it('resets lastRun and skippedCount', () => {
    registerThrottle('job1', '* * * * *', 5000);
    recordRun('job1', Date.now());
    recordSkip('job1');
    resetThrottle('job1');
    const entry = getThrottle('job1');
    expect(entry.lastRun).toBeNull();
    expect(entry.skippedCount).toBe(0);
  });

  it('returns false for unknown id', () => {
    expect(resetThrottle('nope')).toBe(false);
  });
});

describe('listThrottles', () => {
  it('lists all registered throttles with ids', () => {
    registerThrottle('a', '* * * * *', 1000);
    registerThrottle('b', '0 * * * *', 2000);
    const list = listThrottles();
    expect(list).toHaveLength(2);
    expect(list.map(e => e.id)).toContain('a');
    expect(list.map(e => e.id)).toContain('b');
  });
});

describe('removeThrottle', () => {
  it('removes a registered throttle', () => {
    registerThrottle('job1', '* * * * *', 1000);
    expect(removeThrottle('job1')).toBe(true);
    expect(getThrottle('job1')).toBeNull();
  });

  it('returns false for unknown id', () => {
    expect(removeThrottle('nope')).toBe(false);
  });
});
