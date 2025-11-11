<script setup lang="ts">
import { ArrowLeftIcon, FlagIcon } from '@heroicons/vue/24/outline'
import { useFavoritesStore } from '~/stores/favorites'
import type { Trademark } from '~/types'

definePageMeta({
  middleware: 'auth',
  pageTransition: {
    name: 'slide-up',
    mode: 'out-in'
  }
})

const route = useRoute()
const config = useRuntimeConfig()
const favoritesStore = useFavoritesStore()
const { getMockTrademarkById } = useMockData()

const trademarkId = route.params.id as string
const trademark = ref<Trademark | null>(null)
const loading = ref(true)
const submitting = ref(false)
const error = ref('')
const success = ref(false)

const form = reactive({
  reason: '',
  description: '',
  evidence: ''
})

const reportReasons = [
  { value: 'infringement', label: 'Vi phạm quyền sở hữu trí tuệ' },
  { value: 'counterfeit', label: 'Hàng giả mạo' },
  { value: 'misleading', label: 'Gây nhầm lẫn cho người tiêu dùng' },
  { value: 'trademark_squatting', label: 'Chiếm đoạt nhãn hiệu' },
  { value: 'bad_faith', label: 'Đăng ký không thiện chí' },
  { value: 'other', label: 'Lý do khác' }
]

// Check if trademark is in favorites
const isFavorite = computed(() => {
  return trademark.value ? favoritesStore.isFavorite(trademark.value.id) : false
})

const canReport = computed(() => {
  return isFavorite.value
})

const handleSubmit = async () => {
  error.value = ''

  if (!form.reason) {
    error.value = 'Vui lòng chọn lý do báo cáo'
    return
  }

  if (!form.description || form.description.length < 20) {
    error.value = 'Mô tả phải có ít nhất 20 ký tự'
    return
  }

  if (!canReport.value) {
    error.value = 'Bạn chỉ có thể báo cáo các đơn đã lưu'
    return
  }

  submitting.value = true

  try {
    await $fetch('/api/reports', {
      baseURL: config.public.apiBase,
      method: 'POST',
      credentials: 'include',
      body: {
        trademarkId: trademark.value?.id,
        reason: form.reason,
        description: form.description,
        evidence: form.evidence
      }
    })

    success.value = true
  } catch (err: any) {
    error.value = err.data?.message || 'Không thể gửi báo cáo. Vui lòng thử lại.'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  loading.value = true
  
  try {
    // Fetch favorites first
    await favoritesStore.fetchFavorites()
    
    // Get trademark details
    const result = getMockTrademarkById(trademarkId)
    if (result) {
      trademark.value = result
    } else {
      error.value = 'Không tìm thấy nhãn hiệu'
    }
  } catch (err) {
    error.value = 'Không thể tải thông tin nhãn hiệu'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Back button -->
    <NuxtLink
      :to="`/trademarks/${trademarkId}`"
      class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
    >
      <ArrowLeftIcon class="h-5 w-5 mr-2" />
      Quay lại
    </NuxtLink>

    <!-- Loading state -->
    <div v-if="loading" class="card p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-600 dark:text-gray-400">Đang tải...</p>
    </div>

    <!-- Success state -->
    <div v-else-if="success" class="card p-8 text-center animate-scale-in">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Báo cáo đã được gửi!
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét và xử lý trong thời gian sớm nhất.
      </p>
      <div class="space-y-3">
        <NuxtLink :to="`/trademarks/${trademarkId}`" class="btn-primary w-full">
          Xem nhãn hiệu
        </NuxtLink>
        <NuxtLink to="/saved" class="btn-secondary w-full">
          Về danh sách đã lưu
        </NuxtLink>
      </div>
    </div>

    <!-- Report form -->
    <div v-else-if="trademark">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <FlagIcon class="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Báo cáo nhãn hiệu
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              {{ trademark.name }}
            </p>
          </div>
        </div>
      </div>

      <!-- Not in favorites warning -->
      <div v-if="!canReport" class="card p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 mb-6">
        <div class="flex items-start space-x-3">
          <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 class="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
              Không thể báo cáo
            </h3>
            <p class="text-sm text-yellow-800 dark:text-yellow-300">
              Bạn chỉ có thể báo cáo các nhãn hiệu đã lưu. Vui lòng lưu nhãn hiệu này trước khi báo cáo.
            </p>
            <NuxtLink :to="`/trademarks/${trademarkId}`" class="inline-flex items-center text-sm font-medium text-yellow-700 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-200 mt-2">
              Xem và lưu nhãn hiệu →
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Report form -->
      <div v-else class="card p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Error message -->
          <div
            v-if="error"
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm"
          >
            {{ error }}
          </div>

          <!-- Reason -->
          <div>
            <label for="reason" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lý do báo cáo <span class="text-red-500">*</span>
            </label>
            <select
              id="reason"
              v-model="form.reason"
              required
              class="input-field"
            >
              <option value="">Chọn lý do</option>
              <option v-for="reason in reportReasons" :key="reason.value" :value="reason.value">
                {{ reason.label }}
              </option>
            </select>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mô tả chi tiết <span class="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              v-model="form.description"
              required
              rows="6"
              class="input-field"
              placeholder="Vui lòng mô tả chi tiết vấn đề bạn muốn báo cáo (tối thiểu 20 ký tự)..."
            ></textarea>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ form.description.length }} / 20 ký tự tối thiểu
            </p>
          </div>

          <!-- Evidence -->
          <div>
            <label for="evidence" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bằng chứng (tùy chọn)
            </label>
            <textarea
              id="evidence"
              v-model="form.evidence"
              rows="4"
              class="input-field"
              placeholder="Link tài liệu, hình ảnh hoặc thông tin bổ sung..."
            ></textarea>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Cung cấp link hoặc mô tả bằng chứng hỗ trợ báo cáo của bạn
            </p>
          </div>

          <!-- Submit button -->
          <div class="flex items-center space-x-3">
            <button
              type="submit"
              :disabled="submitting || !canReport"
              class="btn-primary flex-1"
            >
              <span v-if="submitting">Đang gửi...</span>
              <span v-else>Gửi báo cáo</span>
            </button>
            <NuxtLink :to="`/trademarks/${trademarkId}`" class="btn-secondary">
              Hủy
            </NuxtLink>
          </div>
        </form>
      </div>

      <!-- Info card -->
      <div class="mt-6 card p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <h4 class="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
          Lưu ý khi báo cáo
        </h4>
        <ul class="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Chỉ báo cáo các vi phạm thực sự</li>
          <li>• Cung cấp thông tin chính xác và đầy đủ</li>
          <li>• Báo cáo sai có thể bị xử lý</li>
          <li>• Thời gian xử lý: 5-7 ngày làm việc</li>
        </ul>
      </div>
    </div>

    <!-- Error state -->
    <div v-else class="card p-8 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <svg class="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Không tìm thấy nhãn hiệu
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ error }}
      </p>
      <NuxtLink to="/saved" class="btn-primary">
        Về danh sách đã lưu
      </NuxtLink>
    </div>
  </div>
</template>
