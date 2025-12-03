<script setup lang="ts">
const { getStatusColor } = useTrademarkHelpers()

interface Props {
    trademark: any
}

const props = defineProps<Props>()
</script>

<template>
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-start justify-between gap-4 mb-6">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {{ trademark.name || trademark.ten_nhan_hieu || 'Không có tên' }}
            </h1>
            <!-- Status Badge - Prominent Position -->
            <span class="px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap flex-shrink-0"
                :class="getStatusColor(trademark.status || trademark.trang_thai)">
                {{ trademark.status || trademark.trang_thai || 'N/A' }}
            </span>
        </div>

        <!-- Key Information Grid -->
        <div class="grid sm:grid-cols-2 gap-6">
            <!-- Application Number -->
            <div class="space-y-1">
                <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    <span class="font-medium">Số đơn</span>
                </div>
                <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {{ trademark.so_don || 'N/A' }}
                </p>
            </div>

            <!-- Registration Number -->
            <div class="space-y-1" v-if="trademark.so_bang">
                <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="font-medium">Số đăng ký</span>
                </div>
                <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {{ trademark.so_bang }}
                </p>
            </div>

            <!-- Filing Date -->
            <div class="space-y-1" v-if="trademark.ngay_nop_don">
                <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="font-medium">Ngày nộp đơn</span>
                </div>
                <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {{ new Date(trademark.ngay_nop_don).toLocaleDateString('vi-VN') }}
                </p>
            </div>

            <!-- Registration/Grant Date -->
            <div class="space-y-1" v-if="trademark.ngay_cap">
                <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-medium">Ngày cấp bằng</span>
                </div>
                <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {{ new Date(trademark.ngay_cap).toLocaleDateString('vi-VN') }}
                </p>
            </div>

            <!-- Expiry Date -->
            <div class="space-y-1" v-if="trademark.ngay_het_han">
                <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-medium">Ngày hết hạn</span>
                </div>
                <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {{ new Date(trademark.ngay_het_han).toLocaleDateString('vi-VN') }}
                </p>
            </div>

            <!-- Publication Number -->
            <div class="space-y-1" v-if="trademark.so_cong_bo">
                <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <span class="font-medium">Số công bố</span>
                </div>
                <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {{ trademark.so_cong_bo }}
                </p>
            </div>

            <!-- Publication Date -->
            <div class="space-y-1" v-if="trademark.ngay_cong_bo">
                <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span class="font-medium">Ngày công bố</span>
                </div>
                <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {{ new Date(trademark.ngay_cong_bo).toLocaleDateString('vi-VN') }}
                </p>
            </div>

            <!-- Application Type -->
            <div class="space-y-1" v-if="trademark.loai_don">
                <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span class="font-medium">Loại đơn</span>
                </div>
                <p class="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
                    {{ trademark.loai_don.replace('_', ' ') }}
                </p>
            </div>
        </div>
    </div>
</template>
