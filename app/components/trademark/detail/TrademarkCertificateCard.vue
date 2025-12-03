<script setup lang="ts">
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'
import type { Trademark } from '~/types'

const { formatDate } = useTrademarkHelpers()

interface Props {
    trademark: Trademark
}

const props = defineProps<Props>()
const showCertificateSection = ref(false)

const toggleCertificateSection = () => {
    showCertificateSection.value = !showCertificateSection.value
}
</script>

<template>
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Thông tin cấp bằng
            </h2>
            <span
                class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
                Đã cấp bằng
            </span>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Số bằng</h3>
                <p class="text-lg text-gray-900 dark:text-gray-100 font-mono">{{ trademark.so_bang }}</p>
            </div>

            <div v-if="trademark.ngay_cap || trademark.registrationDate">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Ngày cấp</h3>
                <p class="text-lg text-gray-900 dark:text-gray-100">{{ formatDate(trademark.ngay_cap ||
                    trademark.registrationDate) }}</p>
            </div>

            <div v-if="trademark.ngay_het_han || trademark.expiryDate">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Ngày hết hạn</h3>
                <p class="text-lg text-gray-900 dark:text-gray-100">{{ formatDate(trademark.ngay_het_han ||
                    trademark.expiryDate) }}</p>
            </div>

            <div v-if="trademark.so_cong_bo">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Số công bố</h3>
                <p class="text-lg text-gray-900 dark:text-gray-100 font-mono">{{ trademark.so_cong_bo }}</p>
            </div>

            <div v-if="trademark.ngay_cong_bo">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Ngày công bố</h3>
                <p class="text-lg text-gray-900 dark:text-gray-100">{{ formatDate(trademark.ngay_cong_bo) }}</p>
            </div>

            <div v-if="trademark.so_don_goc">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Số đơn gốc</h3>
                <p class="text-lg text-gray-900 dark:text-gray-100 font-mono">{{ trademark.so_don_goc }}</p>
            </div>
        </div>

        <!-- Certificate-specific fields -->
        <div v-if="trademark.ten_nhan_hieu_cb || trademark.mau_sac_cb || trademark.phan_loai_hinh_cb"
            class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Thông tin theo bằng cấp</h3>
            <div class="grid md:grid-cols-2 gap-6">
                <div v-if="trademark.ten_nhan_hieu_cb">
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tên nhãn hiệu (cấp bằng)</h4>
                    <p class="text-base text-gray-900 dark:text-gray-100">{{ trademark.ten_nhan_hieu_cb }}</p>
                </div>

                <div v-if="trademark.mau_sac_cb">
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Màu sắc (cấp bằng)</h4>
                    <p class="text-base text-gray-900 dark:text-gray-100">{{ trademark.mau_sac_cb }}</p>
                </div>

                <div v-if="trademark.phan_loai_hinh_cb" class="md:col-span-2">
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phân loại hình (cấp bằng)</h4>
                    <p class="text-base text-gray-900 dark:text-gray-100 font-mono text-sm">{{
                        trademark.phan_loai_hinh_cb }}</p>
                </div>
            </div>
        </div>

        <!-- Thông tin đại diện cấp bằng -->
        <div v-if="trademark.dai_dien_cb" class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Đại diện SHCN (cấp bằng)
            </h3>
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                <p class="font-semibold text-gray-900 dark:text-gray-100">{{ trademark.dai_dien_cb.ten_dai_dien || 'N/A'
                    }}</p>
                <p v-if="trademark.dai_dien_cb.dia_chi_dai_dien" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {{ trademark.dai_dien_cb.dia_chi_dai_dien }}
                </p>
            </div>
        </div>

        <!-- Nhóm dịch vụ cấp bằng -->
        <div v-if="trademark.nhom_dich_vu_cb && trademark.nhom_dich_vu_cb.length > 0"
            class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button @click="toggleCertificateSection"
                class="w-full flex items-center justify-between mb-6 hover:opacity-80 transition-opacity">
                <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Nhóm sản phẩm / Dịch vụ (cấp bằng)
                    </h3>
                    <span
                        class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-semibold">
                        {{ trademark.nhom_dich_vu_cb.length }} nhóm
                    </span>
                </div>
                <component :is="showCertificateSection ? ChevronUpIcon : ChevronDownIcon"
                    class="h-6 w-6 text-gray-500 dark:text-gray-400 transition-transform" />
            </button>

            <transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-[2000px]" leave-active-class="transition-all duration-300 ease-in"
                leave-from-class="opacity-100 max-h-[2000px]" leave-to-class="opacity-0 max-h-0">
                <div v-show="showCertificateSection" class="overflow-hidden">
                    <div class="space-y-3">
                        <div v-for="(nhom, idx) in trademark.nhom_dich_vu_cb" :key="idx"
                            class="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-300 dark:hover:border-green-700 transition-colors">
                            <div class="flex items-start gap-3">
                                <div
                                    class="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <span class="text-lg font-bold text-green-600 dark:text-green-400">
                                        {{ nhom.ma_nhom || 'N/A' }}
                                    </span>
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-semibold text-gray-900 dark:text-gray-100">
                                        Nhóm {{ nhom.ma_nhom || 'N/A' }}
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
</template>
