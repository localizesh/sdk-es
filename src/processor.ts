import { create, fromJsonString, toJsonString } from "@bufbuild/protobuf";
import { Document, Context } from "./types.js";
import { fromProtoDocument, toProtoDocument } from "./mappers.js";
import {
  ParseRequest,
  ParseRequestSchema,
  ParseResponseSchema,
  StringifyRequest,
  StringifyRequestSchema,
  StringifyResponseSchema,
} from "./protos/localize/processor_pb.js";

export abstract class Processor {
  abstract parse(res: string, ctx?: Context): Document;
  abstract stringify(doc: Document, ctx?: Context): string;

  /**
   * Processes a JSON string input (ParseRequest or StringifyRequest)
   * and returns a JSON string output (ParseResponse or StringifyResponse).
   * Safe to use in browser environments.
   */
  public process(input: string): string {
    // Try to parse as ParseRequest first
    try {
      const request = fromJsonString(ParseRequestSchema, input);
      // Valid ParseRequest
      return this.handleParse(request);
    } catch {
      // Ignore error and try StringifyRequest
    }

    // Fallback to StringifyRequest
    try {
      const request = fromJsonString(StringifyRequestSchema, input);
      return this.handleStringify(request);
    } catch (e) {
      throw new Error(`Failed to parse request: ${e}`);
    }
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
    const response = create(ParseResponseSchema, {
      document: toProtoDocument(doc),
    });
    return toJsonString(ParseResponseSchema, response);
  }

  private handleStringify(request: StringifyRequest): string {
    if (!request.document) {
      throw new Error("Missing document in StringifyRequest");
    }

    const doc = fromProtoDocument(request.document);
    const res = this.stringify(doc, request.context);

    const response = create(StringifyResponseSchema, {
      resource: res,
    });
    return toJsonString(StringifyResponseSchema, response);
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
