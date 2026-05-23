const { parseCron } = require('./parser');
const { validate } = require('./validator');
const { humanize } = require('./humanize');
const { nextRun } = require('./nextRun');

/**
 * Parse and validate a cron expression, returning a rich result object.
 * @param {string} expression - A cron expression string (5 fields)
 * @param {object} [options]
 * @param {Date}   [options.from] - Reference date for nextRun (default: now)
 * @param {number} [options.previewCount] - Number of upcoming runs to return (default: 1)
 * @returns {object} result
 */
function cronparse(expression, options = {}) {
  const { from = new Date(), previewCount = 1 } = options;

  const validation = validate(expression);
  if (!validation.valid) {
    return {
      expression,
      valid: false,
      errors: validation.errors,
      description: null,
      nextRuns: [],
    };
  }

  const parsed = parseCron(expression);
  const description = humanize(expression);

  const nextRuns = [];
  let cursor = new Date(from);
  for (let i = 0; i < previewCount; i++) {
    const run = nextRun(expression, cursor);
    if (!run) break;
    nextRuns.push(run);
    cursor = new Date(run.getTime() + 60 * 1000);
  }

  return {
    expression,
    valid: true,
    errors: [],
    parsed,
    description,
    nextRuns,
  };
}

module.exports = { cronparse };
