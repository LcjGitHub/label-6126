import { useQuery } from '@tanstack/react-query';
import {
  fetchAdjacentRadicals,
  fetchRadicalById,
  fetchRadicals,
  fetchRadicalsByStrokeCount,
} from '../api/radicals';

export const RADICALS_QUERY_KEY = ['radicals'] as const;

export function useRadicals() {
  return useQuery({
    queryKey: RADICALS_QUERY_KEY,
    queryFn: fetchRadicals,
  });
}

export function useRadical(id: number) {
  return useQuery({
    queryKey: [...RADICALS_QUERY_KEY, id],
    queryFn: () => fetchRadicalById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useAdjacentRadicals(id: number) {
  return useQuery({
    queryKey: [...RADICALS_QUERY_KEY, 'adjacent', id],
    queryFn: () => fetchAdjacentRadicals(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useRadicalsByStrokeCount(strokeCount: number) {
  return useQuery({
    queryKey: [...RADICALS_QUERY_KEY, 'stroke', strokeCount],
    queryFn: () => fetchRadicalsByStrokeCount(strokeCount),
    enabled: Number.isFinite(strokeCount) && strokeCount > 0,
  });
}
