export * from "./types.js";
export * from "./generators.js";
export * from "./processor.js";
export * from "./utils.js";

// Helpers to create layout nodes
import type { SegmentNode, TextNode, LayoutRoot, LayoutNode } from "./types.js";

// Re-export hastscript as 'element'
export { h as element } from "hastscript";

export function root(children: LayoutNode[] = []): LayoutRoot {
  return { type: "root", children } as LayoutRoot;
}

export function segment(id: string): SegmentNode {
  return { type: "segment", id };
}

export function text(value: string): TextNode {
  return { type: "text", value };
}
