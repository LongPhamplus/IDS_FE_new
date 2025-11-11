<script setup lang="ts">
interface Props {
  count?: number
  type?: 'card' | 'list' | 'detail'
}

const props = withDefaults(defineProps<Props>(), {
  count: 3,
  type: 'card'
})
</script>

<template>
  <div class="space-y-4">
    <!-- Card Skeleton -->
    <div v-if="type === 'card'" v-for="n in count" :key="n" class="card p-6 animate-pulse">
      <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div class="space-y-2">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
    </div>

    <!-- List Skeleton -->
    <div v-if="type === 'list'" v-for="n in count" :key="n" class="flex items-center space-x-4 p-4 animate-pulse">
      <div class="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div class="flex-1 space-y-2">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Detail Skeleton -->
    <div v-if="type === 'detail'" class="animate-pulse">
      <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
      <div class="space-y-4">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>
  </div>
</template>
