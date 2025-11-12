<script setup lang="ts">
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'guest',
  pageTransition: {
    name: 'scale',
    mode: 'out-in'
  }
})

const authStore = useAuthStore()
const route = useRoute()

const form = reactive({
  email: '',
  password: ''
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    await authStore.login({
      email: form.email,
      password: form.password
    })

    // Redirect to original page or home
    const redirect = route.query.redirect as string || '/profile'
    
    // Use nextTick to ensure auth state is updated before navigation
    await nextTick()
    
    // Navigate with replace to avoid back button issues
    await navigateTo(redirect, { replace: true })
  } catch (err: any) {
    // Handle error from backend
    error.value = err.data?.message || err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Sign in to your account
        </h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Access your saved trademarks and more
        </p>
      </div>

      <div class="card p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Error message -->
          <div
            v-if="error"
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg"
          >
            {{ error }}
          </div>

          <!-- Email field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="input-field"
              placeholder="you@example.com"
            />
          </div>

          <!-- Password field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                class="input-field pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Remember me & Forgot password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>

            <a href="#" class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
              Forgot password?
            </a>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary py-3 text-base"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </form>

        <!-- Sign up link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?
            <NuxtLink to="/signup" class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
              Sign up
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- Demo credentials -->
      <div class="mt-6 card p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <p class="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">Demo Credentials:</p>
        <p class="text-xs text-blue-700 dark:text-blue-400">
          Email: demo@example.com<br />
          Password: password123
        </p>
      </div>
    </div>
  </div>
</template>
