<script setup lang="ts">
interface Props {
    trademark: any
}

const props = defineProps<Props>()
</script>

<template>
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Đặc điểm nhãn hiệu
        </h2>
        <div class="space-y-4">
            <div v-if="trademark.loai_nhan_hieu">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Loại nhãn hiệu</p>
                <p class="text-base font-medium text-gray-900 dark:text-gray-100">{{ trademark.loai_nhan_hieu }}</p>
            </div>

            <div v-if="trademark.mau_sac">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Màu sắc</p>
                <p class="text-base text-gray-700 dark:text-gray-300">{{ trademark.mau_sac }}</p>
            </div>

            <div v-if="trademark.phan_loai_hinh">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Phân loại hình</p>
                <p class="text-base text-gray-700 dark:text-gray-300 font-mono text-sm">{{ trademark.phan_loai_hinh }}
                </p>
            </div>
        </div>
    </div>
</template>
