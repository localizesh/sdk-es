import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Processor, root, segment, text } from "../src/index.js";
import { Document, Context } from "../src/types.js";
import type { ParseRequest, StringifyRequest } from "../src/schema.js";

class TestProcessor extends Processor {
  parse(res: string, ctx?: Context): Document {
    return {
      segments: [{ id: "1", text: res }],
      layout: root(),
      metadata: ctx,
    };
  }
  stringify(doc: Document, ctx?: Context): string {
    return doc.segments[0].text;
  }
}

describe("Processor", () => {
  let processor: TestProcessor;
  let stdinMock: any;
  let stdoutMock: any;
  let exitMock: any;

  beforeEach(() => {
    processor = new TestProcessor();

    // Mock stdin
    stdinMock = {
      setEncoding: vi.fn(),
      on: vi.fn(),
    };
    Object.defineProperty(process, "stdin", { value: stdinMock });

    // Mock stdout
    stdoutMock = {
      write: vi.fn(),
    };
    Object.defineProperty(process, "stdout", { value: stdoutMock });

    // Mock exit
    exitMock = vi.spyOn(process, "exit").mockImplementation((() => {}) as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("process()", () => {
    it("should handle ParseRequest", () => {
      const request: ParseRequest = {
        resource: "Hello World",
        context: { foo: "bar" },
      };
      const inputJson = JSON.stringify(request);

      const output = processor.process(inputJson);
      const response = JSON.parse(output);

      expect(response.document).toBeDefined();
      expect(response.document.segments[0].text).toBe("Hello World");
    });

    it("should handle StringifyRequest", () => {
      const request: StringifyRequest = {
        document: {
          segments: [{ id: "1", text: "Hello World" }],
          layout: root(),
        },
      };
      const inputJson = JSON.stringify(request);

      const output = processor.process(inputJson);
      const response = JSON.parse(output);

      expect(response.resource).toBe("Hello World");
    });
  });

  describe("run()", () => {
    it("should handle ParseRequest from stdin", async () => {
      const request: ParseRequest = {
        resource: "Hello World",
      };
      const inputJson = JSON.stringify(request);

      const runPromise = processor.run();

      const dataCallback = stdinMock.on.mock.calls.find(
        (call: any[]) => call[0] === "data",
      )[1];
      dataCallback(inputJson);

      const endCallback = stdinMock.on.mock.calls.find(
        (call: any[]) => call[0] === "end",
      )[1];
      endCallback();

      await runPromise;

      expect(stdoutMock.write).toHaveBeenCalled();
      const output = stdoutMock.write.mock.calls[0][0];
      const response = JSON.parse(output);

      expect(response.document.segments[0].text).toBe("Hello World");
    });
  });
});
