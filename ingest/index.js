import path from 'node:path';

import { parseFile } from './parser.js';
import { validateEvents } from '../utils/validation.js';
import { buildMetadata } from '../utils/metadata.js';

export async function ingest(
  inputPath,
  outputDir,
  options = {}
) {
  if (!inputPath) {
    throw new Error('inputPath is required');
  }

  if (!outputDir) {
    throw new Error('outputDir is required');
  }

  const format = path
    .extname(inputPath)
    .replace('.', '')
    .toLowerCase();

  console.log(
    `[EVAA] Ingesting: ${inputPath}`
  );

  console.log(
    `[EVAA] Format: ${format}`
  );

  // Parse
  const events =
    await parseFile(inputPath);

  // Validate
  validateEvents(events);

  // Metadata
  const metadata =
    buildMetadata(
      events,
      format,
      options
    );

  return {
    success: true,

    metadata,

    preview:
      events.slice(0, 10),

    eventCount:
      events.length,

    files: []
  };
}