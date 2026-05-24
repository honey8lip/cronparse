# cronPipeline

Chain multiple cron expression transformations into a reusable, inspectable pipeline.

## API

### `createPipeline(expression)`

Create a new pipeline starting from a cron expression.

```js
const p = createPipeline('* * * * *');
```

### `addStep(pipeline, name, fn)`

Add a named transformation step. `fn` receives the current expression string and returns a new one.

```js
const p2 = addStep(p, 'setMinute', expr => '0' + expr.slice(1));
```

### `removeStep(pipeline, name)`

Remove a step by name. Returns a new pipeline without that step.

```js
const p3 = removeStep(p2, 'setMinute');
```

### `runPipeline(pipeline)`

Execute all steps in order. Returns `{ result, trace }` where `trace` records each step's output.

```js
const { result, trace } = runPipeline(p2);
// result: '0 * * * *'
// trace: [{ name: 'setMinute', output: '0 * * * *' }]
```

### `listSteps(pipeline)`

Return an array of step names in order.

```js
listSteps(p2); // ['setMinute']
```

### `clonePipeline(pipeline, expression?)`

Clone a pipeline, optionally with a different starting expression.

```js
const clone = clonePipeline(p2, '0 9 * * 1');
```

## Formatter

Use `cronPipelineFormatter` to render pipeline state for display or logging.

```js
const { formatPipelineRun } = require('./cronPipelineFormatter');
console.log(formatPipelineRun(p2, runPipeline(p2)));
```

Output:
```
Input:  "* * * * *"
Trace:
  [1] setMinute: "0 * * * *"
Output: "0 * * * *"
```
