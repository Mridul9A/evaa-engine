export function validateEvents(events) {
  if (!Array.isArray(events)) {
    throw new Error(
      'Parser must return an array of events'
    );
  }

  if (events.length === 0) {
    throw new Error(
      'No valid events found'
    );
  }

  for (const event of events) {
    if (
      typeof event.t !== 'number' ||
      typeof event.x !== 'number' ||
      typeof event.y !== 'number' ||
      typeof event.p !== 'number'
    ) {
      throw new Error(
        'Invalid event. Expected { t, x, y, p }'
      );
    }
  }

  return true;
}