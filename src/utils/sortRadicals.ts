import type { Radical } from '../types/radical';

export type SortMode = 'default' | 'strokes-asc' | 'strokes-desc';

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
