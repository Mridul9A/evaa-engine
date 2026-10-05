import fs from 'node:fs/promises';

/**
 * Parse MATLAB v5 MAT file into EVAA's standard event model:
 *
 * { t, x, y, p }
 */
export async function parseMat(filePath) {
  if (!filePath) {
    throw new Error('MAT file path is required');
  }

  const buffer = await fs.readFile(filePath);

  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );

  const view = new DataView(arrayBuffer);

  // MATLAB v5 files contain a 128-byte header.
  if (arrayBuffer.byteLength < 128) {
    throw new Error('Invalid MAT file: file is too small');
  }

  const headerText = new TextDecoder('ascii').decode(
    new Uint8Array(arrayBuffer, 0, 116)
  );

  if (!headerText.includes('MATLAB')) {
    throw new Error(
      'Invalid MAT file header. Must be a MATLAB v5 format file.'
    );
  }

  let offset = 128;
  const rows = [];

  while (offset < arrayBuffer.byteLength) {
    // Need at least 8 bytes for a data element tag.
    if (offset + 8 > arrayBuffer.byteLength) {
      break;
    }

    const type = view.getUint32(offset, true);
    const size = view.getUint32(offset + 4, true);

    // miMATRIX = 14
    if (type === 14 && size > 0) {
      const dataStart = offset + 8;
      const dataEnd = Math.min(
        dataStart + size,
        arrayBuffer.byteLength
      );

      const dataBuffer = arrayBuffer.slice(dataStart, dataEnd);

      // Existing MAT implementation expects Float64 data.
      const dataView = new Float64Array(dataBuffer);

      const numEvents = Math.floor(dataView.length / 4);

      if (numEvents > 0) {
        for (let i = 0; i < numEvents; i++) {
          rows.push([
            dataView[i],
            dataView[i + numEvents],
            dataView[i + 2 * numEvents],
            dataView[i + 3 * numEvents]
          ]);
        }
      }

      break;
    }

    // MATLAB data elements are 8-byte aligned.
    offset += 8 + size + ((8 - (size % 8)) % 8);
  }

  if (rows.length === 0) {
    throw new Error('No numeric event data found in MAT file.');
  }

  const standardized = [];

  for (const row of rows) {
    const t = Number(row[0]);
    const x = Number(row[1]);
    const y = Number(row[2]);
    const p = Number(row[3]);

    if (
      !Number.isNaN(t) &&
      !Number.isNaN(x) &&
      !Number.isNaN(y) &&
      !Number.isNaN(p)
    ) {
      standardized.push({
        t,
        x: Math.floor(x),
        y: Math.floor(y),
        p: Math.floor(p)
      });
    }
  }

  if (standardized.length === 0) {
    throw new Error('No valid event data found in MAT file.');
  }

  return standardized;
}