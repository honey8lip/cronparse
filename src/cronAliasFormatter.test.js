const { formatAliasEntry, formatAliasList, summarizeAlias } = require('./cronAliasFormatter');
const { registerAlias, clearUserAliases } = require('./cronAlias');

beforeEach(() => clearUserAliases());

describe('formatAliasEntry', () => {
  test('formats a builtin alias entry', () => {
    const entry = { name: '@daily', expression: '0 0 * * *', source: 'builtin' };
    const result = formatAliasEntry(entry);
    expect(result).toContain('@daily');
    expect(result).toContain('[builtin]');
    expect(result).toContain('0 0 * * *');
  });

  test('formats a user alias entry with [custom] tag', () => {
    const entry = { name: '@workdays', expression: '0 9 * * 1-5', source: 'user' };
    const result = formatAliasEntry(entry);
    expect(result).toContain('[custom]');
    expect(result).toContain('@workdays');
  });

  test('includes a description separator', () => {
    const entry = { name: '@hourly', expression: '0 * * * *', source: 'builtin' };
    const result = formatAliasEntry(entry);
    expect(result).toContain('—');
  });
});

describe('formatAliasList', () => {
  test('returns fallback message when no aliases exist (only builtins check)', () => {
    const result = formatAliasList();
    // builtins always exist so the list should not be empty
    expect(result).not.toBe('No aliases defined.');
  });

  test('includes header row', () => {
    const result = formatAliasList();
    expect(result).toContain('Alias');
    expect(result).toContain('Source');
    expect(result).toContain('Expression');
  });

  test('includes user-defined aliases', () => {
    registerAlias('@nightly', '0 2 * * *');
    const result = formatAliasList();
    expect(result).toContain('@nightly');
    expect(result).toContain('[custom]');
  });
});

describe('summarizeAlias', () => {
  test('returns null for unknown alias', () => {
    expect(summarizeAlias('@unknown')).toBeNull();
  });

  test('returns a summary string for a known builtin', () => {
    const result = summarizeAlias('@daily');
    expect(result).not.toBeNull();
    expect(result).toContain('@daily');
    expect(result).toContain('0 0 * * *');
  });

  test('returns summary for user-registered alias', () => {
    registerAlias('@standup', '0 10 * * 1-5');
    const result = summarizeAlias('@standup');
    expect(result).toContain('@standup');
    expect(result).toContain('0 10 * * 1-5');
  });
});
