import { Box, Typography } from '@mui/material';
import RadicalGrid from '../components/RadicalGrid';
import StrokeTabs from '../components/StrokeTabs';
import { useRadicals } from '../hooks/useRadicals';
import { useStrokeFilter } from '../hooks/useStrokeFilter';

export default function HomePage() {
  const { data: radicals, isLoading, isError, error } = useRadicals();
  const { rangeIndex, setRangeIndex, filtered, ranges } = useStrokeFilter(radicals);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        康熙部首（214）
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        点击部首查看例字，或使用右上角搜索汉字与释义
      </Typography>

      <StrokeTabs
        ranges={ranges}
        activeIndex={rangeIndex}
        onChange={setRangeIndex}
      />

      {isError ? (
        <Typography color="error">
          加载失败：{error instanceof Error ? error.message : '未知错误'}
        </Typography>
      ) : (
        <RadicalGrid radicals={filtered} loading={isLoading} />
      )}
    </Box>
  );
}
