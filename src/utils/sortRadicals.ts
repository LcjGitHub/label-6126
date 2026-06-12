import type { Radical } from '../types/radical';

/**
 * 排序模式类型
 * - `default` - 按部首编号顺序（默认）
 * - `strokes-asc` - 按笔画数从少到多
 * - `strokes-desc` - 按笔画数从多到少
 */
export type SortMode = 'default' | 'strokes-asc' | 'strokes-desc';

/**
 * 对部首数组进行排序
 *
 * 排序规则：
 * - `default`：按部首编号（id）从小到大排序
 * - `strokes-asc`：按笔画数从少到多，同笔画数按编号次序排序
 * - `strokes-desc`：按笔画数从多到少，同笔画数按编号次序排序
 *
 * 注意：该函数不会修改传入的原数组，而是返回一个新的排序后数组。
 *
 * @param radicals - 待排序的部首数组
 * @param mode - 排序模式
 * @returns 排序后的新部首数组
 */
export function sortRadicals(radicals: Radical[], mode: SortMode): Radical[] {
  const sorted = [...radicals];
  switch (mode) {
    case 'strokes-asc':
      return sorted.sort((a, b) => a.strokeCount - b.strokeCount || a.id - b.id);
    case 'strokes-desc':
      return sorted.sort((a, b) => b.strokeCount - a.strokeCount || a.id - b.id);
    default:
      return sorted.sort((a, b) => a.id - b.id);
  }
}
