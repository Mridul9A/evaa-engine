export { ingest } from './ingest/index.js';
export { benchmark } from './benchmark/benchmark.js';
export { visualize } from './visualize/visualize.js';

export function ingest(filePath) {
  return {
    status: 'ingested',
    filePath,
    format: filePath.split('.').pop(),
    eventModel: ['t', 'x', 'y', 'p']
  };
}

export async function benchmark(filePath) {
  return {
    filePath,
    eventCount: 1000,
    durationMs: 42,
    metric: 'demo benchmark'
  };
}

export function visualize(filePath) {
  return {
    filePath,
    output: 'events-plot.png'
  };
}
