<script setup lang="ts">
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'

interface Props {
    service: any
    index: number
    expanded: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
    toggle: []
}>()
</script>

<template>
    <div class="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-colors"
        :class="expanded ? 'border-primary-500 dark:border-primary-500' : ''">
        <button @click="emit('toggle')" class="w-full p-5 flex items-start gap-4 transition-colors text-left">
            <div
                class="flex-shrink-0 w-16 h-16 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {{ service?.ma_nhom || 'N/A' }}
                </span>
            </div>
            <div class="flex-1">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Mã nhóm: {{ service?.ma_nhom || 'N/A' }}
                    </h3>
                    <component :is="expanded ? ChevronUpIcon : ChevronDownIcon"
                        class="h-6 w-6 text-gray-500 dark:text-gray-400 transition-transform flex-shrink-0" />
                </div>
                <p v-if="!expanded && service?.mo_ta_dich_vu"
                    class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {{ service?.mo_ta_dich_vu }}
                </p>
            </div>
        </button>

        <transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-[500px]" leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 max-h-[500px]" leave-to-class="opacity-0 max-h-0">
            <div v-show="expanded" class="px-5 pb-5 overflow-hidden">
                <div v-if="service?.mo_ta_dich_vu" class="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mô tả dịch vụ:</p>
                    <p
                        class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-4 border-l-2 border-primary-300 dark:border-primary-700">
                        {{ service?.mo_ta_dich_vu }}
                    </p>
                </div>
            </div>
        </transition>
    </div>
</template>
