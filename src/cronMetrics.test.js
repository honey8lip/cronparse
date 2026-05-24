const {
  recordRun,
  getMetrics,
  resetMetrics,
  removeMetrics,
  listMetrics,
  averageDuration,
  successRate,
} = require('./cronMetrics');

const EXPR = '*/5 * * * *';

beforeEach(() => {
  removeMetrics(EXPR);
  removeMetrics('0 9 * * 1');
});

test('recordRun creates entry on first call', () => {
  const entry = recordRun(EXPR, { durationMs: 100, success: true });
  expect(entry.totalRuns).toBe(1);
  expect(entry.successCount).toBe(1);
  expect(entry.failureCount).toBe(0);
});

test('recordRun accumulates multiple runs', () => {
  recordRun(EXPR, { durationMs: 50, success: true });
  recordRun(EXPR, { durationMs: 150, success: false });
  const entry = getMetrics(EXPR);
  expect(entry.totalRuns).toBe(2);
  expect(entry.successCount).toBe(1);
  expect(entry.failureCount).toBe(1);
  expect(entry.totalDurationMs).toBe(200);
});

test('tracks min and max duration', () => {
  recordRun(EXPR, { durationMs: 80 });
  recordRun(EXPR, { durationMs: 20 });
  recordRun(EXPR, { durationMs: 200 });
  const entry = getMetrics(EXPR);
  expect(entry.minDurationMs).toBe(20);
  expect(entry.maxDurationMs).toBe(200);
});

test('getMetrics returns null for unknown expression', () => {
  expect(getMetrics('1 2 3 4 5')).toBeNull();
});

test('averageDuration returns correct average', () => {
  recordRun(EXPR, { durationMs: 100 });
  recordRun(EXPR, { durationMs: 200 });
  expect(averageDuration(EXPR)).toBe(150);
});

test('successRate returns percentage', () => {
  recordRun(EXPR, { success: true });
  recordRun(EXPR, { success: true });
  recordRun(EXPR, { success: false });
  expect(successRate(EXPR)).toBe(66.67);
});

test('resetMetrics clears stats', () => {
  recordRun(EXPR, { durationMs: 100 });
  resetMetrics(EXPR);
  const entry = getMetrics(EXPR);
  expect(entry.totalRuns).toBe(0);
});

test('listMetrics returns all tracked expressions', () => {
  recordRun(EXPR, { durationMs: 10 });
  recordRun('0 9 * * 1', { durationMs: 20 });
  const all = listMetrics();
  const exprs = all.map(e => e.expression);
  expect(exprs).toContain(EXPR);
  expect(exprs).toContain('0 9 * * 1');
});
