import { Box, Grid, Skeleton, Typography } from '@mui/material';
import type { Radical } from '../types/radical';
import RadicalCard from './RadicalCard';

interface RadicalGridProps {
  radicals?: Radical[];
  loading?: boolean;
}

/** 214 部首网格 */
export default function RadicalGrid({ radicals, loading }: RadicalGridProps) {
  if (loading) {
    return (
      <Grid container spacing={1.5}>
        {Array.from({ length: 24 }).map((_, index) => (
          <Grid item xs={4} sm={3} md={2} lg={1.5} key={index}>
            <Skeleton variant="rounded" height={96} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (radicals && radicals.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          该区间暂无部首
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={1.5}>
      {radicals?.map((radical) => (
        <Grid item xs={4} sm={3} md={2} lg={1.5} key={radical.id}>
          <RadicalCard radical={radical} />
        </Grid>
      ))}
    </Grid>
  );
}
