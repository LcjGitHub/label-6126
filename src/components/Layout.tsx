import { useEffect, useState } from 'react';
import { Link as RouterLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  AppBar,
  Badge,
  Box,
  Container,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BarChartIcon from '@mui/icons-material/BarChart';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SearchDrawer from './SearchDrawer';
import FavoritesDrawer from './FavoritesDrawer';
import { useFavorites } from '../hooks/useFavorites';
import { useRadicals } from '../hooks/useRadicals';
import { pickRandomRadical } from '../utils/randomRadical';
import { hasCheckedIn } from '../utils/dailyRadical';

/** 全局布局：顶栏 + 搜索 Drawer + 收藏 Drawer + 内容区 */
export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const { ids } = useFavorites();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const { data: radicals } = useRadicals();
  const isDailyPage = location.pathname.startsWith('/daily');
  const isStudyPage = location.pathname.startsWith('/study');
  const isStatsPage = location.pathname.startsWith('/stats');
  const isComparePage = location.pathname.startsWith('/compare');
  const currentRadicalId = params.id ? Number(params.id) : undefined;

  useEffect(() => {
    setCheckedIn(hasCheckedIn());
  }, [location.pathname]);

  const handleRandomClick = () => {
    const picked = pickRandomRadical(radicals ?? [], currentRadicalId);
    if (picked) {
      navigate(`/radical/${picked.id}`);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <MenuBookIcon sx={{ mr: 1.5 }} />
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
            康熙部首检字
          </Typography>
          <Tooltip title={isDailyPage ? '当前每日页' : '每日部首'}>
            <span>
              <IconButton
                color="inherit"
                aria-label="每日部首"
                component={RouterLink}
                to="/daily"
                disabled={isDailyPage}
              >
                <Badge
                  variant="dot"
                  color="success"
                  invisible={!checkedIn}
                  overlap="circular"
                >
                  <EventIcon />
                </Badge>
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={isStudyPage ? '当前学习页' : '学习卡片'}>
            <span>
              <IconButton
                color="inherit"
                aria-label="学习卡片"
                component={RouterLink}
                to="/study"
                disabled={isStudyPage}
              >
                <SchoolIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={isComparePage ? '当前对比页' : '部首对比'}>
            <span>
              <IconButton
                color="inherit"
                aria-label="部首对比"
                component={RouterLink}
                to="/compare"
                disabled={isComparePage}
              >
                <CompareArrowsIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={isStatsPage ? '当前统计页' : '学习统计'}>
            <span>
              <IconButton
                color="inherit"
                aria-label="学习统计"
                component={RouterLink}
                to="/stats"
                disabled={isStatsPage}
              >
                <BarChartIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="随机部首">
            <span>
              <IconButton
                color="inherit"
                aria-label="随机部首"
                onClick={handleRandomClick}
                disabled={!radicals || radicals.length === 0}
              >
                <ShuffleIcon />
              </IconButton>
            </span>
          </Tooltip>
          <IconButton
            color="inherit"
            aria-label="打开搜索"
            onClick={() => setSearchOpen(true)}
          >
            <SearchIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="打开收藏夹"
            onClick={() => setFavoritesOpen(true)}
          >
            <Badge badgeContent={ids.length} color="error" max={99}>
              <FavoriteIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Outlet />
      </Container>

      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <FavoritesDrawer open={favoritesOpen} onClose={() => setFavoritesOpen(false)} />
    </Box>
  );
}
