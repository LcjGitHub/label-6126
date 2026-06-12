import type { Radical } from '../types/radical';

/**
 * 拼音分组条目
 * @property letter - 拼音首字母（大写）
 * @property radicals - 该字母下的部首列表
 */
export interface PinyinGroup {
  letter: string;
  radicals: Radical[];
}

/**
 * 去除拼音中的声调符号
 * @param pinyin - 带声调的拼音字符串
 * @returns 去除声调后的拼音
 */
function removeToneMarks(pinyin: string): string {
  const toneMap: Record<string, string> = {
    ā: 'a', á: 'a', ǎ: 'a', à: 'a',
    ō: 'o', ó: 'o', ǒ: 'o', ò: 'o',
    ē: 'e', é: 'e', ě: 'e', è: 'e',
    ī: 'i', í: 'i', ǐ: 'i', ì: 'i',
    ū: 'u', ú: 'u', ǔ: 'u', ù: 'u',
    ǖ: 'v', ǘ: 'v', ǚ: 'v', ǜ: 'v', ü: 'v',
  };

  return pinyin
    .split('')
    .map((char) => toneMap[char] ?? char)
    .join('');
}

/**
 * 获取拼音的首字母（大写）
 * @param pinyin - 拼音字符串
 * @returns 首字母（A-Z）
 */
export function getPinyinFirstLetter(pinyin: string): string {
  const cleanPinyin = removeToneMarks(pinyin);
  const firstChar = cleanPinyin.charAt(0).toUpperCase();
  return /^[A-Z]$/.test(firstChar) ? firstChar : '#';
}

/**
 * 将部首按拼音首字母分组
 * @param radicals - 部首列表
 * @returns 按拼音首字母分组的结果，字母按 A-Z 顺序排列
 */
export function groupRadicalsByPinyin(radicals: Radical[]): PinyinGroup[] {
  const groupMap = new Map<string, Radical[]>();

  radicals.forEach((radical) => {
    const letter = getPinyinFirstLetter(radical.pinyin);
    const group = groupMap.get(letter);
    if (group) {
      group.push(radical);
    } else {
      groupMap.set(letter, [radical]);
    }
  });

  const letterOrder = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#';
  const result: PinyinGroup[] = [];

  letterOrder.split('').forEach((letter) => {
    const group = groupMap.get(letter);
    if (group && group.length > 0) {
      result.push({
        letter,
        radicals: group.sort((a, b) => {
          const letterA = removeToneMarks(a.pinyin);
          const letterB = removeToneMarks(b.pinyin);
          if (letterA < letterB) return -1;
          if (letterA > letterB) return 1;
          return a.id - b.id;
        }),
      });
    }
  });

  return result;
}
