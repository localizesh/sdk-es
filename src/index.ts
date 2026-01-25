export * from "./types.js";
export * from "./generators.js";
export * from "./processor.js";
export * from "./utils.js";

// Re-export hastscript for convenience
export { h } from "hastscript";

// Helpers to create special nodes
import type { SegmentNode, TextNode } from "./types.js";

export function s(id: string): SegmentNode {
  return { type: "segment", id };
}

export function t(value: string): TextNode {
  return { type: "text", value };
}
