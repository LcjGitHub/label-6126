import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useRadicals } from '../hooks/useRadicals';
import { useRadicalSearch } from '../hooks/useRadicalSearch';

interface SearchDrawerProps {
  open: boolean;
  onClose: () => void;
}

/** 汉字 / 释义搜索侧栏 */
export default function SearchDrawer({ open, onClose }: SearchDrawerProps) {
  const [query, setQuery] = useState('');
  const { data: radicals } = useRadicals();
  const results = useRadicalSearch(radicals, query);

  useEffect(() => {
    if (!open) {
      setQuery('');
    }
  }, [open]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          搜索
        </Typography>
        <IconButton aria-label="关闭搜索" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ px: 2, pb: 2 }}>
        <TextField
          fullWidth
          autoFocus
          placeholder="输入汉字或释义…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {query.trim() === '' ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            可搜索部首、例字汉字、拼音或释义
          </Typography>
        ) : results.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            未找到匹配结果
          </Typography>
        ) : (
          <List disablePadding>
            {results.map((result) => {
              const key = result.matchedChar
                ? `${result.radical.id}-${result.matchedChar.char}`
                : `radical-${result.radical.id}`;

              return (
                <ListItemButton
                  key={key}
                  component={RouterLink}
                  to={`/radical/${result.radical.id}`}
                  onClick={onClose}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          component="span"
                          sx={{ fontFamily: '"Noto Serif SC", serif', fontSize: '1.5rem' }}
                        >
                          {result.matchedChar?.char ?? result.radical.char}
                        </Typography>
                        <Chip
                          size="small"
                          label={result.matchType === 'example' ? '例字' : '部首'}
                          color={result.matchType === 'example' ? 'secondary' : 'default'}
                        />
                      </Box>
                    }
                    secondary={
                      result.matchedChar
                        ? `${result.matchedChar.pinyin} · ${result.matchedChar.meaning}（部首 ${result.radical.char}）`
                        : `#${result.radical.id} ${result.radical.pinyin} · ${result.radical.meaning}`
                    }
                  />
                </ListItemButton>
              );
            })}
          </List>
        )}
      </Box>
    </Drawer>
  );
}
