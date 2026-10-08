import path from 'node:path';
import fs from 'node:fs/promises';

import { parseFile } from './parser.js';
import { validateEvents } from '../utils/validation.js';
import { buildMetadata } from '../utils/metadata.js';
import {
  toColumns,
  isSortedByTime,
  sortColumns,
  previewRows
} from '../utils/columns.js';
import { writeHdf5 } from '../writers/hdf5.writer.js';
import { writeParquet } from '../writers/parquet.writer.js';

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

  console.log(`[EVAA] Ingesting: ${inputPath}`);
  console.log(`[EVAA] Format: ${format}`);

  // Parse and validate
  const events = await parseFile(inputPath);
  validateEvents(events);

  const metadata = buildMetadata(events, format, options);

  // Compact columns, sorted by time
  let columns = toColumns(events);

  metadata.sortedInput = isSortedByTime(columns.t);

  if (!metadata.sortedInput) {
    columns = sortColumns(columns);
  }

  // Write the output files
  await fs.mkdir(outputDir, { recursive: true });

  const hdf5Path = path.join(outputDir, 'events.h5');
  const parquetPath = path.join(outputDir, 'data.parquet');

  await writeHdf5(columns, hdf5Path, metadata);
  await writeParquet(columns, parquetPath);

  return {
    success: true,

    metadata,

    preview: previewRows(columns, 10),

    eventCount: columns.n,

    files: [
      { kind: 'HDF5', path: hdf5Path },
      { kind: 'PARQUET', path: parquetPath }
    ]
  };
}