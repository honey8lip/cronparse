/**
 * Computes the next run date(s) for a parsed cron expression.
 */

const FIELD_ORDER = ['minute', 'hour', 'dom', 'month', 'dow'];

function matchesField(value, fieldDef) {
  if (fieldDef.type === 'wildcard') return true;

  if (fieldDef.type === 'value') return value === fieldDef.value;

  if (fieldDef.type === 'range') {
    return value >= fieldDef.from && value <= fieldDef.to;
  }

  if (fieldDef.type === 'step') {
    const base = fieldDef.start ?? 0;
    return value >= base && (value - base) % fieldDef.step === 0;
  }

  if (fieldDef.type === 'list') {
    return fieldDef.values.some((v) => matchesField(value, v));
  }

  return false;
}

function matchesCron(date, parsed) {
  const minute = date.getMinutes();
  const hour = date.getHours();
  const dom = date.getDate();
  const month = date.getMonth() + 1; // 1-indexed
  const dow = date.getDay(); // 0=Sun

  return (
    matchesField(minute, parsed.minute) &&
    matchesField(hour, parsed.hour) &&
    matchesField(dom, parsed.dom) &&
    matchesField(month, parsed.month) &&
    matchesField(dow, parsed.dow)
  );
}

/**
 * Returns the next N run dates after `from` for the given parsed cron.
 * @param {object} parsed - result of parseCron()
 * @param {Date} [from=new Date()] - start date (exclusive)
 * @param {number} [count=1] - how many upcoming dates to return
 * @param {number} [maxIterations=525600] - safety cap (~1 year of minutes)
 * @returns {Date[]}
 */
function nextRun(parsed, from = new Date(), count = 1, maxIterations = 525600) {
  const results = [];
  // Start from the next whole minute
  const cursor = new Date(from);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  let iterations = 0;
  while (results.length < count && iterations < maxIterations) {
    if (matchesCron(cursor, parsed)) {
      results.push(new Date(cursor));
    }
    cursor.setMinutes(cursor.getMinutes() + 1);
    iterations++;
  }

  return results;
}

module.exports = { nextRun, matchesField, matchesCron };
