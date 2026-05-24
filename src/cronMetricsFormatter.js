/**
 * cronMetricsFormatter.js — Format cron metrics entries for display
 */

const { averageDuration, successRate } = require('./cronMetrics');

function formatDuration(ms) {
  if (ms === null || ms === undefined) return 'n/a';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatMetricsEntry(entry) {
  if (!entry) return 'No metrics found.';
  const avg = entry.totalRuns > 0
    ? formatDuration(Math.round(entry.totalDurationMs / entry.totalRuns))
    : 'n/a';
  const rate = entry.totalRuns > 0
    ? `${((entry.successCount / entry.totalRuns) * 100).toFixed(1)}%`
    : 'n/a';
  return [
    `Expression : ${entry.expression}`,
    `Total Runs : ${entry.totalRuns}`,
    `Successes  : ${entry.successCount}`,
    `Failures   : ${entry.failureCount}`,
    `Success Rate: ${rate}`,
    `Avg Duration: ${avg}`,
    `Min Duration: ${formatDuration(entry.minDurationMs)}`,
    `Max Duration: ${formatDuration(entry.maxDurationMs)}`,
    `Last Run   : ${entry.lastRunAt || 'never'}`,
    `Last Status: ${entry.lastStatus || 'n/a'}`,
  ].join('\n');
}

function formatMetricsList(entries) {
  if (!entries || entries.length === 0) return 'No metrics recorded.';
  return entries.map(formatMetricsEntry).join('\n\n');
}

function toMetricsJSON(entry) {
  if (!entry) return null;
  return {
    expression: entry.expression,
    totalRuns: entry.totalRuns,
    successCount: entry.successCount,
    failureCount: entry.failureCount,
    successRate: entry.totalRuns > 0
      ? parseFloat(((entry.successCount / entry.totalRuns) * 100).toFixed(2))
      : null,
    avgDurationMs: entry.totalRuns > 0
      ? Math.round(entry.totalDurationMs / entry.totalRuns)
      : null,
    minDurationMs: entry.minDurationMs,
    maxDurationMs: entry.maxDurationMs,
    lastRunAt: entry.lastRunAt,
    lastStatus: entry.lastStatus,
  };
}

module.exports = { formatDuration, formatMetricsEntry, formatMetricsList, toMetricsJSON };
