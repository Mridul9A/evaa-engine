export function buildMetadata(
  events,
  format,
  options = {}
) {
  const timestamps = events.map(
    event => event.t
  );

  const minTimestamp =
    Math.min(...timestamps);

  const maxTimestamp =
    Math.max(...timestamps);

  return {
    format,

    width:
      options.width ?? null,

    height:
      options.height ?? null,

    eventCount:
      events.length,

    durationUs:
      maxTimestamp - minTimestamp,

    eventModel: [
      't',
      'x',
      'y',
      'p'
    ]
  };
}