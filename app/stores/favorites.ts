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
    isFavorite: (state) => (trademarkId: string | number) => {
      // Defensive check to ensure favorites is always an array
      if (!Array.isArray(state.favorites)) {
        return false
      }
      return state.favorites.some(tm => String(tm.id) === String(trademarkId))
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

        const config = useRuntimeConfig()
        
        // Fetch saved trademarks from backend
        const response = await $fetch<any[]>('/fe/user/saved', {
          baseURL: config.public.apiBase,
          credentials: 'include'
        })
        
        
        // Normalize backend data to frontend format
        const normalizedTrademarks = Array.isArray(response) ? response.map((item: any) => ({
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

      // Check limit
      if (this.isLimitReached) {
        throw new Error(`Bạn đã đạt giới hạn ${this.favoriteLimit} đơn lưu. Nâng cấp để lưu thêm!`)
      }

      // Optimistic update
      this.favorites.push(trademark)

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ message: string }>('/fe/user/add', {
          baseURL: config.public.apiBase,
          method: 'POST',
          credentials: 'include', // Include cookies
          body: { 
            userId: authStore.user?.id,
            order: trademark.so_don,
          }
        })
        
        if (response.message === 'Đã tồn tại đơn.') {
          console.log('Trademark already saved')
        }
      } catch (error: any) {
        // Rollback on error
        if (Array.isArray(this.favorites)) {
          this.favorites = this.favorites.filter(tm => String(tm.id) !== String(trademark.id))
        }
        this.error = error.data?.message || 'Failed to add favorite'
        throw error
      }
    },

    async removeFavorite(trademarkId: string | number) {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return

      // Ensure favorites is an array
      if (!Array.isArray(this.favorites)) {
        this.favorites = []
        return
      }

      // Store for rollback
      const previousFavorites = [...this.favorites]
      
      // Find the trademark to get so_don
      const trademark = this.favorites.find(tm => String(tm.id) === String(trademarkId))
      if (!trademark) return
      
      // Optimistic update
      this.favorites = this.favorites.filter(tm => String(tm.id) !== String(trademarkId))

      try {
        const config = useRuntimeConfig()
        await $fetch<{ message: string }>('/fe/user/delete/', {
          baseURL: config.public.apiBase,
          method: 'POST',
          credentials: 'include', // Include cookies
          body: {
            userId: authStore.user?.id,
            order: trademark.so_don,
          }
        })
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

    upgradeToPremium() {
      this.isPremium = true
      this.favoriteLimit = 50 // Premium users can save 50 trademarks
    },

    increaseFavoriteLimit(amount: number) {
      this.favoriteLimit += amount
    }
  }
})
