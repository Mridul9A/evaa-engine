import { parseNpy } from '../ingest/parsers/npy.parser.js';

const events = await parseNpy('./test/sample.npy');

console.log('Event count:', events.length);
console.log('First 10 events:', events.slice(0, 10));