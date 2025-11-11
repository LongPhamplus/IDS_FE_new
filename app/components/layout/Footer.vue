<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          © {{ currentYear }} Trademark Search. All rights reserved.
        </div>
        
        <div class="flex space-x-6">
          <NuxtLink
            to="/about"
            class="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            About
          </NuxtLink>
          <NuxtLink
            to="/privacy"
            class="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Privacy
          </NuxtLink>
          <NuxtLink
            to="/terms"
            class="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Terms
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
