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
    isFavorite: (state) => (trademarkId: string) => {
      return state.favorites.some(tm => tm.id === trademarkId)
    },
    favoritesCount: (state) => state.favorites.length,
    remainingSlots: (state) => state.favoriteLimit - state.favorites.length,
    isLimitReached: (state) => state.favorites.length >= state.favoriteLimit,
    canAddMore: (state) => state.favorites.length < state.favoriteLimit
  },

  actions: {
    async fetchFavorites() {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return

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
        const response = await $fetch<Trademark[]>('/api/user/favorites', {
          baseURL: config.public.apiBase,
          credentials: 'include' // Include cookies
        })

        this.favorites = response
      } catch (error: any) {
        this.error = error.data?.message || 'Failed to fetch favorites'
        console.error('Failed to fetch favorites:', error)
      } finally {
        this.loading = false
      }
    },

    async addFavorite(trademark: Trademark) {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        throw new Error('Must be logged in to save favorites')
      }

      // Check limit
      if (this.isLimitReached) {
        throw new Error(`Bạn đã đạt giới hạn ${this.favoriteLimit} đơn lưu. Nâng cấp để lưu thêm!`)
      }

      // Optimistic update
      this.favorites.push(trademark)

      try {
        const config = useRuntimeConfig()
        await $fetch('/api/user/favorites', {
          baseURL: config.public.apiBase,
          method: 'POST',
          credentials: 'include', // Include cookies
          body: { trademarkId: trademark.id }
        })
      } catch (error: any) {
        // Rollback on error
        this.favorites = this.favorites.filter(tm => tm.id !== trademark.id)
        this.error = error.data?.message || 'Failed to add favorite'
        throw error
      }
    },

    async removeFavorite(trademarkId: string) {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return

      // Store for rollback
      const previousFavorites = [...this.favorites]
      
      // Optimistic update
      this.favorites = this.favorites.filter(tm => tm.id !== trademarkId)

      try {
        const config = useRuntimeConfig()
        await $fetch(`/api/user/favorites/${trademarkId}`, {
          baseURL: config.public.apiBase,
          method: 'DELETE',
          credentials: 'include' // Include cookies
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
