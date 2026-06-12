import { useCallback, useEffect, useState } from 'react';
import {
  addFavorite,
  getFavoriteIds,
  isFavorite as checkIsFavorite,
  removeFavorite,
  toggleFavorite as toggleFav,
} from '../utils/favorites';

const STORAGE_EVENT = 'kangxi-favorites-change';

export function useFavorites() {
  const [ids, setIds] = useState<number[]>(() => getFavoriteIds());

  useEffect(() => {
    const handler = () => setIds(getFavoriteIds());
    window.addEventListener(STORAGE_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(STORAGE_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const refresh = useCallback(() => {
    setIds(getFavoriteIds());
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }, []);

  const isFavorite = useCallback((id: number) => checkIsFavorite(id), []);

  const add = useCallback(
    (id: number) => {
      addFavorite(id);
      refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    (id: number) => {
      removeFavorite(id);
      refresh();
    },
    [refresh],
  );

  const toggle = useCallback(
    (id: number) => {
      toggleFav(id);
      refresh();
    },
    [refresh],
  );

  return { ids, isFavorite, add, remove, toggle };
}
