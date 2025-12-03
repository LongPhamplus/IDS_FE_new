<script setup lang="ts">
import { Squares2X2Icon, TableCellsIcon, ClockIcon, XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import type { Trademark, SearchParams } from '~/types'
import { useAuthStore } from '~/stores/auth'
import { useFavoritesStore } from '~/stores/favorites'

const route = useRoute()
const { searchTrademarks } = useApi()
const { getHistory, addToHistory, clearHistory, removeFromHistory, formatTimestamp } = useSearchHistory()
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()

// Status mapping for Vietnamese labels
const getStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    'granted': 'Cấp bằng',
    'examining': 'Đang kiểm tra',
    'cancelled': 'Hủy',
    'expired': 'Hết hạn',
    'rejected': 'Từ chối'
  }
  return statusMap[status] || status
}

// View mode: 'card' or 'table'
const viewMode = ref<'card' | 'table'>('card')

// Load saved view mode from localStorage
onMounted(() => {
  if (process.client) {
    const savedViewMode = localStorage.getItem('trademarkViewMode')
    if (savedViewMode === 'card' || savedViewMode === 'table') {
      viewMode.value = savedViewMode
    }
  }
})

// Save view mode to localStorage when changed
watch(viewMode, (newMode) => {
  if (process.client) {
    localStorage.setItem('trademarkViewMode', newMode)
  }
})

// Items per page options
const itemsPerPageOptions = [6, 12, 24, 48, 96]

// Initialize search params from URL
const searchParams = ref<SearchParams>({
  q: (route.query.q as string) || '',
  so_don: (route.query.so_don as string) || '',
  class: (route.query.class as string) || '',
  owner: (route.query.owner as string) || '',
  status: (route.query.status as string) || '',
  type: (route.query.type as 'trademark' | 'patent') || undefined,
  page: parseInt((route.query.page as string) || '1'),
  limit: parseInt((route.query.limit as string) || '12')
})

// Handle items per page change
const handleItemsPerPageChange = (newLimit: number) => {
  searchParams.value.limit = newLimit
  searchParams.value.page = 1 // Reset to first page
  performSearch()
}

const trademarks = ref<Trademark[]>([])
const loading = ref(false)
const searchHistory = ref(getHistory())
const error = ref('')
const totalPages = ref(0)
const total = ref(0)

// Modal states
const showConfirmModal = ref(false)
const confirmAction = ref<'add' | 'remove'>('add')
const selectedTrademark = ref<Trademark | null>(null)
const showLimitModal = ref(false)
const showSuccessToast = ref(false)
const toastMessage = ref('')

// Helper methods for search history
const handleClearHistory = () => {
  clearHistory()
  searchHistory.value = []
}

const handleRemoveFromHistory = (query: string) => {
  removeFromHistory(query)
  searchHistory.value = getHistory()
}

const performSearch = async () => {
  loading.value = true
  error.value = ''

  try {
    // Fetch data từ backend API
    const response = await searchTrademarks(searchParams.value)

    // Batch all state updates together
    trademarks.value = response.data || []
    totalPages.value = response.totalPages || 0
    total.value = response.total || 0

    // Save to search history only if there are actual search criteria
    // This allows empty display without affecting search logic
    const hasSearchCriteria = searchParams.value.q ||
      searchParams.value.so_don ||
      searchParams.value.owner ||
      searchParams.value.status ||
      searchParams.value.class

    if (hasSearchCriteria) {
      // Use advanced search label if no query but has filters
      const displayQuery = searchParams.value.q || 'Tìm kiếm nâng cao'

      addToHistory({
        query: displayQuery,
        type: searchParams.value.type,
        filters: {
          so_don: searchParams.value.so_don,
          owner: searchParams.value.owner,
          status: searchParams.value.status,
          class: searchParams.value.class
        }
      })

      searchHistory.value = getHistory()
    }
  } catch (err: any) {
    error.value = err.data?.message || err.message || 'Tìm kiếm thất bại. Vui lòng thử lại.'
    console.error('Search error:', err)

    trademarks.value = []
    totalPages.value = 0
    total.value = 0
  } finally {
    loading.value = false
  }
}

