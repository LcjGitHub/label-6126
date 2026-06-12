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
import RadicalNav from '../components/RadicalNav';
import { useAdjacentRadicals, useRadical } from '../hooks/useRadicals';
import { useFavorites } from '../hooks/useFavorites';

export default function RadicalDetailPage() {
  const { id: idParam } = useParams<{ id: string }>();
  const id = Number(idParam);
  const { data: radical, isLoading, isError } = useRadical(id);
  const { data: adjacent, isLoading: isAdjacentLoading } = useAdjacentRadicals(id);
  const { isFavorite, toggle } = useFavorites();

  if (!Number.isFinite(id) || id < 1 || id > 214) {
    return <Alert severity="warning">无效的部首编号，请输入 1–214</Alert>;
  }

  if (isError || (!isLoading && !radical)) {
    return <Alert severity="error">未找到该部首</Alert>;
  }

  const renderContent = () => {
    if (isLoading || !radical) {
      return (
        <>
          <Skeleton width={200} height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rounded" height={120} sx={{ mb: 3 }} />
          <Skeleton variant="rounded" height={240} />
        </>
      );
    }

    return (
      <>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
          <Link component={RouterLink} underline="hover" color="inherit" to="/">
            部首列表
          </Link>
          <Typography color="text.primary">#{radical.id} {radical.char}</Typography>
        </Breadcrumbs>

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

        <Typography variant="h6" gutterBottom>
          例字
        </Typography>
        <ExampleCharList examples={radical.examples} />
      </>
    );
  };

  return (
    <>
      <Box sx={{ pb: 8 }}>
        {renderContent()}
      </Box>
      <RadicalNav
        prev={adjacent?.prev ?? null}
        next={adjacent?.next ?? null}
        isLoading={isAdjacentLoading}
      />
    </>
  );
}
