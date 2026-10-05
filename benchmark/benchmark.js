import { parseFile } from '../ingest/parser.js';

export async function benchmark(filePath) {
  const start = performance.now();

  const events =
    await parseFile(filePath);

  const durationMs =
    performance.now() - start;

  return {
    filePath,

    eventCount:
      events.length,

    durationMs:
      Number(durationMs.toFixed(2)),

    metric:
      'parse duration'
  };
}