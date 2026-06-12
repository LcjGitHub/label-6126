import { useQuery } from '@tanstack/react-query';
import { fetchRadicalById, fetchRadicals } from '../api/radicals';

/** 全部部首 Query Key */
export const RADICALS_QUERY_KEY = ['radicals'] as const;

/**
 * 加载 214 部首列表
 */
export function useRadicals() {
  return useQuery({
    queryKey: RADICALS_QUERY_KEY,
    queryFn: fetchRadicals,
  });
}

/**
 * 加载单个部首详情
 * @param id 部首编号
 */
export function useRadical(id: number) {
  return useQuery({
    queryKey: [...RADICALS_QUERY_KEY, id],
    queryFn: () => fetchRadicalById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}
