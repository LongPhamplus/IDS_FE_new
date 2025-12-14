import { defineStore } from 'pinia'
import type { Trademark } from '~/types'
import { useAuthStore } from './auth'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [] as Trademark[],
    loading: false,
    error: null as string | null,
    favoriteLimit: 3, // Default limit for basic users
    isPremium: false
  }),

  getters: {
    // Check by both id and so_don for backend compatibility
    isFavorite: (state) => (trademarkIdOrSoDon: string | number) => {
      if (!Array.isArray(state.favorites)) {
        return false
      }
      const searchValue = String(trademarkIdOrSoDon)
      return state.favorites.some(tm =>
        String(tm.id) === searchValue ||
        String(tm.so_don) === searchValue
      )
    },
    favoritesCount: (state) => Array.isArray(state.favorites) ? state.favorites.length : 0,
    remainingSlots: (state) => state.favoriteLimit - (Array.isArray(state.favorites) ? state.favorites.length : 0),
    isLimitReached: (state) => (Array.isArray(state.favorites) ? state.favorites.length : 0) >= state.favoriteLimit,
    canAddMore: (state) => (Array.isArray(state.favorites) ? state.favorites.length : 0) < state.favoriteLimit
  },

  actions: {
    async fetchFavorites() {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        this.favorites = []
        return
      }

      this.loading = true
      this.error = null

      try {
        // Check if demo user
        if (authStore.user?.email === 'demo@example.com') {
          // Load demo favorites from mock data
          const { getMockDemoFavorites } = useMockData()
          this.favorites = getMockDemoFavorites()
          this.loading = false
          return
        }

        const { getSavedTrademarks } = useApi()
        const response = await getSavedTrademarks()

        // Handle response - could be { success, data } or direct array
        const trademarks = Array.isArray(response)
          ? response
          : (response as any)?.data || []

        // Normalize backend data to frontend format
        const normalizedTrademarks = Array.isArray(trademarks) ? trademarks.map((item: any) => ({
          id: item.id,
          name: item.ten_nhan_hieu || item.name || 'N/A',
          class: item.loai_don || item.class || 'N/A',
          owner: item.chu_don?.ten_chu_don || item.owner || 'N/A',
          status: item.trang_thai || item.status || 'N/A',
          registrationNumber: item.so_bang || item.registrationNumber,
          registrationDate: item.ngay_cap || item.registrationDate,
          expiryDate: item.ngay_het_han || item.expiryDate,
          so_don: item.so_don,
          imageUrl: item.imageUrl,
          // Keep raw fields for reference
          ten_nhan_hieu: item.ten_nhan_hieu,
          loai_don: item.loai_don,
          so_bang: item.so_bang,
          ngay_cap: item.ngay_cap,
          trang_thai: item.trang_thai,
          ngay_het_han: item.ngay_het_han,
          chu_don_id: item.chu_don_id
        })) : []

        this.favorites = normalizedTrademarks
      } catch (error: any) {
        this.error = error.data?.message || 'Failed to fetch favorites'
        console.error('Failed to fetch favorites:', error)
        // Ensure favorites is always an array even on error
        this.favorites = []
      } finally {
        this.loading = false
      }
    },

    async addFavorite(trademark: Trademark) {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        throw new Error('Must be logged in to save favorites')
      }

      // Ensure favorites is an array
      if (!Array.isArray(this.favorites)) {
        this.favorites = []
      }

      // Check if already exists by so_don
      if (trademark.so_don && this.favorites.some(tm => tm.so_don === trademark.so_don)) {
        console.log('Trademark already in favorites')
        return
      }

      // Check limit
      if (this.isLimitReached) {
        throw new Error(`Bạn đã đạt giới hạn ${this.favoriteLimit} đơn lưu. Nâng cấp để lưu thêm!`)
      }

      // Optimistic update
      this.favorites.push(trademark)

      try {
        if (!trademark.so_don) {
          throw new Error('Trademark so_don is missing')
        }
        const { addToFavorites } = useApi()
        const userId = authStore.user?.id ? Number(authStore.user.id) : undefined
        const response = await addToFavorites(userId, trademark.so_don)

        if (response?.message === 'Đã tồn tại đơn.') {
          console.log('Trademark already saved on server')
        }
      } catch (error: any) {
        // Rollback on error - use so_don for matching
        if (Array.isArray(this.favorites)) {
          this.favorites = this.favorites.filter(tm => tm.so_don !== trademark.so_don)
        }
        this.error = error.data?.message || 'Failed to add favorite'
        throw error
      }
    },

    async removeFavorite(trademarkIdOrSoDon: string | number) {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return

      // Ensure favorites is an array
      if (!Array.isArray(this.favorites)) {
        this.favorites = []
        return
      }

      // Store for rollback
      const previousFavorites = [...this.favorites]

      // Find the trademark by id or so_don
      const searchValue = String(trademarkIdOrSoDon)
      const trademark = this.favorites.find(tm =>
        String(tm.id) === searchValue ||
        String(tm.so_don) === searchValue
      )
      if (!trademark) return

      // Optimistic update - remove by matching id or so_don
      this.favorites = this.favorites.filter(tm =>
        String(tm.id) !== searchValue &&
        String(tm.so_don) !== searchValue
      )

      try {
        if (!trademark.so_don) {
          throw new Error('Trademark so_don is missing')
        }
        const { removeFromFavorites } = useApi()
        const userId = authStore.user?.id ? Number(authStore.user.id) : undefined
        await removeFromFavorites(userId, trademark.so_don)
      } catch (error: any) {
        // Rollback on error
        this.favorites = previousFavorites
        this.error = error.data?.message || 'Failed to remove favorite'
        throw error
      }
    },

    clearFavorites() {
      this.favorites = []
      this.error = null
    },

    /**
     * Fetch save limit from server
     */
    async fetchSaveLimit() {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        this.favoriteLimit = 3
        return
      }

      try {
        const { getSaveLimit } = useApi()
        const limitData = await getSaveLimit()

        this.favoriteLimit = limitData.limit
        this.isPremium = limitData.limit > 10 // Consider premium if limit > 10
      } catch (error) {
        console.error('Failed to fetch save limit:', error)
        // Keep default limit on error
      }
    },

    /**
     * Increase save limit via server API
     */
    async increaseFavoriteLimit(amount: number = 10) {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        throw new Error('Must be logged in to increase limit')
      }

      try {
        const { increaseSaveLimit } = useApi()
        const limitData = await increaseSaveLimit(amount)

        this.favoriteLimit = limitData.limit
        this.isPremium = limitData.limit > 10

        return {
          success: true,
          newLimit: limitData.limit,
          message: `Đã tăng giới hạn lên ${limitData.limit} đơn`
        }
      } catch (error: any) {
        this.error = error.data?.message || 'Failed to increase limit'
        throw error
      }
    },

    /**
     * @deprecated Use fetchSaveLimit() instead - this only updates local state
     */
    upgradeToPremium() {
      this.isPremium = true
      this.favoriteLimit = 50 // Premium users can save 50 trademarks
    }
  }
})
