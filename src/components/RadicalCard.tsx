import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';
import type { Radical } from '../types/radical';

interface RadicalCardProps {
  radical: Radical;
}

/** 部首网格卡片 */
export default function RadicalCard({ radical }: RadicalCardProps) {
  return (
    <Card
      elevation={1}
      sx={{
        height: '100%',
        transition: 'transform 0.15s, box-shadow 0.15s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/radical/${radical.id}`}
        sx={{ height: '100%' }}
      >
        <CardContent sx={{ textAlign: 'center', py: 2 }}>
          <Typography
            variant="h4"
            component="span"
            sx={{ fontFamily: '"Noto Serif SC", serif', lineHeight: 1.2 }}
          >
            {radical.char}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
            #{radical.id} · {radical.pinyin}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {radical.meaning}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
