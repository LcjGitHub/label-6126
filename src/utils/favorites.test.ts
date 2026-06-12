import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getFavoriteIds,
  isFavorite,
  addFavorite,
  removeFavorite,
  toggleFavorite,
} from './favorites';

const STORAGE_KEY = 'kangxi-favorites';

describe('favorites utils', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getFavoriteIds', () => {
    it('should return empty array when no data in localStorage', () => {
      expect(getFavoriteIds()).toEqual([]);
    });

    it('should return parsed array from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3]));
      expect(getFavoriteIds()).toEqual([1, 2, 3]);
    });

    it('should return empty array when stored value is not valid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'not-json');
      expect(getFavoriteIds()).toEqual([]);
    });

    it('should return empty array when stored value is not an array', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: 1 }));
      expect(getFavoriteIds()).toEqual([]);
    });

    it('should filter out non-number values from stored array', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([1, '2', null, 3, undefined, {}, 4]));
      expect(getFavoriteIds()).toEqual([1, 3, 4]);
    });

    it('should return empty array when localStorage throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      expect(getFavoriteIds()).toEqual([]);
    });

    it('should handle empty string in localStorage', () => {
      localStorage.setItem(STORAGE_KEY, '');
      expect(getFavoriteIds()).toEqual([]);
    });
  });

  describe('isFavorite', () => {
    it('should return false when id is not in favorites', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3]));
      expect(isFavorite(4)).toBe(false);
    });

    it('should return true when id is in favorites', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3]));
      expect(isFavorite(2)).toBe(true);
    });

    it('should return false when favorites is empty', () => {
      expect(isFavorite(1)).toBe(false);
    });
  });

  describe('addFavorite', () => {
    it('should add a new id to favorites', () => {
      const result = addFavorite(1);
      expect(result).toEqual([1]);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([1]);
    });

    it('should ignore adding duplicate id', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2]));
      const result = addFavorite(2);
      expect(result).toEqual([1, 2]);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([1, 2]);
    });

    it('should add multiple ids in sequence', () => {
      addFavorite(1);
      addFavorite(2);
      const result = addFavorite(3);
      expect(result).toEqual([1, 2, 3]);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([1, 2, 3]);
    });

    it('should return the updated array after adding', () => {
      const result1 = addFavorite(10);
      expect(result1).toEqual([10]);
      const result2 = addFavorite(20);
      expect(result2).toEqual([10, 20]);
    });

    it('should preserve existing order when adding new id', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([5, 3, 1]));
      const result = addFavorite(2);
      expect(result).toEqual([5, 3, 1, 2]);
    });
  });

  describe('removeFavorite', () => {
    it('should remove an existing id from favorites', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3]));
      const result = removeFavorite(2);
      expect(result).toEqual([1, 3]);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([1, 3]);
    });

    it('should do nothing when removing non-existent id', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3]));
      const result = removeFavorite(4);
      expect(result).toEqual([1, 2, 3]);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([1, 2, 3]);
    });

    it('should return empty array when removing from empty favorites', () => {
      const result = removeFavorite(1);
      expect(result).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toEqual(JSON.stringify([]));
    });

    it('should handle removing the only id in favorites', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([5]));
      const result = removeFavorite(5);
      expect(result).toEqual([]);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([]);
    });

    it('should preserve order of remaining ids after removal', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([10, 20, 30, 40, 50]));
      const result = removeFavorite(30);
      expect(result).toEqual([10, 20, 40, 50]);
    });

    it('should remove all occurrences if id appears multiple times', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 1, 3, 1]));
      const result = removeFavorite(1);
      expect(result).toEqual([2, 3]);
    });
  });

  describe('toggleFavorite', () => {
    it('should add id when it is not in favorites', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2]));
      const result = toggleFavorite(3);
      expect(result).toEqual([1, 2, 3]);
      expect(isFavorite(3)).toBe(true);
    });

    it('should remove id when it is already in favorites', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3]));
      const result = toggleFavorite(2);
      expect(result).toEqual([1, 3]);
      expect(isFavorite(2)).toBe(false);
    });

    it('should toggle id multiple times correctly', () => {
      expect(toggleFavorite(1)).toEqual([1]);
      expect(toggleFavorite(1)).toEqual([]);
      expect(toggleFavorite(1)).toEqual([1]);
      expect(toggleFavorite(1)).toEqual([]);
    });

    it('should return the updated array after toggle', () => {
      const addResult = toggleFavorite(5);
      expect(addResult).toEqual([5]);
      const removeResult = toggleFavorite(5);
      expect(removeResult).toEqual([]);
    });
  });

  describe('integration scenarios', () => {
    it('should handle full workflow: add, check, toggle, remove', () => {
      expect(getFavoriteIds()).toEqual([]);

      expect(addFavorite(10)).toEqual([10]);
      expect(isFavorite(10)).toBe(true);

      expect(addFavorite(20)).toEqual([10, 20]);
      expect(getFavoriteIds()).toEqual([10, 20]);

      expect(toggleFavorite(10)).toEqual([20]);
      expect(isFavorite(10)).toBe(false);

      expect(toggleFavorite(30)).toEqual([20, 30]);
      expect(getFavoriteIds()).toEqual([20, 30]);

      expect(removeFavorite(20)).toEqual([30]);
      expect(removeFavorite(30)).toEqual([]);

      expect(getFavoriteIds()).toEqual([]);
    });

    it('should ignore duplicate adds', () => {
      addFavorite(1);
      addFavorite(1);
      addFavorite(1);
      expect(getFavoriteIds()).toEqual([1]);
    });

    it('should handle large number of favorites', () => {
      for (let i = 1; i <= 100; i++) {
        addFavorite(i);
      }
      expect(getFavoriteIds()).toHaveLength(100);
      expect(isFavorite(50)).toBe(true);
      expect(isFavorite(101)).toBe(false);

      for (let i = 1; i <= 50; i++) {
        removeFavorite(i);
      }
      expect(getFavoriteIds()).toHaveLength(50);
      expect(getFavoriteIds()[0]).toBe(51);
    });
  });

  describe('edge cases', () => {
    it('should handle zero as id', () => {
      addFavorite(0);
      expect(isFavorite(0)).toBe(true);
      expect(getFavoriteIds()).toEqual([0]);
      removeFavorite(0);
      expect(getFavoriteIds()).toEqual([]);
    });

    it('should handle negative ids', () => {
      addFavorite(-1);
      addFavorite(-5);
      expect(isFavorite(-1)).toBe(true);
      expect(isFavorite(-5)).toBe(true);
      expect(getFavoriteIds()).toEqual([-1, -5]);
    });

    it('should handle large number ids', () => {
      const largeId = Number.MAX_SAFE_INTEGER;
      addFavorite(largeId);
      expect(isFavorite(largeId)).toBe(true);
      expect(getFavoriteIds()).toEqual([largeId]);
    });

    it('should persist data correctly through multiple operations', () => {
      addFavorite(1);
      addFavorite(2);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([1, 2]);

      toggleFavorite(1);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([2]);

      addFavorite(3);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([2, 3]);

      removeFavorite(2);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([3]);
    });
  });
});
