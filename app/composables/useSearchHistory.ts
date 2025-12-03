export interface SearchHistoryItem {
  query: string
  timestamp: number
  type?: string
  filters?: {
    so_don?: string
    owner?: string
    status?: string
    class?: string
    registrationNumber?: string
    applicationDateFrom?: string
    applicationDateTo?: string
    registrationDateFrom?: string
    registrationDateTo?: string
  }
}

export const useSearchHistory = () => {
  const STORAGE_KEY = 'trademark_search_history'
  const MAX_HISTORY_ITEMS = 6

  // Get search history from localStorage
  const getHistory = (): SearchHistoryItem[] => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
      } catch (error) {
        console.error('Error reading search history:', error)
        return []
      }
    }
    return []
  }

  // Save search to history
  const addToHistory = (item: Omit<SearchHistoryItem, 'timestamp'>) => {
    if (typeof window === 'undefined' || !item.query?.trim()) return
    console.log(item)
    try {
      const history = getHistory()

      // Remove duplicate if exists (same query)
      const filteredHistory = history.filter(h => h.query !== item.query)

      // Add new item at the beginning
      const newHistory = [
        {
          ...item,
          timestamp: Date.now()
        },
        ...filteredHistory
      ].slice(0, MAX_HISTORY_ITEMS) // Keep only MAX_HISTORY_ITEMS items

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
    } catch (error) {
      console.error('Error saving search history:', error)
    }
  }

  // Clear all history
  const clearHistory = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (error) {
        console.error('Error clearing search history:', error)
      }
    }
  }

  // Remove specific item from history
  const removeFromHistory = (query: string) => {
    if (typeof window === 'undefined') return

    try {
      const history = getHistory()
      const newHistory = history.filter(h => h.query !== query)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
    } catch (error) {
      console.error('Error removing from search history:', error)
    }
  }

  // Format timestamp to readable date
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return diffInMinutes < 1 ? 'Vừa xong' : `${diffInMinutes} phút trước`
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`
    } else if (diffInHours < 48) {
      return 'Hôm qua'
    } else {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
  }

  return {
    getHistory,
    addToHistory,
    clearHistory,
    removeFromHistory,
    formatTimestamp
  }
}
