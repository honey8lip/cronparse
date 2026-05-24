/**
 * cronparse — main entry point
 */

export { parseCron, parseField, resolveAlias } from './parser.js';
export { validate, validateParsed, validatePart } from './validator.js';
export { humanize, describeField, formatValue } from './humanize.js';
export { nextRun, matchesCron, matchesField } from './nextRun.js';
export { toSummary, toExpression, formatFieldValue } from './formatter.js';
export { resolvePreset, isPreset, getPreset, listPresetNames } from './presets.js';
export { diffCron, diffFields } from './diff.js';
export { explain, describeValue } from './explain.js';
export { getSchedule, getScheduleInRange } from './schedule.js';
export { formatSchedule, formatRunDate, toScheduleSummary } from './scheduleFormatter.js';
export { mergeCron, mergeField } from './merge.js';
export { normalize, fillDefaults, normalizeWhitespace, expandAlias } from './normalize.js';
export { toSixField, toFiveField, toNamedFields, fromNamedFields } from './convert.js';
export { stringify, stringifyField } from './stringify.js';
export { compareCron, fieldsEqual, expandField } from './compare.js';
export { suggestFromPartial, listSuggestions, searchSuggestions } from './suggest.js';
export { listTimezones, isValidTimezone, toTimezone, nextRunInTimezone } from './timezone.js';
export { auditCron, isWildcard, isEveryMinute, hasBothDomAndDow, isFrequent, hasAliases } from './audit.js';
export { range, expandToken, rangesEqual, rangeIntersect } from './range.js';
export { matchesToken, matchesFieldValue, matchingValues, fieldsMatch, isSubsetOf } from './matchers.js';
export { fieldOverlaps, canOverlap, overlapSummary } from './overlap.js';
export { getBounds, clamp, inBounds, allValues, fieldLabel } from './bounds.js';
export { getLastRuns, getRunsBetween, summarizeHistory } from './cronHistory.js';
export { formatRunEntry, formatHistoryList, toHistorySummary } from './historyFormatter.js';
export { shiftCron, shiftField, shiftToken, addMinutes } from './cronMath.js';

/**
 * All-in-one cronparse function.
 * Returns a rich object with parsed fields, validation, human description, and next run.
 */
export function cronparse(expression, options = {}) {
  const { parseCron } = await import('./parser.js');
  const { validate } = await import('./validator.js');
  const { humanize } = await import('./humanize.js');
  const { nextRun } = await import('./nextRun.js');

  const parsed = parseCron(expression);
  const validation = validate(expression);
  const description = humanize(expression);
  const next = nextRun(expression, options.from ?? new Date());

  return {
    expression,
    parsed,
    valid: validation.valid,
    errors: validation.errors ?? [],
    description,
    nextRun: next,
  };
}
