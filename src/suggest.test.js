const { listSuggestions, searchSuggestions, suggestFromPartial } = require('./suggest');

describe('listSuggestions', () => {
  it('returns an array of suggestions', () => {
    const results = listSuggestions();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it('each suggestion has label and expression', () => {
    listSuggestions().forEach(s => {
      expect(typeof s.label).toBe('string');
      expect(typeof s.expression).toBe('string');
    });
  });

  it('returns a copy, not the original array', () => {
    const a = listSuggestions();
    const b = listSuggestions();
    expect(a).not.toBe(b);
  });
});

describe('searchSuggestions', () => {
  it('returns matching suggestions by label', () => {
    const results = searchSuggestions('minute');
    expect(results.length).toBeGreaterThan(0);
    results.forEach(r => expect(r.label.toLowerCase()).toContain('minute'));
  });

  it('is case-insensitive', () => {
    const lower = searchSuggestions('daily');
    const upper = searchSuggestions('DAILY');
    expect(lower).toEqual(upper);
  });

  it('returns all suggestions for empty query', () => {
    expect(searchSuggestions('')).toEqual(listSuggestions());
  });

  it('returns all suggestions for null query', () => {
    expect(searchSuggestions(null)).toEqual(listSuggestions());
  });

  it('returns empty array for unmatched query', () => {
    expect(searchSuggestions('zzznomatch')).toEqual([]);
  });
});

describe('suggestFromPartial', () => {
  it('returns suggestions matching the partial expression', () => {
    const results = suggestFromPartial('0 0');
    expect(results.length).toBeGreaterThan(0);
    results.forEach(r => expect(r.expression.startsWith('0 0')).toBe(true));
  });

  it('returns all for empty partial', () => {
    expect(suggestFromPartial('')).toEqual(listSuggestions());
  });

  it('returns all for null partial', () => {
    expect(suggestFromPartial(null)).toEqual(listSuggestions());
  });

  it('exact match returns at least one result', () => {
    const results = suggestFromPartial('* * * * *');
    expect(results.some(r => r.expression === '* * * * *')).toBe(true);
  });
});
