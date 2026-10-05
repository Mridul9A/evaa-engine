import { parseCsv } from '../ingest/parsers/csv.parser.js';

const events = await parseCsv('./test/sample.csv');

console.log('Event count:', events.length);
console.log('First 10 events:', events.slice(0, 10));