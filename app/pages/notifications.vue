<script setup lang="ts">
import {
  BellIcon,
  CheckIcon,
  TrashIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'
import { useNotificationStore } from '~/stores/notifications'

definePageMeta({
  middleware: 'auth',
  pageTransition: {
    name: 'slide-up',
    mode: 'out-in'
  }
})

const notificationStore = useNotificationStore()

const loading = ref(false)

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return CheckCircleIcon
    case 'warning': return ExclamationTriangleIcon
    case 'error': return XCircleIcon
    default: return InformationCircleIcon
  }
}

const getIconColor = (type: string) => {
  switch (type) {
    case 'success': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
    case 'warning': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
    case 'error': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
    default: return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
  }
}

const formatTime = (dateString: string) => {
  // Parse date từ backend (đã là UTC)
  const date = new Date(dateString)

  // Lấy thời gian hiện tại và convert sang UTC
  const now = new Date()

  // Tính diff bằng cách so sánh timestamp (đã tự động ở UTC)
  // getTime() trả về milliseconds since epoch (UTC)
  let diff = now.getTime() - date.getTime()
  // Tránh trường hợp diff âm (do clock lệch)
  if (diff < 0) diff = 0

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "vừa xong"
  if (minutes < 60) return `${minutes} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  return `${days} ngày trước`
}


const handleMarkAsRead = async (id: number) => {
  try {
    await notificationStore.markAsRead(id)
  } catch (error) {
    console.error('Failed to mark as read:', error)
  }
}

const handleMarkAllAsRead = async () => {
  try {
    await notificationStore.markAllAsRead()
  } catch (error) {
    console.error('Failed to mark all as read:', error)
  }
}

const handleDelete = async (id: number) => {
  try {
    await notificationStore.deleteNotification(id)
  } catch (error) {
    console.error('Failed to delete notification:', error)
  }
}

const handleClearAll = () => {
  if (confirm('Bạn có chắc muốn xóa tất cả thông báo?')) {
    notificationStore.clearAll()
  }
}

onMounted(() => {
  notificationStore.fetchNotifications()
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
    <!-- Page Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold mb-2">
          <span class="text-gray-900 dark:text-white">Thông báo</span>
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Cập nhật và hoạt động mới nhất
        </p>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-2">
        <button v-if="notificationStore.unreadCount > 0" @click="handleMarkAllAsRead" class="btn-secondary text-sm">
          <CheckIcon class="h-4 w-4 mr-2" />
          Đánh dấu đã đọc
        </button>
        <button v-if="notificationStore.allNotifications.length > 0" @click="handleClearAll"
          class="btn-secondary text-sm text-red-600 dark:text-red-400">
          <TrashIcon class="h-4 w-4 mr-2" />
          Xóa tất cả
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Chưa đọc</p>
            <p class="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">
              {{ notificationStore.unreadCount }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <BellIcon class="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Tổng số</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {{ notificationStore.allNotifications.length }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <BellIcon class="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <UiLoadingSkeleton v-if="notificationStore.loading" :count="4" type="card" />

    <!-- Empty state -->
    <UiEmptyState v-else-if="notificationStore.allNotifications.length === 0" title="Không có thông báo"
      description="Bạn chưa có thông báo nào" icon="bell" />

    <!-- Notifications List -->
    <div v-else class="space-y-3">
      <div v-for="notification in notificationStore.allNotifications" :key="notification.id" :class="[
        'card p-5 transition-all duration-200',
        !notification.is_read ? 'border-l-4 border-primary-500 bg-primary-50/50 dark:bg-primary-900/10' : ''
      ]">
        <div class="flex items-start space-x-4">
          <!-- Icon -->
          <div
            :class="['w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', getIconColor(notification.type)]">
            <component :is="getIcon(notification.type)" class="h-5 w-5" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {{ notification.title }}
                  <span v-if="!notification.is_read"
                    class="ml-2 inline-block w-2 h-2 bg-primary-500 rounded-full"></span>
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {{ notification.message }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500">
                  {{ formatTime(notification.created_at) }}
                </p>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-2 ml-4">
                <button v-if="!notification.is_read" @click="handleMarkAsRead(notification.id)"
                  class="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Đánh dấu đã đọc">
                  <CheckIcon class="h-4 w-4" />
                </button>
                <button @click="handleDelete(notification.id)"
                  class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Xóa">
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Link -->
            <NuxtLink v-if="notification.action_url" :to="notification.action_url"
              class="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium mt-2">
              Xem chi tiết →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
