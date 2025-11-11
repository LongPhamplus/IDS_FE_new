<script setup lang="ts">
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import type { SearchParams, TrademarkStatus, IPType } from '~/types'

interface Props {
  modelValue: SearchParams
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: SearchParams]
  search: []
}>()

const isExpanded = ref(false)

const searchParams = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const statusOptions: { value: TrademarkStatus; label: string }[] = [
  { value: 'granted', label: 'Cấp bằng' },
  { value: 'examining', label: 'Đang kiểm tra' },
  { value: 'cancelled', label: 'Hủy' },
  { value: 'expired', label: 'Hết hạn' },
  { value: 'rejected', label: 'Từ chối' }
]

const typeOptions: { value: IPType; label: string }[] = [
  { value: 'trademark', label: 'Nhãn hiệu' },
  { value: 'patent', label: 'Sáng chế' }
]

const toggleAdvanced = () => {
  isExpanded.value = !isExpanded.value
}

const clearFilters = () => {
  searchParams.value = {
    q: searchParams.value.q,
    page: 1,
    limit: 12
  }
}

const handleSearch = () => {
  emit('search')
}

const hasFilters = computed(() => {
  return !!(searchParams.value.owner || searchParams.value.status || searchParams.value.type)
})
</script>

<template>
  <div class="space-y-4">
    <!-- Main Search Bar -->
    <div class="relative glass-effect rounded-2xl shadow-lg p-2">
      <div class="flex items-center gap-2">
        <div class="flex-1 relative">
          <input
            v-model="searchParams.q"
            type="text"
            placeholder="Nhập số đơn hoặc tên nhãn hiệu..."
            @keyup.enter="handleSearch"
            class="w-full pl-4 pr-4 py-3 text-base bg-transparent border-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
          />
        </div>
        
        <button
          @click="toggleAdvanced"
          class="px-4 py-3 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors flex items-center gap-2"
          :class="{ 'bg-primary-50 dark:bg-primary-900/20': isExpanded }"
        >
          <span>Nâng cao</span>
          <ChevronDownIcon v-if="!isExpanded" class="h-4 w-4" />
          <ChevronUpIcon v-else class="h-4 w-4" />
        </button>
        
        <button
          @click="handleSearch"
          class="btn-primary px-8 py-3"
        >
          Tìm kiếm
        </button>
      </div>
    </div>

    <!-- Advanced Filters -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="isExpanded" class="card p-6 space-y-4 animate-slide-up">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Tìm kiếm nâng cao
          </h3>
          <button
            v-if="hasFilters"
            @click="clearFilters"
            class="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1"
          >
            <XMarkIcon class="h-4 w-4" />
            Xóa bộ lọc
          </button>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <!-- Chủ đơn -->
          <div>
            <label for="owner" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chủ đơn
            </label>
            <input
              id="owner"
              v-model="searchParams.owner"
              type="text"
              placeholder="Nhập tên chủ đơn..."
              class="input-field"
            />
          </div>

          <!-- Trạng thái -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Trạng thái
            </label>
            <select
              id="status"
              v-model="searchParams.status"
              class="input-field"
            >
              <option value="">Tất cả trạng thái</option>
              <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
          </div>

          <!-- Loại -->
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loại sở hữu trí tuệ
            </label>
            <select
              id="type"
              v-model="searchParams.type"
              class="input-field"
            >
              <option value="">Tất cả loại</option>
              <option v-for="type in typeOptions" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>

          <!-- Class (existing) -->
          <div>
            <label for="class" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phân loại
            </label>
            <input
              id="class"
              v-model="searchParams.class"
              type="text"
              placeholder="Nhập mã phân loại..."
              class="input-field"
            />
          </div>
        </div>

        <!-- Filter Summary -->
        <div v-if="hasFilters" class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-wrap gap-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">Bộ lọc đang áp dụng:</span>
            
            <span v-if="searchParams.owner" class="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
              Chủ đơn: {{ searchParams.owner }}
              <button @click="searchParams.owner = ''" class="hover:text-primary-900 dark:hover:text-primary-100">
                <XMarkIcon class="h-3 w-3" />
              </button>
            </span>
            
            <span v-if="searchParams.status" class="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
              Trạng thái: {{ statusOptions.find(s => s.value === searchParams.status)?.label }}
              <button @click="searchParams.status = ''" class="hover:text-primary-900 dark:hover:text-primary-100">
                <XMarkIcon class="h-3 w-3" />
              </button>
            </span>
            
            <span v-if="searchParams.type" class="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
              Loại: {{ typeOptions.find(t => t.value === searchParams.type)?.label }}
              <button @click="searchParams.type = ''" class="hover:text-primary-900 dark:hover:text-primary-100">
                <XMarkIcon class="h-3 w-3" />
              </button>
            </span>
            
            <span v-if="searchParams.class" class="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
              Phân loại: {{ searchParams.class }}
              <button @click="searchParams.class = ''" class="hover:text-primary-900 dark:hover:text-primary-100">
                <XMarkIcon class="h-3 w-3" />
              </button>
            </span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
