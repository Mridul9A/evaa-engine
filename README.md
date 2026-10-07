# EVAA Engine

**EVAA Engine** is the core event-camera data processing engine for **EVAA (Event Vision Analytics)**.

It provides reusable Node.js modules for ingesting event-camera datasets, benchmarking processed data, and generating visualizations.

The engine is designed to be consumed directly by the EVAA backend as a Node.js module, while keeping processing logic separate from the application/API layer.

## Features

- **Ingestion**
  - Process supported event-camera datasets
  - Normalize input data into a common representation
  - Prepare datasets for downstream analysis

- **Benchmarking**
  - Run dataset benchmarks
  - Generate performance and data-quality metrics

- **Visualization**
  - Generate visual representations of event-camera data
  - Support downstream visualization workflows

## Architecture

```text
                    EVAA Platform
                         │
                         ▼
                  EVAA Backend
                         │
                         ▼
                  ┌─────────────┐
                  │ EVAA Engine │
                  └─────────────┘
                     │    │    │
             ┌───────┘    │    └────────┐
             ▼             ▼             ▼
          Ingest       Benchmark     Visualize
             │             │             │
             └─────────────┴─────────────┘
                           │
                           ▼
                    Processed Dataset
```

The engine focuses on **data processing and analysis**, while the EVAA backend is responsible for application-level concerns such as authentication, dataset management, storage, APIs, and database operations.

## Installation

Clone the repository:

```bash
git clone https://github.com/Mridul9A/evaa-engine.git
```

Navigate into the project:

```bash
cd evaa-engine
```

Install dependencies:

```bash
npm install
```

## Usage

The engine exposes its core functionality through `index.js`.

```javascript
import {
  ingest,
  benchmark,
  visualize
} from "evaa-engine";
```

### Ingestion

Use `ingest` to process and normalize an event-camera dataset.

```javascript
import { ingest } from "evaa-engine";

const result = await ingest(inputPath, outputDir, options);
```

Where:

- `inputPath` — path to the input dataset
- `outputDir` — directory where processed output should be written
- `options` — optional processing configuration

Example:

```javascript
const result = await ingest(
  "./datasets/sample.h5",
  "./output/sample",
  {}
);

console.log(result);
```

### Benchmarking

Use `benchmark` to analyze a processed dataset.

```javascript
import { benchmark } from "evaa-engine";

const result = await benchmark(datasetPath, options);

console.log(result);
```

### Visualization

Use `visualize` to generate visual representations from processed event data.

```javascript
import { visualize } from "evaa-engine";

const result = await visualize(datasetPath, options);

console.log(result);
```

## Supported Data

EVAA is designed to work with event-based vision datasets and related data formats.

The ingestion layer is intended to support formats such as:

- `.aedat4`
- `.h5`
- `.hdf5`
- `.mat`
- `.parquet`
- `.zarr`
- `.csv`
- `.txt`
- `.npy`

Additional media and document formats may be supported at the EVAA platform level depending on the processing workflow.

## Event Data Model

Event-camera data is commonly represented using:

```text
[t, x, y, p]
```

Where:

| Field | Description |
|---|---|
| `t` | Event timestamp |
| `x` | Pixel X coordinate |
| `y` | Pixel Y coordinate |
| `p` | Event polarity |

The ingestion pipeline converts supported input formats into a normalized representation suitable for downstream processing.

## Module Structure

The package currently exposes the following modules:

```text
evaa-engine/
│
├── index.js
│
├── ingest/
│   └── ...
│
├── benchmark/
│   └── benchmark.js
│
├── visualize/
│   └── visualize.js
│
├── package.json
└── README.md
```

### Public API

The package entry point exports:

```javascript
export { ingest } from "./ingest/index.js";
export { benchmark } from "./benchmark/benchmark.js";
export { visualize } from "./visualize/visualize.js";
```

This allows the EVAA backend to consume the engine directly without communicating through an HTTP layer.

## Integration with EVAA Backend

The recommended architecture is:

```text
┌──────────────────┐
│   EVAA Frontend  │
└────────┬─────────┘
         │
         │ HTTP/API
         ▼
┌──────────────────┐
│   EVAA Backend   │
│     (NestJS)     │
└────────┬─────────┘
         │
         │ Direct function calls
         ▼
┌──────────────────┐
│   EVAA Engine    │
│   Node.js Module │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Dataset / Output │
│    Processing    │
└──────────────────┘
```

The engine does **not** need to expose its own HTTP API when it is consumed directly by the EVAA backend.

For example:

```javascript
import { ingest } from "evaa-engine";

const result = await ingest(
  inputPath,
  outputPath,
  options
);
```

An HTTP wrapper or separate processing service can be introduced later if the engine needs to run independently, scale separately, or be deployed as a separate worker/service.

## Package Information

```json
{
  "name": "evaa-engine",
  "version": "0.1.0",
  "type": "module",
  "main": "index.js",
  "exports": "./index.js"
}
```

## Development

Install dependencies:

```bash
npm install
```

The package uses native ES modules:

```javascript
import { ingest } from "evaa-engine";
```

## Roadmap

Planned improvements may include:

- [ ] Expand supported event-data formats
- [ ] Standardize ingestion output schema
- [ ] Add dataset validation
- [ ] Add event-data quality metrics
- [ ] Expand benchmarking capabilities
- [ ] Expand visualization capabilities
- [ ] Add automated tests
- [ ] Add TypeScript type definitions
- [ ] Add comprehensive API documentation
- [ ] Publish the package to npm
- [ ] Add CI/CD
- [ ] Add versioned releases

## License

License information will be added when the project license is finalized.

---

**EVAA Engine**  
Core processing engine for the EVAA Event Vision Analytics platform.
