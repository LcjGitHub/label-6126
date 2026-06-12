import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAdjacentRadicals, fetchRadicalById, fetchRadicals } from '../api/radicals';
import type { Radical } from '../types/radical';

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
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: [...RADICALS_QUERY_KEY, 'adjacent', id],
    queryFn: () => {
      const cachedRadicals = queryClient.getQueryData<Radical[]>(RADICALS_QUERY_KEY);
      return fetchAdjacentRadicals(id, cachedRadicals);
    },
    enabled: Number.isFinite(id) && id > 0,
  });
}
