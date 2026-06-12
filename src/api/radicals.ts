import type { Radical } from '../types/radical';

const MOCK_DELAY_MS = 400;

/**
 * 模拟网络延迟
 * @param ms 延迟毫秒
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * 异步加载全部部首 Mock 数据
 */
export async function fetchRadicals(): Promise<Radical[]> {
  await delay(MOCK_DELAY_MS);
  const module = await import('../mock/radicals.json');
  return module.default as Radical[];
}

/**
 * 异步加载单个部首
 * @param id 部首编号 1–214
 */
export async function fetchRadicalById(id: number): Promise<Radical | undefined> {
  const radicals = await fetchRadicals();
  return radicals.find((item) => item.id === id);
}
