import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SearchIcon from '@mui/icons-material/Search';
import SearchDrawer from './SearchDrawer';

/** 全局布局：顶栏 + 搜索 Drawer + 内容区 */
export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <MenuBookIcon sx={{ mr: 1.5 }} />
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
            康熙部首检字
          </Typography>
          <IconButton
            color="inherit"
            aria-label="打开搜索"
            onClick={() => setSearchOpen(true)}
          >
            <SearchIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Outlet />
      </Container>

      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
    </Box>
  );
}
