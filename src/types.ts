import { Root, Node, Text, Element } from "hast";

export interface Segment {
  id: string;
  text: string;
  tags?: Tags;
}

export interface Tag {
  attrs: { [key: string]: string };
}

export type Tags = {
  [key: string]: Tag;
};

export interface LayoutRoot extends Root {}

export interface SegmentNode extends Node {
  type: "segment";
  id: string;
}

export interface TextNode extends Text {}

export type LayoutNode = Root | Element | SegmentNode | TextNode;

export type Context = any;

export interface Document {
  segments: Segment[];
  layout: LayoutRoot;
  metadata?: { [key: string]: any };
}

declare module "hast" {
  interface RootContentMap {
    segment: SegmentNode;
  }
  interface ElementContentMap {
    segment: SegmentNode;
  }
}
