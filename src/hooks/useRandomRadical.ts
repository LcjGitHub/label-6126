import { useCallback, useState } from 'react';
import type { Radical } from '../types/radical';

interface UseRandomRadicalReturn {
  current: Radical | null;
  viewedCount: number;
  viewedIds: Set<number>;
  next: () => void;
  reset: () => void;
}

/**
 * 随机抽取部首 Hook
 * 保证不连续重复，记录已浏览数量
 */
export function useRandomRadical(radicals: Radical[] | undefined): UseRandomRadicalReturn {
  const [current, setCurrent] = useState<Radical | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<number>>(new Set());

  const pickRandom = useCallback(() => {
    if (!radicals || radicals.length === 0) return null;

    if (radicals.length === 1) {
      return radicals[0];
    }

    const available = radicals.filter((r) => r.id !== current?.id);
    const index = Math.floor(Math.random() * available.length);
    return available[index];
  }, [radicals, current]);

  const next = useCallback(() => {
    const picked = pickRandom();
    if (picked) {
      setCurrent(picked);
      setViewedIds((prev) => {
        const nextSet = new Set(prev);
        nextSet.add(picked.id);
        return nextSet;
      });
    }
  }, [pickRandom]);

  const reset = useCallback(() => {
    setCurrent(null);
    setViewedIds(new Set());
  }, []);

  return {
    current,
    viewedCount: viewedIds.size,
    viewedIds,
    next,
    reset,
  };
}
