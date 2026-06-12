import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import type { Radical } from '../types/radical';

interface StudyCardProps {
  radical: Radical;
  onNext: () => void;
}

/** 学习卡片：大号字形 + 答案展开 + 下一个按钮 */
export default function StudyCard({ radical, onNext }: StudyCardProps) {
  const [revealed, setRevealed] = useState(false);

  const handleNext = () => {
    setRevealed(false);
    onNext();
  };

  const examples = radical.examples.slice(0, 2);

  return (
    <Card
      elevation={2}
      sx={{
        maxWidth: 520,
        mx: 'auto',
        textAlign: 'center',
      }}
    >
      <CardContent sx={{ pt: 4, pb: 3, px: 4 }}>
        <Typography
          sx={{
            fontSize: { xs: 128, sm: 160, md: 192 },
            lineHeight: 1.1,
            fontFamily: '"Noto Serif SC", "Songti SC", "SimSun", serif',
            fontWeight: 500,
            color: 'primary.main',
            mb: 3,
            userSelect: 'none',
          }}
        >
          {radical.char}
        </Typography>

        <Box sx={{ minHeight: revealed ? 'auto' : 56, mb: revealed ? 0 : 2 }}>
          {revealed ? (
            <Box sx={{ animation: 'fadeIn 0.3s ease-out' }}>
              <Typography variant="h5" component="div" gutterBottom>
                {radical.meaning}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={`拼音：${radical.pinyin}`}
                  color="primary"
                  variant="outlined"
                  size="medium"
                />
                <Chip
                  label={`笔画：${radical.strokeCount}画`}
                  color="secondary"
                  variant="outlined"
                  size="medium"
                />
                <Chip
                  label={`编号：#${radical.id}`}
                  variant="outlined"
                  size="medium"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom color="text.secondary">
                例字
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 2 }}>
                {examples.map((ex, idx) => (
                  <Box key={idx} sx={{ minWidth: 100 }}>
                    <Typography
                      sx={{
                        fontSize: 40,
                        fontFamily: '"Noto Serif SC", "Songti SC", "SimSun", serif',
                        lineHeight: 1.2,
                      }}
                    >
                      {ex.char}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {ex.pinyin}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {ex.meaning}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary">
              点击下方按钮查看释义
            </Typography>
          )}
        </Box>

        <Box sx={{ pt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
          {!revealed ? (
            <Button
              variant="contained"
              size="large"
              startIcon={<VisibilityIcon />}
              onClick={() => setRevealed(true)}
              sx={{ px: 4, py: 1.5 }}
            >
              显示答案
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              color="success"
              endIcon={<NavigateNextIcon />}
              onClick={handleNext}
              sx={{ px: 4, py: 1.5 }}
            >
              下一个
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
