import { Box, Chip, Paper, Typography } from '@mui/material';
import type { Radical } from '../types/radical';

interface RadicalCompareCardProps {
  radical: Radical | null;
  isLoading?: boolean;
  label?: string;
}

export default function RadicalCompareCard({ radical, isLoading, label }: RadicalCompareCardProps) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h2" sx={{ fontFamily: '"Noto Serif SC", serif', color: 'grey.300' }}>
              —
            </Typography>
          </Box>
          <Box sx={{ height: 24, bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />
          <Box sx={{ height: 24, bgcolor: 'grey.200', borderRadius: 1, mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Box sx={{ height: 32, width: 80, bgcolor: 'grey.200', borderRadius: 1 }} />
            <Box sx={{ height: 32, width: 80, bgcolor: 'grey.200', borderRadius: 1 }} />
          </Box>
          <Box sx={{ height: 24, bgcolor: 'grey.200', borderRadius: 1, mb: 2 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
            {[0, 1, 2].map((i) => (
              <Box key={i} sx={{ height: 80, bgcolor: 'grey.200', borderRadius: 1 }} />
            ))}
          </Box>
        </>
      );
    }

    if (!radical) {
      return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h5" color="text.disabled" sx={{ fontFamily: '"Noto Serif SC", serif' }}>
            待选择
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
            请选择 1–214 之间的部首编号
          </Typography>
        </Box>
      );
    }

    return (
      <>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography
            variant="h2"
            component="div"
            sx={{ fontFamily: '"Noto Serif SC", serif', color: 'primary.main' }}
          >
            {radical.char}
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ textAlign: 'center', mb: 1 }}>
          第 {radical.id} 部
        </Typography>
        <Typography variant="subtitle1" color="primary.main" sx={{ textAlign: 'center', mb: 2 }}>
          {radical.pinyin}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
          <Chip label={`笔画：${radical.strokeCount}`} variant="outlined" size="small" />
          <Chip label={`释义：${radical.meaning}`} size="small" />
        </Box>

        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
          例字（前3个）
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
          {radical.examples.slice(0, 3).map((example) => (
            <Paper
              key={example.char}
              elevation={0}
              sx={{
                p: 1,
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <Typography variant="h5" sx={{ fontFamily: '"Noto Serif SC", serif' }}>
                {example.char}
              </Typography>
              <Typography variant="caption" color="primary.main" display="block">
                {example.pinyin}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" noWrap>
                {example.meaning}
              </Typography>
            </Paper>
          ))}
        </Box>
      </>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {label && (
        <Typography variant="overline" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
          {label}
        </Typography>
      )}
      {renderContent()}
    </Paper>
  );
}