const handleSearch = async () => {
  searchParams.value.page = 1

  // Update URL first
  const query: Record<string, string> = {}
  if (searchParams.value.q) query.q = searchParams.value.q
  if (searchParams.value.so_don) query.so_don = searchParams.value.so_don
  if (searchParams.value.class) query.class = searchParams.value.class
  if (searchParams.value.owner) query.owner = searchParams.value.owner
  if (searchParams.value.status) query.status = searchParams.value.status
  if (searchParams.value.type) query.type = searchParams.value.type
  if (searchParams.value.limit && searchParams.value.limit !== 12) {
    query.limit = searchParams.value.limit.toString()
  }

  await navigateTo({
    path: '/search',
    query,
    replace: true
  })

  // Then perform search
  await performSearch()
}

const goToPage = async (page: number) => {
  searchParams.value.page = page

  // Update URL
  const query: Record<string, string> = {}
  if (searchParams.value.q) query.q = searchParams.value.q
  if (searchParams.value.so_don) query.so_don = searchParams.value.so_don
  if (searchParams.value.class) query.class = searchParams.value.class
  if (searchParams.value.owner) query.owner = searchParams.value.owner
  if (searchParams.value.status) query.status = searchParams.value.status
  if (searchParams.value.type) query.type = searchParams.value.type
  if (page > 1) query.page = page.toString()
  if (searchParams.value.limit && searchParams.value.limit !== 12) {
    query.limit = searchParams.value.limit.toString()
  }

  await navigateTo({
    path: '/search',
    query,
    replace: true
  })

  await performSearch()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Perform initial search on mount
onMounted(() => {
  if (searchParams.value.q || searchParams.value.so_don || searchParams.value.class || searchParams.value.owner || searchParams.value.status || searchParams.value.type) {
    performSearch()
  }
})

// Favorite management functions
const handleFavoriteAction = (trademark: Trademark, action: 'add' | 'remove') => {
  if (!authStore.isAuthenticated) {
    navigateTo('/login')
    return
  }

  selectedTrademark.value = trademark
  confirmAction.value = action

  // Check limit for add action
  if (action === 'add' && favoritesStore.isLimitReached) {
    showLimitModal.value = true
    return
  }

  showConfirmModal.value = true
}

const confirmFavoriteAction = async () => {
  if (!selectedTrademark.value) return

  try {
    if (confirmAction.value === 'add') {
      await favoritesStore.addFavorite(selectedTrademark.value)
      toastMessage.value = 'Đã lưu đơn thành công!'
    } else {
      await favoritesStore.removeFavorite(selectedTrademark.value.id)
      toastMessage.value = 'Đã hủy lưu đơn!'
    }

    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
    }, 3000)

  } catch (error: any) {
    console.error('Failed to toggle favorite:', error)
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

const cancelFavoriteAction = () => {
  showConfirmModal.value = false
  selectedTrademark.value = null
}

const closeLimitModal = () => {
  showLimitModal.value = false
  selectedTrademark.value = null
}

// Watch for route changes
watch(() => route.query, () => {
  searchParams.value = {
    q: (route.query.q as string) || '',
    so_don: (route.query.so_don as string) || '',
    class: (route.query.class as string) || '',
    owner: (route.query.owner as string) || '',
    status: (route.query.status as string) || '',
    type: (route.query.type as 'trademark' | 'patent') || undefined,
    page: parseInt((route.query.page as string) || '1'),
    limit: 12
  }
})

// Provide favorite handler to child components
provide('handleFavoriteAction', handleFavoriteAction)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-2">
        <span class="text-gray-900 dark:text-white">Tìm kiếm</span>
        <span class="gradient-text"> Nhãn hiệu & Sáng chế</span>
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Tìm kiếm theo số đơn, tên nhãn hiệu, chủ đơn, trạng thái và nhiều hơn nữa
      </p>
    </div>

    <!-- Advanced Search Component -->
    <div class="mb-8">
      <TrademarkAdvancedSearch v-model="searchParams" @search="handleSearch" />

      <!-- Compact Search History - Always visible below search -->
      <div v-if="searchHistory.length > 0" class="mt-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Tìm kiếm gần đây</span>
          <button @click="handleClearHistory"
            class="ml-auto text-xs text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
            Xóa
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <div v-for="(item, idx) in searchHistory.slice(0, 6)" :key="idx"
            class="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full text-sm transition-colors cursor-pointer">
            <div class="flex items-center gap-1.5 truncate max-w-[300px]" @click="() => {
              searchParams.q = item.query === 'Tìm kiếm nâng cao' ? '' : item.query
              if (item.filters?.so_don) searchParams.so_don = item.filters.so_don
              if (item.filters?.owner) searchParams.owner = item.filters.owner
              if (item.filters?.status) searchParams.status = item.filters.status
              if (item.filters?.class) searchParams.class = item.filters.class
              handleSearch()
            }">
              <span
                class="text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate">
                {{ item.query }}
              </span>
              <span v-if="item.filters?.so_don || item.filters?.owner || item.filters?.status || item.filters?.class"
                class="text-xs text-gray-400">
                •
              </span>
              <span v-if="item.filters?.so_don" class="text-xs text-orange-600 dark:text-orange-400 truncate">
                {{ item.filters.so_don }}
              </span>
              <span v-if="item.filters?.owner" class="text-xs text-blue-600 dark:text-blue-400 truncate">
                {{ item.filters.owner }}
              </span>
              <span v-if="item.filters?.status" class="text-xs text-green-600 dark:text-green-400 truncate">
                {{ getStatusLabel(item.filters.status) }}
              </span>
              <span v-if="item.filters?.class" class="text-xs text-purple-600 dark:text-purple-400">
                Lớp {{ item.filters.class }}
              </span>
            </div>
            <button @click.stop="handleRemoveFromHistory(item.query)"
              class="text-gray-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <XMarkIcon class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="error"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
      {{ error }}
    </div>

    <!-- Results count and view toggle -->
    <div v-if="!loading && trademarks.length > 0"
      class="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div>
          <p class="text-gray-600 dark:text-gray-400">
            Tìm thấy <span class="font-semibold text-gray-900 dark:text-gray-100">{{ total }}</span> kết quả
          </p>
          <p v-if="total >= 100" class="text-sm text-amber-600 dark:text-amber-400 mt-1">
            ⚠️ Có nhiều hơn 100 kết quả, vui lòng điền thêm thông tin chi tiết để thu hẹp kết quả
          </p>
        </div>

        <!-- Items per page selector -->
        <div class="flex items-center gap-2">
          <label for="itemsPerPage" class="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
            Hiển thị:
          </label>
          <select id="itemsPerPage" v-model.number="searchParams.limit"
            @change="handleItemsPerPageChange(searchParams.limit || 12)"
            class="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors cursor-pointer">
            <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
          <span class="text-sm text-gray-600 dark:text-gray-400">/ trang</span>
        </div>
      </div>

      <!-- View Mode Toggle -->
      <div class="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        <button @click="viewMode = 'card'" :class="[
          'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200',
          viewMode === 'card'
            ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-md'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        ]">
          <Squares2X2Icon class="h-5 w-5" />
          <span>Thẻ</span>
        </button>
        <button @click="viewMode = 'table'" :class="[
          'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200',
          viewMode === 'table'
            ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-md'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        ]">
          <TableCellsIcon class="h-5 w-5" />
          <span>Bảng</span>
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" key="loading-state">
      <UiLoadingSkeleton :count="6" type="card" />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="trademarks.length === 0 && (searchParams.q || searchParams.owner || searchParams.status || searchParams.type)"
      key="empty-state">
      <UiEmptyState title="Không tìm thấy kết quả" description="Thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc của bạn"
        icon="search">
        <template #action>
          <button @click="searchParams = { page: 1, limit: 12 }; handleSearch()" class="btn-primary">
            Xóa bộ lọc
          </button>
        </template>
      </UiEmptyState>
    </div>

    <!-- Initial state -->
    <div v-else-if="trademarks.length === 0" key="initial-state">
      <UiEmptyState title="Bắt đầu tìm kiếm" description="Nhập số đơn, tên nhãn hiệu hoặc sử dụng tìm kiếm nâng cao"
        icon="search" />
    </div>

    <!-- Results - Card View -->
    <div v-else-if="viewMode === 'card'" key="card-view"
      class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-fade-in">
      <TrademarkCard v-for="trademark in trademarks" :key="trademark.id" :trademark="trademark" />
    </div>

    <!-- Results - Table View -->
    <div v-else key="table-view" class="mb-8 animate-fade-in">
      <TrademarkTableView :trademarks="trademarks" />
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2">
      <button @click="goToPage((searchParams.page || 1) - 1)" :disabled="(searchParams.page || 1) === 1"
        class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed">
        Trước
      </button>

      <div class="flex space-x-1">
        <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="[
          'px-4 py-2 rounded-xl font-medium transition-all duration-200',
          page === (searchParams.page || 1)
            ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        ]">
          {{ page }}
        </button>
      </div>

      <button @click="goToPage((searchParams.page || 1) + 1)" :disabled="(searchParams.page || 1) === totalPages"
        class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed">
        Sau
      </button>
    </div>

    <!-- Confirmation Modal -->
    <Teleport to="body">
      <Transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showConfirmModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          @click.self="cancelFavoriteAction">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div class="flex items-center gap-4 mb-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" :class="confirmAction === 'add'
                ? 'bg-primary-100 dark:bg-primary-900/30'
                : 'bg-red-100 dark:bg-red-900/30'">
                <ExclamationTriangleIcon class="h-6 w-6" :class="confirmAction === 'add'
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-red-600 dark:text-red-400'" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {{ confirmAction === 'add' ? 'Xác nhận lưu đơn' : 'Xác nhận hủy lưu đơn' }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ confirmAction === 'add' ?
                    'Bạn có chắc muốn lưu đơn này?' :
                    'Bạn có chắc muốn hủy lưu đơn này khỏi danh sách ? ' }}
                </p>
              </div>
            </div>

            <div v-if="selectedTrademark" class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-1">
                {{ selectedTrademark.name || 'N/A' }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Số đơn: {{ selectedTrademark.so_don || selectedTrademark.registrationNumber || 'N/A' }}
              </p>
            </div>

            <div class="flex gap-3">
              <button @click="cancelFavoriteAction"
                class="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors">
                Hủy
              </button>
              <button @click="confirmFavoriteAction"
                class="flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors" :class="confirmAction === 'add'
                  ? 'bg-primary-600 hover:bg-primary-700'
                  : 'bg-red-600 hover:bg-red-700'">
                {{ confirmAction === 'add' ? 'Lưu đơn' : 'Hủy lưu đơn' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Limit Reached Modal -->
    <Teleport to="body">
      <Transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showLimitModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          @click.self="closeLimitModal">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div class="flex items-center gap-4 mb-4">
              <div
                class="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <ExclamationTriangleIcon class="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Đã đạt giới hạn lưu đơn
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Bạn đã lưu {{ favoritesStore.favoriteLimit }} đơn (giới hạn tối đa)
                </p>
              </div>
            </div>

            <div
              class="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p class="text-sm text-amber-800 dark:text-amber-200 mb-3">
                💡 <strong>Gợi ý:</strong> Hủy lưu một số đơn cũ để có thể lưu đơn mới, hoặc nâng cấp tài khoản để tăng
                giới
                hạn.
              </p>
              <div class="text-xs text-amber-700 dark:text-amber-300">
                Đã sử dụng: {{ favoritesStore.favoritesCount }}/{{ favoritesStore.favoriteLimit }}
              </div>
            </div>

            <div class="flex gap-3">
              <button @click="closeLimitModal"
                class="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors">
                Đóng
              </button>
              <NuxtLink to="/saved" @click="closeLimitModal"
                class="flex-1 px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors text-center">
                Quản lý đơn đã lưu
              </NuxtLink>
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
