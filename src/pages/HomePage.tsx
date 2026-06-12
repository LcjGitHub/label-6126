import { Box, Typography } from '@mui/material';
import RadicalGrid from '../components/RadicalGrid';
import { useRadicals } from '../hooks/useRadicals';

/** 首页：214 部首网格 */
export default function HomePage() {
  const { data: radicals, isLoading, isError, error } = useRadicals();

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        康熙部首（214）
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        点击部首查看例字，或使用右上角搜索汉字与释义
      </Typography>

      {isError ? (
        <Typography color="error">
          加载失败：{error instanceof Error ? error.message : '未知错误'}
        </Typography>
      ) : (
        <RadicalGrid radicals={radicals} loading={isLoading} />
      )}
    </Box>
  );
}
