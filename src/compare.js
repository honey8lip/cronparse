/**
 * compare.js — Compare two cron expressions and determine their relationship
 */

import { parseCron } from './parser.js';

/**
 * Check if two field expressions are equivalent
 */
export function fieldsEqual(a, b) {
  if (a === b) return true;
  if (a === '*' && b === '*') return true;
  const setA = expandField(a);
  const setB = expandField(b);
  if (setA.size !== setB.size) return false;
  for (const v of setA) {
    if (!setB.has(v)) return false;
  }
  return true;
}

function expandField(field) {
  const values = new Set();
  const parts = String(field).split(',');
  for (const part of parts) {
    if (part.includes('/')) {
      const [range, step] = part.split('/');
      const [start, end] = range === '*' ? [0, 59] : range.split('-').map(Number);
      for (let i = start; i <= end; i += Number(step)) values.add(i);
    } else if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      for (let i = start; i <= end; i++) values.add(i);
    } else if (part !== '*') {
      values.add(Number(part));
    }
  }
  return values;
}

/**
 * Compare two cron expressions
 * Returns: 'equal' | 'subset' | 'superset' | 'overlap' | 'disjoint'
 */
export function compareCron(exprA, exprB) {
  const a = parseCron(exprA);
  const b = parseCron(exprB);
  const fields = ['minute', 'hour', 'day', 'month', 'weekday'];

  let aSubB = true;
  let bSubA = true;

  for (const field of fields) {
    const fa = a[field];
    const fb = b[field];
    if (fa === '*' && fb === '*') continue;
    if (fa !== '*' && fb === '*') { bSubA = false; continue; }
    if (fa === '*' && fb !== '*') { aSubB = false; continue; }
    const sa = expandField(fa);
    const sb = expandField(fb);
    const aInB = [...sa].every(v => sb.has(v));
    const bInA = [...sb].every(v => sa.has(v));
    if (!aInB) aSubB = false;
    if (!bInA) bSubA = false;
  }

  if (aSubB && bSubA) return 'equal';
  if (aSubB) return 'subset';
  if (bSubA) return 'superset';

  // Check for any overlap
  for (const field of fields) {
    const fa = a[field];
    const fb = b[field];
    if (fa === '*' || fb === '*') continue;
    const sa = expandField(fa);
    const sb = expandField(fb);
    const hasOverlap = [...sa].some(v => sb.has(v));
    if (!hasOverlap) return 'disjoint';
  }

  return 'overlap';
}
