import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Paper, Skeleton, Typography } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import type { Radical } from '../types/radical';

interface RadicalNavProps {
  prev: Radical | null;
  next: Radical | null;
  isLoading?: boolean;
}

export default function RadicalNav({ prev, next, isLoading = false }: RadicalNavProps) {
  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (t) => t.zIndex.appBar - 1,
        borderRadius: 0,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          maxWidth: 'lg',
          mx: 'auto',
          px: 2,
          py: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button
          component={!isLoading && prev ? RouterLink : 'div'}
          to={!isLoading && prev ? `/radical/${prev.id}` : undefined}
          disabled={isLoading || !prev}
          startIcon={!isLoading && prev ? <NavigateBeforeIcon /> : undefined}
          sx={{
            textTransform: 'none',
            minWidth: 140,
            justifyContent: 'flex-start',
            opacity: !isLoading && prev ? 1 : 0.38,
          }}
        >
          {isLoading ? (
            <Skeleton width={100} height={24} animation="wave" />
          ) : prev ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="h5"
                sx={{ fontFamily: '"Noto Serif SC", serif', color: 'primary.main', lineHeight: 1 }}
              >
                {prev.char}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                第{prev.id}部
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.disabled">
              已是第一部
            </Typography>
          )}
        </Button>

        <Button
          component={!isLoading && next ? RouterLink : 'div'}
          to={!isLoading && next ? `/radical/${next.id}` : undefined}
          disabled={isLoading || !next}
          endIcon={!isLoading && next ? <NavigateNextIcon /> : undefined}
          sx={{
            textTransform: 'none',
            minWidth: 140,
            justifyContent: 'flex-end',
            opacity: !isLoading && next ? 1 : 0.38,
          }}
        >
          {isLoading ? (
            <Skeleton width={100} height={24} animation="wave" />
          ) : next ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                第{next.id}部
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontFamily: '"Noto Serif SC", serif', color: 'primary.main', lineHeight: 1 }}
              >
                {next.char}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.disabled">
              已是最后一部
            </Typography>
          )}
        </Button>
      </Box>
    </Paper>
  );
}
