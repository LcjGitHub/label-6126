import { useMemo } from 'react';
import Fuse from 'fuse.js';
import type { Radical, SearchResult } from '../types/radical';

export type MatchTypeFilter = 'all' | 'radical' | 'example';

interface RadicalSearchDoc {
  radical: Radical;
  char: string;
  pinyin: string;
  meaning: string;
  matchType: 'radical' | 'example';
  exampleChar?: string;
  examplePinyin?: string;
  exampleMeaning?: string;
}

/**
 * 将部首与例字展平为可检索文档
 * @param radicals 部首列表
 */
function buildSearchDocs(radicals: Radical[]): RadicalSearchDoc[] {
  const docs: RadicalSearchDoc[] = [];

  radicals.forEach((radical) => {
    docs.push({
      radical,
      char: radical.char,
      pinyin: radical.pinyin,
      meaning: radical.meaning,
      matchType: 'radical',
    });

    radical.examples.forEach((example) => {
      docs.push({
        radical,
        char: example.char,
        pinyin: example.pinyin,
        meaning: example.meaning,
        matchType: 'example',
        exampleChar: example.char,
        examplePinyin: example.pinyin,
        exampleMeaning: example.meaning,
      });
    });
  });

  return docs;
}

/**
 * 基于 fuse.js 的汉字 / 释义模糊搜索
 * @param radicals 部首数据源
 * @param query 搜索关键词
 * @param matchFilter 匹配类型过滤，默认为 'all'
 */
export function useRadicalSearch(
  radicals: Radical[] | undefined,
  query: string,
  matchFilter: MatchTypeFilter = 'all'
): SearchResult[] {
  const fuse = useMemo(() => {
    if (!radicals?.length) {
      return null;
    }

    return new Fuse(buildSearchDocs(radicals), {
      keys: [
        { name: 'char', weight: 0.45 },
        { name: 'pinyin', weight: 0.2 },
        { name: 'meaning', weight: 0.35 },
      ],
      threshold: 0.35,
      includeScore: true,
      ignoreLocation: true,
    });
  }, [radicals]);

  return useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed || !fuse) {
      return [];
    }

    const seen = new Set<string>();
    const results: SearchResult[] = [];

    fuse.search(trimmed).forEach(({ item, score }) => {
      if (matchFilter !== 'all' && item.matchType !== matchFilter) {
        return;
      }

      const key =
        item.matchType === 'example'
          ? `${item.radical.id}-${item.exampleChar}`
          : `radical-${item.radical.id}`;

      if (seen.has(key)) {
        return;
      }
      seen.add(key);

      results.push({
        radical: item.radical,
        matchedChar:
          item.matchType === 'example'
            ? {
                char: item.exampleChar!,
                pinyin: item.examplePinyin!,
                meaning: item.exampleMeaning!,
              }
            : undefined,
        matchType: item.matchType,
        score: score ?? 1,
      });
    });

    return results.slice(0, 30);
  }, [fuse, query, matchFilter]);
}
