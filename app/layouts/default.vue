<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useFavoritesStore } from '~/stores/favorites'
import { useDarkMode } from '~/composables/useDarkMode'

const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()
const { initDarkMode } = useDarkMode()

onMounted(() => {
  // Initialize auth and dark mode
  authStore.initAuth()
  initDarkMode()
  
  // Fetch favorites if authenticated
  if (authStore.isAuthenticated) {
    favoritesStore.fetchFavorites()
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <LayoutNavbar />
    
    <main class="flex-1">
      <slot />
    </main>
    
    <LayoutFooter />
  </div>
</template>
