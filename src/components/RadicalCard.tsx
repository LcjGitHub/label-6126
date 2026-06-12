import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Typography,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import type { Radical } from '../types/radical';
import { useFavorites } from '../hooks/useFavorites';

interface RadicalCardProps {
  radical: Radical;
}

/** 部首网格卡片 */
export default function RadicalCard({ radical }: RadicalCardProps) {
  const { isFavorite, toggle } = useFavorites();
  const favorited = isFavorite(radical.id);

  return (
    <Card
      elevation={1}
      sx={{
        height: '100%',
        position: 'relative',
        transition: 'transform 0.15s, box-shadow 0.15s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/radical/${radical.id}`}
        sx={{ height: '100%' }}
      >
        <CardContent sx={{ textAlign: 'center', py: 2 }}>
          <Typography
            variant="h4"
            component="span"
            sx={{ fontFamily: '"Noto Serif SC", serif', lineHeight: 1.2 }}
          >
            {radical.char}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
            #{radical.id} · {radical.pinyin} · {radical.strokeCount}画
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {radical.meaning}
          </Typography>
        </CardContent>
      </CardActionArea>
      <IconButton
        size="small"
        aria-label={favorited ? `取消收藏 ${radical.char}` : `收藏 ${radical.char}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle(radical.id);
        }}
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          color: favorited ? 'error.main' : 'text.secondary',
          opacity: favorited ? 1 : 0.6,
          transition: 'opacity 0.15s, background-color 0.15s',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
            opacity: 1,
          },
        }}
      >
        {favorited ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
      </IconButton>
    </Card>
  );
}
