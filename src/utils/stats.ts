const STORAGE_KEY = 'kangxi-view-history';

export interface ViewRecord {
  radicalId: number;
  timestamp: number;
}

export interface RadicalViewCount {
  radicalId: number;
  count: number;
}

export interface ViewStats {
  totalViewed: number;
  todayViewed: number;
  topRadicals: RadicalViewCount[];
}

function read(): ViewRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter(
          (r: unknown) =>
            typeof r === 'object' &&
            r !== null &&
            typeof (r as ViewRecord).radicalId === 'number' &&
            typeof (r as ViewRecord).timestamp === 'number',
        )
      : [];
  } catch {
    return [];
  }
}

function write(records: ViewRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function recordView(radicalId: number): ViewRecord[] {
  const records = read();
  const entry: ViewRecord = { radicalId, timestamp: Date.now() };
  records.push(entry);
  write(records);
  return records;
}

export function getViewHistory(): ViewRecord[] {
  return read();
}

export function getViewStats(): ViewStats {
  const records = read();

  const uniqueIds = new Set(records.map((r) => r.radicalId));
  const totalViewed = uniqueIds.size;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayMs = todayStart.getTime();
  const todayRecords = records.filter((r) => r.timestamp >= todayMs);
  const todayUniqueIds = new Set(todayRecords.map((r) => r.radicalId));
  const todayViewed = todayUniqueIds.size;

  const countMap = new Map<number, number>();
  for (const r of records) {
    countMap.set(r.radicalId, (countMap.get(r.radicalId) ?? 0) + 1);
  }
  const topRadicals = Array.from(countMap.entries())
    .map(([radicalId, count]) => ({ radicalId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return { totalViewed, todayViewed, topRadicals };
}

export function clearViewHistory(): void {
  write([]);
}
