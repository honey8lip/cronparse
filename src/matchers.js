/**
 * matchers.js — Field matching utilities for cron expressions
 * Provides pattern-based matching helpers for cron fields.
 */

import { expandToken, expandField } from './range.js';

/**
 * Check if a value matches a single cron token (e.g. "*", "5", "1-5", "*/2")
 */
export function matchesToken(value, token) {
  if (token === '*') return true;
  const expanded = expandToken(token);
  return expanded.includes(value);
}

/**
 * Check if a numeric value matches a parsed cron field string
 */
export function matchesFieldValue(value, fieldStr) {
  if (fieldStr === '*') return true;
  const parts = fieldStr.split(',');
  return parts.some(token => matchesToken(value, token.trim()));
}

/**
 * Return all values in [min, max] that match the given field string
 */
export function matchingValues(fieldStr, min, max) {
  const results = [];
  for (let i = min; i <= max; i++) {
    if (matchesFieldValue(i, fieldStr)) results.push(i);
  }
  return results;
}

/**
 * Check if two field strings match the same set of values within [min, max]
 */
export function fieldsMatch(fieldA, fieldB, min, max) {
  const a = matchingValues(fieldA, min, max);
  const b = matchingValues(fieldB, min, max);
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

/**
 * Check if a field string is a subset of another within [min, max]
 */
export function isSubsetOf(fieldA, fieldB, min, max) {
  const a = matchingValues(fieldA, min, max);
  const b = matchingValues(fieldB, min, max);
  return a.every(v => b.includes(v));
}

/**
 * Return the overlap between two field strings within [min, max]
 */
export function fieldOverlap(fieldA, fieldB, min, max) {
  const a = matchingValues(fieldA, min, max);
  const b = matchingValues(fieldB, min, max);
  return a.filter(v => b.includes(v));
}
