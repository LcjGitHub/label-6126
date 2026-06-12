import { useMemo, useState } from 'react';
import type { Radical } from '../types/radical';
import type { StrokeRange } from '../config/strokeRanges';
import { DEFAULT_RANGE_INDEX, STROKE_RANGES } from '../config/strokeRanges';

export function filterByStrokeRange(
  radicals: Radical[],
  range: StrokeRange,
): Radical[] {
  return radicals.filter((r) => {
    if (range.max === null) {
      return r.strokeCount >= range.min;
    }
    return r.strokeCount >= range.min && r.strokeCount <= range.max;
  });
}

export function useStrokeFilter(radicals?: Radical[]) {
  const [rangeIndex, setRangeIndex] = useState(DEFAULT_RANGE_INDEX);

  const activeRange = STROKE_RANGES[rangeIndex];

  const filtered = useMemo(() => {
    if (!radicals) return undefined;
    return filterByStrokeRange(radicals, activeRange);
  }, [radicals, activeRange]);

  return {
    rangeIndex,
    setRangeIndex,
    activeRange,
    filtered,
    ranges: STROKE_RANGES,
  };
}
