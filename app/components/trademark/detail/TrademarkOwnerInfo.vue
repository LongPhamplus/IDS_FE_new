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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Chủ sở hữu
        </h2>
        <div class="space-y-3">
            <div v-if="trademark.chu_don?.ten_chu_don">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Tên chủ đơn</p>
                <p class="text-base font-medium text-gray-900 dark:text-gray-100">{{ trademark.chu_don.ten_chu_don }}
                </p>
            </div>
            <div v-if="trademark.chu_don?.dia_chi_chu_don">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Địa chỉ</p>
                <p class="text-base text-gray-700 dark:text-gray-300">{{ trademark.chu_don.dia_chi_chu_don }}</p>
            </div>
        </div>
    </div>
</template>
