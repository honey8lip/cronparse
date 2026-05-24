const {
  registerFilter,
  removeFilter,
  getFilter,
  listFilters,
  filterCrons,
  applyFilter,
  clearFilters
} = require('./cronFilter');

beforeEach(() => clearFilters());

test('registerFilter stores a named filter', () => {
  const f = registerFilter('hourly', { minute: '0' });
  expect(f.name).toBe('hourly');
  expect(f.criteria).toEqual({ minute: '0' });
  expect(f.createdAt).toBeDefined();
});

test('registerFilter throws on invalid name', () => {
  expect(() => registerFilter('', {})).toThrow('non-empty string');
});

test('registerFilter throws on invalid criteria', () => {
  expect(() => registerFilter('x', null)).toThrow('object');
});

test('getFilter returns stored filter', () => {
  registerFilter('daily', { minute: '0', hour: '0' });
  expect(getFilter('daily').name).toBe('daily');
});

test('getFilter returns null for unknown filter', () => {
  expect(getFilter('nope')).toBeNull();
});

test('removeFilter deletes a filter', () => {
  registerFilter('tmp', { hour: '12' });
  expect(removeFilter('tmp')).toBe(true);
  expect(getFilter('tmp')).toBeNull();
});

test('listFilters returns all filters', () => {
  registerFilter('a', { minute: '0' });
  registerFilter('b', { hour: '6' });
  const names = listFilters().map(f => f.name);
  expect(names).toContain('a');
  expect(names).toContain('b');
});

test('filterCrons filters by minute', () => {
  const exprs = ['0 * * * *', '30 * * * *', '0 12 * * *'];
  const result = filterCrons(exprs, { minute: '0' });
  expect(result).toContain('0 * * * *');
  expect(result).toContain('0 12 * * *');
  expect(result).not.toContain('30 * * * *');
});

test('filterCrons skips invalid expressions', () => {
  const exprs = ['0 * * * *', 'not-a-cron'];
  expect(() => filterCrons(exprs, { minute: '0' })).not.toThrow();
});

test('filterCrons throws if expressions not array', () => {
  expect(() => filterCrons('bad', {})).toThrow('array');
});

test('applyFilter uses registered filter', () => {
  registerFilter('noon', { minute: '0', hour: '12' });
  const exprs = ['0 12 * * *', '0 6 * * *', '30 12 * * *'];
  const result = applyFilter(exprs, 'noon');
  expect(result).toEqual(['0 12 * * *']);
});

test('applyFilter throws on unknown filter', () => {
  expect(() => applyFilter([], 'missing')).toThrow('not found');
});
