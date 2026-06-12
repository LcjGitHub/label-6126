import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import RadicalGrid from '../components/RadicalGrid';
import StrokeTabs from '../components/StrokeTabs';
import { useRadicals } from '../hooks/useRadicals';
import { useStrokeFilter } from '../hooks/useStrokeFilter';
import type { SortMode } from '../utils/sortRadicals';
import { sortRadicals } from '../utils/sortRadicals';

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'default', label: '编号顺序' },
  { value: 'strokes-asc', label: '笔画 ↑' },
  { value: 'strokes-desc', label: '笔画 ↓' },
];

export default function HomePage() {
  const { data: radicals, isLoading, isError, error } = useRadicals();
  const { rangeIndex, setRangeIndex, activeRange, filtered, ranges } = useStrokeFilter(radicals);
  const [sortMode, setSortMode] = useState<SortMode>('default');

  const handleRangeChange = useCallback((index: number) => {
    setRangeIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setRangeIndex]);

  const handleSortChange = useCallback((_e: React.MouseEvent<HTMLElement>, value: SortMode | null) => {
    if (value) setSortMode(value);
  }, []);

  useEffect(() => {
    if (filtered) {
      document.title = `康熙部首 · ${activeRange.label}`;
    }
  }, [activeRange, filtered]);

  const sorted = useMemo(() => {
    if (!filtered) return undefined;
    return sortRadicals(filtered, sortMode);
  }, [filtered, sortMode]);

  const count = sorted?.length ?? 0;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        康熙部首 · {activeRange.label}（{count}）
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        点击部首查看例字，或使用右上角搜索汉字与释义
      </Typography>

      <StrokeTabs
        ranges={ranges}
        activeIndex={rangeIndex}
        onChange={handleRangeChange}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={sortMode}
          onChange={handleSortChange}
        >
          {SORT_OPTIONS.map((opt) => (
            <ToggleButton key={opt.value} value={opt.value}>
              {opt.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {isError ? (
        <Typography color="error">
          加载失败：{error instanceof Error ? error.message : '未知错误'}
        </Typography>
      ) : (
        <RadicalGrid radicals={sorted} loading={isLoading} />
      )}
    </Box>
  );
}
