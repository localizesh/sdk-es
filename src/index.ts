export * from "./types.js";
export * from "./generators.js";
export * from "./processor.js";
export * from "./utils.js";

// Helpers to create layout nodes
import type {
  SegmentNode,
  TextNode,
  LayoutRoot,
  LayoutNode,
  ElementNode,
} from "./types.js";
import { h } from "hastscript";

export function root(children: LayoutNode[] = []): LayoutRoot {
  return { type: "root", children } as LayoutRoot;
}

export function element(
  tagName: string,
  ...children: (LayoutNode | string)[]
): ElementNode;
export function element(
  tagName: string,
  properties: { [key: string]: any },
  ...children: (LayoutNode | string)[]
): ElementNode;
export function element(
  tagName: string,
  propertiesOrChild?: { [key: string]: any } | LayoutNode | string,
  ...children: (LayoutNode | string)[]
): ElementNode {
  return h(
    tagName,
    propertiesOrChild as any,
    ...(children as any),
  ) as ElementNode;
}

export function segment(id: string): SegmentNode {
  return { type: "segment", id };
}

export function text(value: string = ""): TextNode {
  return { type: "text", value };
}
