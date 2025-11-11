<script setup lang="ts">
import { Squares2X2Icon, TableCellsIcon, ClockIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import type { Trademark, SearchParams } from '~/types'

const route = useRoute()
const { searchTrademarks } = useApi()
const { getHistory, addToHistory, clearHistory, removeFromHistory, formatTimestamp } = useSearchHistory()

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

const performSearch = async () => {
  loading.value = true
  error.value = ''

  try {
    // Fetch data từ backend API
    const response = await searchTrademarks(searchParams.value)

    // Update state after fetch completes
    trademarks.value = response.data || []
    totalPages.value = response.totalPages || 0
    total.value = response.total || 0

    // Save to search history if there's a query or any filter
    const hasSearchCriteria = searchParams.value.q ||
      searchParams.value.owner ||
      searchParams.value.status ||
      searchParams.value.class

    if (hasSearchCriteria) {
      const displayQuery = searchParams.value.q ||
        searchParams.value.owner ||
        searchParams.value.status ||
        searchParams.value.class ||
        'Tìm kiếm nâng cao'

      addToHistory({
        query: displayQuery,
        type: searchParams.value.type,
        filters: {
          owner: searchParams.value.owner,
          status: searchParams.value.status,
          class: searchParams.value.class
        }
      })
      // Update history display
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
  if (searchParams.value.q || searchParams.value.class || searchParams.value.owner || searchParams.value.status || searchParams.value.type) {
    performSearch()
  }
})

// Watch for route changes
watch(() => route.query, () => {
  searchParams.value = {
    q: (route.query.q as string) || '',
    class: (route.query.class as string) || '',
    owner: (route.query.owner as string) || '',
    status: (route.query.status as string) || '',
    type: (route.query.type as 'trademark' | 'patent') || undefined,
    page: parseInt((route.query.page as string) || '1'),
    limit: 12
  }
})
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
        <div class="flex items-center gap-2 mb-2">
          <ClockIcon class="h-4 w-4 text-gray-400 dark:text-gray-500" />
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Tìm kiếm gần đây</span>
          <button @click="() => { clearHistory(); searchHistory = [] }"
            class="ml-auto text-xs text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
            Xóa
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button v-for="(item, idx) in searchHistory.slice(0, 6)" :key="idx" @click="() => {
            searchParams.q = item.query === 'Tìm kiếm nâng cao' ? '' : item.query
            if (item.filters?.owner) searchParams.owner = item.filters.owner
            if (item.filters?.status) searchParams.status = item.filters.status
            if (item.filters?.class) searchParams.class = item.filters.class
            handleSearch()
          }"
            class="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full text-sm transition-colors">
            <div class="flex items-center gap-1.5 truncate max-w-[300px]">
              <span
                class="text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate">
                {{ item.query }}
              </span>
              <span v-if="item.filters?.owner || item.filters?.status || item.filters?.class"
                class="text-xs text-gray-400">
                •
              </span>
              <span v-if="item.filters?.owner" class="text-xs text-blue-600 dark:text-blue-400 truncate">
                {{ item.filters.owner }}
              </span>
              <span v-if="item.filters?.status" class="text-xs text-green-600 dark:text-green-400 truncate">
                {{ item.filters.status }}
              </span>
              <span v-if="item.filters?.class" class="text-xs text-purple-600 dark:text-purple-400">
                Lớp {{ item.filters.class }}
              </span>
            </div>
            <button @click.stop="() => { removeFromHistory(item.query); searchHistory = getHistory() }"
              class="text-gray-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <XMarkIcon class="h-3.5 w-3.5" />
            </button>
          </button>
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
        <p class="text-gray-600 dark:text-gray-400">
          Found <span class="font-semibold text-gray-900 dark:text-gray-100">{{ total }}</span> results
        </p>

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
          <span>Card</span>
        </button>
        <button @click="viewMode = 'table'" :class="[
          'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200',
          viewMode === 'table'
            ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-md'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        ]">
          <TableCellsIcon class="h-5 w-5" />
          <span>Table</span>
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <UiLoadingSkeleton v-if="loading" :count="6" type="card" />

    <!-- Empty state -->
    <UiEmptyState
      v-else-if="!loading && trademarks.length === 0 && (searchParams.q || searchParams.owner || searchParams.status || searchParams.type)"
      title="Không tìm thấy kết quả" description="Thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc của bạn" icon="search">
      <template #action>
        <button @click="searchParams = { page: 1, limit: 12 }; handleSearch()" class="btn-primary">
          Xóa bộ lọc
        </button>
      </template>
    </UiEmptyState>

    <!-- Initial state -->
    <UiEmptyState v-else-if="!loading && trademarks.length === 0" title="Bắt đầu tìm kiếm"
      description="Nhập số đơn, tên nhãn hiệu hoặc sử dụng tìm kiếm nâng cao" icon="search" />

    <!-- Results - Card View -->
    <div v-else-if="viewMode === 'card'" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-fade-in">
      <TrademarkCard v-for="trademark in trademarks" :key="trademark.id" :trademark="trademark" />
    </div>

    <!-- Results - Table View -->
    <div v-else-if="viewMode === 'table'" class="mb-8 animate-fade-in">
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
  </div>
</template>
