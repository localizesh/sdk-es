import { create } from "@bufbuild/protobuf";
import {
  Document as ProtoDocument,
  DocumentSchema as ProtoDocumentSchema,
} from "./protos/localize/document_pb.js";
import {
  Segment as ProtoSegment,
  SegmentSchema,
  Tag,
} from "./protos/localize/segment_pb.js";

import { Document, LayoutRoot, Segment, Tags } from "./types.js";

export function fromProtoDocument(protoDocument: ProtoDocument): Document {
  return {
    segments: fromProtoSegments(protoDocument.segments),
    layout: (protoDocument.layout as unknown as LayoutRoot) || {
      type: "root",
      children: [],
    },
    metadata: protoDocument.metadata,
  };
}

export function toProtoDocument(document: Document): ProtoDocument {
  return create(ProtoDocumentSchema, {
    segments: toProtoSegments(document.segments),
    layout: document.layout as any,
    metadata: document.metadata,
  });
}

export function fromProtoSegment(protoSegment: ProtoSegment): Segment {
  const segment: Segment = { id: protoSegment.id, text: protoSegment.text };

  if (protoSegment.tags) {
    const tags: Tags = {};
    for (const tagKey of Object.keys(protoSegment.tags)) {
      const tag: Tag = protoSegment.tags[tagKey];
      tags[tagKey] = { attrs: tag.attrs };
    }

    if (Object.keys(tags).length) {
      segment.tags = tags;
    }
  }

  return segment;
}

export function fromProtoSegments(protoSegments: ProtoSegment[]): Segment[] {
  return protoSegments.map(fromProtoSegment);
}

export function toProtoSegment(segment: Segment): ProtoSegment {
  const protoSegment: any = { id: segment.id, text: segment.text };
  const protoTags: any = {};

  if (segment.tags) {
    for (const tagKey of Object.keys(segment.tags)) {
      const tag = segment.tags[tagKey];
      protoTags[tagKey] = { attrs: tag.attrs };
    }

    if (Object.keys(protoTags).length) {
      protoSegment.tags = protoTags;
    }
  }

  return create(SegmentSchema, protoSegment);
}

export function toProtoSegments(segments: Segment[]): ProtoSegment[] {
  return segments.map(toProtoSegment);
}
