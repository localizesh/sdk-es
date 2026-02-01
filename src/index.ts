export * from "./types.js";
export * from "./generators.js";
export * from "./processor.js";
export * from "./utils.js";

// Helpers to create layout nodes
import type {
  LayoutSegment,
  LayoutText,
  LayoutRoot,
  LayoutNode,
  LayoutElement,
} from "./types.js";
import { h } from "hastscript";

type Child = LayoutNode | string | Child[];

export function root(children: LayoutNode[] = []): LayoutRoot {
  return { type: "root", children } as LayoutRoot;
}

export function element(tagName: string, ...children: Child[]): LayoutElement;
export function element(
  tagName: string,
  properties: { [key: string]: any },
  ...children: Child[]
): LayoutElement;
export function element(
  tagName: string,
  propertiesOrChild?: { [key: string]: any } | Child,
  ...children: Child[]
): LayoutElement {
  return h(
    tagName,
    propertiesOrChild as any,
    ...(children as any),
  ) as LayoutElement;
}

export function segment(id: string): LayoutSegment {
  return { type: "segment", id };
}

export function text(value: string = ""): LayoutText {
  return { type: "text", value };
}
