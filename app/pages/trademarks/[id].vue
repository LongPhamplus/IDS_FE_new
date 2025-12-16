<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import type { Trademark } from '~/types'
import { useAuthStore } from '~/stores/auth'
import { useFavoritesStore } from '~/stores/favorites'

// Define custom page transition
definePageMeta({
  pageTransition: {
    name: 'slide-up',
    mode: 'out-in'
  }
})

const route = useRoute()
const { getTrademarkBySlug } = useApi()
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()
const { getStatusColor } = useTrademarkHelpers()

const trademark = ref<any | null>(null)
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const showImageModal = ref(false)

// Modal states
const showConfirmModal = ref(false)
const confirmAction = ref<'add' | 'remove'>('add')
const showLimitModal = ref(false)
const showSuccessToast = ref(false)
const toastMessage = ref('')

const isFavorite = computed(() =>
  trademark.value ? favoritesStore.isFavorite(trademark.value.id) : false
)

const openImageModal = () => {
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
}

const toggleFavorite = async () => {
  if (!trademark.value) return

  if (!authStore.isAuthenticated) {
    navigateTo('/login')
    return
  }

  // Check limit for add action
  if (!isFavorite.value && favoritesStore.isLimitReached) {
    showLimitModal.value = true
    return
  }

  confirmAction.value = isFavorite.value ? 'remove' : 'add'
  showConfirmModal.value = true
}

const confirmFavoriteAction = async () => {
  if (!trademark.value) return

  saving.value = true
  try {
    if (confirmAction.value === 'add') {
      await favoritesStore.addFavorite(trademark.value)
      toastMessage.value = 'Đã lưu đơn thành công!'
    } else {
      await favoritesStore.removeFavorite(trademark.value.id)
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
    saving.value = false
    showConfirmModal.value = false
  }
}

const cancelFavoriteAction = () => {
  showConfirmModal.value = false
}

const closeLimitModal = () => {
  showLimitModal.value = false
}

onMounted(async () => {
  const slug = route.params.id as string

  try {
    loading.value = true

    const result = await getTrademarkBySlug(slug)
    if (result) {
      trademark.value = result
    } else {
      error.value = 'Không tìm thấy nhãn hiệu'
    }
  } catch (err: any) {
    error.value = err.data?.message || err.message || 'Không thể tải thông tin nhãn hiệu'
    console.error('Error fetching trademark:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Back button and Report Creator -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <NuxtLink to="/search"
          class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group">
          <ArrowLeftIcon class="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span class="font-medium">Quay lại tìm kiếm</span>
        </NuxtLink>

        <!-- Report Creator Component (only show if trademark is loaded) -->
        <TrademarkDetailTrademarkReportCreator v-if="trademark && !loading && !error" :trademark="trademark"
          :is-favorite="isFavorite" />
      </div>

      <!-- Loading state -->
      <UiLoadingSkeleton v-if="loading" type="detail" />

      <!-- Error state -->
      <div v-else-if="error"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg">
        {{ error }}
      </div>

      <!-- Trademark details - 2 Column Layout -->
      <div v-else-if="trademark">
        <!-- Main 2-column grid -->
        <div class="grid lg:grid-cols-3 gap-8 mb-8">
          <!-- LEFT COLUMN - Image Display (1/3 width) -->
          <div class="lg:col-span-1">
            <TrademarkDetailTrademarkImageDisplay :trademark="trademark" :is-favorite="isFavorite" :saving="saving"
              @toggle-favorite="toggleFavorite" @open-image-modal="openImageModal" />
          </div>

          <!-- RIGHT COLUMN - Information (2/3 width) -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Trademark Name & Basic Info -->
            <TrademarkDetailTrademarkBasicInfo :trademark="trademark" />

            <!-- Owner Information -->
            <TrademarkDetailTrademarkOwnerInfo :trademark="trademark" />

            <!-- Trademark Characteristics -->
            <TrademarkDetailTrademarkCharacteristics :trademark="trademark" />

            <!-- Disclaimer / Yếu tố loại trừ -->
            <TrademarkDetailTrademarkDisclaimer :trademark="trademark" />

            <!-- Description -->
            <div v-if="trademark.description"
              class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Mô tả
              </h2>
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ trademark.description }}</p>
            </div>

            <!-- Services/Products -->
            <TrademarkDetailTrademarkServicesCard v-if="trademark.nhom_dich_vu?.length" :trademark="trademark" />
          </div>
        </div>

        <!-- Full Width Sections Below -->
        <div class="space-y-6">
          <!-- Certificate Information (only if granted) -->
          <TrademarkDetailTrademarkCertificateCard v-if="trademark.so_bang" :trademark="trademark" />

          <!-- Progress Timeline -->
          <!-- <TrademarkDetailTrademarkProgressTimeline v-if="trademark.tien_trinh?.length"
            :progress="trademark.tien_trinh" /> -->

          <!-- Related Trademarks -->
          <div v-if="trademark.relatedTrademarks?.length"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Nhãn hiệu tương tự
            </h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <TrademarkCard v-for="related in trademark.relatedTrademarks" :key="related.id" :trademark="related" />
            </div>
          </div>
        </div>
      </div>

      <!-- Modals & Toast -->
      <TrademarkDetailTrademarkImageModal :show="showImageModal" :image-url="trademark?.imageUrl"
        :trademark-name="trademark?.name" :trademark-class="trademark?.class" :trademark-status="trademark?.status"
        @close="closeImageModal" />

      <TrademarkDetailTrademarkConfirmModal :show="showConfirmModal" :action="confirmAction" :trademark="trademark"
        :saving="saving" @confirm="confirmFavoriteAction" @cancel="cancelFavoriteAction" />

      <TrademarkDetailTrademarkLimitModal :show="showLimitModal" :current-count="favoritesStore.favoritesCount"
        :limit="favoritesStore.favoriteLimit" @close="closeLimitModal" />

      <TrademarkDetailTrademarkSuccessToast :show="showSuccessToast" :message="toastMessage"
        @close="showSuccessToast = false" />
    </div>
  </div>
</template>
