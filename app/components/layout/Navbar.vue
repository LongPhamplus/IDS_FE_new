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

// Initialize auth and fetch data on mount
onMounted(() => {
  authStore.initAuth()
  
  if (authStore.isAuthenticated) {
    notificationStore.fetchNotifications()
    favoritesStore.fetchFavorites()
  }
})

// Watch for auth changes to fetch data
watch(() => authStore.isAuthenticated, async (isAuth) => {
  // Defer data fetching to avoid conflicts with page renders
  await nextTick()
  console.log(isAuth)
  if (isAuth) {
    notificationStore.fetchNotifications()
    favoritesStore.fetchFavorites()
  } else {
    favoritesStore.clearFavorites()
  }
})

// Get user initials for avatar
const userInitials = computed(() => {
  if (!authStore.user?.name) return 'U'
  const names = authStore.user.name.split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }
  return authStore.user.name.substring(0, 2).toUpperCase()
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
              <MenuButton class="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none group">
                <!-- User Avatar -->
                <div class="relative">
                  <div class="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:shadow-lg transition-shadow">
                    {{ userInitials }}
                  </div>
                  <div class="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                </div>
                <!-- User Info -->
                <div class="flex flex-col items-start">
                  <span class="text-sm font-semibold">{{ authStore.user?.name }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</span>
                </div>
              </MenuButton>

              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems class="absolute right-0 mt-2 w-64 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700">
                  <!-- User Info Header -->
                  <div class="px-4 py-3">
                    <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ authStore.user?.name }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ authStore.user?.email }}</p>
                  </div>
                  
                  <!-- Menu Items -->
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <NuxtLink
                        to="/profile"
                        :class="[
                          active ? 'bg-gray-100 dark:bg-gray-700' : '',
                          'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                        ]"
                      >
                        <UserCircleIcon class="h-5 w-5 mr-3 text-gray-400" />
                        Hồ sơ cá nhân
                      </NuxtLink>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <NuxtLink
                        to="/saved"
                        :class="[
                          active ? 'bg-gray-100 dark:bg-gray-700' : '',
                          'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                        ]"
                      >
                        <BookmarkIcon class="h-5 w-5 mr-3 text-gray-400" />
                        Đơn đã lưu
                        <span v-if="favoritesStore.favoritesCount > 0" class="ml-auto px-2 py-0.5 text-xs bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full">
                          {{ favoritesStore.favoritesCount }}
                        </span>
                      </NuxtLink>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <NuxtLink
                        to="/feedback"
                        :class="[
                          active ? 'bg-gray-100 dark:bg-gray-700' : '',
                          'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                        ]"
                      >
                        <svg class="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        Gửi phản hồi
                      </NuxtLink>
                    </MenuItem>
                  </div>
                  
                  <!-- Logout -->
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <button
                        @click="handleLogout"
                        :class="[
                          active ? 'bg-red-50 dark:bg-red-900/20' : '',
                          'flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400'
                        ]"
                      >
                        <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Đăng xuất
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>

          <!-- Login/Signup buttons (desktop) -->
          <div v-else class="hidden md:flex items-center space-x-3">
            <NuxtLink
              to="/login"
              class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Đăng nhập
            </NuxtLink>
            <NuxtLink
              to="/signup"
              class="btn-primary text-sm"
            >
              Đăng ký
            </NuxtLink>
          </div>

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
          <!-- User Info in Mobile -->
          <div class="px-3 py-3 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-3">
              <div class="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold shadow-md">
                {{ userInitials }}
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ authStore.user?.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ authStore.user?.email }}</p>
              </div>
            </div>
          </div>
          
          <NuxtLink
            to="/profile"
            @click="closeMobileMenu"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <UserCircleIcon class="h-5 w-5 inline mr-2" />
            Hồ sơ cá nhân
          </NuxtLink>
          <NuxtLink
            to="/feedback"
            @click="closeMobileMenu"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Gửi phản hồi
          </NuxtLink>
          <button
            @click="handleLogout"
            class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Đăng xuất
          </button>
        </template>

        <template v-else>
          <NuxtLink
            to="/login"
            @click="closeMobileMenu"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Đăng nhập
          </NuxtLink>
          <NuxtLink
            to="/signup"
            @click="closeMobileMenu"
            class="block px-3 py-2 rounded-md text-base font-medium text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Đăng ký
          </NuxtLink>
        </template>
      </div>
    </div>
  </nav>
</template>
