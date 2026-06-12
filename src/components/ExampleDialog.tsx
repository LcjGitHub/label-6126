import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { ExampleChar, Radical } from '../types/radical';

interface ExampleDialogProps {
  open: boolean;
  onClose: () => void;
  example: ExampleChar | null;
  radical: Radical | null;
}

export default function ExampleDialog({ open, onClose, example, radical }: ExampleDialogProps) {
  if (!example || !radical) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          m: { xs: 2, sm: 3 },
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton aria-label="关闭" onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 0, pb: 4, px: { xs: 3, sm: 5 } }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h1"
            sx={{
              fontFamily: '"Noto Serif SC", serif',
              fontSize: { xs: '6rem', sm: '8rem' },
              lineHeight: 1,
              color: 'primary.main',
              mb: 2,
            }}
          >
            {example.char}
          </Typography>
          <Typography variant="h5" color="primary.main" sx={{ mb: 1 }}>
            {example.pinyin}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {example.meaning}
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{
            p: 2.5,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'grey.50',
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Noto Serif SC", serif',
              fontSize: '2.5rem',
              color: 'text.primary',
            }}
          >
            {radical.char}
          </Typography>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Chip label={`第 ${radical.id} 部`} size="small" sx={{ mb: 0.5 }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              <Link
                component={RouterLink}
                to={`/radical/${radical.id}`}
                onClick={onClose}
                underline="hover"
                color="primary"
              >
                查看部首详情 →
              </Link>
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
