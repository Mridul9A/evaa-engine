import fs from 'node:fs';

const events = [
  [1000, 10, 20, 1],
  [1100, 15, 25, 0],
  [1200, 20, 30, 1]
];

// MAT parser expects column-major data:
// all t values, then x, then y, then p
const values = [];

for (let column = 0; column < 4; column++) {
  for (const event of events) {
    values.push(event[column]);
  }
}

// Convert values to Float64 binary data
const data = Buffer.alloc(values.length * 8);

values.forEach((value, index) => {
  data.writeDoubleLE(value, index * 8);
});

// Create 128-byte MATLAB-style header
const header = Buffer.alloc(128, ' ');

Buffer.from(
  'MATLAB 5.0 MAT-file, EVAA test data',
  'ascii'
).copy(header, 0);

// Version
header.writeUInt16LE(0x0100, 124);

// Endian indicator
header.write('IM', 126, 2, 'ascii');

// miMATRIX = 14
const tag = Buffer.alloc(8);
tag.writeUInt32LE(14, 0);
tag.writeUInt32LE(data.length, 4);

// Final MAT file
const output = Buffer.concat([
  header,
  tag,
  data
]);

fs.writeFileSync('./test/sample.mat', output);

console.log('Created: test/sample.mat');
console.log('Events:', events.length);