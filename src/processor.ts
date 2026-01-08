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

  async run() {
    const input = await this.readStdin();
    if (!input.trim()) return;

    // Try to parse as ParseRequest first
    try {
      const request = fromJsonString(ParseRequestSchema, input);
      this.handleParse(request);
      return;
    } catch {
      // Ignore error and try StringifyRequest
    }

    // Fallback to StringifyRequest
    try {
      const request = fromJsonString(StringifyRequestSchema, input);
      this.handleStringify(request);
    } catch (e) {
      console.error("Failed to parse request:", e);
      process.exit(1);
    }
  }

  private handleParse(request: ParseRequest) {
    try {
      const doc = this.parse(request.resource, request.context);
      const response = create(ParseResponseSchema, {
        document: toProtoDocument(doc),
      });
      process.stdout.write(toJsonString(ParseResponseSchema, response));
    } catch (e) {
      console.error("Parse error:", e);
      process.exit(1);
    }
  }

  private handleStringify(request: StringifyRequest) {
    try {
      if (!request.document) {
        throw new Error("Missing document in StringifyRequest");
      }

      const doc = fromProtoDocument(request.document);
      const res = this.stringify(doc, request.context);

      const response = create(StringifyResponseSchema, {
        resource: res,
      });
      process.stdout.write(toJsonString(StringifyResponseSchema, response));
    } catch (e) {
      console.error("Stringify error:", e);
      process.exit(1);
    }
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
