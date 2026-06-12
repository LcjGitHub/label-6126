import { useCallback, useEffect, useState } from 'react';
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
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import { useRadicals } from '../hooks/useRadicals';
import { useRadicalSearch, type MatchTypeFilter } from '../hooks/useRadicalSearch';
import { addSearchHistory, getSearchHistory } from '../utils/searchHistory';
import type { SearchHistoryItem } from '../types/radical';

interface SearchDrawerProps {
  open: boolean;
  onClose: () => void;
}

/** 汉字 / 释义搜索侧栏 */
export default function SearchDrawer({ open, onClose }: SearchDrawerProps) {
  const [query, setQuery] = useState('');
  const [matchFilter, setMatchFilter] = useState<MatchTypeFilter>('all');
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const { data: radicals } = useRadicals();
  const results = useRadicalSearch(radicals, query, matchFilter);
  const allResults = useRadicalSearch(radicals, query, 'all');

  useEffect(() => {
    if (open) {
      setQuery('');
      setMatchFilter('all');
      setHistory(getSearchHistory());
    }
  }, [open]);

  useEffect(() => {
    if (query.trim() === '') {
      setMatchFilter('all');
    }
  }, [query]);

  const handleSubmit = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed && results.length > 0) {
      const updated = addSearchHistory(trimmed);
      setHistory(updated);
    }
  }, [query, results]);

  const handleHistoryClick = useCallback(
    (keyword: string) => {
      setQuery(keyword);
      const updated = addSearchHistory(keyword);
      setHistory(updated);
    },
    []
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleFilterChange = useCallback(
    (_event: React.MouseEvent<HTMLElement>, value: MatchTypeFilter | null) => {
      if (value !== null) {
        setMatchFilter(value);
      }
    },
    []
  );

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
          onKeyDown={handleKeyDown}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        {query.trim() !== '' && (
          <Box sx={{ mt: 1.5 }}>
            <ToggleButtonGroup
              size="small"
              exclusive
              fullWidth
              value={matchFilter}
              onChange={handleFilterChange}
              aria-label="搜索结果类型筛选"
              role="group"
            >
              <ToggleButton value="all" aria-label="显示全部匹配结果">全部</ToggleButton>
              <ToggleButton value="radical" aria-label="仅显示部首匹配结果">仅部首</ToggleButton>
              <ToggleButton value="example" aria-label="仅显示例字匹配结果">仅例字</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}

        {query.trim() === '' && history.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <HistoryIcon color="action" sx={{ fontSize: 16 }} />
              <Typography variant="body2" color="text.secondary">
                最近搜索
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {history.map((item) => (
                <Chip
                  key={item.timestamp}
                  label={item.keyword}
                  size="small"
                  onClick={() => handleHistoryClick(item.keyword)}
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {query.trim() === '' ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            可搜索部首、例字汉字、拼音或释义
          </Typography>
        ) : results.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            {allResults.length === 0 ? '未找到匹配结果' : '当前筛选类型下无匹配项'}
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
