import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Typography,
  Alert,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useRadicals } from '../hooks/useRadicals';
import {
  getDailyRadicalId,
  hasCheckedIn,
  recordCheckin,
  getCheckinCount,
  getStreakCount,
  formatDateKey,
} from '../utils/dailyRadical';
import type { Radical } from '../types/radical';

export default function DailyPage() {
  const { data: radicals, isLoading, isError, error } = useRadicals();
  const navigate = useNavigate();
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkinCount, setCheckinCount] = useState(0);
  const [streakCount, setStreakCount] = useState(0);

  const dailyRadicalId = useMemo(() => getDailyRadicalId(), []);

  const dailyRadical = useMemo<Radical | undefined>(() => {
    if (!radicals) return undefined;
    return radicals.find((r) => r.id === dailyRadicalId);
  }, [radicals, dailyRadicalId]);

  useEffect(() => {
    setCheckedIn(hasCheckedIn());
    setCheckinCount(getCheckinCount());
    setStreakCount(getStreakCount());
  }, []);

  useEffect(() => {
    document.title = '每日部首 · 康熙部首';
  }, []);

  const handleCheckIn = () => {
    if (dailyRadical && !checkedIn) {
      recordCheckin(dailyRadical.id);
      setCheckedIn(true);
      setCheckinCount(getCheckinCount());
      setStreakCount(getStreakCount());
    }
  };

  const handleViewDetail = () => {
    if (dailyRadical) {
      navigate(`/radical/${dailyRadical.id}`);
    }
  };

  const todayKey = formatDateKey();
  const displayExamples = dailyRadical?.examples.slice(0, 4) ?? [];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" align="center" sx={{ py: 8 }}>
        加载失败：{error instanceof Error ? error.message : '未知错误'}
      </Typography>
    );
  }

  if (!dailyRadical) {
    return (
      <Alert severity="warning" sx={{ mt: 4 }}>
        未找到今日部首
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <EventIcon color="primary" />
        <Typography variant="h5" component="h1">
          每日部首
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          {todayKey}
        </Typography>
        {checkedIn && (
          <Chip
            icon={<CheckCircleIcon fontSize="small" />}
            label="已签到"
            color="success"
            size="small"
            sx={{ ml: 'auto' }}
          />
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          mb: 4,
          flexWrap: 'wrap',
        }}
      >
        <Chip
          icon={<CheckCircleIcon fontSize="small" />}
          label={`累计签到 ${checkinCount} 天`}
          color="primary"
          variant="outlined"
        />
        <Chip
          icon={<LocalFireDepartmentIcon fontSize="small" />}
          label={`连续 ${streakCount} 天`}
          color="warning"
          variant="outlined"
        />
      </Box>

      <Card
        elevation={2}
        sx={{
          maxWidth: 600,
          mx: 'auto',
          textAlign: 'center',
        }}
      >
        <CardContent sx={{ pt: 4, pb: 4, px: 4 }}>
          <Typography
            sx={{
              fontSize: { xs: 140, sm: 180, md: 220 },
              lineHeight: 1.1,
              fontFamily: '"Noto Serif SC", "Songti SC", "SimSun", serif',
              fontWeight: 500,
              color: 'primary.main',
              mb: 3,
              userSelect: 'none',
            }}
          >
            {dailyRadical.char}
          </Typography>

          <Typography variant="h4" component="div" gutterBottom>
            {dailyRadical.meaning}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mb: 3,
              flexWrap: 'wrap',
            }}
          >
            <Chip
              label={`拼音：${dailyRadical.pinyin}`}
              color="primary"
              variant="outlined"
              size="medium"
            />
            <Chip
              label={`笔画：${dailyRadical.strokeCount}画`}
              color="secondary"
              variant="outlined"
              size="medium"
            />
            <Chip
              label={`第 ${dailyRadical.id} 部`}
              variant="outlined"
              size="medium"
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" gutterBottom color="text.secondary">
            例字摘要
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 3,
              mb: 4,
              flexWrap: 'wrap',
            }}
          >
            {displayExamples.map((ex, idx) => (
              <Box key={idx} sx={{ minWidth: 80 }}>
                <Typography
                  sx={{
                    fontSize: 36,
                    fontFamily: '"Noto Serif SC", "Songti SC", "SimSun", serif',
                    lineHeight: 1.2,
                  }}
                >
                  {ex.char}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {ex.pinyin}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ex.meaning}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              pt: 2,
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            {!checkedIn ? (
              <Button
                variant="contained"
                size="large"
                startIcon={<EventIcon />}
                onClick={handleCheckIn}
                sx={{ px: 4, py: 1.5 }}
              >
                立即签到
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                startIcon={<CheckCircleIcon />}
                color="success"
                disabled
                sx={{ px: 4, py: 1.5 }}
              >
                今日已签到
              </Button>
            )}
            <Button
              variant="outlined"
              size="large"
              endIcon={<ChevronRightIcon />}
              onClick={handleViewDetail}
              sx={{ px: 4, py: 1.5 }}
            >
              查看详情
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
