<script setup lang="ts">
interface Props {
    trademark: any
}

const props = defineProps<Props>()
</script>

<template>
    <div v-if="trademark.yeu_to_loai_tru_new?.noi_dung_loai_tru"
        class="bg-amber-50 dark:bg-amber-900/20 rounded-2xl shadow-sm border border-amber-200 dark:border-amber-800 p-6">
        <h2 class="text-xl font-bold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Yếu tố loại trừ
        </h2>
        <p class="text-amber-800 dark:text-amber-200 leading-relaxed">
            {{ trademark.yeu_to_loai_tru_new.noi_dung_loai_tru }}
        </p>
    </div>
</template>
