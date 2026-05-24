const { tagCron, getTag, removeTag, listTags, updateTag, clearTags } = require('./cronTag');

beforeEach(() => clearTags());

describe('tagCron', () => {
  it('creates a tag entry', () => {
    const entry = tagCron('0 9 * * 1-5', 'Weekday morning');
    expect(entry).toEqual({ expression: '0 9 * * 1-5', label: 'Weekday morning', meta: {} });
  });

  it('stores meta when provided', () => {
    const entry = tagCron('*/5 * * * *', 'Every 5 min', { owner: 'alice' });
    expect(entry.meta).toEqual({ owner: 'alice' });
  });

  it('throws on missing expression', () => {
    expect(() => tagCron('', 'label')).toThrow();
  });

  it('throws on missing label', () => {
    expect(() => tagCron('* * * * *', '')).toThrow();
  });

  it('trims whitespace from expression and label', () => {
    const entry = tagCron('  * * * * *  ', '  My job  ');
    expect(entry.expression).toBe('* * * * *');
    expect(entry.label).toBe('My job');
  });
});

describe('getTag', () => {
  it('returns the tag for a known expression', () => {
    tagCron('0 0 * * *', 'Midnight');
    expect(getTag('0 0 * * *')).toMatchObject({ label: 'Midnight' });
  });

  it('returns null for unknown expression', () => {
    expect(getTag('1 2 3 4 5')).toBeNull();
  });
});

describe('removeTag', () => {
  it('removes an existing tag and returns true', () => {
    tagCron('0 0 * * *', 'Midnight');
    expect(removeTag('0 0 * * *')).toBe(true);
    expect(getTag('0 0 * * *')).toBeNull();
  });

  it('returns false when tag does not exist', () => {
    expect(removeTag('9 9 9 9 9')).toBe(false);
  });
});

describe('listTags', () => {
  beforeEach(() => {
    tagCron('0 9 * * 1-5', 'Weekday morning');
    tagCron('0 0 * * *', 'Midnight daily');
    tagCron('*/10 * * * *', 'Every 10 minutes');
  });

  it('returns all tags when no filter given', () => {
    expect(listTags()).toHaveLength(3);
  });

  it('filters by label substring (case-insensitive)', () => {
    const results = listTags('daily');
    expect(results).toHaveLength(1);
    expect(results[0].label).toBe('Midnight daily');
  });

  it('returns empty array when no match', () => {
    expect(listTags('zzznomatch')).toHaveLength(0);
  });
});

describe('updateTag', () => {
  it('updates label', () => {
    tagCron('0 6 * * *', 'Old label');
    const updated = updateTag('0 6 * * *', { label: 'New label' });
    expect(updated.label).toBe('New label');
  });

  it('merges meta', () => {
    tagCron('0 6 * * *', 'Job', { a: 1 });
    const updated = updateTag('0 6 * * *', { meta: { b: 2 } });
    expect(updated.meta).toEqual({ a: 1, b: 2 });
  });

  it('returns null for unknown expression', () => {
    expect(updateTag('9 9 9 9 9', { label: 'x' })).toBeNull();
  });
});
