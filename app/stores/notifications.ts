import { defineStore } from 'pinia'

export interface Notification {
  id: number
  user_id: number
  created_by: number | null
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  is_read: boolean
  read_at: string | null
  action_url: string | null
  meta: any
  created_at: string
  creator?: {
    id: number
    name: string
    email: string
  }
}

interface NotificationResponse {
  success: boolean
  data: Notification[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface UnreadResponse {
  success: boolean
  data: Notification[]
  count: number
}

interface CountResponse {
  success: boolean
  count: number
}

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[],
    loading: false,
    error: null as string | null,
    total: 0,
    currentPage: 1,
    totalPages: 1
  }),

  getters: {
    unreadCount: (state) => (state.notifications || []).filter(n => !n.is_read).length,
    unreadNotifications: (state) => (state.notifications || []).filter(n => !n.is_read),
    allNotifications: (state) => state.notifications || []
  },

  actions: {
    async fetchNotifications(page: number = 1, limit: number = 20, includeRead: boolean = true) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<NotificationResponse>('/notifications', {
          method: 'GET',
          baseURL: config.public.apiBase,
          credentials: 'include',
          params: {
            page,
            limit,
            includeRead
          }
        })

        if (response.success) {
          this.notifications = Array.isArray(response.data) ? response.data : []
          this.total = response.total || 0
          this.currentPage = response.page || 1
          this.totalPages = response.totalPages || 1
        } else {
          console.error('API returned success: false')
          this.notifications = []
        }
      } catch (error: any) {
        console.error('Fetch notifications error:', error)
        this.error = error.message || 'Failed to fetch notifications'
        this.notifications = []
      } finally {
        this.loading = false
      }
    },

    async fetchUnreadCount() {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<CountResponse>('/notifications/count', {
          method: 'GET',
          baseURL: config.public.apiBase,
          credentials: 'include'
        })

        return response.count
      } catch (error: any) {
        console.error('Fetch unread count error:', error)
        return 0
      }
    },

    async markAsRead(notificationId: number) {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ success: boolean }>(`/notifications/${notificationId}/read`, {
          method: 'POST',
          baseURL: config.public.apiBase,
          credentials: 'include'
        })

        if (response.success) {
          // Update local state
          const notification = this.notifications.find(n => n.id === notificationId)
          if (notification) {
            notification.is_read = true
            notification.read_at = new Date().toISOString()
          }
        }
      } catch (error: any) {
        console.error('Mark as read error:', error)
        throw error
      }
    },

    async markAllAsRead() {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ success: boolean; count: number }>('/notifications/read-all', {
          method: 'POST',
          baseURL: config.public.apiBase,
          credentials: 'include'
        })

        if (response.success) {
          // Update local state
          this.notifications.forEach(n => {
            n.is_read = true
            n.read_at = new Date().toISOString()
          })
        }
      } catch (error: any) {
        console.error('Mark all as read error:', error)
        throw error
      }
    },

    async deleteNotification(notificationId: number) {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ success: boolean; message: string }>(`/notifications/${notificationId}`, {
          method: 'DELETE',
          baseURL: config.public.apiBase,
          credentials: 'include'
        })

        if (response.success) {
          // Remove from local state
          this.notifications = this.notifications.filter(n => n.id !== notificationId)
          this.total--
        }
      } catch (error: any) {
        console.error('Delete notification error:', error)
        throw error
      }
    },

    clearAll() {
      this.notifications = []
      this.total = 0
    }
  }
})
