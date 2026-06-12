import type { SearchHistoryItem } from '../types/radical';

const STORAGE_KEY = 'kangxi-search-history';
const MAX_HISTORY = 5;

function read(): SearchHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter(
          (item: unknown): item is SearchHistoryItem =>
            typeof item === 'object' &&
            item !== null &&
            typeof (item as SearchHistoryItem).keyword === 'string' &&
            typeof (item as SearchHistoryItem).timestamp === 'number'
        )
      : [];
  } catch {
    return [];
  }
}

function write(items: SearchHistoryItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getSearchHistory(): SearchHistoryItem[] {
  return read().sort((a, b) => b.timestamp - a.timestamp).slice(0, MAX_HISTORY);
}

export function addSearchHistory(keyword: string): SearchHistoryItem[] {
  const trimmed = keyword.trim();
  if (!trimmed) return read();

  const items = read().filter((item) => item.keyword !== trimmed);
  items.unshift({ keyword: trimmed, timestamp: Date.now() });

  const limited = items.slice(0, MAX_HISTORY);
  write(limited);
  return limited;
}

export function clearSearchHistory(): void {
  write([]);
}
