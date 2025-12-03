<script setup lang="ts">
import { ClockIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'

interface Props {
    progress: any[]
}

const props = defineProps<Props>()
const showProgress = ref(false)

const toggleProgress = () => {
    showProgress.value = !showProgress.value
}
</script>

<template>
    <div class="card p-8">
        <button @click="toggleProgress"
            class="w-full flex items-center justify-between mb-6 hover:opacity-80 transition-opacity">
            <div class="flex items-center gap-3">
                <ClockIcon class="h-8 w-8 text-primary-500" />
                <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Tiến trình xử lý
                </h2>
                <span
                    class="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold">
                    {{ progress.length }} bước
                </span>
            </div>
            <component :is="showProgress ? ChevronUpIcon : ChevronDownIcon"
                class="h-6 w-6 text-gray-500 dark:text-gray-400 transition-transform" />
        </button>

        <transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-[2000px]" leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 max-h-[2000px]" leave-to-class="opacity-0 max-h-0">
            <div v-show="showProgress" class="relative overflow-hidden">
                <!-- Timeline line -->
                <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                <!-- Progress items -->
                <div class="space-y-6">
                    <TrademarkDetailTrademarkProgressItem v-for="(item, index) in progress" :key="item.id" :item="item"
                        :index="index" />
                </div>
            </div>
        </transition>
    </div>
</template>
