/**
 * cronPipeline.js
 * Chain multiple cron transformations into a reusable pipeline.
 */

/**
 * Create a new pipeline with an initial cron expression.
 * @param {string} expression
 * @returns {object} pipeline
 */
function createPipeline(expression) {
  return { expression, steps: [] };
}

/**
 * Add a named transformation step to the pipeline.
 * @param {object} pipeline
 * @param {string} name
 * @param {Function} fn - receives expression, returns new expression
 * @returns {object} updated pipeline
 */
function addStep(pipeline, name, fn) {
  return {
    ...pipeline,
    steps: [...pipeline.steps, { name, fn }]
  };
}

/**
 * Remove a step by name from the pipeline.
 * @param {object} pipeline
 * @param {string} name
 * @returns {object} updated pipeline
 */
function removeStep(pipeline, name) {
  return {
    ...pipeline,
    steps: pipeline.steps.filter(s => s.name !== name)
  };
}

/**
 * Run all steps in order, threading the expression through each.
 * @param {object} pipeline
 * @returns {{ result: string, trace: Array<{name: string, output: string}> }}
 */
function runPipeline(pipeline) {
  const trace = [];
  let current = pipeline.expression;

  for (const step of pipeline.steps) {
    current = step.fn(current);
    trace.push({ name: step.name, output: current });
  }

  return { result: current, trace };
}

/**
 * Get the names of all steps in the pipeline.
 * @param {object} pipeline
 * @returns {string[]}
 */
function listSteps(pipeline) {
  return pipeline.steps.map(s => s.name);
}

/**
 * Clone a pipeline, optionally overriding the starting expression.
 * @param {object} pipeline
 * @param {string} [expression]
 * @returns {object}
 */
function clonePipeline(pipeline, expression) {
  return {
    expression: expression !== undefined ? expression : pipeline.expression,
    steps: [...pipeline.steps]
  };
}

module.exports = {
  createPipeline,
  addStep,
  removeStep,
  runPipeline,
  listSteps,
  clonePipeline
};
