import type { Radical } from '../types/radical';

const MOCK_DELAY_MS = 400;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function fetchRadicals(): Promise<Radical[]> {
  await delay(MOCK_DELAY_MS);
  const module = await import('../mock/radicals.json');
  return module.default as Radical[];
}

export async function fetchRadicalById(id: number): Promise<Radical | undefined> {
  const radicals = await fetchRadicals();
  return radicals.find((item) => item.id === id);
}

export interface AdjacentRadicals {
  prev: Radical | null;
  next: Radical | null;
}

export async function fetchAdjacentRadicals(id: number): Promise<AdjacentRadicals> {
  const radicals = await fetchRadicals();
  const idx = radicals.findIndex((item) => item.id === id);
  if (idx === -1) {
    return { prev: null, next: null };
  }
  return {
    prev: idx > 0 ? radicals[idx - 1] : null,
    next: idx < radicals.length - 1 ? radicals[idx + 1] : null,
  };
}
