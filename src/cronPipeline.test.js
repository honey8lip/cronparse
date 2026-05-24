const {
  createPipeline,
  addStep,
  removeStep,
  runPipeline,
  listSteps,
  clonePipeline
} = require('./cronPipeline');

describe('createPipeline', () => {
  it('stores the initial expression', () => {
    const p = createPipeline('0 9 * * 1');
    expect(p.expression).toBe('0 9 * * 1');
    expect(p.steps).toEqual([]);
  });
});

describe('addStep', () => {
  it('appends a step', () => {
    const p = createPipeline('* * * * *');
    const fn = e => e.replace('*', '0');
    const p2 = addStep(p, 'replaceFirst', fn);
    expect(p2.steps).toHaveLength(1);
    expect(p2.steps[0].name).toBe('replaceFirst');
  });

  it('does not mutate the original', () => {
    const p = createPipeline('* * * * *');
    addStep(p, 'noop', e => e);
    expect(p.steps).toHaveLength(0);
  });
});

describe('removeStep', () => {
  it('removes a step by name', () => {
    let p = createPipeline('* * * * *');
    p = addStep(p, 'a', e => e);
    p = addStep(p, 'b', e => e);
    const p2 = removeStep(p, 'a');
    expect(listSteps(p2)).toEqual(['b']);
  });

  it('is a no-op if name not found', () => {
    let p = createPipeline('* * * * *');
    p = addStep(p, 'a', e => e);
    const p2 = removeStep(p, 'z');
    expect(listSteps(p2)).toEqual(['a']);
  });
});

describe('runPipeline', () => {
  it('threads expression through all steps', () => {
    let p = createPipeline('* * * * *');
    p = addStep(p, 'setMinute', e => '0' + e.slice(1));
    p = addStep(p, 'setHour', e => e.slice(0, 2) + '9' + e.slice(3));
    const { result, trace } = runPipeline(p);
    expect(trace).toHaveLength(2);
    expect(trace[0].name).toBe('setMinute');
    expect(result).toBe('09 * * *');
  });

  it('returns original expression when no steps', () => {
    const p = createPipeline('0 9 * * 1');
    const { result, trace } = runPipeline(p);
    expect(result).toBe('0 9 * * 1');
    expect(trace).toHaveLength(0);
  });
});

describe('listSteps', () => {
  it('returns step names in order', () => {
    let p = createPipeline('* * * * *');
    p = addStep(p, 'first', e => e);
    p = addStep(p, 'second', e => e);
    expect(listSteps(p)).toEqual(['first', 'second']);
  });
});

describe('clonePipeline', () => {
  it('clones with same expression by default', () => {
    let p = createPipeline('0 9 * * *');
    p = addStep(p, 'noop', e => e);
    const clone = clonePipeline(p);
    expect(clone.expression).toBe('0 9 * * *');
    expect(listSteps(clone)).toEqual(['noop']);
  });

  it('overrides expression when provided', () => {
    const p = createPipeline('0 9 * * *');
    const clone = clonePipeline(p, '0 12 * * *');
    expect(clone.expression).toBe('0 12 * * *');
  });

  it('does not share steps array reference', () => {
    let p = createPipeline('* * * * *');
    p = addStep(p, 'a', e => e);
    const clone = clonePipeline(p);
    const modified = addStep(clone, 'b', e => e);
    expect(listSteps(p)).toHaveLength(1);
    expect(listSteps(modified)).toHaveLength(2);
  });
});
