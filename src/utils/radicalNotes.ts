const STORAGE_KEY = 'kangxi-radical-notes';

type NotesMap = Record<number, string>;

function readAll(): NotesMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}

function writeAll(map: NotesMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getNote(radicalId: number): string {
  return readAll()[radicalId] ?? '';
}

export function saveNote(radicalId: number, content: string): void {
  const map = readAll();
  if (content.trim() === '') {
    delete map[radicalId];
  } else {
    map[radicalId] = content;
  }
  writeAll(map);
}

export function deleteNote(radicalId: number): void {
  const map = readAll();
  delete map[radicalId];
  writeAll(map);
}

export function getAllNotes(): NotesMap {
  return readAll();
}
