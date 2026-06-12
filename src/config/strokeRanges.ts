export interface StrokeRange {
  label: string;
  min: number;
  max: number | null;
}

export const STROKE_RANGES: StrokeRange[] = [
  { label: '全部', min: 1, max: null },
  { label: '一至三画', min: 1, max: 3 },
  { label: '四至六画', min: 4, max: 6 },
  { label: '七画及以上', min: 7, max: null },
];

export const DEFAULT_RANGE_INDEX = 0;
