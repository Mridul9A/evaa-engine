import { parseMat } from '../ingest/parsers/mat.parser.js';

const events = await parseMat('./test/sample.mat');

console.log('Event count:', events.length);
console.log('First 10 events:', events.slice(0, 10));