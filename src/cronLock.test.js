const {
  acquireLock,
  releaseLock,
  isLocked,
  getLock,
  renewLock,
  listLocks,
  clearAllLocks,
} = require('./cronLock');

beforeEach(() => clearAllLocks());

describe('acquireLock', () => {
  test('acquires a lock for a new expression', () => {
    const result = acquireLock('*/5 * * * *', 'worker-1');
    expect(result.acquired).toBe(true);
    expect(result.owner).toBe('worker-1');
    expect(result.expiresAt).toBeGreaterThan(Date.now());
  });

  test('rejects lock if already held by another owner', () => {
    acquireLock('*/5 * * * *', 'worker-1');
    const result = acquireLock('*/5 * * * *', 'worker-2');
    expect(result.acquired).toBe(false);
    expect(result.owner).toBe('worker-1');
  });

  test('allows re-acquiring expired lock', () => {
    acquireLock('0 * * * *', 'worker-1', -1);
    const result = acquireLock('0 * * * *', 'worker-2');
    expect(result.acquired).toBe(true);
    expect(result.owner).toBe('worker-2');
  });
});

describe('releaseLock', () => {
  test('releases a lock held by the correct owner', () => {
    acquireLock('*/10 * * * *', 'worker-1');
    const result = releaseLock('*/10 * * * *', 'worker-1');
    expect(result.released).toBe(true);
    expect(isLocked('*/10 * * * *')).toBe(false);
  });

  test('refuses to release lock held by different owner', () => {
    acquireLock('*/10 * * * *', 'worker-1');
    const result = releaseLock('*/10 * * * *', 'worker-2');
    expect(result.released).toBe(false);
    expect(result.reason).toBe('wrong_owner');
  });

  test('returns no_lock if expression not locked', () => {
    const result = releaseLock('1 2 3 4 5', 'worker-1');
    expect(result.released).toBe(false);
    expect(result.reason).toBe('no_lock');
  });
});

describe('isLocked', () => {
  test('returns true for active lock', () => {
    acquireLock('0 0 * * *', 'worker-1');
    expect(isLocked('0 0 * * *')).toBe(true);
  });

  test('returns false for expired lock', () => {
    acquireLock('0 0 * * *', 'worker-1', -1);
    expect(isLocked('0 0 * * *')).toBe(false);
  });
});

describe('renewLock', () => {
  test('renews a lock held by the correct owner', () => {
    acquireLock('*/2 * * * *', 'worker-1', 5000);
    const result = renewLock('*/2 * * * *', 'worker-1', 30000);
    expect(result.renewed).toBe(true);
    expect(result.expiresAt).toBeGreaterThan(Date.now() + 20000);
  });

  test('fails to renew lock owned by someone else', () => {
    acquireLock('*/2 * * * *', 'worker-1');
    const result = renewLock('*/2 * * * *', 'worker-2');
    expect(result.renewed).toBe(false);
  });
});

describe('listLocks', () => {
  test('lists all active locks', () => {
    acquireLock('* * * * *', 'a');
    acquireLock('0 0 * * *', 'b');
    const list = listLocks();
    expect(list.length).toBe(2);
    expect(list.map(l => l.owner)).toContain('a');
  });

  test('excludes expired locks', () => {
    acquireLock('* * * * *', 'a', -1);
    acquireLock('0 0 * * *', 'b');
    const list = listLocks();
    expect(list.length).toBe(1);
    expect(list[0].owner).toBe('b');
  });
});
