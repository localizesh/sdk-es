import Ajv from "ajv";
import { Document, Context } from "./types.js";
import type {
  ParseRequest,
  ParseResponse,
  StringifyRequest,
  StringifyResponse,
} from "./schema.js";
import schema from "./schema.json" assert { type: "json" };

export abstract class Processor {
  private static ajv = new Ajv();
  private static validateParseRequest = Processor.ajv.compile({
    ...schema.definitions.ParseRequest,
    definitions: schema.definitions,
  });
  private static validateStringifyRequest = Processor.ajv.compile({
    ...schema.definitions.StringifyRequest,
    definitions: schema.definitions,
  });

  abstract parse(res: string, ctx?: Context): Document;
  abstract stringify(doc: Document, ctx?: Context): string;

  /**
   * Processes a JSON string input (ParseRequest or StringifyRequest)
   * and returns a JSON string output (ParseResponse or StringifyResponse).
   * Safe to use in browser environments.
   */
  public process(input: string): string {
    const request = JSON.parse(input);

    // Validate and handle ParseRequest
    if (Processor.validateParseRequest(request)) {
      return this.handleParse(request as unknown as ParseRequest);
    }

    // Validate and handle StringifyRequest
    if (Processor.validateStringifyRequest(request)) {
      return this.handleStringify(request as unknown as StringifyRequest);
    }

    // Collect all validation errors
    const errors = [
      ...(Processor.validateParseRequest.errors || []),
      ...(Processor.validateStringifyRequest.errors || []),
    ];
    throw new Error(`Invalid request: ${JSON.stringify(errors)}`);
  }

  /**
   * Reads from stdin and writes to stdout.
   * Node.js environment only.
   */
  async run() {
    if (typeof process === "undefined" || !process.stdin || !process.stdout) {
      throw new Error(
        "Processor.run() is only available in Node.js environment",
      );
    }

    try {
      const input = await this.readStdin();
      if (!input.trim()) return;

      const output = this.process(input);
      process.stdout.write(output);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }

  private handleParse(request: ParseRequest): string {
    const doc = this.parse(request.resource, request.context);
    const response: ParseResponse = {
      document: doc as any, // Layout is typed as LayoutRoot but schema expects generic object
    };
    return JSON.stringify(response);
  }

  private handleStringify(request: StringifyRequest): string {
    if (!request.document) {
      throw new Error("Missing document in StringifyRequest");
    }

    const res = this.stringify(
      request.document as unknown as Document,
      request.context,
    );
    const response: StringifyResponse = {
      resource: res,
    };
    return JSON.stringify(response);
  }

  private readStdin(): Promise<string> {
    return new Promise((resolve, reject) => {
      let data = "";
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", (chunk) => (data += chunk));
      process.stdin.on("end", () => resolve(data));
      process.stdin.on("error", reject);
    });
  }
}
