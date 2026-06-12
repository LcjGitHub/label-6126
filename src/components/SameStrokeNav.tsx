import { useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Chip,
  IconButton,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.7;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const renderSkeletons = () =>
    Array.from({ length: 6 }).map((_, i) => (
      <Skeleton
        key={i}
        variant="rounded"
        width={72}
        height={80}
        sx={{ flexShrink: 0 }}
      />
    ));

  const renderItems = () =>
    radicals?.map((radical) => (
      <ChipNavItem key={radical.id} radical={radical} isActive={radical.id === currentId} />
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
        <Box sx={{ flex: 1 }} />
        <IconButton
          size="small"
          onClick={() => scroll('left')}
          aria-label="向左滚动"
          sx={{ color: 'text.secondary' }}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => scroll('right')}
          aria-label="向右滚动"
          sx={{ color: 'text.secondary' }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          gap: 1.5,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          pb: 0.5,
          scrollBehavior: 'smooth',
        }}
      >
        {isLoading ? renderSkeletons() : renderItems()}
      </Box>
    </Box>
  );
}

interface ChipNavItemProps {
  radical: Radical;
  isActive: boolean;
}

function ChipNavItem({ radical, isActive }: ChipNavItemProps) {
  const theme = useTheme();
  return (
    <Chip
      component={RouterLink}
      to={`/radical/${radical.id}`}
      label={
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 0.5 }}>
          <Typography
            variant="h5"
            component="span"
            sx={{
              fontFamily: '"Noto Serif SC", serif',
              lineHeight: 1.1,
              color: isActive ? theme.palette.primary.contrastText : 'inherit',
            }}
          >
            {radical.char}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              mt: 0.25,
              color: isActive ? 'rgba(255,255,255,0.85)' : 'text.secondary',
              fontSize: '0.68rem',
            }}
          >
            #{radical.id}
          </Typography>
        </Box>
      }
      clickable
      variant={isActive ? 'filled' : 'outlined'}
      color={isActive ? 'primary' : 'default'}
      sx={{
        height: 'auto',
        minWidth: 68,
        px: 1.5,
        py: 0.75,
        flexShrink: 0,
        borderRadius: 2,
        border: isActive ? 2 : 1,
        borderColor: isActive ? 'primary.main' : 'divider',
        transition: 'all 0.15s ease',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: 1,
        },
        '& .MuiChip-label': {
          padding: 0,
          display: 'block',
        },
      }}
    />
  );
}
