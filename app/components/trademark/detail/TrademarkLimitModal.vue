<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

interface Props {
    show: boolean
    currentCount: number
    limit: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
    close: []
}>()
</script>

<template>
    <Teleport to="body">
        <Transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                @click.self="emit('close')">
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
                    <div class="flex items-center gap-4 mb-4">
                        <div
                            class="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <ExclamationTriangleIcon class="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Đã đạt giới hạn lưu đơn
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                Bạn đã lưu {{ limit }} đơn (giới hạn tối đa)
                            </p>
                        </div>
                    </div>

                    <div
                        class="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <p class="text-sm text-amber-800 dark:text-amber-200 mb-3">
                            💡 <strong>Gợi ý:</strong> Hủy lưu một số đơn cũ để có thể lưu đơn mới, hoặc nâng cấp tài
                            khoản để tăng giới hạn.
                        </p>
                        <div class="text-xs text-amber-700 dark:text-amber-300">
                            Đã sử dụng: {{ currentCount }}/{{ limit }}
                        </div>
                    </div>

                    <div class="flex gap-3">
                        <button @click="emit('close')"
                            class="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors">
                            Đóng
                        </button>
                        <NuxtLink to="/saved" @click="emit('close')"
                            class="flex-1 px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors text-center">
                            Quản lý đơn đã lưu
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
