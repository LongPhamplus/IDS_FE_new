<script setup lang="ts">
import { BookmarkIcon as BookmarkOutline } from '@heroicons/vue/24/outline'
import { BookmarkIcon as BookmarkSolid } from '@heroicons/vue/24/solid'
import type { Trademark } from '~/types'
import { useAuthStore } from '~/stores/auth'
import { useFavoritesStore } from '~/stores/favorites'

interface Props {
  trademarks: Trademark[]
}

const props = defineProps<Props>()

const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()

const isFavorite = (id: any) => favoritesStore.isFavorite(id)
const saving = ref<Record<string, boolean>>({})

const toggleFavorite = async (trademark: Trademark) => {
  if (!authStore.isAuthenticated) {
    navigateTo('/login')
    return
  }

  saving.value[trademark.id] = true
  try {
    if (isFavorite(trademark.id)) {
      await favoritesStore.removeFavorite(trademark.id)
    } else {
      await favoritesStore.addFavorite(trademark)
    }
  } catch (error) {
    console.error('Failed to toggle favorite:', error)
  } finally {
    saving.value[trademark.id] = false
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
  <div class="card overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Nhãn hiệu
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Tên
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Chủ đơn
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Mã nhóm
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Trạng thái
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Số đơn
            </th>
            <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr 
            v-for="trademark in trademarks" 
            :key="trademark.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <!-- Image -->
            <td class="px-6 py-4">
              <NuxtLink :to="`/trademarks/${trademark.so_don}`">
                <div class="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                  <img 
                    v-if="trademark.imageUrl" 
                    :src="trademark.imageUrl" 
                    :alt="trademark.name"
                    class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <span class="text-xl font-bold text-gray-400 dark:text-gray-600">{{ trademark.name.charAt(0) }}</span>
                  </div>
                </div>
              </NuxtLink>
            </td>

            <!-- Name -->
            <td class="px-6 py-4">
              <NuxtLink 
                :to="`/trademarks/${trademark.so_don}`"
                class="font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {{ trademark.name }}
              </NuxtLink>
            </td>

            <!-- Owner -->
            <td class="px-6 py-4">
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ trademark.owner }}</span>
            </td>

            <!-- Class -->
            <td class="px-6 py-4">
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ trademark.class }}</span>
            </td>

            <!-- Status -->
            <td class="px-6 py-4">
              <span 
                class="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                :class="getStatusColor(trademark.status)"
              >
                {{ trademark.status }}
              </span>
            </td>

            <!-- Registration Number -->
            <td class="px-6 py-4">
              <span class="text-sm font-mono text-gray-700 dark:text-gray-300">
                {{ trademark.so_don || 'N/A' }}
              </span>
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end space-x-3">
                <button
                  @click="toggleFavorite(trademark)"
                  :disabled="saving[trademark.id]"
                  class="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none"
                  :class="{ 'opacity-50 cursor-not-allowed': saving[trademark.id] }"
                >
                  <BookmarkSolid v-if="isFavorite(trademark.id)" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <BookmarkOutline v-else class="h-5 w-5" />
                </button>
                <NuxtLink
                  :to="`/trademarks/${trademark.so_don}`"
                  class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                >
                  View →
                </NuxtLink>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
