import { Box, Grid, Skeleton, Typography } from '@mui/material';
import type { Radical } from '../types/radical';
import RadicalCard from './RadicalCard';

/**
 * 部首网格组件属性
 * @property radicals - 已排序的部首列表，按传入顺序渲染，组件内部不再排序
 * @property loading - 是否处于加载状态
 */
interface RadicalGridProps {
  radicals?: Radical[];
  loading?: boolean;
}

/**
 * 214 部首网格
 * 接收首页已完成排序的部首列表，按传入顺序依次渲染部首卡片，
 * 组件内部不执行任何排序逻辑，仅负责展示。
 * @param props - 组件属性
 */
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
