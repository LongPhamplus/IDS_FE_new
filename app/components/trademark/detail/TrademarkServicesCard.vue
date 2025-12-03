<script setup lang="ts">
import type { Trademark } from '~/types'

interface Props {
    trademark: Trademark
}

const props = defineProps<Props>()
const expandedServices = ref<Record<number, boolean>>({})
const toggleService = (index: number) => {
    expandedServices.value[index] = !expandedServices.value[index]
}
</script>

<template>
    <div class="card p-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Nhóm sản phẩm / Dịch vụ
            <span class="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                ({{ trademark.nhom_dich_vu.length }} nhóm)
            </span>
        </h2>
        <div class="space-y-4">
            <TrademarkDetailTrademarkServiceItem v-for="(nhom, idx) in trademark.nhom_dich_vu" :key="idx" :service="nhom" :index="idx"
                :expanded="!!expandedServices[idx]" @toggle="toggleService(idx)" />
        </div>
    </div>
</template>
