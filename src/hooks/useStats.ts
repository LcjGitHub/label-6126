import { useCallback, useEffect, useState } from 'react';
import {
  clearViewHistory,
  getViewStats,
  recordView,
} from '../utils/stats';
import type { ViewStats } from '../utils/stats';

const STORAGE_EVENT = 'kangxi-view-history-change';

export function useStats() {
  const [stats, setStats] = useState<ViewStats>(() => getViewStats());

  useEffect(() => {
    const handler = () => setStats(getViewStats());
    window.addEventListener(STORAGE_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(STORAGE_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const refresh = useCallback(() => {
    setStats(getViewStats());
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }, []);

  const trackView = useCallback(
    (radicalId: number) => {
      recordView(radicalId);
      refresh();
    },
    [refresh],
  );

  const clear = useCallback(() => {
    clearViewHistory();
    refresh();
  }, [refresh]);

  return { stats, trackView, clear };
}
