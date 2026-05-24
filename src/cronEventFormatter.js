// cronEventFormatter.js — formats cron event data for display

const { listEvents } = require('./cronEvent');

function formatEventEntry(event, handlerCount) {
  return `[${event}] handlers: ${handlerCount}`;
}

function formatEmitterSummary(id, events) {
  if (!events || events.length === 0) {
    return `Emitter "${id}": no active events`;
  }
  const lines = events.map(e => `  - ${e}`);
  return [`Emitter "${id}":`, ...lines].join('\n');
}

function toEventJSON(id, events) {
  return { id, events: events || [] };
}

function formatAllEmitters(emitterIds, getEventsFn) {
  if (!emitterIds || emitterIds.length === 0) return 'No emitters registered.';
  return emitterIds
    .map(id => formatEmitterSummary(id, getEventsFn(id)))
    .join('\n\n');
}

module.exports = { formatEventEntry, formatEmitterSummary, toEventJSON, formatAllEmitters };
