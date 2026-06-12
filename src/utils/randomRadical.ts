import type { Radical } from '../types/radical';

/**
 * 从部首数组中随机选取一个部首
 *
 * 选取规则：
 * - 若传入 `excludeId`，则不会选中该 ID 对应的部首（用于避免重复）
 * - 若部首数组为空，返回 `null`
 * - 若数组仅有一个元素且该元素被排除，返回 `null`
 *
 * @param radicals - 部首数组
 * @param excludeId - 可选，要排除的部首 ID
 * @returns 随机选中的部首，或 null
 */
export function pickRandomRadical(
  radicals: Radical[],
  excludeId?: number,
): Radical | null {
  if (!radicals || radicals.length === 0) {
    return null;
  }

  const pool =
    excludeId !== undefined
      ? radicals.filter((r) => r.id !== excludeId)
      : radicals;

  if (pool.length === 0) {
    return null;
  }

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}
