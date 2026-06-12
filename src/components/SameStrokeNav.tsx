import { useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
import type { Radical } from '../types/radical';
import { useRadicalsByStrokeCount } from '../hooks/useRadicals';

interface SameStrokeNavProps {
  strokeCount: number;
  currentId: number;
}

export default function SameStrokeNav({ strokeCount, currentId }: SameStrokeNavProps) {
  const theme = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: radicals, isLoading } = useRadicalsByStrokeCount(strokeCount);

  useEffect(() => {
    if (scrollRef.current && radicals) {
      const currentIdx = radicals.findIndex((r) => r.id === currentId);
      if (currentIdx !== -1) {
        const children = scrollRef.current.children;
        if (children[currentIdx]) {
          const element = children[currentIdx] as HTMLElement;
          const container = scrollRef.current;
          const offset =
            element.offsetLeft - container.clientWidth / 2 + element.clientWidth / 2;
          container.scrollTo({ left: offset, behavior: 'smooth' });
        }
      }
    }
  }, [radicals, currentId]);

  const renderSkeletons = () =>
    Array.from({ length: 6 }).map((_, i) => (
      <Skeleton
        key={i}
        variant="rounded"
        width={120}
        height={110}
        sx={{ flexShrink: 0 }}
      />
    ));

  const renderItems = () =>
    radicals?.map((radical) => (
      <StrokeNavCard key={radical.id} radical={radical} isActive={radical.id === currentId} />
    ));

  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        borderRadius: 2,
        backgroundColor: theme.palette.action.hover,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, px: 0.5 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
          同笔画部首 · {strokeCount} 画
        </Typography>
      </Box>
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          gap: 1.5,
          overflowX: 'auto',
          pb: 1,
          scrollBehavior: 'smooth',
        }}
      >
        {isLoading ? renderSkeletons() : renderItems()}
      </Box>
    </Box>
  );
}

interface StrokeNavCardProps {
  radical: Radical;
  isActive: boolean;
}

function StrokeNavCard({ radical, isActive }: StrokeNavCardProps) {
  const theme = useTheme();

  const cardSx = {
    flexShrink: 0,
    width: 120,
    height: '100%',
    border: isActive ? 2 : 1,
    borderColor: isActive ? 'primary.main' : 'divider',
    borderRadius: 2,
    transition: 'transform 0.15s, box-shadow 0.15s',
    backgroundColor: isActive ? 'primary.main' : 'background.paper',
    '&:hover': !isActive
      ? {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        }
      : undefined,
  };

  const charColor = isActive ? theme.palette.primary.contrastText : 'inherit';
  const textSecondaryColor = isActive ? 'rgba(255,255,255,0.85)' : 'text.secondary';

  const cardContent = (
    <CardContent sx={{ textAlign: 'center', py: 2, height: '100%' }}>
      <Typography
        variant="h4"
        component="span"
        sx={{ fontFamily: '"Noto Serif SC", serif', lineHeight: 1.2, color: charColor }}
      >
        {radical.char}
      </Typography>
      <Typography
        variant="caption"
        display="block"
        sx={{ mt: 0.5, color: textSecondaryColor }}
      >
        #{radical.id} · {radical.pinyin} · {radical.strokeCount}画
      </Typography>
      <Typography
        variant="body2"
        noWrap
        sx={{ color: textSecondaryColor, mt: 0.25 }}
      >
        {radical.meaning}
      </Typography>
    </CardContent>
  );

  return (
    <Card elevation={isActive ? 2 : 1} sx={cardSx}>
      {isActive ? (
        cardContent
      ) : (
        <CardActionArea
          component={RouterLink}
          to={`/radical/${radical.id}`}
          sx={{ height: '100%' }}
        >
          {cardContent}
        </CardActionArea>
      )}
    </Card>
  );
}
