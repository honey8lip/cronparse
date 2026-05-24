const { formatEventEntry, formatEmitterSummary, toEventJSON, formatAllEmitters } = require('./cronEventFormatter');

test('formatEventEntry returns formatted string', () => {
  expect(formatEventEntry('run', 3)).toBe('[run] handlers: 3');
});

test('formatEventEntry with zero handlers', () => {
  expect(formatEventEntry('error', 0)).toBe('[error] handlers: 0');
});

test('formatEmitterSummary lists events', () => {
  const result = formatEmitterSummary('job1', ['run', 'error']);
  expect(result).toContain('Emitter "job1"');
  expect(result).toContain('- run');
  expect(result).toContain('- error');
});

test('formatEmitterSummary with no events', () => {
  expect(formatEmitterSummary('job2', [])).toBe('Emitter "job2": no active events');
});

test('formatEmitterSummary with undefined events', () => {
  expect(formatEmitterSummary('job3', undefined)).toBe('Emitter "job3": no active events');
});

test('toEventJSON returns structured object', () => {
  expect(toEventJSON('job4', ['run'])).toEqual({ id: 'job4', events: ['run'] });
});

test('toEventJSON with no events defaults to empty array', () => {
  expect(toEventJSON('job5')).toEqual({ id: 'job5', events: [] });
});

test('formatAllEmitters with multiple emitters', () => {
  const ids = ['a', 'b'];
  const fn = id => (id === 'a' ? ['run'] : []);
  const result = formatAllEmitters(ids, fn);
  expect(result).toContain('Emitter "a"');
  expect(result).toContain('Emitter "b": no active events');
});

test('formatAllEmitters with empty list', () => {
  expect(formatAllEmitters([], () => [])).toBe('No emitters registered.');
});

test('formatAllEmitters with null', () => {
  expect(formatAllEmitters(null, () => [])).toBe('No emitters registered.');
});
