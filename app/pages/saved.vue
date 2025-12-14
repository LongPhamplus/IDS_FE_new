<script setup lang="ts">
import { PlusIcon, SparklesIcon, ExclamationTriangleIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useFavoritesStore } from '~/stores/favorites'
import { useAuthStore } from '~/stores/auth'
import type { Trademark } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()

const loading = ref(false)
const upgrading = ref(false)

// Modal states
const showConfirmModal = ref(false)
const selectedTrademark = ref<Trademark | null>(null)
const showSuccessToast = ref(false)
const toastMessage = ref('')

const isDemoUser = computed(() => authStore.user?.email === 'demo@example.com')

const refreshFavorites = async () => {
  loading.value = true
  try {
    await favoritesStore.fetchFavorites()
  } catch (error) {
    console.error('Failed to refresh favorites:', error)
  } finally {
    loading.value = false
  }
}

const handleUpgrade = async () => {
  upgrading.value = true

  try {
    const result = await favoritesStore.increaseFavoriteLimit(10)
    toastMessage.value = result.message || 'Đã tăng giới hạn thành công!'
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
    }, 3000)
  } catch (error: any) {
    console.error('Failed to increase limit:', error)
    toastMessage.value = error.message || 'Có lỗi xảy ra!'
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
    }, 3000)
  } finally {
    upgrading.value = false
  }
}

// Favorite management functions
const handleRemoveFavorite = (trademark: Trademark) => {
  selectedTrademark.value = trademark
  showConfirmModal.value = true
}

const confirmRemoveFavorite = async () => {
  if (!selectedTrademark.value) return

  try {
    await favoritesStore.removeFavorite(selectedTrademark.value.id)
    toastMessage.value = 'Đã hủy lưu đơn thành công!'
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
    }, 3000)
  } catch (error: any) {
    console.error('Failed to remove favorite:', error)
    toastMessage.value = error.message || 'Có lỗi xảy ra!'
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
    }, 3000)
  } finally {
    showConfirmModal.value = false
    selectedTrademark.value = null
  }
}

const cancelRemoveFavorite = () => {
  showConfirmModal.value = false
  selectedTrademark.value = null
}

// Provide remove handler to child components
provide('handleRemoveFavorite', handleRemoveFavorite)

onMounted(() => {
  refreshFavorites()
  favoritesStore.fetchSaveLimit() // Load limit from server
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Đơn đã lưu
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Danh sách các nhãn hiệu yêu thích của bạn
        </p>
      </div>

      <button @click="refreshFavorites" :disabled="loading" class="btn-secondary">
        <span v-if="loading">Đang tải...</span>
        <span v-else>Làm mới</span>
      </button>
    </div>

    <!-- Loading state -->
    <UiLoadingSkeleton v-if="favoritesStore.loading && favoritesStore.favorites.length === 0" :count="6" type="card" />

    <!-- Error message -->
    <div v-else-if="favoritesStore.error"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
      {{ favoritesStore.error }}
    </div>

    <!-- Empty state -->
    <UiEmptyState v-else-if="favoritesStore.favorites.length === 0" title="Chưa có đơn đã lưu"
      description="Tìm kiếm nhãn hiệu và nhấn lưu để lưu vào danh sách của bạn" icon="bookmark">
      <template #action>
        <NuxtLink to="/search" class="btn-primary">
          Bắt đầu tìm kiếm
        </NuxtLink>
      </template>
    </UiEmptyState>

    <!-- Favorites grid -->
    <div v-else>
      <!-- Limit Info & Upgrade Card -->
      <div
        class="mb-6 card p-6 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-2 border-primary-200 dark:border-primary-800">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
                Giới hạn đơn lưu
              </h3>
              <span :class="[
                'px-3 py-1 rounded-full text-sm font-semibold',
                favoritesStore.isLimitReached
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              ]">
                {{ favoritesStore.favoritesCount }} / {{ favoritesStore.favoriteLimit }}
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              <span v-if="favoritesStore.isLimitReached" class="text-red-600 dark:text-red-400 font-medium">
                Bạn đã đạt giới hạn! Nâng cấp để lưu thêm nhiều đơn hơn.
              </span>
              <span v-else>
                Còn lại <span class="font-semibold text-gray-900 dark:text-gray-100">{{ favoritesStore.remainingSlots
                }}</span> slot
              </span>
            </p>
          </div>

          <button v-if="!favoritesStore.isPremium" @click="handleUpgrade" :disabled="upgrading"
            class="btn-primary flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700">
            <SparklesIcon class="h-5 w-5" />
            <span v-if="upgrading">Đang nâng cấp...</span>
            <span v-else>Tăng giới hạn +10</span>
          </button>
        </div>
      </div>

      <!-- Favorites grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TrademarkCard v-for="trademark in favoritesStore.favorites" :key="trademark.id" :trademark="trademark" />
      </div>
    </div>

    <!-- Confirmation Modal -->
    <Teleport to="body">
      <Transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showConfirmModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          @click.self="cancelRemoveFavorite">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div class="flex items-center gap-4 mb-4">
              <div
                class="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <ExclamationTriangleIcon class="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Xác nhận hủy lưu đơn
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Bạn có chắc muốn hủy lưu đơn này khỏi danh sách?
                </p>
              </div>
            </div>

            <div v-if="selectedTrademark" class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-1">
                {{ selectedTrademark.name || selectedTrademark.ten_nhan_hieu || 'N/A' }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Số đơn: {{ selectedTrademark.so_don || selectedTrademark.registrationNumber || 'N/A' }}
              </p>
            </div>

            <div class="flex gap-3">
              <button @click="cancelRemoveFavorite"
                class="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors">
                Hủy
              </button>
              <button @click="confirmRemoveFavorite"
                class="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors">
                Hủy lưu đơn
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Success Toast -->
    <Teleport to="body">
      <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
        <div v-if="showSuccessToast"
          class="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm">
          <div class="flex items-center gap-3">
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircleIcon class="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ toastMessage }}
            </p>
            <button @click="showSuccessToast = false"
              class="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <XMarkIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
