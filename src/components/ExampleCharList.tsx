import { KeyboardEvent, useCallback } from 'react';
import {
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import type { ExampleChar } from '../types/radical';

interface ExampleCharListProps {
  /** 例字数组 */
  examples: ExampleChar[];
  /** 点击例字卡片时的回调，未传则卡片不可交互 */
  onExampleClick?: (example: ExampleChar) => void;
}

/**
 * 部首详情下的例字列表。
 * 当传入 `onExampleClick` 时，每个卡片具备按钮语义、键盘可聚焦、回车/空格触发，
 * 适用于读屏与纯键盘操作场景。
 */
export default function ExampleCharList({ examples, onExampleClick }: ExampleCharListProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>, example: ExampleChar) => {
      if (!onExampleClick) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onExampleClick(example);
      }
    },
    [onExampleClick],
  );

  const interactive = !!onExampleClick;

  return (
    <Grid container spacing={2}>
      {examples.map((example) => (
        <Grid item xs={6} sm={4} md={3} key={example.char}>
          <Paper
            elevation={0}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-label={interactive ? `查看例字 ${example.char} 详情` : undefined}
            onClick={interactive ? () => onExampleClick?.(example) : undefined}
            onKeyDown={interactive ? (e) => handleKeyDown(e, example) : undefined}
            sx={{
              p: 2,
              textAlign: 'center',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              cursor: interactive ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              outline: 'none',
              '&:hover, &:focus-visible': interactive
                ? {
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)',
                  }
                : undefined,
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontFamily: '"Noto Serif SC", serif', mb: 0.5 }}
            >
              {example.char}
            </Typography>
            <Typography variant="body2" color="primary.main">
              {example.pinyin}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {example.meaning}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
