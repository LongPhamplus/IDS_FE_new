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

// Try to get handlers from parent pages
const handleFavoriteAction = inject('handleFavoriteAction', null) as ((trademark: any, action: 'add' | 'remove') => void) | null
const handleRemoveFavorite = inject('handleRemoveFavorite', null) as ((trademark: any) => void) | null

const toggleFavorite = async () => {
  if (!authStore.isAuthenticated) {
    navigateTo('/login')
    return
  }

  if (handleFavoriteAction) {
    const action = isFavorite.value ? 'remove' : 'add'
    handleFavoriteAction(props.trademark, action)
    return
  }

  if (handleRemoveFavorite && isFavorite.value) {
    handleRemoveFavorite(props.trademark)
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
    'cấp bằng': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'đang giải quyết': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'từ chối': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    'hủy': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'hết hạn': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    'rút đơn': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
  if (!status) return colors.pending
  return colors[status.toLowerCase()] || colors['đang giải quyết']
}
</script>

<template>
  <div class="card overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col">
    <!-- Image -->
    <NuxtLink :to="`/trademarks/${trademark.so_don || trademark.registrationNumber || trademark.id}`"
      class="block relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden flex-shrink-0">
      <img v-if="trademark.imageUrl" :src="trademark.imageUrl" :alt="trademark.name || 'Trademark'"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
      <div v-else class="w-full h-full flex items-center justify-center">
        <span class="text-4xl font-bold text-gray-400 dark:text-gray-600">{{ trademark.name?.charAt(0) || '?' }}</span>
      </div>
      <!-- Overlay gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      </div>
    </NuxtLink>

    <div class="p-6 flex flex-col flex-1">
      <div class="flex items-start justify-between mb-4">
        <NuxtLink :to="`/trademarks/${trademark.so_don || trademark.registrationNumber || trademark.id}`"
          class="flex-1">
          <h3
            class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
            {{ trademark.name || 'N/A' }}
          </h3>
        </NuxtLink>

        <button @click="toggleFavorite" :disabled="saving"
          class="ml-4 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none"
          :class="{ 'opacity-50 cursor-not-allowed': saving }">
          <BookmarkSolid v-if="isFavorite" class="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <BookmarkOutline v-else class="h-6 w-6" />
        </button>
      </div>

      <div class="space-y-2 mt-4 flex-1">
        <div class="flex items-center text-sm">
          <span class="text-gray-500 dark:text-gray-400 w-24">Mã nhóm:</span>
          <span class="text-gray-900 dark:text-gray-100 font-medium">{{ trademark.class || 'N/A' }}</span>
        </div>

        <div class="flex items-center text-sm">
          <span class="text-gray-500 dark:text-gray-400 w-24">Chủ đơn:</span>
          <span class="text-gray-900 dark:text-gray-100">{{ trademark.owner || 'N/A' }}</span>
        </div>

        <div class="flex items-center text-sm">
          <span class="text-gray-500 dark:text-gray-400 w-24">Trạng thái:</span>
          <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getStatusColor(trademark.status)">
            {{ trademark.status || 'N/A' }}
          </span>
        </div>

        <div v-if="trademark.so_don || trademark.registrationNumber" class="flex items-center text-sm">
          <span class="text-gray-500 dark:text-gray-400 w-24">Số đơn:</span>
          <span class="text-gray-900 dark:text-gray-100 font-mono text-xs">{{ trademark.so_don ||
            trademark.registrationNumber }}</span>
        </div>
      </div>

      <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <NuxtLink :to="`/trademarks/${trademark.so_don || trademark.registrationNumber || trademark.id}`"
          class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium">
          View Details →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
