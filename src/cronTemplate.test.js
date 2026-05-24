const {
  registerTemplate,
  removeTemplate,
  isTemplate,
  resolveTemplate,
  listTemplates,
  getTemplate,
} = require('./cronTemplate');

describe('registerTemplate', () => {
  it('registers a new template', () => {
    registerTemplate('test-tpl', 'MINUTE HOUR * * *', ['MINUTE', 'HOUR']);
    expect(isTemplate('test-tpl')).toBe(true);
  });

  it('throws on empty name', () => {
    expect(() => registerTemplate('', '* * * * *')).toThrow();
  });

  it('throws on missing pattern', () => {
    expect(() => registerTemplate('bad', null)).toThrow();
  });
});

describe('removeTemplate', () => {
  it('removes an existing template', () => {
    registerTemplate('removable', '* * * * *');
    expect(removeTemplate('removable')).toBe(true);
    expect(isTemplate('removable')).toBe(false);
  });

  it('returns false for unknown template', () => {
    expect(removeTemplate('nope')).toBe(false);
  });
});

describe('resolveTemplate', () => {
  it('resolves built-in daily-at template', () => {
    const result = resolveTemplate('daily-at', { MINUTE: '0', HOUR: '9' });
    expect(result).toBe('0 9 * * *');
  });

  it('resolves every-n-minutes template', () => {
    const result = resolveTemplate('every-n-minutes', { N: '15' });
    expect(result).toBe('*/15 * * * *');
  });

  it('resolves weekly-on template', () => {
    const result = resolveTemplate('weekly-on', { MINUTE: '30', HOUR: '8', DOW: '1' });
    expect(result).toBe('30 8 * * 1');
  });

  it('throws for unknown template', () => {
    expect(() => resolveTemplate('ghost', {})).toThrow('Unknown template');
  });

  it('throws when variable is missing', () => {
    expect(() => resolveTemplate('daily-at', { MINUTE: '0' })).toThrow('Missing variable');
  });

  it('throws when resolved expression is invalid', () => {
    registerTemplate('bad-tpl', 'X * * * *', ['X']);
    expect(() => resolveTemplate('bad-tpl', { X: '99' })).toThrow('invalid');
  });
});

describe('listTemplates', () => {
  it('includes built-in templates', () => {
    const names = listTemplates();
    expect(names).toContain('daily-at');
    expect(names).toContain('every-n-minutes');
    expect(names).toContain('weekly-on');
    expect(names).toContain('monthly-on');
  });
});

describe('getTemplate', () => {
  it('returns pattern and vars for known template', () => {
    const tpl = getTemplate('daily-at');
    expect(tpl).toHaveProperty('pattern', 'MINUTE HOUR * * *');
    expect(tpl.vars).toContain('MINUTE');
  });

  it('returns null for unknown template', () => {
    expect(getTemplate('unknown-xyz')).toBeNull();
  });
});
