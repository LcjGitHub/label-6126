import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Breadcrumbs,
  Chip,
  IconButton,
  Link,
  Paper,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ExampleCharList from '../components/ExampleCharList';
import ExampleDialog from '../components/ExampleDialog';
import RadicalNav from '../components/RadicalNav';
import SameStrokeNav from '../components/SameStrokeNav';
import { useAdjacentRadicals, useRadical, useRadicals } from '../hooks/useRadicals';
import { useFavorites } from '../hooks/useFavorites';
import { useStats } from '../hooks/useStats';
import type { ExampleChar } from '../types/radical';

export default function RadicalDetailPage() {
  const { id: idParam } = useParams<{ id: string }>();
  const id = Number(idParam);
  const { data: radical, isLoading, isError } = useRadical(id);
  const { data: radicals } = useRadicals();
  const { data: adjacent, isLoading: isAdjacentLoading } = useAdjacentRadicals(id);
  const { isFavorite, toggle } = useFavorites();
  const { trackView } = useStats();

  const [selectedExample, setSelectedExample] = useState<ExampleChar | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleExampleClick = useCallback((example: ExampleChar) => {
    setSelectedExample(example);
    setDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setSelectedExample(null);
  }, []);

  const strokeCount = useMemo(() => {
    if (radicals) {
      const r = radicals.find((item) => item.id === id);
      if (r) return r.strokeCount;
    }
    if (radical) return radical.strokeCount;
    return 0;
  }, [radical, radicals, id]);

  useEffect(() => {
    if (radical) {
      document.title = `第${radical.id}部 · ${radical.char} · 康熙部首`;
      trackView(radical.id);
    }
  }, [radical, trackView]);

  if (!Number.isFinite(id) || id < 1 || id > 214) {
    return <Alert severity="warning">无效的部首编号，请输入 1–214</Alert>;
  }

  if (isError || (!isLoading && !radical)) {
    return <Alert severity="error">未找到该部首</Alert>;
  }

  const renderBreadcrumbs = () => {
    if (isLoading || !radical) {
      return <Skeleton width={200} height={32} sx={{ mb: 2 }} />;
    }
    return (
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
        <Link component={RouterLink} underline="hover" color="inherit" to="/">
          部首列表
        </Link>
        <Typography color="text.primary">#{radical.id} {radical.char}</Typography>
      </Breadcrumbs>
    );
  };

  const renderRadicalCard = () => {
    if (isLoading || !radical) {
      return <Skeleton variant="rounded" height={120} sx={{ mb: 3 }} />;
    }
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          flexWrap: 'wrap',
        }}
      >
        <Typography
          variant="h2"
          component="span"
          sx={{ fontFamily: '"Noto Serif SC", serif', color: 'primary.main' }}
        >
          {radical.char}
        </Typography>
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Typography variant="h6" gutterBottom>
            第 {radical.id} 部 · {radical.pinyin}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={`释义：${radical.meaning}`} />
            <Chip label={`笔画：${radical.strokeCount}`} variant="outlined" />
            <Chip label={`例字 ${radical.examples.length} 个`} variant="outlined" />
          </Box>
        </Box>
        <Tooltip title={isFavorite(radical.id) ? '取消收藏' : '收藏'}>
          <IconButton
            aria-label={isFavorite(radical.id) ? '取消收藏' : '收藏'}
            onClick={() => toggle(radical.id)}
            color={isFavorite(radical.id) ? 'error' : 'default'}
            sx={{ p: 1.5 }}
          >
            {isFavorite(radical.id) ? (
              <FavoriteIcon sx={{ fontSize: 28 }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 28 }} />
            )}
          </IconButton>
        </Tooltip>
      </Paper>
    );
  };

  const renderExampleSection = () => {
    if (isLoading || !radical) {
      return (
        <>
          <Skeleton width={60} height={24} sx={{ mb: 1 }} />
          <Skeleton variant="rounded" height={240} />
        </>
      );
    }
    return (
      <>
        <Typography variant="h6" gutterBottom>
          例字
        </Typography>
        <ExampleCharList examples={radical.examples} onExampleClick={handleExampleClick} />
      </>
    );
  };

  return (
    <>
      <Box sx={{ pb: 8 }}>
        {renderBreadcrumbs()}
        {renderRadicalCard()}
        {strokeCount > 0 ? (
          <SameStrokeNav strokeCount={strokeCount} currentId={id} />
        ) : (
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Skeleton width={160} height={24} sx={{ mb: 1.5, mx: 0.5 }} />
            <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'hidden', pb: 0.5 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  width={120}
                  height={110}
                  sx={{ flexShrink: 0 }}
                />
              ))}
            </Box>
          </Box>
        )}
        {renderExampleSection()}
      </Box>
      <RadicalNav
        prev={adjacent?.prev ?? null}
        next={adjacent?.next ?? null}
        isLoading={isAdjacentLoading}
      />
      <ExampleDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        example={selectedExample}
        radical={radical ?? null}
      />
    </>
  );
}
