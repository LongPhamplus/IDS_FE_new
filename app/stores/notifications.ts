import { defineStore } from 'pinia'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
  link?: string
}

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    unreadCount: (state) => state.notifications.filter(n => !n.read).length,
    unreadNotifications: (state) => state.notifications.filter(n => !n.read),
    allNotifications: (state) => state.notifications
  },

  actions: {
    async fetchNotifications() {
      this.loading = true
      this.error = null

      try {
        // Mock data - replace with real API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        this.notifications = [
          {
            id: '1',
            title: 'Nhãn hiệu mới được cấp',
            message: 'Nhãn hiệu "VINFAST VF9" đã được cấp bằng độc quyền',
            type: 'success',
            read: false,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            link: '/trademarks/TM-VN-004'
          },
          {
            id: '2',
            title: 'Cập nhật trạng thái',
            message: 'Nhãn hiệu "TECH INNOVATE" đang trong quá trình thẩm định',
            type: 'info',
            read: false,
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            link: '/trademarks/TM-201'
          },
          {
            id: '3',
            title: 'Nhắc nhở gia hạn',
            message: 'Nhãn hiệu "TRUNG NGUYÊN" sắp hết hạn bảo hộ',
            type: 'warning',
            read: true,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            link: '/trademarks/TM-VN-001'
          },
          {
            id: '4',
            title: 'Tìm kiếm tương tự',
            message: 'Tìm thấy 3 nhãn hiệu tương tự với "NIKE"',
            type: 'info',
            read: true,
            createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            link: '/search?q=nike'
          }
        ]
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch notifications'
        console.error('Fetch notifications error:', error)
      } finally {
        this.loading = false
      }
    },

    markAsRead(notificationId: string) {
      const notification = this.notifications.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
      }
    },

    markAllAsRead() {
      this.notifications.forEach(n => n.read = true)
    },

    deleteNotification(notificationId: string) {
      this.notifications = this.notifications.filter(n => n.id !== notificationId)
    },

    clearAll() {
      this.notifications = []
    }
  }
})
