<script setup lang="ts">
const { formatDate } = useTrademarkHelpers()

interface Props {
    item: any
    index: number
}

const props = defineProps<Props>()
</script>

<template>
    <div class="relative pl-20">
        <!-- Timeline dot -->
        <div
            class="absolute left-6 w-5 h-5 rounded-full bg-primary-500 border-4 border-white dark:border-gray-900 shadow-lg">
        </div>

        <!-- Content card -->
        <div class="card p-5 hover:shadow-lg transition-shadow">
            <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-3">
                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {{ formatDate(item.ngay_xu_ly) }}
                        </span>
                    </div>
                    <p class="text-base text-gray-900 dark:text-gray-100 leading-relaxed">
                        {{ item.noi_dung_xu_ly }}
                    </p>
                </div>
                <div class="flex-shrink-0 ml-4">
                    <span
                        class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold text-sm">
                        {{ index + 1 }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
