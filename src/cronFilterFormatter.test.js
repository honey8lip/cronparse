const {
  formatFilterEntry,
  formatFilterList,
  formatFilterResult,
  toFilterJSON
} = require('./cronFilterFormatter');

const sampleFilter = {
  name: 'hourly',
  criteria: { minute: '0' },
  createdAt: '2024-01-01T00:00:00.000Z'
};

test('formatFilterEntry formats a filter', () => {
  const out = formatFilterEntry(sampleFilter);
  expect(out).toContain('hourly');
  expect(out).toContain('minute: 0');
  expect(out).toContain('2024-01-01');
});

test('formatFilterEntry handles null filter', () => {
  expect(formatFilterEntry(null)).toBe('Filter: (none)');
});

test('formatFilterList formats multiple filters', () => {
  const filters = [
    sampleFilter,
    { name: 'daily', criteria: { minute: '0', hour: '0' }, createdAt: '2024-01-02T00:00:00.000Z' }
  ];
  const out = formatFilterList(filters);
  expect(out).toContain('hourly');
  expect(out).toContain('daily');
});

test('formatFilterList handles empty list', () => {
  expect(formatFilterList([])).toBe('No filters registered.');
});

test('formatFilterList handles null', () => {
  expect(formatFilterList(null)).toBe('No filters registered.');
});

test('formatFilterResult shows match count', () => {
  const out = formatFilterResult('hourly', 3, 10);
  expect(out).toContain('hourly');
  expect(out).toContain('3 of 10');
});

test('toFilterJSON returns serializable object', () => {
  const json = toFilterJSON(sampleFilter);
  expect(json).toEqual({
    name: 'hourly',
    criteria: { minute: '0' },
    createdAt: '2024-01-01T00:00:00.000Z'
  });
});

test('toFilterJSON returns null for falsy input', () => {
  expect(toFilterJSON(null)).toBeNull();
});
