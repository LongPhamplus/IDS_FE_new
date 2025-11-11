<script setup lang="ts">
import { BookmarkIcon as BookmarkOutline } from '@heroicons/vue/24/outline'
import { BookmarkIcon as BookmarkSolid } from '@heroicons/vue/24/solid'
import type { Trademark } from '~/types'
import { useAuthStore } from '~/stores/auth'
import { useFavoritesStore } from '~/stores/favorites'

interface Props {
  trademark: Trademark
}

const props = defineProps<Props>()

const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()

const isFavorite = computed(() => favoritesStore.isFavorite(props.trademark.id))
const saving = ref(false)

const toggleFavorite = async () => {
  if (!authStore.isAuthenticated) {
    navigateTo('/login')
    return
  }

  saving.value = true
  try {
    if (isFavorite.value) {
      await favoritesStore.removeFavorite(props.trademark.id)
    } else {
      await favoritesStore.addFavorite(props.trademark)
    }
  } catch (error) {
    console.error('Failed to toggle favorite:', error)
  } finally {
    saving.value = false
  }
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    granted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    examining: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    expired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return colors[status.toLowerCase()] || colors.pending
}
</script>

<template>
  <div class="card overflow-hidden hover:shadow-2xl transition-all duration-300 group">
    <!-- Image -->
    <NuxtLink :to="`/trademarks/${trademark.registrationNumber || trademark.id}`" class="block relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
      <img 
        v-if="trademark.imageUrl" 
        :src="trademark.imageUrl" 
        :alt="trademark.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <span class="text-4xl font-bold text-gray-400 dark:text-gray-600">{{ trademark.name.charAt(0) }}</span>
      </div>
      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </NuxtLink>

    <div class="p-6">
      <div class="flex items-start justify-between mb-4">
        <NuxtLink :to="`/trademarks/${trademark.registrationNumber || trademark.id}`" class="flex-1">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
            {{ trademark.name }}
          </h3>
        </NuxtLink>
      
        <button
          @click="toggleFavorite"
          :disabled="saving"
          class="ml-4 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none"
          :class="{ 'opacity-50 cursor-not-allowed': saving }"
        >
          <BookmarkSolid v-if="isFavorite" class="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <BookmarkOutline v-else class="h-6 w-6" />
        </button>
      </div>

      <div class="space-y-2 mt-4">
      <div class="flex items-center text-sm">
        <span class="text-gray-500 dark:text-gray-400 w-24">Mã nhóm:</span>
        <span class="text-gray-900 dark:text-gray-100 font-medium">{{ trademark.class }}</span>
      </div>
      
      <div class="flex items-center text-sm">
        <span class="text-gray-500 dark:text-gray-400 w-24">Owner:</span>
        <span class="text-gray-900 dark:text-gray-100">{{ trademark.owner }}</span>
      </div>
      
      <div class="flex items-center text-sm">
        <span class="text-gray-500 dark:text-gray-400 w-24">Status:</span>
        <span 
          class="px-2 py-1 rounded-full text-xs font-medium"
          :class="getStatusColor(trademark.status)"
        >
          {{ trademark.status }}
        </span>
      </div>

        <div v-if="trademark.registrationNumber" class="flex items-center text-sm">
          <span class="text-gray-500 dark:text-gray-400 w-24">Reg. No:</span>
          <span class="text-gray-900 dark:text-gray-100 font-mono text-xs">{{ trademark.registrationNumber }}</span>
        </div>
      </div>

      <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <NuxtLink
          :to="`/trademarks/${trademark.registrationNumber || trademark.id}`"
          class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
        >
          View Details →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
