import { useCallback, useState } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveIcon from '@mui/icons-material/Save';
import { useRadicalNotes } from '../hooks/useRadicalNotes';

interface RadicalNotesEditorProps {
  radicalId: number;
}

export default function RadicalNotesEditor({ radicalId }: RadicalNotesEditorProps) {
  const { note, save, remove } = useRadicalNotes(radicalId);
  const [draft, setDraft] = useState<string>(note);
  const [dirty, setDirty] = useState(false);

  const handleChange = useCallback((value: string) => {
    setDraft(value);
    setDirty(true);
  }, []);

  const handleSave = useCallback(() => {
    save(draft);
    setDirty(false);
  }, [draft, save]);

  const handleClear = useCallback(() => {
    setDraft('');
    remove();
    setDirty(false);
  }, [remove]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        部首笔记
      </Typography>
      <TextField
        fullWidth
        multiline
        minRows={3}
        maxRows={8}
        placeholder="在此记录你对这个部首的理解、记忆技巧或其他笔记…"
        value={dirty ? draft : note}
        onChange={(e) => handleChange(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteOutlineIcon />}
          onClick={handleClear}
          disabled={!dirty && !note}
        >
          清空
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!dirty || draft.trim() === ''}
        >
          保存
        </Button>
      </Box>
    </Paper>
  );
}
