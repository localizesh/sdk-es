# Localize.sh SDK (ECMAScript)

A TypeScript/JavaScript SDK for building [Localize.sh](https://localize.sh) processors and handling localization documents. This SDK provides type definitions, utilities, and a robust base class for implementing custom processors.

## Features

- **Abstract Processor**: A base class for creating custom processors that work seamlessly with the Localize.sh CLI (Node.js) and in browser environments.
- **JSON Validation**: Runtime validation of requests using JSON Schema and AJV.
- **ID Generation**: Utilities for generating deterministic MD5-based IDs for segments.
- **Type Definitions**: Comprehensive TypeScript definitions for Documents, Segments, and Layouts (HAST compatible).
- **Browser Compatible**: Works in both Node.js and browser environments.

## Installation

```bash
npm install @localizesh/sdk
```

## Usage

### Creating a Processor

Extend the `Processor` abstract class to implement your custom localization logic. This works for both CLI tools and browser-based processors.

```typescript
import { Processor, Document, Context } from "@localizesh/sdk";

export class MyCustomProcessor extends Processor {
  // Parse a source file (e.g., Markdown, JSON) into a Localize Document
  parse(res: string, ctx?: Context): Document {
    return {
      segments: [
        { id: "dfc45caaec2819e2446e5bb669642cc9", text: "Hello World" }
      ],
      layout: {
        type: "root",
        "children": [
          { "type": "segment", "id": "dfc45caaec2819e2446e5bb669642cc9" }
        ]
      }
    };
  }

  // Convert a Localize Document back into the source format
  stringify(doc: Document, ctx?: Context): string {
    return doc.segments.map(s => s.text).join("\n");
  }
}

// If running in a Node.js CLI environment:
const processor = new MyCustomProcessor();
processor.run();
```

### ID Generation

Generate stable IDs for your segments based on text and context.

```typescript
import { IdGenerator } from "@localizesh/sdk";

// Default: accounts for duplicates (index 1, 2, 3...)
const generator = new IdGenerator();
const id1 = generator.generateId("Hello {b1}World{/b1}", { b1: { class: "bold" } });

// Ignore Index: returns same ID for duplicates
const generatorNoIndex = new IdGenerator({ ignoreIndex: true });
const id2 = generatorNoIndex.generateId("Hello World");
```

## Development

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Generate schema types**:
    ```bash
    npm run schema
    ```

3.  **Build the SDK**:
    ```bash
    npm run build
    ```

4.  **Run Tests**:
    ```bash
    npm test
    ```

## License

[Apache 2.0](LICENSE)
