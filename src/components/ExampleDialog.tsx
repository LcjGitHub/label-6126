import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { ExampleChar, Radical } from '../types/radical';

interface ExampleDialogProps {
  /** 弹窗是否打开 */
  open: boolean;
  /** 关闭弹窗的回调 */
  onClose: () => void;
  /** 当前展示的例字，为空时不渲染 */
  example: ExampleChar | null;
  /** 例字所属的部首，为空时不渲染 */
  radical: Radical | null;
}

/**
 * 例字详情弹窗。
 * - 居中展示选中例字的大字、拼音与释义
 * - 下半区展示所属部首字形、部首编号，并提供跳转到部首详情的链接
 * - 支持读屏识别（DialogTitle）、遮罩点击与右上角关闭按钮
 */
export default function ExampleDialog({ open, onClose, example, radical }: ExampleDialogProps) {
  if (!example || !radical) return null;

  const dialogTitleId = `example-dialog-title-${example.char}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby={dialogTitleId}
      PaperProps={{
        sx: {
          borderRadius: 3,
          m: { xs: 2, sm: 3 },
        },
      }}
    >
      <DialogTitle id={dialogTitleId} sx={{ p: 0, height: 0, overflow: 'hidden' }}>
        例字 {example.char} 详情
      </DialogTitle>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton aria-label="关闭例字详情弹窗" onClick={onClose} size="large">
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
            <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
              部首编号：{radical.id}
            </Typography>
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
