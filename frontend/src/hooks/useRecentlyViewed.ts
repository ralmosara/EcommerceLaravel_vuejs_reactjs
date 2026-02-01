import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'recently_viewed_albums';
const MAX_ITEMS = 10;

interface RecentlyViewedItem {
  slug: string;
  timestamp: number;
}

export function useRecentlyViewed() {
  const [items, setItems] = useLocalStorage<RecentlyViewedItem[]>(STORAGE_KEY, []);

  const addItem = useCallback((slug: string) => {
    setItems((prevItems) => {
      // Remove if already exists
      const filtered = prevItems.filter(item => item.slug !== slug);

      // Add to front with new timestamp
      const newItems = [
        { slug, timestamp: Date.now() },
        ...filtered
      ];

      // Limit to max items
      return newItems.slice(0, MAX_ITEMS);
    });
  }, [setItems]);

  const removeItem = useCallback((slug: string) => {
    setItems((prevItems) => prevItems.filter(item => item.slug !== slug));
  }, [setItems]);

  const clearAll = useCallback(() => {
    setItems([]);
  }, [setItems]);

  // Get slugs only (most recent first)
  const slugs = items.map(item => item.slug);

  return {
    items,
    slugs,
    addItem,
    removeItem,
    clearAll,
    hasItems: items.length > 0
  };
}
