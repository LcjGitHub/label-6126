import { describe, it, expect } from 'vitest';
import { sortRadicals, type SortMode } from './sortRadicals';
import type { Radical } from '../types/radical';

const mockRadicals: Radical[] = [
  { id: 3, char: '丶', pinyin: 'zhǔ', meaning: 'dot', strokeCount: 1, examples: [] },
  { id: 1, char: '一', pinyin: 'yī', meaning: 'one', strokeCount: 1, examples: [] },
  { id: 2, char: '丨', pinyin: 'gǔn', meaning: 'line', strokeCount: 1, examples: [] },
  { id: 5, char: '乙', pinyin: 'yǐ', meaning: 'second', strokeCount: 1, examples: [] },
  { id: 4, char: '亅', pinyin: 'jué', meaning: 'hook', strokeCount: 1, examples: [] },
  { id: 9, char: '人', pinyin: 'rén', meaning: 'person', strokeCount: 2, examples: [] },
  { id: 6, char: '二', pinyin: 'èr', meaning: 'two', strokeCount: 2, examples: [] },
  { id: 10, char: '儿', pinyin: 'ér', meaning: 'child', strokeCount: 2, examples: [] },
  { id: 8, char: '冖', pinyin: 'mì', meaning: 'cover', strokeCount: 2, examples: [] },
  { id: 7, char: '亠', pinyin: 'tóu', meaning: 'head', strokeCount: 2, examples: [] },
  { id: 30, char: '口', pinyin: 'kǒu', meaning: 'mouth', strokeCount: 3, examples: [] },
  { id: 25, char: '土', pinyin: 'tǔ', meaning: 'earth', strokeCount: 3, examples: [] },
  { id: 20, char: '十', pinyin: 'shí', meaning: 'ten', strokeCount: 2, examples: [] },
];

describe('sortRadicals', () => {
  it('should not mutate the original array', () => {
    const original = [...mockRadicals];
    const originalIds = original.map((r) => r.id);
    sortRadicals(mockRadicals, 'default');
    expect(mockRadicals.map((r) => r.id)).toEqual(originalIds);
  });

  it('should return a new array instance', () => {
    const result = sortRadicals(mockRadicals, 'default');
    expect(result).not.toBe(mockRadicals);
  });

  describe('default mode (by id ascending)', () => {
    it('should sort radicals by id in ascending order', () => {
      const result = sortRadicals(mockRadicals, 'default');
      const ids = result.map((r) => r.id);
      expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 25, 30]);
    });

    it('should handle empty array', () => {
      const result = sortRadicals([], 'default');
      expect(result).toEqual([]);
    });

    it('should handle single element array', () => {
      const single = [mockRadicals[0]];
      const result = sortRadicals(single, 'default');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(3);
    });
  });

  describe('strokes-asc mode', () => {
    it('should sort by stroke count ascending, then by id ascending', () => {
      const result = sortRadicals(mockRadicals, 'strokes-asc');
      const strokes = result.map((r) => r.strokeCount);
      expect(strokes).toEqual([1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3]);

      const firstGroupIds = result.filter((r) => r.strokeCount === 1).map((r) => r.id);
      expect(firstGroupIds).toEqual([1, 2, 3, 4, 5]);

      const secondGroupIds = result.filter((r) => r.strokeCount === 2).map((r) => r.id);
      expect(secondGroupIds).toEqual([6, 7, 8, 9, 10, 20]);

      const thirdGroupIds = result.filter((r) => r.strokeCount === 3).map((r) => r.id);
      expect(thirdGroupIds).toEqual([25, 30]);
    });

    it('should handle same stroke count with different ids', () => {
      const sameStroke: Radical[] = [
        { id: 5, char: '戊', pinyin: 'wù', meaning: 'fifth', strokeCount: 4, examples: [] },
        { id: 1, char: '户', pinyin: 'hù', meaning: 'door', strokeCount: 4, examples: [] },
        { id: 3, char: '日', pinyin: 'rì', meaning: 'sun', strokeCount: 4, examples: [] },
      ];
      const result = sortRadicals(sameStroke, 'strokes-asc');
      expect(result.map((r) => r.id)).toEqual([1, 3, 5]);
    });
  });

  describe('strokes-desc mode', () => {
    it('should sort by stroke count descending, then by id ascending', () => {
      const result = sortRadicals(mockRadicals, 'strokes-desc');
      const strokes = result.map((r) => r.strokeCount);
      expect(strokes).toEqual([3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1]);

      const firstGroupIds = result.filter((r) => r.strokeCount === 3).map((r) => r.id);
      expect(firstGroupIds).toEqual([25, 30]);

      const secondGroupIds = result.filter((r) => r.strokeCount === 2).map((r) => r.id);
      expect(secondGroupIds).toEqual([6, 7, 8, 9, 10, 20]);

      const thirdGroupIds = result.filter((r) => r.strokeCount === 1).map((r) => r.id);
      expect(thirdGroupIds).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle same stroke count with different ids in desc mode', () => {
      const sameStroke: Radical[] = [
        { id: 5, char: '戊', pinyin: 'wù', meaning: 'fifth', strokeCount: 4, examples: [] },
        { id: 1, char: '户', pinyin: 'hù', meaning: 'door', strokeCount: 4, examples: [] },
        { id: 3, char: '日', pinyin: 'rì', meaning: 'sun', strokeCount: 4, examples: [] },
      ];
      const result = sortRadicals(sameStroke, 'strokes-desc');
      expect(result.map((r) => r.id)).toEqual([1, 3, 5]);
    });
  });

  describe('edge cases', () => {
    it('should handle already sorted array', () => {
      const sorted = [...mockRadicals].sort((a, b) => a.id - b.id);
      const result = sortRadicals(sorted, 'default');
      expect(result.map((r) => r.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 25, 30]);
    });

    it('should handle reverse sorted array', () => {
      const reversed = [...mockRadicals].sort((a, b) => b.id - a.id);
      const result = sortRadicals(reversed, 'default');
      expect(result.map((r) => r.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 25, 30]);
    });
  });
});

describe('SortMode type', () => {
  it('should accept all valid sort modes', () => {
    const modes: SortMode[] = ['default', 'strokes-asc', 'strokes-desc'];
    modes.forEach((mode) => {
      expect(() => sortRadicals([], mode)).not.toThrow();
    });
  });
});
