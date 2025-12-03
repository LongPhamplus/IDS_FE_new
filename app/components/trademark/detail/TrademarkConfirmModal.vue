<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import type { Trademark } from '~/types'

interface Props {
    show: boolean
    action: 'add' | 'remove'
    trademark?: Trademark | null
    saving: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
    confirm: []
    cancel: []
}>()
</script>

<template>
    <Teleport to="body">
        <Transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                @click.self="emit('cancel')">
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
                    <div class="flex items-center gap-4 mb-4">
                        <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" :class="action === 'add'
                            ? 'bg-primary-100 dark:bg-primary-900/30'
                            : 'bg-red-100 dark:bg-red-900/30'">
                            <ExclamationTriangleIcon class="h-6 w-6" :class="action === 'add'
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-red-600 dark:text-red-400'" />
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {{ action === 'add' ? 'Xác nhận lưu đơn' : 'Xác nhận hủy lưu đơn' }}
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ action === 'add' ? 'Bạn có chắc muốn lưu đơn này?' : 'Bạn có chắc muốn hủy lưu đơn này khỏi danh sách?' }}
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
                        <button @click="emit('cancel')"
                            class="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors">
                            Hủy
                        </button>
                        <button @click="emit('confirm')" :disabled="saving"
                            class="flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                            :class="action === 'add'
                                ? 'bg-primary-600 hover:bg-primary-700'
                                : 'bg-red-600 hover:bg-red-700'">
                            {{ saving ? 'Đang xử lý...' : (action === 'add' ? 'Lưu đơn' : 'Hủy lưu đơn') }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
