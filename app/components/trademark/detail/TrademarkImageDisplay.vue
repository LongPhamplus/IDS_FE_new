<script setup lang="ts">
interface Props {
    trademark: any
    isFavorite: boolean
    saving: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
    toggleFavorite: []
    openImageModal: []
}>()
</script>

<template>
    <div class="sticky top-8 space-y-4">
        <!-- Image Container -->
        <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <!-- Image Display -->
            <div
                class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-8">
                <img v-if="trademark.imageUrl" :src="trademark.imageUrl"
                    :alt="trademark.name || trademark.ten_nhan_hieu" class="max-w-full max-h-full object-contain" />
                <div v-else class="text-center">
                    <div
                        class="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span class="text-4xl font-bold text-gray-400 dark:text-gray-500">
                            {{ (trademark.name || trademark.ten_nhan_hieu)?.charAt(0) || '?' }}
                        </span>
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Không có hình ảnh</p>
                </div>
            </div>

            <!-- Image Actions -->
            <div class="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <button v-if="trademark.imageUrl" @click="emit('openImageModal')"
                    class="w-full px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    Xem ảnh gốc
                </button>

                <button v-if="trademark.imageUrl"
                    class="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Tải xuống ảnh
                </button>

                <button @click="emit('toggleFavorite')" :disabled="saving"
                    class="w-full px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                    :class="isFavorite
                        ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'">
                    <svg class="w-5 h-5" :class="{ 'fill-current': isFavorite }" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    {{ isFavorite ? 'Đã lưu' : 'Lưu đơn' }}
                </button>
            </div>
        </div>
    </div>
</template>
