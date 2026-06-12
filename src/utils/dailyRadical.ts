const TOTAL_RADICALS = 214;
const CHECKIN_STORAGE_KEY = 'kangxi-daily-checkin';

export function formatDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function hashDate(dateKey: string): number {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    const char = dateKey.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getDailyRadicalId(date: Date = new Date()): number {
  const dateKey = formatDateKey(date);
  const hash = hashDate(dateKey);
  const index = hash % TOTAL_RADICALS;
  return index + 1;
}

export interface CheckinRecord {
  date: string;
  radicalId: number;
  timestamp: number;
}

function readCheckinRecords(): CheckinRecord[] {
  try {
    const raw = localStorage.getItem(CHECKIN_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter(
          (r: unknown) =>
            typeof r === 'object' &&
            r !== null &&
            typeof (r as CheckinRecord).date === 'string' &&
            typeof (r as CheckinRecord).radicalId === 'number' &&
            typeof (r as CheckinRecord).timestamp === 'number',
        )
      : [];
  } catch {
    return [];
  }
}

function writeCheckinRecords(records: CheckinRecord[]): void {
  localStorage.setItem(CHECKIN_STORAGE_KEY, JSON.stringify(records));
}

export function hasCheckedIn(date: Date = new Date()): boolean {
  const dateKey = formatDateKey(date);
  const records = readCheckinRecords();
  return records.some((r) => r.date === dateKey);
}

export function recordCheckin(radicalId: number, date: Date = new Date()): CheckinRecord[] {
  const dateKey = formatDateKey(date);
  const records = readCheckinRecords();

  const existingIndex = records.findIndex((r) => r.date === dateKey);
  if (existingIndex >= 0) {
    return records;
  }

  const record: CheckinRecord = {
    date: dateKey,
    radicalId,
    timestamp: Date.now(),
  };
  records.push(record);
  writeCheckinRecords(records);
  return records;
}

export function getCheckinCount(): number {
  return readCheckinRecords().length;
}

export function getStreakCount(): number {
  const records = readCheckinRecords();
  if (records.length === 0) return 0;

  const sortedDates = [...new Set(records.map((r) => r.date))].sort().reverse();

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < sortedDates.length; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const checkDateKey = formatDateKey(checkDate);

    if (sortedDates.includes(checkDateKey)) {
      streak++;
    } else if (i === 0) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = formatDateKey(yesterday);
      if (sortedDates[0] === yesterdayKey) {
        streak++;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return streak;
}
