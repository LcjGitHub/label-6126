const STORAGE_KEY = 'kangxi-favorites';

function read(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((n: unknown) => typeof n === 'number') : [];
  } catch {
    return [];
  }
}

function write(ids: number[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function getFavoriteIds(): number[] {
  return read();
}

export function isFavorite(id: number): boolean {
  return read().includes(id);
}

export function addFavorite(id: number): number[] {
  const ids = read();
  if (!ids.includes(id)) {
    ids.push(id);
    write(ids);
  }
  return ids;
}

export function removeFavorite(id: number): number[] {
  const ids = read().filter((n) => n !== id);
  write(ids);
  return ids;
}

export function toggleFavorite(id: number): number[] {
  return isFavorite(id) ? removeFavorite(id) : addFavorite(id);
}
