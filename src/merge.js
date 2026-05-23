/**
 * merge.js — Merge two parsed cron expressions into one
 * Supports union (|) and intersection (&) strategies
 */

const { parseCron } = require('./parser');

/**
 * Merge two field arrays using the given strategy.
 * @param {string[]} a
 * @param {string[]} b
 * @param {'union'|'intersection'} strategy
 * @returns {string[]}
 */
function mergeField(a, b, strategy) {
  if (a.includes('*') && strategy === 'union') return ['*'];
  if (b.includes('*') && strategy === 'union') return ['*'];
  if (a.includes('*') && strategy === 'intersection') return [...new Set(b)];
  if (b.includes('*') && strategy === 'intersection') return [...new Set(a)];

  const setA = new Set(a.map(String));
  const setB = new Set(b.map(String));

  if (strategy === 'union') {
    const merged = new Set([...setA, ...setB]);
    return [...merged].sort((x, y) => Number(x) - Number(y));
  }

  if (strategy === 'intersection') {
    const merged = [...setA].filter(v => setB.has(v));
    return merged.length ? merged.sort((x, y) => Number(x) - Number(y)) : ['*'];
  }

  throw new Error(`Unknown merge strategy: ${strategy}`);
}

/**
 * Merge two cron expressions.
 * @param {string} exprA
 * @param {string} exprB
 * @param {'union'|'intersection'} [strategy='union']
 * @returns {{ merged: object, expression: string }}
 */
function mergeCron(exprA, exprB, strategy = 'union') {
  const a = parseCron(exprA);
  const b = parseCron(exprB);

  const fields = ['minute', 'hour', 'dom', 'month', 'dow'];

  const merged = {};
  for (const field of fields) {
    merged[field] = mergeField(a[field], b[field], strategy);
  }

  const expression = fields.map(f => merged[f].join(',')).join(' ');

  return { merged, expression };
}

module.exports = { mergeField, mergeCron };
