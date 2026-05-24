const {
  formatTraceEntry,
  formatTrace,
  formatPipelineSummary,
  formatPipelineRun
} = require('./cronPipelineFormatter');
const { createPipeline, addStep, runPipeline } = require('./cronPipeline');

describe('formatTraceEntry', () => {
  it('formats a trace entry with index', () => {
    const entry = { name: 'setMinute', output: '0 * * * *' };
    expect(formatTraceEntry(entry, 0)).toBe('  [1] setMinute: "0 * * * *"');
  });

  it('uses 1-based index', () => {
    const entry = { name: 'setHour', output: '0 9 * * *' };
    expect(formatTraceEntry(entry, 2)).toBe('  [3] setHour: "0 9 * * *"');
  });
});

describe('formatTrace', () => {
  it('returns placeholder for empty trace', () => {
    expect(formatTrace([])).toBe('  (no steps)');
  });

  it('formats all entries', () => {
    const trace = [
      { name: 'a', output: '0 * * * *' },
      { name: 'b', output: '0 9 * * *' }
    ];
    const result = formatTrace(trace);
    expect(result).toContain('[1] a');
    expect(result).toContain('[2] b');
  });
});

describe('formatPipelineSummary', () => {
  it('shows expression, steps, and result', () => {
    let p = createPipeline('* * * * *');
    p = addStep(p, 'normalize', e => e.trim());
    const summary = formatPipelineSummary(p, '* * * * *');
    expect(summary).toContain('Pipeline: "* * * * *"');
    expect(summary).toContain('normalize');
    expect(summary).toContain('Result: "* * * * *"');
  });

  it('shows (none) when no steps', () => {
    const p = createPipeline('0 9 * * 1');
    const summary = formatPipelineSummary(p, '0 9 * * 1');
    expect(summary).toContain('(none)');
  });
});

describe('formatPipelineRun', () => {
  it('formats a full run report', () => {
    let p = createPipeline('* * * * *');
    p = addStep(p, 'setMinute', e => '0' + e.slice(1));
    const runResult = runPipeline(p);
    const report = formatPipelineRun(p, runResult);
    expect(report).toContain('Input:  "* * * * *"');
    expect(report).toContain('Trace:');
    expect(report).toContain('setMinute');
    expect(report).toContain('Output:');
  });

  it('handles empty trace', () => {
    const p = createPipeline('0 9 * * *');
    const runResult = runPipeline(p);
    const report = formatPipelineRun(p, runResult);
    expect(report).toContain('(no steps)');
    expect(report).toContain('Output: "0 9 * * *"');
  });
});
