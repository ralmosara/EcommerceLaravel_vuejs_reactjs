import { computed } from 'vue'
import { useLocalStorage } from './useLocalStorage'

interface RecentlyViewedItem {
  slug: string
  timestamp: number
}

const MAX_ITEMS = 10
const STORAGE_KEY = 'recently_viewed_albums'

export function useRecentlyViewed() {
  const [items, setItems] = useLocalStorage<RecentlyViewedItem[]>(STORAGE_KEY, [])

  const slugs = computed(() => items.value.map(item => item.slug))
  const hasItems = computed(() => items.value.length > 0)
  const count = computed(() => items.value.length)

  const addItem = (slug: string) => {
    // Remove existing item with the same slug
    const filtered = items.value.filter(item => item.slug !== slug)

    // Add new item at the beginning
    const newItems = [
      { slug, timestamp: Date.now() },
      ...filtered,
    ].slice(0, MAX_ITEMS) // Keep only MAX_ITEMS

    setItems(newItems)
  }

  const removeItem = (slug: string) => {
    setItems(items.value.filter(item => item.slug !== slug))
  }

  const clearAll = () => {
    setItems([])
  }

  const isViewed = (slug: string) => {
    return slugs.value.includes(slug)
  }

  return {
    items,
    slugs,
    hasItems,
    count,
    addItem,
    removeItem,
    clearAll,
    isViewed,
  }
}
