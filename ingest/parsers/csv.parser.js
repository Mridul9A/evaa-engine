import fs from 'node:fs/promises';

const COLUMN_MAPPING = {
  timestamp: 't',
  time: 't',
  ts: 't',
  timestamp_s: 't',
  t_s: 't',

  pos_x: 'x',
  coord_x: 'x',
  channel: 'x',
  ch: 'x',

  pos_y: 'y',
  coord_y: 'y',
  event_id: 'y',
  duration_ms: 'y',

  polarity: 'p',
  pol: 'p',
  event_type: 'p',
  amplitude: 'p',
  val: 'p'
};

export async function parseCsv(filePath) {
  if (!filePath) {
    throw new Error('CSV file path is required');
  }

  const text = await fs.readFile(filePath, 'utf8');

  // Ignore empty lines and comments
  const lines = text.split(/\r?\n/).filter((line) => {
    const trimmed = line.trim();

    return trimmed.length > 0 && !trimmed.startsWith('#');
  });

  if (lines.length === 0) {
    throw new Error('CSV file is empty or contains no valid lines');
  }

  // First row
  const firstRowTokens = lines[0]
    .split(',')
    .map((value) => value.trim().replace(/^["']|["']$/g, ''));

  // Existing implementation determines header by checking for letters
  const hasHeader = firstRowTokens.some((token) => /[a-zA-Z]/.test(token));

  let headers;
  let dataLines;

  if (hasHeader) {
    headers = firstRowTokens.map((header) => header.toLowerCase());
    dataLines = lines.slice(1);
  } else {
    headers = ['t', 'x', 'y', 'p'];
    dataLines = lines;
  }

  // Convert aliases to standard names
  let mappedHeaders = headers.map(
    (header) => COLUMN_MAPPING[header] || header
  );

  const targetColumns = ['t', 'x', 'y', 'p'];

  const missing = targetColumns.filter(
    (column) => !mappedHeaders.includes(column)
  );

  // Existing fallback:
  // if there are at least 4 columns, assume first 4 are t,x,y,p
  if (missing.length > 0) {
    if (mappedHeaders.length >= 4) {
      for (let i = 0; i < 4; i++) {
        mappedHeaders[i] = targetColumns[i];
      }
    } else {
      throw new Error('CSV requires at least 4 columns');
    }
  }

  const indices = {
    t: mappedHeaders.indexOf('t'),
    x: mappedHeaders.indexOf('x'),
    y: mappedHeaders.indexOf('y'),
    p: mappedHeaders.indexOf('p')
  };

  const parsedData = [];

  for (const line of dataLines) {
    const tokens = line
      .split(',')
      .map((value) => value.trim().replace(/^["']|["']$/g, ''));

    if (tokens.length < 4) {
      continue;
    }

    const t = Number(tokens[indices.t]);
    const x = Number(tokens[indices.x]);
    const y = Number(tokens[indices.y]);
    const p = Number(tokens[indices.p]);

    if (
      !Number.isNaN(t) &&
      !Number.isNaN(x) &&
      !Number.isNaN(y) &&
      !Number.isNaN(p)
    ) {
      parsedData.push({
        t,
        x: Math.floor(x),
        y: Math.floor(y),
        p: Math.floor(p)
      });
    }
  }

  return parsedData;
}