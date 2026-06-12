import { createTheme } from '@mui/material/styles';

/** 应用 MUI 主题 */
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#8B4513',
      light: '#A0522D',
      dark: '#5D2E0C',
    },
    secondary: {
      main: '#2E7D32',
    },
    background: {
      default: '#FAF6F0',
      paper: '#FFFCF7',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Noto Serif SC", "Songti SC", serif',
    h4: {
      fontFamily: '"Noto Serif SC", "Songti SC", serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Noto Serif SC", "Songti SC", serif',
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});
