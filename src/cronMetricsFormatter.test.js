const { formatDuration, formatMetricsEntry, formatMetricsList, toMetricsJSON } = require('./cronMetricsFormatter');
const { recordRun, getMetrics, removeMetrics } = require('./cronMetrics');

const EXPR = '0 12 * * *';

beforeEach(() => removeMetrics(EXPR));

test('formatDuration handles ms', () => {
  expect(formatDuration(250)).toBe('250ms');
});

test('formatDuration handles seconds', () => {
  expect(formatDuration(2500)).toBe('2.50s');
});

test('formatDuration handles null', () => {
  expect(formatDuration(null)).toBe('n/a');
});

test('formatMetricsEntry returns no-metrics message for null', () => {
  expect(formatMetricsEntry(null)).toBe('No metrics found.');
});

test('formatMetricsEntry includes key fields', () => {
  recordRun(EXPR, { durationMs: 120, success: true });
  recordRun(EXPR, { durationMs: 80, success: false });
  const entry = getMetrics(EXPR);
  const output = formatMetricsEntry(entry);
  expect(output).toContain('Total Runs : 2');
  expect(output).toContain('Successes  : 1');
  expect(output).toContain('Failures   : 1');
  expect(output).toContain('50.0%');
  expect(output).toContain('100ms');
});

test('formatMetricsList returns message when empty', () => {
  expect(formatMetricsList([])).toBe('No metrics recorded.');
});

test('formatMetricsList joins multiple entries', () => {
  recordRun(EXPR, { durationMs: 50, success: true });
  const entry = getMetrics(EXPR);
  const output = formatMetricsList([entry, entry]);
  expect(output.split('\n\n').length).toBe(2);
});

test('toMetricsJSON returns null for null input', () => {
  expect(toMetricsJSON(null)).toBeNull();
});

test('toMetricsJSON returns structured object', () => {
  recordRun(EXPR, { durationMs: 300, success: true });
  const entry = getMetrics(EXPR);
  const json = toMetricsJSON(entry);
  expect(json.expression).toBe(EXPR);
  expect(json.totalRuns).toBe(1);
  expect(json.successRate).toBe(100);
  expect(json.avgDurationMs).toBe(300);
  expect(json.minDurationMs).toBe(300);
  expect(json.maxDurationMs).toBe(300);
});
