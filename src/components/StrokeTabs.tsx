import { Tab, Tabs } from '@mui/material';
import type { StrokeRange } from '../config/strokeRanges';

interface StrokeTabsProps {
  ranges: StrokeRange[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export default function StrokeTabs({ ranges, activeIndex, onChange }: StrokeTabsProps) {
  return (
    <Tabs
      value={activeIndex}
      onChange={(_e, newIndex) => onChange(newIndex)}
      variant="scrollable"
      scrollButtons="auto"
      sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
    >
      {ranges.map((range, idx) => (
        <Tab key={idx} label={range.label} />
      ))}
    </Tabs>
  );
}
