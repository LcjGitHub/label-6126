/**
 * 笔画区间配置类型定义
 * @property label - 区间显示名称
 * @property min - 最小笔画数（包含）
 * @property max - 最大笔画数（包含），为 null 时表示无上限
 */
export interface StrokeRange {
  label: string;
  min: number;
  max: number | null;
}

/**
 * 笔画区间配置
 * 集中维护所有笔画分组区间，如需调整分组规则只需修改此数组
 */
export const STROKE_RANGES: StrokeRange[] = [
  { label: '一至三画', min: 1, max: 3 },
  { label: '四至六画', min: 4, max: 6 },
  { label: '七画及以上', min: 7, max: null },
];

/**
 * 默认选中的区间索引
 * 默认展示「一至三画」区间
 */
export const DEFAULT_RANGE_INDEX = 0;
