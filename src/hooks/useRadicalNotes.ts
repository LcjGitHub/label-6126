import { useCallback, useState } from 'react';
import { deleteNote, getNote, saveNote } from '../utils/radicalNotes';

const STORAGE_EVENT = 'kangxi-radical-notes-change';

export function useRadicalNotes(radicalId: number) {
  const [note, setNote] = useState<string>(() => getNote(radicalId));

  const refresh = useCallback(() => {
    const updated = getNote(radicalId);
    setNote(updated);
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }, [radicalId]);

  const save = useCallback(
    (content: string) => {
      saveNote(radicalId, content);
      refresh();
    },
    [radicalId, refresh],
  );

  const remove = useCallback(() => {
    deleteNote(radicalId);
    refresh();
  }, [radicalId, refresh]);

  return { note, save, remove };
}
