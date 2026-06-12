import { useEffect } from 'react';
import {
  Box,
  Chip,
  CircularProgress,
  Typography,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StudyCard from '../components/StudyCard';
import { useRadicals } from '../hooks/useRadicals';
import { useRandomRadical } from '../hooks/useRandomRadical';

export default function StudyPage() {
  const { data: radicals, isLoading, isError, error } = useRadicals();
  const { current, viewedCount, next } = useRandomRadical(radicals);

  useEffect(() => {
    document.title = '学习卡片 · 康熙部首';
  }, []);

  useEffect(() => {
    if (radicals && !current) {
      next();
    }
  }, [radicals, current, next]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Chip
          icon={<AutoAwesomeIcon fontSize="small" />}
          label={`已浏览 ${viewedCount} 个`}
          color="primary"
          variant="filled"
        />
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Typography color="error" align="center" sx={{ py: 8 }}>
          加载失败：{error instanceof Error ? error.message : '未知错误'}
        </Typography>
      ) : current ? (
        <StudyCard radical={current} onNext={next} />
      ) : null}
    </Box>
  );
}
