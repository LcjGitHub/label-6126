import {
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import type { ExampleChar } from '../types/radical';

interface ExampleCharListProps {
  examples: ExampleChar[];
  onExampleClick?: (example: ExampleChar) => void;
}

/** 部首详情下的例字列表 */
export default function ExampleCharList({ examples, onExampleClick }: ExampleCharListProps) {
  return (
    <Grid container spacing={2}>
      {examples.map((example) => (
        <Grid item xs={6} sm={4} md={3} key={example.char}>
          <Paper
            elevation={0}
            onClick={() => onExampleClick?.(example)}
            sx={{
              p: 2,
              textAlign: 'center',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              cursor: onExampleClick ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              '&:hover': onExampleClick
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
