<script setup lang="ts">
import { 
  UserCircleIcon, 
  BellIcon, 
  BookmarkIcon, 
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth'
import { useFavoritesStore } from '~/stores/favorites'
import { useNotificationStore } from '~/stores/notifications'

definePageMeta({
  middleware: 'auth',
  pageTransition: {
    name: 'fade',
    mode: 'out-in'
  }
})

const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()
const notificationStore = useNotificationStore()

const user = computed(() => authStore.currentUser)
const stats = computed(() => ({
  savedTrademarks: favoritesStore.favoritesCount,
  searches: 0, // TODO: Implement search history
  notifications: notificationStore.unreadCount
}))

const handleLogout = () => {
  authStore.logout()
}

onMounted(() => {
  favoritesStore.fetchFavorites()
  notificationStore.fetchNotifications()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-2">
        <span class="text-gray-900 dark:text-white">Tài khoản</span>
        <span class="gradient-text"> của tôi</span>
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Quản lý thông tin cá nhân và hoạt động của bạn
      </p>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Left Column - User Info -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Profile Card -->
        <div class="card p-6">
          <div class="flex flex-col items-center text-center">
            <!-- Avatar -->
            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mb-4">
              <span class="text-3xl font-bold text-white">
                {{ user?.name?.charAt(0).toUpperCase() }}
              </span>
            </div>

            <!-- User Info -->
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {{ user?.name }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              {{ user?.email }}
            </p>

            <!-- Member Since -->
            <div class="text-sm text-gray-500 dark:text-gray-500">
              Thành viên từ {{ new Date(user?.createdAt || '').toLocaleDateString('vi-VN') }}
            </div>
          </div>

          <!-- Divider -->
          <div class="my-6 border-t border-gray-200 dark:border-gray-700"></div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {{ stats.savedTrademarks }}
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Đã lưu
              </div>
            </div>
            <div>
              <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {{ stats.searches }}
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Tìm kiếm
              </div>
            </div>
            <div>
              <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {{ stats.notifications }}
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Thông báo
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Thao tác nhanh
          </h3>
          <div class="space-y-2">
            <NuxtLink
              to="/saved"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <BookmarkIcon class="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span class="text-gray-900 dark:text-gray-100">Nhãn hiệu đã lưu</span>
            </NuxtLink>
            <NuxtLink
              to="/search"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span class="text-gray-900 dark:text-gray-100">Tìm kiếm</span>
            </NuxtLink>
            <NuxtLink
              to="/notifications"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <BellIcon class="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span class="text-gray-900 dark:text-gray-100">Thông báo</span>
              <span v-if="stats.notifications > 0" class="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {{ stats.notifications }}
              </span>
            </NuxtLink>
            <button
              @click="handleLogout"
              class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
            >
              <ArrowRightOnRectangleIcon class="h-5 w-5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column - Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Recent Activity -->
        <div class="card p-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Hoạt động gần đây
          </h3>
          
          <div class="space-y-4">
            <!-- Activity Item -->
            <div class="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <BookmarkIcon class="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div class="flex-1">
                <p class="text-gray-900 dark:text-gray-100 font-medium">
                  Đã lưu nhãn hiệu mới
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Bạn đã lưu "NIKE AIR" vào danh sách yêu thích
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  2 giờ trước
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <MagnifyingGlassIcon class="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="flex-1">
                <p class="text-gray-900 dark:text-gray-100 font-medium">
                  Tìm kiếm mới
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Tìm kiếm "Samsung" - 15 kết quả
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  5 giờ trước
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <UserCircleIcon class="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div class="flex-1">
                <p class="text-gray-900 dark:text-gray-100 font-medium">
                  Tài khoản được tạo
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Chào mừng bạn đến với hệ thống
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {{ new Date(user?.createdAt || '').toLocaleDateString('vi-VN') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Settings -->
        <div class="card p-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Cài đặt tài khoản
          </h3>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-gray-100">
                  Thông báo Email
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Nhận thông báo qua email
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" checked>
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-gray-100">
                  Thông báo Push
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Nhận thông báo trên trình duyệt
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <button class="w-full btn-secondary flex items-center justify-center space-x-2">
              <Cog6ToothIcon class="h-5 w-5" />
              <span>Cài đặt nâng cao</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
