/**
 * cronPipelineFormatter.js
 * Format pipeline state and run traces for display.
 */

const { listSteps } = require('./cronPipeline');

/**
 * Format a single trace entry.
 * @param {{ name: string, output: string }} entry
 * @param {number} index
 * @returns {string}
 */
function formatTraceEntry(entry, index) {
  return `  [${index + 1}] ${entry.name}: "${entry.output}"`;
}

/**
 * Format the full trace from a runPipeline result.
 * @param {Array<{name: string, output: string}>} trace
 * @returns {string}
 */
function formatTrace(trace) {
  if (trace.length === 0) return '  (no steps)';
  return trace.map((entry, i) => formatTraceEntry(entry, i)).join('\n');
}

/**
 * Format a pipeline summary showing steps and final result.
 * @param {object} pipeline
 * @param {string} result
 * @returns {string}
 */
function formatPipelineSummary(pipeline, result) {
  const steps = listSteps(pipeline);
  const stepList = steps.length
    ? steps.map((s, i) => `  ${i + 1}. ${s}`).join('\n')
    : '  (none)';
  return [
    `Pipeline: "${pipeline.expression}"`,
    `Steps:\n${stepList}`,
    `Result: "${result}"`
  ].join('\n');
}

/**
 * Format a pipeline run as a detailed report.
 * @param {object} pipeline
 * @param {{ result: string, trace: Array }} runResult
 * @returns {string}
 */
function formatPipelineRun(pipeline, runResult) {
  const { result, trace } = runResult;
  return [
    `Input:  "${pipeline.expression}"`,
    `Trace:\n${formatTrace(trace)}`,
    `Output: "${result}"`
  ].join('\n');
}

module.exports = {
  formatTraceEntry,
  formatTrace,
  formatPipelineSummary,
  formatPipelineRun
};
