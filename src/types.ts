import { Root, Node, Text, Element } from "hast";
import type { Tag as SchemaTag } from "./schema.js";

// HAST-specific extensions
export interface LayoutRoot extends Root {}

export interface LayoutNode extends Node {}

export interface ElementNode extends Element {}

export interface SegmentNode extends Node {
  type: "segment";
  id: string;
}

export interface TextNode extends Text {}

export type Context = any;

// Extended Document type with typed layout
export interface Document {
  segments: Segment[];
  layout: LayoutRoot;
  metadata?: { [key: string]: any };
}

// SDK types (aligned with schema but with specific HAST types)
export type Tag = SchemaTag;

export interface Segment {
  id: string;
  text: string;
  tags?: {
    [key: string]: Tag;
  };
}

declare module "hast" {
  interface RootContentMap {
    segment: SegmentNode;
  }
  interface ElementContentMap {
    segment: SegmentNode;
  }
}
