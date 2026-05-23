const { PRESETS, resolvePreset, isPreset, getPreset } = require('./presets');

describe('PRESETS', () => {
  test('contains expected preset names', () => {
    const names = PRESETS.map((p) => p.name);
    expect(names).toContain('@daily');
    expect(names).toContain('@weekly');
    expect(names).toContain('@monthly');
    expect(names).toContain('@yearly');
    expect(names).toContain('@hourly');
    expect(names).toContain('@reboot');
  });
});

describe('resolvePreset', () => {
  test('resolves @daily to correct expression', () => {
    expect(resolvePreset('@daily')).toBe('0 0 * * *');
  });

  test('resolves @weekly to correct expression', () => {
    expect(resolvePreset('@weekly')).toBe('0 0 * * 0');
  });

  test('resolves alias @annually same as @yearly', () => {
    expect(resolvePreset('@annually')).toBe(resolvePreset('@yearly'));
  });

  test('resolves alias @midnight same as @daily', () => {
    expect(resolvePreset('@midnight')).toBe(resolvePreset('@daily'));
  });

  test('returns null for unknown preset', () => {
    expect(resolvePreset('@unknown')).toBeNull();
  });

  test('@reboot returns null expression', () => {
    expect(resolvePreset('@reboot')).toBeNull();
  });

  test('is case-insensitive', () => {
    expect(resolvePreset('@DAILY')).toBe('0 0 * * *');
  });
});

describe('isPreset', () => {
  test('returns true for known preset', () => {
    expect(isPreset('@hourly')).toBe(true);
    expect(isPreset('@reboot')).toBe(true);
  });

  test('returns true for alias', () => {
    expect(isPreset('@midnight')).toBe(true);
  });

  test('returns false for unknown string', () => {
    expect(isPreset('@nope')).toBe(false);
    expect(isPreset('0 * * * *')).toBe(false);
  });
});

describe('getPreset', () => {
  test('returns full preset object', () => {
    const preset = getPreset('@daily');
    expect(preset).not.toBeNull();
    expect(preset.name).toBe('@daily');
    expect(preset.expression).toBe('0 0 * * *');
    expect(preset.description).toBeTruthy();
  });

  test('returns null for unknown preset', () => {
    expect(getPreset('@nope')).toBeNull();
  });
});
