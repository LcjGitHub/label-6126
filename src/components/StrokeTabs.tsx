import { Box, Tab, Tabs } from '@mui/material';
import type { StrokeRange } from '../config/strokeRanges';

/**
 * 笔画区间标签栏组件属性
 * @property ranges - 笔画区间配置数组
 * @property activeIndex - 当前选中区间的索引
 * @property onChange - 切换区间时的回调函数
 */
interface StrokeTabsProps {
  ranges: StrokeRange[];
  activeIndex: number;
  onChange: (index: number) => void;
}

/**
 * 笔画区间标签栏
 * 以可滚动标签形式展示所有笔画区间，支持粘性定位，页面滚动时保持可见
 * @param props - 组件属性
 */
export default function StrokeTabs({ ranges, activeIndex, onChange }: StrokeTabsProps) {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        bgcolor: 'background.paper',
        mb: 2,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Tabs
        value={activeIndex}
        onChange={(_e, newIndex) => onChange(newIndex)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {ranges.map((range, idx) => (
          <Tab key={idx} label={range.label} />
        ))}
      </Tabs>
    </Box>
  );
}
