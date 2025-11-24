<script setup lang="ts">
import { ArrowLeftIcon, BookmarkIcon as BookmarkOutline, FlagIcon, ArrowDownTrayIcon, DocumentTextIcon, ClockIcon, ChevronDownIcon, ChevronUpIcon, XMarkIcon, MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import { BookmarkIcon as BookmarkSolid } from '@heroicons/vue/24/solid'
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

const trademark = ref<any | null>(null)
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const showProgress = ref(false) 
const expandedServices = ref<Record<number, boolean>>({})
const showCertificateSection = ref(false)
const showImageModal = ref(false)
const imageZoom = ref(1)

// Modal states
const showConfirmModal = ref(false)
const confirmAction = ref<'add' | 'remove'>('add')
const showLimitModal = ref(false)
const showSuccessToast = ref(false)
const toastMessage = ref('')

const isFavorite = computed(() => 
  trademark.value ? favoritesStore.isFavorite(trademark.value.id) : false
)

const toggleProgress = () => {
  showProgress.value = !showProgress.value
}

const toggleService = (index: number) => {
  expandedServices.value[index] = !expandedServices.value[index]
}

const toggleCertificateSection = () => {
  showCertificateSection.value = !showCertificateSection.value
}

const openImageModal = () => {
  showImageModal.value = true
  imageZoom.value = 1
}

const closeImageModal = () => {
  showImageModal.value = false
  imageZoom.value = 1
}

const zoomIn = () => {
  if (imageZoom.value < 3) {
    imageZoom.value += 0.25
  }
}

const zoomOut = () => {
  if (imageZoom.value > 0.5) {
    imageZoom.value -= 0.25
  }
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

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    granted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    examining: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    expired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return colors[status.toLowerCase()] || colors.pending
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

onMounted(async () => {
  const slug = route.params.id as string
  
  try {
    loading.value = true
    
    const result = await getTrademarkBySlug(slug)
    console.log(result)
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
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Back button -->
    <NuxtLink
      to="/search"
      class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
    >
      <ArrowLeftIcon class="h-5 w-5 mr-2" />
      Back to Search
    </NuxtLink>

    <!-- Loading state -->
    <UiLoadingSkeleton v-if="loading" type="detail" />

    <!-- Error state -->
    <div
      v-else-if="error"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg"
    >
      {{ error }}
    </div>

    <!-- Trademark details -->
    <div v-else-if="trademark" class="space-y-6">
      <!-- Image Hero -->
      <div v-if="trademark.imageUrl" class="card overflow-hidden">
        <div class="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 cursor-pointer group" @click="openImageModal">
          <img 
            :src="trademark.imageUrl" 
            :alt="trademark.name"
            class="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div class="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
            <MagnifyingGlassPlusIcon class="h-5 w-5" />
            <span class="text-sm font-medium">Nhấn để xem ảnh</span>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div class="absolute bottom-0 left-0 right-0 p-8">
            <div class="flex items-end justify-between">
              <div>
                <h1 class="text-5xl font-bold text-white mb-3 drop-shadow-lg">
                  {{ trademark.name }}
                </h1>
                <div class="flex items-center space-x-3">
                  <span
                    class="px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm"
                    :class="getStatusColor(trademark.status)"
                  >
                    {{ trademark.status }}
                  </span>
                  <span class="text-white/90 font-medium backdrop-blur-sm bg-black/30 px-4 py-2 rounded-full">
                    Mã nhóm: {{ trademark.class }}
                  </span>
                </div>
              </div>
              <button
                @click="toggleFavorite"
                :disabled="saving"
                class="p-4 bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all focus:outline-none rounded-2xl"
                :class="{ 'opacity-50 cursor-not-allowed': saving }"
              >
                <BookmarkSolid v-if="isFavorite" class="h-8 w-8 text-primary-400" />
                <BookmarkOutline v-else class="h-8 w-8 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Header (no image) -->
      <div v-else class="card p-8">
        <div class="flex items-start justify-between mb-6">
          <div class="flex-1">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {{ trademark.name }}
            </h1>
            <div class="flex items-center space-x-3">
              <span
                class="px-3 py-1 rounded-full text-sm font-medium"
                :class="getStatusColor(trademark.status)"
              >
                {{ trademark.status }}
              </span>
              <span class="text-gray-500 dark:text-gray-400">
                Mã nhóm: {{ trademark.class }}
              </span>
            </div>
          </div>

          <button
            @click="toggleFavorite"
            :disabled="saving"
            class="ml-4 p-3 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="{ 'opacity-50 cursor-not-allowed': saving }"
          >
            <BookmarkSolid v-if="isFavorite" class="h-8 w-8 text-primary-600 dark:text-primary-400" />
            <BookmarkOutline v-else class="h-8 w-8" />
          </button>
        </div>
      </div>

      <!-- Thông tin đơn -->
      <div class="card p-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          Thông tin đơn
        </h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Trạng thái</h3>
            <span 
              class="inline-block px-3 py-1 rounded-full text-sm font-medium"
              :class="getStatusColor(trademark.trang_thai || trademark.status)"
            >
              {{ trademark.trang_thai || trademark.status }}
            </span>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Số đơn</h3>
            <p class="text-lg text-gray-900 dark:text-gray-100 font-mono">{{ trademark.so_don || trademark.registrationNumber || 'N/A' }}</p>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Số đơn gốc</h3>
            <p class="text-lg text-gray-900 dark:text-gray-100 font-mono">{{ trademark.so_don_goc || 'N/A' }}</p>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Ngày nộp đơn</h3>
            <p class="text-lg text-gray-900 dark:text-gray-100">{{ formatDate(trademark.ngay_nop_don) }}</p>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Ngày công bố</h3>
            <p class="text-lg text-gray-900 dark:text-gray-100">{{ formatDate(trademark.ngay_cong_bo) }}</p>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Loại đơn</h3>
            <p class="text-lg text-gray-900 dark:text-gray-100">{{ trademark.loai_don || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- Thông tin cấp bằng (chỉ hiển thị khi đã được cấp bằng) -->
      <div v-if="trademark.so_bang" class="card p-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          Thông tin cấp bằng
        </h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Số bằng</h3>
            <p class="text-lg text-gray-900 dark:text-gray-100 font-mono">{{ trademark.so_bang }}</p>
          </div>

          <div v-if="trademark.ngay_cap || trademark.registrationDate">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Ngày cấp</h3>
            <p class="text-lg text-gray-900 dark:text-gray-100">{{ formatDate(trademark.ngay_cap || trademark.registrationDate) }}</p>
          </div>

          <div v-if="trademark.ngay_het_han || trademark.expiryDate">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Ngày hết hạn</h3>
            <p class="text-lg text-gray-900 dark:text-gray-100">{{ formatDate(trademark.ngay_het_han || trademark.expiryDate) }}</p>
          </div>

          <div v-if="trademark.so_cong_bo">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Số công bố</h3>
            <p class="text-lg text-gray-900 dark:text-gray-100 font-mono">{{ trademark.so_cong_bo }}</p>
          </div>

          <div v-if="trademark.ngay_cong_bo">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Ngày công bố</h3>
            <p class="text-lg text-gray-900 dark:text-gray-100">{{ formatDate(trademark.ngay_cong_bo) }}</p>
          </div>

          <!-- Thêm các field kết thúc bằng cb từ backend -->
          <div v-if="trademark.ten_nhan_hieu_cb">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tên nhãn hiệu (cấp bằng)</h3>
            <p class="text-lg text-gray-900 dark:text-gray-100">{{ trademark.ten_nhan_hieu_cb }}</p>
          </div>

          <div v-if="trademark.mau_sac_cb">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Màu sắc (cấp bằng)</h3>
            <p class="text-lg text-gray-900 dark:text-gray-100">{{ trademark.mau_sac_cb }}</p>
          </div>

          <div v-if="trademark.phan_loai_hinh_cb">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phân loại hình (cấp bằng)</h3>
            <p class="text-lg text-gray-900 dark:text-gray-100">{{ trademark.phan_loai_hinh_cb }}</p>
          </div>

          <div v-if="trademark.yeu_to_loai_tru">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Yếu tố loại trừ</h3>
            <p class="text-lg text-gray-900 dark:text-gray-100">{{ trademark.yeu_to_loai_tru }}</p>
          </div>

          <div v-if="trademark.so_don_goc">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Số đơn gốc</h3>
            <p class="text-lg text-gray-900 dark:text-gray-100 font-mono">{{ trademark.so_don_goc }}</p>
          </div>
        </div>

        <!-- Thông tin đại diện cấp bằng -->
        <div v-if="trademark.dai_dien_cb" class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Đại diện SHCN (cấp bằng)</h3>
          <div class="text-gray-900 dark:text-gray-100">
            <p class="font-semibold">{{ trademark.dai_dien_cb.ten_dai_dien || 'N/A' }}</p>
            <p v-if="trademark.dai_dien_cb.dia_chi_dai_dien" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ trademark.dai_dien_cb.dia_chi_dai_dien }}
            </p>
          </div>
        </div>

        <!-- Nhóm dịch vụ cấp bằng -->
        <div v-if="trademark.nhom_dich_vu_cb && trademark.nhom_dich_vu_cb.length > 0" class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="toggleCertificateSection"
            class="w-full flex items-center justify-between mb-6 hover:opacity-80 transition-opacity"
          >
            <div class="flex items-center gap-3">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Nhóm sản phẩm / Dịch vụ (cấp bằng)
              </h3>
              <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-semibold">
                {{ trademark.nhom_dich_vu_cb.length }} nhóm
              </span>
            </div>
            <component
              :is="showCertificateSection ? ChevronUpIcon : ChevronDownIcon"
              class="h-6 w-6 text-gray-500 dark:text-gray-400 transition-transform"
            />
          </button>

          <transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-[2000px]"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 max-h-[2000px]"
            leave-to-class="opacity-0 max-h-0"
          >
            <div v-show="showCertificateSection" class="overflow-hidden">
              <div class="space-y-3">
            <div
              v-for="(nhom, idx) in trademark.nhom_dich_vu_cb"
              :key="idx"
              class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <span class="text-lg font-bold text-green-600 dark:text-green-400">
                    {{ nhom.ma_nhom || 'N/A' }}
                  </span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 dark:text-gray-100">
                    Mã nhóm: {{ nhom.ma_nhom || 'N/A' }}
                  </h4>
                  <p v-if="nhom?.mo_ta_dich_vu" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {{ nhom?.mo_ta_dich_vu }}
                  </p>
                </div>
              </div>
            </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- Đặc điểm nhãn hiệu -->
      <div class="card p-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          Đặc điểm nhãn hiệu
        </h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Mô tả nhãn hiệu</h3>
            <p class="text-lg text-gray-900 dark:text-gray-100">{{ trademark.ten_nhan_hieu || 'N/A' }}</p>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Màu sắc</h3>
            <p class="text-lg text-gray-900 dark:text-gray-100">{{ trademark.mau_sac || 'N/A' }}</p>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phân loại hình</h3>
            <p class="text-lg text-gray-900 dark:text-gray-100">{{ trademark.phan_loai_hinh || 'N/A' }}</p>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Kiểu mẫu nhãn</h3>
            <p class="text-lg text-gray-900 dark:text-gray-100">{{ trademark.kieu_mau_nhan || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- Thông tin chủ đơn & đại diện -->
      <div class="card p-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          Chủ đơn & Đại diện
        </h2>
        <div class="space-y-6">
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Chủ đơn/Chủ bằng</h3>
            <div class="text-gray-900 dark:text-gray-100">
              <p class="font-semibold">{{ trademark.chu_don?.ten_chu_don || trademark.owner || 'N/A' }}</p>
              <p v-if="trademark.chu_don?.dia_chi" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ trademark.chu_don.dia_chi }}
              </p>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Đại diện SHCN</h3>
            <div class="text-gray-900 dark:text-gray-100">
              <p class="font-semibold">{{ trademark.dai_dien?.ten_dai_dien || 'N/A' }}</p>
              <p v-if="trademark.dai_dien?.dia_chi_dai_dien || trademark.dai_dien?.dia_chi" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ trademark.dai_dien.dia_chi_dai_dien || trademark.dai_dien.dia_chi }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div v-if="trademark.description" class="card p-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Mô tả</h2>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          {{ trademark.description }}
        </p>
      </div>

      <!-- Classes / Services -->
      <div v-if="trademark.nhom_dich_vu && trademark.nhom_dich_vu.length > 0" class="card p-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Nhóm sản phẩm / Dịch vụ
          <span class="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
            ({{ trademark.nhom_dich_vu.length }} nhóm)
          </span>
        </h2>
        <div class="space-y-4">
          <div
            v-for="(nhom, idx) in trademark.nhom_dich_vu"
            :key="idx"
            class="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-colors"
            :class="expandedServices[idx] ? 'border-primary-500 dark:border-primary-500' : 'hover:border-gray-300 dark:hover:border-gray-600'"
          >
            <button
              @click="toggleService(idx)"
              class="w-full p-5 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
            >
              <div class="flex-shrink-0 w-16 h-16 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {{ nhom?.ma_nhom || 'N/A' }}
                </span>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Mã nhóm: {{ nhom?.ma_nhom || 'N/A' }}
                  </h3>
                  <component
                    :is="expandedServices[idx] ? ChevronUpIcon : ChevronDownIcon"
                    class="h-6 w-6 text-gray-500 dark:text-gray-400 transition-transform flex-shrink-0"
                  />
                </div>
                <p v-if="!expandedServices[idx] && nhom?.mo_ta_dich_vu" class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {{ nhom?.mo_ta_dich_vu }}
                </p>
              </div>
            </button>
            
            <transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-[500px]"
              leave-active-class="transition-all duration-300 ease-in"
              leave-from-class="opacity-100 max-h-[500px]"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-show="expandedServices[idx]" class="px-5 pb-5 overflow-hidden">
                <div v-if="nhom?.mo_ta_dich_vu" class="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mô tả dịch vụ:</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-4 border-l-2 border-primary-300 dark:border-primary-700">
                    {{ nhom?.mo_ta_dich_vu }}
                  </p>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- Progress Timeline -->
      <div v-if="trademark.progress && trademark.progress.length > 0" class="card p-8">
        <button
          @click="toggleProgress"
          class="w-full flex items-center justify-between mb-6 hover:opacity-80 transition-opacity"
        >
          <div class="flex items-center gap-3">
            <ClockIcon class="h-8 w-8 text-primary-500" />
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Tiến trình xử lý
            </h2>
            <span class="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold">
              {{ trademark.progress.length }} bước
            </span>
          </div>
          <component
            :is="showProgress ? ChevronUpIcon : ChevronDownIcon"
            class="h-6 w-6 text-gray-500 dark:text-gray-400 transition-transform"
          />
        </button>

        <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-[2000px]"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="opacity-100 max-h-[2000px]"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-show="showProgress" class="relative overflow-hidden">
            <!-- Timeline line -->
            <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

            <!-- Progress items -->
            <div class="space-y-6">
              <div
                v-for="(item, index) in trademark.progress"
                :key="item.id"
                class="relative pl-20"
              >
                <!-- Timeline dot -->
                <div class="absolute left-6 w-5 h-5 rounded-full bg-primary-500 border-4 border-white dark:border-gray-900 shadow-lg"></div>

                <!-- Content card -->
                <div class="card p-5 hover:shadow-lg transition-shadow">
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-3">
                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {{ formatDate(item.ngay_xu_ly) }}
                        </span>
                      </div>
                      <p class="text-base text-gray-900 dark:text-gray-100 leading-relaxed">
                        {{ item.noi_dung_xu_ly }}
                      </p>
                    </div>
                    <div class="flex-shrink-0 ml-4">
                      <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold text-sm">
                        {{ index + 1 }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Download Documents -->
      <div class="card p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Tài liệu
          </h2>
          <DocumentTextIcon class="h-8 w-8 text-primary-500" />
        </div>

        <div class="space-y-4">
          <!-- Document items -->
          <div class="group relative overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-lg">
            <div class="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50">
              <div class="flex items-center space-x-4 flex-1">
                <div class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    Giấy chứng nhận đăng ký nhãn hiệu
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">PDF • 2.4 MB</p>
                </div>
              </div>
              <button class="btn-primary flex items-center space-x-2 group-hover:scale-105 transition-transform">
                <ArrowDownTrayIcon class="h-5 w-5" />
                <span>Tải xuống</span>
              </button>
            </div>
          </div>

          <div class="group relative overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-lg">
            <div class="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50">
              <div class="flex items-center space-x-4 flex-1">
                <div class="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    Đơn đăng ký nhãn hiệu
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">PDF • 1.8 MB</p>
                </div>
              </div>
              <button class="btn-primary flex items-center space-x-2 group-hover:scale-105 transition-transform">
                <ArrowDownTrayIcon class="h-5 w-5" />
                <span>Tải xuống</span>
              </button>
            </div>
          </div>

          <div class="group relative overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-lg">
            <div class="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50">
              <div class="flex items-center space-x-4 flex-1">
                <div class="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    Hình ảnh nhãn hiệu (độ phân giải cao)
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">PNG • 3.2 MB</p>
                </div>
              </div>
              <button class="btn-primary flex items-center space-x-2 group-hover:scale-105 transition-transform">
                <ArrowDownTrayIcon class="h-5 w-5" />
                <span>Tải xuống</span>
              </button>
            </div>
          </div>

          <div class="group relative overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-lg">
            <div class="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50">
              <div class="flex items-center space-x-4 flex-1">
                <div class="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    Thông tin chi tiết (Full report)
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">PDF • 5.1 MB</p>
                </div>
              </div>
              <button class="btn-primary flex items-center space-x-2 group-hover:scale-105 transition-transform">
                <ArrowDownTrayIcon class="h-5 w-5" />
                <span>Tải xuống</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Download all button -->
        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button class="w-full btn-secondary flex items-center justify-center space-x-2 py-4 text-base font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20">
            <ArrowDownTrayIcon class="h-6 w-6" />
            <span>Tải tất cả tài liệu (ZIP - 12.5 MB)</span>
          </button>
        </div>
      </div>

      <!-- Related Trademarks -->
      <div v-if="trademark.relatedTrademarks && trademark.relatedTrademarks.length > 0" class="card p-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Related Trademarks</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <TrademarkCard
            v-for="related in trademark.relatedTrademarks"
            :key="related.id"
            :trademark="related"
          />
        </div>
      </div>

      <!-- Actions -->
      <div v-if="authStore.isAuthenticated" class="card p-6 bg-gray-50 dark:bg-gray-800/50">
        <div class="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <p class="text-gray-600 dark:text-gray-400">
            Phát hiện vấn đề với nhãn hiệu này?
          </p>
          <NuxtLink
            v-if="isFavorite"
            :to="`/report/${trademark.so_don}`"
            class="btn-primary flex items-center space-x-2 bg-red-600 hover:bg-red-700"
          >
            <FlagIcon class="h-5 w-5" />
            <span>Báo cáo vi phạm</span>
          </NuxtLink>
          <button
            v-else
            disabled
            class="btn-secondary flex items-center space-x-2 opacity-50 cursor-not-allowed"
            title="Chỉ có thể báo cáo các đơn đã lưu"
          >
            <FlagIcon class="h-5 w-5" />
            <span>Báo cáo vi phạm</span>
          </button>
        </div>
        <p v-if="!isFavorite" class="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center sm:text-right">
          💡 Lưu nhãn hiệu này để có thể báo cáo
        </p>
      </div>
    </div>

    <!-- Image Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showImageModal && trademark?.imageUrl"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          @click.self="closeImageModal"
        >
          <div class="relative w-full h-full flex items-center justify-center p-4">
            <!-- Close button -->
            <button
              @click="closeImageModal"
              class="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors z-10"
              title="Đóng"
            >
              <XMarkIcon class="h-6 w-6 text-white" />
            </button>

            <!-- Zoom controls -->
            <div class="absolute top-4 left-4 flex gap-2 z-10">
              <button
                @click="zoomOut"
                :disabled="imageZoom <= 0.5"
                class="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Thu nhỏ"
              >
                <MagnifyingGlassMinusIcon class="h-6 w-6 text-white" />
              </button>
              <button
                @click="zoomIn"
                :disabled="imageZoom >= 3"
                class="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Phóng to"
              >
                <MagnifyingGlassPlusIcon class="h-6 w-6 text-white" />
              </button>
              <div class="px-4 py-3 bg-white/10 backdrop-blur-md rounded-full text-white font-medium">
                {{ Math.round(imageZoom * 100) }}%
              </div>
            </div>

            <!-- Image info -->
            <div class="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-lg p-4 text-white">
              <h3 class="text-xl font-bold mb-1">{{ trademark.name }}</h3>
              <p class="text-sm text-white/80">Mã nhóm: {{ trademark.class }} • {{ trademark.status }}</p>
            </div>

            <!-- Image -->
            <div class="overflow-auto max-w-full max-h-full">
              <img
                :src="trademark.imageUrl"
                :alt="trademark.name"
                class="transition-transform duration-300 select-none"
                :style="{ transform: `scale(${imageZoom})` }"
                draggable="false"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Confirmation Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showConfirmModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          @click.self="cancelFavoriteAction"
        >
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div class="flex items-center gap-4 mb-4">
              <div 
                class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                :class="confirmAction === 'add' 
                  ? 'bg-primary-100 dark:bg-primary-900/30' 
                  : 'bg-red-100 dark:bg-red-900/30'"
              >
                <ExclamationTriangleIcon 
                  class="h-6 w-6"
                  :class="confirmAction === 'add' 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-red-600 dark:text-red-400'"
                />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {{ confirmAction === 'add' ? 'Xác nhận lưu đơn' : 'Xác nhận hủy lưu đơn' }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ confirmAction === 'add' ? 'Bạn có chắc muốn lưu đơn này?' : 'Bạn có chắc muốn hủy lưu đơn này khỏi danh sách?' }}
                </p>
              </div>
            </div>
            
            <div v-if="trademark" class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-1">
                {{ trademark.name || trademark.ten_nhan_hieu || 'N/A' }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Số đơn: {{ trademark.so_don || trademark.registrationNumber || 'N/A' }}
              </p>
            </div>

            <div class="flex gap-3">
              <button
                @click="cancelFavoriteAction"
                class="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                @click="confirmFavoriteAction"
                :disabled="saving"
                class="flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                :class="confirmAction === 'add' 
                  ? 'bg-primary-600 hover:bg-primary-700' 
                  : 'bg-red-600 hover:bg-red-700'"
              >
                {{ saving ? 'Đang xử lý...' : (confirmAction === 'add' ? 'Lưu đơn' : 'Hủy lưu đơn') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Limit Reached Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showLimitModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          @click.self="closeLimitModal"
        >
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div class="flex items-center gap-4 mb-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
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
            
            <div class="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p class="text-sm text-amber-800 dark:text-amber-200 mb-3">
                💡 <strong>Gợi ý:</strong> Hủy lưu một số đơn cũ để có thể lưu đơn mới, hoặc nâng cấp tài khoản để tăng giới hạn.
              </p>
              <div class="text-xs text-amber-700 dark:text-amber-300">
                Đã sử dụng: {{ favoritesStore.favoritesCount }}/{{ favoritesStore.favoriteLimit }}
              </div>
            </div>

            <div class="flex gap-3">
              <button
                @click="closeLimitModal"
                class="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Đóng
              </button>
              <NuxtLink
                to="/saved"
                @click="closeLimitModal"
                class="flex-1 px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors text-center"
              >
                Quản lý đơn đã lưu
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Success Toast -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div
          v-if="showSuccessToast"
          class="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm"
        >
          <div class="flex items-center gap-3">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircleIcon class="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ toastMessage }}
            </p>
            <button
              @click="showSuccessToast = false"
              class="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
