import { describe, it, expect } from 'vitest';
import { IdGenerator } from '../src/generators.js';

describe('IdGenerator', () => {
  it('should generate deterministic IDs for same input sequence', () => {
    const generator = new IdGenerator();
    const id1 = generator.generateId('Hello');

    const generator2 = new IdGenerator();
    const id2 = generator2.generateId('Hello');

    expect(id1).toBe(id2);
  });

  it('should generate different IDs for same text in same sequence', () => {
    const generator = new IdGenerator();
    const id1 = generator.generateId('Hello');
    const id2 = generator.generateId('Hello');

    expect(id1).not.toBe(id2);
  });

  it('should generate different IDs for different tags', () => {
    const generator = new IdGenerator();
    const id1 = generator.generateId('Hello', { b: { attrs: {} } });

    const generator2 = new IdGenerator();
    const id2 = generator2.generateId('Hello', { i: { attrs: {} } });

    expect(id1).not.toBe(id2);
  });
});
