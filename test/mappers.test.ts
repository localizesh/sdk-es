import { describe, it, expect } from 'vitest';
import { fromProtoSegment, toProtoSegment, fromProtoDocument, toProtoDocument } from '../src/mappers.js';
import { Segment as ProtoSegment } from '../src/protos/localize/segment_pb.js';
import { Document as ProtoDocument } from '../src/protos/localize/document_pb.js';
import { create } from '@bufbuild/protobuf';
import { SegmentSchema, TagSchema } from '../src/protos/localize/segment_pb.js';
import { DocumentSchema } from '../src/protos/localize/document_pb.js';

describe('Mappers', () => {
  describe('Segment Mappers', () => {
    it('should map proto segment to internal segment without tags', () => {
      const proto = create(SegmentSchema, {
        id: '123',
        text: 'Hello World'
      });

      const internal = fromProtoSegment(proto);
+
      expect(internal).toEqual({
        id: '123',
        text: 'Hello World'
      });
    });

    it('should map proto segment to internal segment with tags', () => {
      const proto = create(SegmentSchema, {
        id: '123',
        text: 'Hello World',
        tags: {
          'b': create(TagSchema, { attrs: { class: 'bold' } })
        }
      });

      const internal = fromProtoSegment(proto);

      expect(internal.tags).toBeDefined();
      expect(internal.tags!['b'].attrs).toEqual({ class: 'bold' });
    });

    it('should map internal segment to proto segment without tags', () => {
      const internal = {
        id: '123',
        text: 'Hello World'
      };

      const proto = toProtoSegment(internal);

      expect(proto.id).toBe('123');
      expect(proto.text).toBe('Hello World');
      expect(Object.keys(proto.tags).length).toBe(0);
    });

    it('should map internal segment to proto segment with tags', () => {
      const internal = {
        id: '123',
        text: 'Hello World',
        tags: {
          'b': { attrs: { class: 'bold' } }
        }
      };

      const proto = toProtoSegment(internal);

      expect(proto.id).toBe('123');
      expect(proto.tags['b']).toBeDefined();
      expect(proto.tags['b'].attrs['class']).toBe('bold');
    });
  });

  describe('Document Mappers', () => {
      it('should map basic proto document to internal document', () => {
          const proto = create(DocumentSchema, {
              segments: [
                  create(SegmentSchema, { id: '1', text: 'foo' })
              ],
              layout: {
                  type: 'root',
                  children: []
              },
              metadata: {
                  lang: 'en'
              }
          });

          const internal = fromProtoDocument(proto);

          expect(internal.segments).toHaveLength(1);
          expect(internal.segments[0].id).toBe('1');
          expect(internal.layout).toEqual({ type: 'root', children: [] });
          expect(internal.metadata).toEqual({ lang: 'en' });
      });

      it('should map internal document to proto document', () => {
          const internal = {
              segments: [{ id: '1', text: 'foo' }],
              layout: { type: 'root', children: [] } as any,
              metadata: { lang: 'en' }
          };

          const proto = toProtoDocument(internal);

          expect(proto.segments).toHaveLength(1);
          expect(proto.segments[0].id).toBe('1');
          // Struct mapping can be tricky to test directly with equality due to internal wrapper
          // but we check if it exists
          expect(proto.layout).toBeDefined();
          expect(proto.metadata).toBeDefined();
      });
  });
});
