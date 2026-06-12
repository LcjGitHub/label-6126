import { useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RefreshIcon from '@mui/icons-material/Refresh';
import StudyCard from '../components/StudyCard';
import { useRadicals } from '../hooks/useRadicals';
import { useRandomRadical } from '../hooks/useRandomRadical';

export default function StudyPage() {
  const { data: radicals, isLoading, isError, error } = useRadicals();
  const { current, viewedCount, next, reset } = useRandomRadical(radicals);

  useEffect(() => {
    document.title = '学习卡片 · 康熙部首';
  }, []);

  const handleStart = () => {
    next();
  };

  const handleReset = () => {
    reset();
  };

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" gutterBottom>
            随机学习卡片
          </Typography>
          <Typography variant="body2" color="text.secondary">
            通过抽卡方式学习康熙部首，挑战你的记忆力
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip
            icon={<AutoAwesomeIcon fontSize="small" />}
            label={`已浏览 ${viewedCount} 个`}
            color="primary"
            variant="filled"
          />
          {viewedCount > 0 && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleReset}
            >
              重新开始
            </Button>
          )}
        </Box>
      </Stack>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Typography color="error" align="center" sx={{ py: 8 }}>
          加载失败：{error instanceof Error ? error.message : '未知错误'}
        </Typography>
      ) : !current ? (
        <Box
          sx={{
            maxWidth: 520,
            mx: 'auto',
            textAlign: 'center',
            py: 8,
            px: 4,
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 80, sm: 96 },
              mb: 3,
              fontFamily: '"Noto Serif SC", serif',
              color: 'grey.400',
            }}
          >
            ?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            准备好了吗？点击下方按钮开始随机学习，共 {radicals?.length ?? 214} 个部首等你挑战！
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AutoAwesomeIcon />}
            onClick={handleStart}
            sx={{ px: 6, py: 1.5 }}
          >
            开始学习
          </Button>
        </Box>
      ) : (
        <StudyCard radical={current} onNext={next} />
      )}
    </Box>
  );
}
