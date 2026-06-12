/** 例字条目 */
export interface ExampleChar {
  char: string;
  pinyin: string;
  meaning: string;
}

/** 康熙部首条目 */
export interface Radical {
  id: number;
  char: string;
  pinyin: string;
  meaning: string;
  strokeCount: number;
  examples: ExampleChar[];
}

/** 搜索结果条目 */
export interface SearchResult {
  radical: Radical;
  matchedChar?: ExampleChar;
  matchType: 'radical' | 'example';
  score: number;
}
