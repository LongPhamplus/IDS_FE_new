<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { 
  MagnifyingGlassIcon, 
  BookmarkIcon, 
  UserCircleIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth'
import { useFavoritesStore } from '~/stores/favorites'
import { useNotificationStore } from '~/stores/notifications'
import { useDarkMode } from '~/composables/useDarkMode'

const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()
const notificationStore = useNotificationStore()
const { isDark, toggleDarkMode } = useDarkMode()

// Fetch notifications on mount if authenticated
onMounted(() => {
  if (authStore.isAuthenticated) {
    notificationStore.fetchNotifications()
  }
})

const mobileMenuOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
  mobileMenuOpen.value = false
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and primary nav -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <div class="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">IDS</span>
            </div>
            <span class="text-xl font-bold text-gray-900 dark:text-gray-100 hidden sm:block">
              Trademark Search
            </span>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <div class="hidden md:ml-10 md:flex md:space-x-8">
            <NuxtLink
              to="/search"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              active-class="text-primary-600 dark:text-primary-400 border-b-2 border-primary-600"
            >
              <MagnifyingGlassIcon class="h-5 w-5 mr-1" />
              Search
            </NuxtLink>

            <NuxtLink
              v-if="authStore.isAuthenticated"
              to="/saved"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors relative"
              active-class="text-primary-600 dark:text-primary-400 border-b-2 border-primary-600"
            >
              <BookmarkIcon class="h-5 w-5 mr-1" />
              Saved
              <span
                v-if="favoritesStore.favoritesCount > 0"
                class="ml-1 px-2 py-0.5 text-xs bg-primary-600 text-white rounded-full"
              >
                {{ favoritesStore.favoritesCount }}
              </span>
            </NuxtLink>

            <NuxtLink
              v-if="authStore.isAuthenticated"
              to="/notifications"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors relative"
              active-class="text-primary-600 dark:text-primary-400 border-b-2 border-primary-600"
            >
              <BellIcon class="h-5 w-5 mr-1" />
              Notifications
              <span
                v-if="notificationStore.unreadCount > 0"
                class="ml-1 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full animate-pulse"
              >
                {{ notificationStore.unreadCount }}
              </span>
            </NuxtLink>
          </div>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center space-x-4">
          <!-- Dark mode toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
            aria-label="Toggle dark mode"
          >
            <SunIcon v-if="isDark" class="h-5 w-5" />
            <MoonIcon v-else class="h-5 w-5" />
          </button>

          <!-- User menu (desktop) -->
          <div v-if="authStore.isAuthenticated" class="hidden md:block">
            <Menu as="div" class="relative">
              <MenuButton class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none">
                <UserCircleIcon class="h-8 w-8" />
                <span class="text-sm font-medium">{{ authStore.user?.name }}</span>
              </MenuButton>

              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems class="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <NuxtLink
                        to="/profile"
                        :class="[
                          active ? 'bg-gray-100 dark:bg-gray-700' : '',
                          'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                        ]"
                      >
                        Profile
                      </NuxtLink>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <NuxtLink
                        to="/feedback"
                        :class="[
                          active ? 'bg-gray-100 dark:bg-gray-700' : '',
                          'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                        ]"
                      >
                        Send Feedback
                      </NuxtLink>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <button
                        @click="handleLogout"
                        :class="[
                          active ? 'bg-gray-100 dark:bg-gray-700' : '',
                          'block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                        ]"
                      >
                        Logout
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>

          <!-- Login button (desktop) -->
          <NuxtLink
            v-else
            to="/login"
            class="hidden md:block btn-primary"
          >
            Login
          </NuxtLink>

          <!-- Mobile menu button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
          >
            <Bars3Icon v-if="!mobileMenuOpen" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 dark:border-gray-700">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <NuxtLink
          to="/search"
          @click="closeMobileMenu"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <MagnifyingGlassIcon class="h-5 w-5 inline mr-2" />
          Search
        </NuxtLink>

        <NuxtLink
          v-if="authStore.isAuthenticated"
          to="/saved"
          @click="closeMobileMenu"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <BookmarkIcon class="h-5 w-5 inline mr-2" />
          Saved
          <span
            v-if="favoritesStore.favoritesCount > 0"
            class="ml-1 px-2 py-0.5 text-xs bg-primary-600 text-white rounded-full"
          >
            {{ favoritesStore.favoritesCount }}
          </span>
        </NuxtLink>

        <NuxtLink
          v-if="authStore.isAuthenticated"
          to="/notifications"
          @click="closeMobileMenu"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <BellIcon class="h-5 w-5 inline mr-2" />
          Notifications
          <span
            v-if="notificationStore.unreadCount > 0"
            class="ml-1 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full"
          >
            {{ notificationStore.unreadCount }}
          </span>
        </NuxtLink>

        <template v-if="authStore.isAuthenticated">
          <NuxtLink
            to="/profile"
            @click="closeMobileMenu"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <UserCircleIcon class="h-5 w-5 inline mr-2" />
            Profile
          </NuxtLink>
          <NuxtLink
            to="/feedback"
            @click="closeMobileMenu"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Send Feedback
          </NuxtLink>
          <button
            @click="handleLogout"
            class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Logout
          </button>
        </template>

        <NuxtLink
          v-else
          to="/login"
          @click="closeMobileMenu"
          class="block px-3 py-2 rounded-md text-base font-medium text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Login
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>
