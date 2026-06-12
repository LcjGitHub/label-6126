import { Box, Chip, Grid, Skeleton, Typography } from '@mui/material';
import { useMemo } from 'react';
import PinyinGroupHeader from '../components/PinyinGroupHeader';
import RadicalCard from '../components/RadicalCard';
import { useRadicals } from '../hooks/useRadicals';
import { groupRadicalsByPinyin } from '../utils/pinyinGroup';

export default function PinyinIndexPage() {
  const { data: radicals, isLoading, isError, error } = useRadicals();

  const groups = useMemo(() => {
    if (!radicals) return [];
    return groupRadicalsByPinyin(radicals);
  }, [radicals]);

  const totalCount = radicals?.length ?? 0;

  const scrollToLetter = (letter: string) => {
    const element = document.getElementById(`pinyin-group-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        拼音索引 · 全部部首（{totalCount}）
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        按拼音首字母分组浏览，点击字母快速跳转，点击卡片查看详情
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          mb: 2,
          p: 1.5,
          bgcolor: 'action.hover',
          borderRadius: 1,
        }}
      >
        {groups.map((group) => (
          <Chip
            key={group.letter}
            label={group.letter}
            size="small"
            clickable
            onClick={() => scrollToLetter(group.letter)}
            sx={{
              minWidth: 32,
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              },
            }}
          />
        ))}
      </Box>

      {isError ? (
        <Typography color="error">
          加载失败：{error instanceof Error ? error.message : '未知错误'}
        </Typography>
      ) : isLoading ? (
        <Box>
          {Array.from({ length: 5 }).map((_, i) => (
            <Box key={i} sx={{ mt: 3 }}>
              <Skeleton variant="rounded" width={120} height={32} sx={{ mb: 1.5 }} />
              <Grid container spacing={1.5}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <Grid item xs={4} sm={3} md={2} lg={1.5} key={j}>
                    <Skeleton variant="rounded" height={96} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      ) : (
        <Box>
          {groups.map((group) => (
            <Box key={group.letter} id={`pinyin-group-${group.letter}`}>
              <PinyinGroupHeader letter={group.letter} count={group.radicals.length} />
              <Grid container spacing={1.5}>
                {group.radicals.map((radical) => (
                  <Grid item xs={4} sm={3} md={2} lg={1.5} key={radical.id}>
                    <RadicalCard radical={radical} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
