import { useMemo, useState } from 'react';
import type { Radical } from '../types/radical';
import type { StrokeRange } from '../config/strokeRanges';
import { DEFAULT_RANGE_INDEX, STROKE_RANGES } from '../config/strokeRanges';

/**
 * 按笔画区间过滤部首列表
 * @param radicals - 部首列表
 * @param range - 笔画区间配置
 * @returns 过滤后的部首数组
 */
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

/**
 * 笔画筛选 Hook
 * 管理当前选中的笔画区间，并返回过滤后的部首列表
 * @param radicals - 全部部首数据（可选，未加载时为 undefined）
 * @returns 区间状态与过滤结果
 * @property rangeIndex - 当前选中区间的索引
 * @property setRangeIndex - 切换区间的方法
 * @property activeRange - 当前选中的区间配置
 * @property filtered - 过滤后的部首列表，未输入时为 undefined
 * @property ranges - 全部笔画区间配置
 */
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
