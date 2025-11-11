<script setup lang="ts">
import { PlusIcon, SparklesIcon } from '@heroicons/vue/24/outline'
import { useFavoritesStore } from '~/stores/favorites'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'auth'
})

const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()

const loading = ref(false)
const upgrading = ref(false)

const isDemoUser = computed(() => authStore.user?.email === 'demo@example.com')

const refreshFavorites = async () => {
  loading.value = true
  try {
    await favoritesStore.fetchFavorites()
  } catch (error) {
    console.error('Failed to refresh favorites:', error)
  } finally {
    loading.value = false
  }
}

const handleUpgrade = () => {
  upgrading.value = true
  
  // Simulate upgrade process
  setTimeout(() => {
    favoritesStore.increaseFavoriteLimit(10) // Increase by 10
    upgrading.value = false
  }, 1000)
}

onMounted(() => {
  refreshFavorites()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Saved Trademarks
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Your collection of favorite trademarks
        </p>
      </div>

      <button
        @click="refreshFavorites"
        :disabled="loading"
        class="btn-secondary"
      >
        <span v-if="loading">Refreshing...</span>
        <span v-else>Refresh</span>
      </button>
    </div>

    <!-- Loading state -->
    <UiLoadingSkeleton v-if="favoritesStore.loading && favoritesStore.favorites.length === 0" :count="6" type="card" />

    <!-- Error message -->
    <div
      v-else-if="favoritesStore.error"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6"
    >
      {{ favoritesStore.error }}
    </div>

    <!-- Empty state -->
    <UiEmptyState
      v-else-if="favoritesStore.favorites.length === 0"
      title="No saved trademarks yet"
      description="Start searching for trademarks and save your favorites to see them here"
      icon="bookmark"
    >
      <template #action>
        <NuxtLink to="/search" class="btn-primary">
          Start Searching
        </NuxtLink>
      </template>
    </UiEmptyState>

    <!-- Favorites grid -->
    <div v-else>
      <!-- Limit Info & Upgrade Card -->
      <div class="mb-6 card p-6 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-2 border-primary-200 dark:border-primary-800">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
                Giới hạn đơn lưu
              </h3>
              <span 
                :class="[
                  'px-3 py-1 rounded-full text-sm font-semibold',
                  favoritesStore.isLimitReached 
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                ]"
              >
                {{ favoritesStore.favoritesCount }} / {{ favoritesStore.favoriteLimit }}
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              <span v-if="favoritesStore.isLimitReached" class="text-red-600 dark:text-red-400 font-medium">
                Bạn đã đạt giới hạn! Nâng cấp để lưu thêm nhiều đơn hơn.
              </span>
              <span v-else>
                Còn lại <span class="font-semibold text-gray-900 dark:text-gray-100">{{ favoritesStore.remainingSlots }}</span> slot
              </span>
            </p>
          </div>
          
          <button
            v-if="!favoritesStore.isPremium"
            @click="handleUpgrade"
            :disabled="upgrading"
            class="btn-primary flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700"
          >
            <SparklesIcon class="h-5 w-5" />
            <span v-if="upgrading">Đang nâng cấp...</span>
            <span v-else>Tăng giới hạn +10</span>
          </button>
        </div>
      </div>

      <!-- Favorites grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TrademarkCard
          v-for="trademark in favoritesStore.favorites"
          :key="trademark.id"
          :trademark="trademark"
        />
      </div>
    </div>
  </div>
</template>
