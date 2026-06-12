import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import RadicalCompareCard from '../components/RadicalCompareCard';
import { useRadical, useRadicals } from '../hooks/useRadicals';

const MIN_ID = 1;
const MAX_ID = 214;

function isValidId(value: number | undefined): value is number {
  return Number.isFinite(value) && value! >= MIN_ID && value! <= MAX_ID;
}

export default function ComparePage() {
  const [leftId, setLeftId] = useState<number | ''>('');
  const [rightId, setRightId] = useState<number | ''>('');
  const [touched, setTouched] = useState<{ left: boolean; right: boolean }>({
    left: false,
    right: false,
  });

  const { data: radicals } = useRadicals();
  const leftNum = leftId === '' ? undefined : Number(leftId);
  const rightNum = rightId === '' ? undefined : Number(rightId);

  const { data: leftRadical, isLoading: leftLoading } = useRadical(
    isValidId(leftNum) ? leftNum : 0,
  );
  const { data: rightRadical, isLoading: rightLoading } = useRadical(
    isValidId(rightNum) ? rightNum : 0,
  );

  const leftError = useMemo(() => {
    if (!touched.left) return '';
    if (leftId === '') return '请选择左侧部首编号';
    if (!isValidId(leftNum)) return `编号需在 ${MIN_ID}–${MAX_ID} 之间`;
    return '';
  }, [leftId, leftNum, touched.left]);

  const rightError = useMemo(() => {
    if (!touched.right) return '';
    if (rightId === '') return '请选择右侧部首编号';
    if (!isValidId(rightNum)) return `编号需在 ${MIN_ID}–${MAX_ID} 之间`;
    return '';
  }, [rightId, rightNum, touched.right]);

  const bothSelected = isValidId(leftNum) && isValidId(rightNum);
  const showHint = !bothSelected && (touched.left || touched.right);

  const handleSwap = () => {
    setLeftId(rightId);
    setRightId(leftId);
    setTouched({ left: true, right: true });
  };

  const handleClear = () => {
    setLeftId('');
    setRightId('');
    setTouched({ left: false, right: false });
  };

  const idOptions = useMemo(() => {
    if (!radicals) return [];
    return radicals.map((r) => ({
      id: r.id,
      label: `#${r.id} ${r.char}`,
    }));
  }, [radicals]);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
        部首对比
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        选择两个部首编号，并排对比字形、拼音、释义、笔画数及例字
      </Typography>

      <Box
        sx={{
          p: 3,
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={5}>
            <FormControl fullWidth error={!!leftError}>
              <InputLabel id="left-select-label">左侧部首</InputLabel>
              <Select
                labelId="left-select-label"
                value={leftId}
                label="左侧部首"
                onChange={(e) => {
                  setLeftId(e.target.value as number | '');
                  setTouched((prev) => ({ ...prev, left: true }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, left: true }))}
              >
                <MenuItem value="">
                  <em>请选择编号 1–214</em>
                </MenuItem>
                {idOptions.map((opt) => (
                  <MenuItem key={opt.id} value={opt.id} disabled={opt.id === rightNum}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
              {leftError && <FormHelperText>{leftError}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<SwapHorizIcon />}
              onClick={handleSwap}
              disabled={!isValidId(leftNum) && !isValidId(rightNum)}
              sx={{ minWidth: 'auto' }}
            >
              交换
            </Button>
          </Grid>

          <Grid item xs={12} sm={5}>
            <FormControl fullWidth error={!!rightError}>
              <InputLabel id="right-select-label">右侧部首</InputLabel>
              <Select
                labelId="right-select-label"
                value={rightId}
                label="右侧部首"
                onChange={(e) => {
                  setRightId(e.target.value as number | '');
                  setTouched((prev) => ({ ...prev, right: true }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, right: true }))}
              >
                <MenuItem value="">
                  <em>请选择编号 1–214</em>
                </MenuItem>
                {idOptions.map((opt) => (
                  <MenuItem key={opt.id} value={opt.id} disabled={opt.id === leftNum}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
              {rightError && <FormHelperText>{rightError}</FormHelperText>}
            </FormControl>
          </Grid>
        </Grid>

        {showHint && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {!isValidId(leftNum) && !isValidId(rightNum)
              ? '请分别选择左侧和右侧的部首编号后开始对比'
              : !isValidId(leftNum)
                ? '请选择左侧部首编号'
                : '请选择右侧部首编号'}
          </Alert>
        )}

        {bothSelected && leftNum === rightNum && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            两侧编号相同，建议选择不同的部首进行对比
          </Alert>
        )}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="text" onClick={handleClear}>
            清空选择
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <RadicalCompareCard
            radical={isValidId(leftNum) ? leftRadical ?? null : null}
            isLoading={isValidId(leftNum) && leftLoading}
            label="左侧部首"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RadicalCompareCard
            radical={isValidId(rightNum) ? rightRadical ?? null : null}
            isLoading={isValidId(rightNum) && rightLoading}
            label="右侧部首"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
