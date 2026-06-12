import type { Radical } from '../types/radical';

const MOCK_DELAY_MS = 400;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

let cachedRadicals: Radical[] | null = null;
let loadingPromise: Promise<Radical[]> | null = null;
let idIndex: Map<number, Radical> | null = null;
let strokeIndex: Map<number, Radical[]> | null = null;

function buildIndexes(radicals: Radical[]): void {
  idIndex = new Map();
  strokeIndex = new Map();

  radicals.forEach((radical) => {
    idIndex!.set(radical.id, radical);

    const strokeList = strokeIndex!.get(radical.strokeCount);
    if (strokeList) {
      strokeList.push(radical);
    } else {
      strokeIndex!.set(radical.strokeCount, [radical]);
    }
  });
}

async function ensureRadicalsLoaded(): Promise<Radical[]> {
  if (cachedRadicals) {
    return cachedRadicals;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    await delay(MOCK_DELAY_MS);
    const module = await import('../mock/radicals.json');
    const radicals = module.default as Radical[];
    cachedRadicals = radicals;
    buildIndexes(radicals);
    loadingPromise = null;
    return radicals;
  })();

  return loadingPromise;
}

export async function fetchRadicals(): Promise<Radical[]> {
  return ensureRadicalsLoaded();
}

export async function fetchRadicalById(id: number): Promise<Radical | undefined> {
  await ensureRadicalsLoaded();
  return idIndex!.get(id);
}

export interface AdjacentRadicals {
  prev: Radical | null;
  next: Radical | null;
}

export async function fetchAdjacentRadicals(
  id: number,
  _preloadedRadicals?: Radical[],
): Promise<AdjacentRadicals> {
  const radicals = await ensureRadicalsLoaded();
  const idx = radicals.findIndex((item) => item.id === id);
  if (idx === -1) {
    return { prev: null, next: null };
  }
  return {
    prev: idx > 0 ? radicals[idx - 1] : null,
    next: idx < radicals.length - 1 ? radicals[idx + 1] : null,
  };
}

export async function fetchRadicalsByStrokeCount(
  strokeCount: number,
  _preloadedRadicals?: Radical[],
): Promise<Radical[]> {
  await ensureRadicalsLoaded();
  return strokeIndex!.get(strokeCount) ?? [];
}
