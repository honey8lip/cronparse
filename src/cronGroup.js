/**
 * cronGroup.js — Group and manage multiple cron expressions as a named set
 */

import { parseCron } from './parser.js';
import { validate } from './validator.js';
import { nextRun } from './nextRun.js';

/**
 * Create a new group from an array of { name, expression } entries
 * @param {Array<{name: string, expression: string}>} entries
 * @returns {Object} group
 */
export function createGroup(entries = []) {
  const group = {};
  for (const { name, expression } of entries) {
    if (!name || typeof name !== 'string') throw new Error('Each entry must have a name');
    if (!validate(expression).valid) throw new Error(`Invalid expression for "${name}": ${expression}`);
    group[name] = expression;
  }
  return group;
}

/**
 * Add or update a named expression in a group
 * @param {Object} group
 * @param {string} name
 * @param {string} expression
 * @returns {Object} updated group (new object)
 */
export function addToGroup(group, name, expression) {
  if (!validate(expression).valid) throw new Error(`Invalid expression: ${expression}`);
  return { ...group, [name]: expression };
}

/**
 * Remove a named entry from a group
 * @param {Object} group
 * @param {string} name
 * @returns {Object} updated group (new object)
 */
export function removeFromGroup(group, name) {
  const { [name]: _, ...rest } = group;
  return rest;
}

/**
 * Get the next run time for each expression in the group
 * @param {Object} group
 * @param {Date} [from]
 * @returns {Array<{name: string, expression: string, nextRun: Date}>}
 */
export function groupNextRuns(group, from = new Date()) {
  return Object.entries(group).map(([name, expression]) => ({
    name,
    expression,
    nextRun: nextRun(expression, from),
  }));
}

/**
 * Sort group entries by their next run time (ascending)
 * @param {Object} group
 * @param {Date} [from]
 * @returns {Array<{name: string, expression: string, nextRun: Date}>}
 */
export function sortGroupByNextRun(group, from = new Date()) {
  return groupNextRuns(group, from).sort((a, b) => a.nextRun - b.nextRun);
}

/**
 * List all names in the group
 * @param {Object} group
 * @returns {string[]}
 */
export function listGroupNames(group) {
  return Object.keys(group);
}
