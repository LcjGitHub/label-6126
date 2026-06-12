import { Box, Typography } from '@mui/material';

interface PinyinGroupHeaderProps {
  letter: string;
  count: number;
}

/**
 * 拼音分组标题组件
 * 显示拼音首字母及该组部首数量
 */
export default function PinyinGroupHeader({ letter, count }: PinyinGroupHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        mt: 3,
        mb: 1.5,
        position: 'sticky',
        top: 0,
        bgcolor: 'background.default',
        py: 1,
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: 1,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          fontWeight: 700,
          fontSize: '1.25rem',
        }}
      >
        {letter}
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {letter === '#' ? '其他' : letter + ' 开头'}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        共 {count} 个
      </Typography>
    </Box>
  );
}
