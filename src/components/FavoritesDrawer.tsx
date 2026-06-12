import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useFavorites } from '../hooks/useFavorites';
import { useRadicals } from '../hooks/useRadicals';

interface FavoritesDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function FavoritesDrawer({ open, onClose }: FavoritesDrawerProps) {
  const { ids, remove } = useFavorites();
  const { data: radicals, isLoading } = useRadicals();

  const radicalMap = new Map((radicals ?? []).map((r) => [r.id, r]));
  const favoriteRadicals = ids
    .map((id) => radicalMap.get(id))
    .filter((r): r is NonNullable<typeof r> => r !== undefined);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          我的收藏（{ids.length}）
        </Typography>
        <IconButton aria-label="关闭收藏" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {isLoading && ids.length > 0 ? (
          <Box sx={{ p: 2 }}>
            <Skeleton variant="rounded" height={56} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" height={56} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" height={56} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              加载中…
            </Typography>
          </Box>
        ) : ids.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            暂无收藏的部首，点击部首卡片右上角的 ❤ 按钮可添加收藏
          </Typography>
        ) : (
          <List disablePadding>
            {favoriteRadicals.map((radical) => (
              <ListItem
                key={radical.id}
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label={`取消收藏 ${radical.char}`}
                    onClick={() => remove(radical.id)}
                    color="default"
                  >
                    <FavoriteBorderIcon />
                  </IconButton>
                }
              >
                <ListItemButton
                  component={RouterLink}
                  to={`/radical/${radical.id}`}
                  onClick={onClose}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          component="span"
                          sx={{ fontFamily: '"Noto Serif SC", serif', fontSize: '1.5rem' }}
                        >
                          {radical.char}
                        </Typography>
                      </Box>
                    }
                    secondary={`#${radical.id} ${radical.pinyin} · ${radical.meaning}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
}
