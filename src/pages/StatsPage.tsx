import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TodayIcon from '@mui/icons-material/Today';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useStats } from '../hooks/useStats';
import { useRadicals } from '../hooks/useRadicals';

export default function StatsPage() {
  const { stats, clear } = useStats();
  const { data: radicals } = useRadicals();

  useEffect(() => {
    document.title = '学习统计 · 康熙部首';
  }, []);

  const radicalMap = new Map(radicals?.map((r) => [r.id, r]) ?? []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        学习统计
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        追踪你的部首浏览情况，了解学习进度
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 4 }}>
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              }}
            >
              <BarChartIcon />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                累计浏览部首
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {stats.totalViewed}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
              }}
            >
              <TodayIcon />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                今日浏览部首
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {stats.todayViewed}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Paper
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 3 }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmojiEventsIcon color="primary" />
          <Typography variant="h6">浏览次数最多的部首</Typography>
        </Box>
        <Divider />
        {stats.topRadicals.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              暂无浏览记录，去浏览部首吧！
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {stats.topRadicals.map((item, index) => {
              const radical = radicalMap.get(item.radicalId);
              const medals = ['#FFD700', '#C0C0C0', '#CD7F32'];
              return (
                <ListItem
                  key={item.radicalId}
                  component={RouterLink}
                  to={`/radical/${item.radicalId}`}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  divider={index < stats.topRadicals.length - 1}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 700,
                        color: index < 3 ? medals[index] : 'text.secondary',
                      }}
                    >
                      {index + 1}
                    </Typography>
                  </ListItemIcon>
                  <Typography
                    variant="h5"
                    component="span"
                    sx={{
                      fontFamily: '"Noto Serif SC", serif',
                      color: 'primary.main',
                      mr: 2,
                      minWidth: 36,
                      textAlign: 'center',
                    }}
                  >
                    {radical?.char ?? '?'}
                  </Typography>
                  <ListItemText
                    primary={radical ? `第 ${radical.id} 部 · ${radical.pinyin}` : `第 ${item.radicalId} 部`}
                    secondary={`浏览 ${item.count} 次`}
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteOutlineIcon />}
          onClick={clear}
          disabled={stats.totalViewed === 0}
        >
          清除浏览记录
        </Button>
      </Box>
    </Box>
  );
}
