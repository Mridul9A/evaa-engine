import { parseFile } from '../ingest/parser.js';

export async function visualize(filePath) {
  const events =
    await parseFile(filePath);

  return {
    filePath,

    eventCount:
      events.length,

    output:
      'visualization not implemented yet'
  };
}