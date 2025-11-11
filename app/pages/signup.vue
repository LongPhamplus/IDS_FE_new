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
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref('')
const registrationSuccess = ref(false)

const handleSignup = async () => {
  error.value = ''
  
  // Validation
  if (!form.name || !form.email || !form.password || !form.confirmPassword) {
    error.value = 'Vui lòng điền đầy đủ thông tin'
    return
  }

  if (form.password !== form.confirmPassword) {
    error.value = 'Mật khẩu xác nhận không khớp'
    return
  }

  if (form.password.length < 6) {
    error.value = 'Mật khẩu phải có ít nhất 6 ký tự'
    return
  }

  loading.value = true

  try {
    await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password
    })

    // Show success message instead of auto-login
    registrationSuccess.value = true
  } catch (err: any) {
    error.value = err.message || 'Đăng ký thất bại. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 animate-fade-in">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h2 class="text-4xl font-bold mb-2">
          <span class="text-gray-900 dark:text-white">Tạo tài khoản</span>
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          Đăng ký để bắt đầu tìm kiếm nhãn hiệu
        </p>
      </div>

      <!-- Success Message -->
      <div v-if="registrationSuccess" class="card p-8 text-center animate-scale-in">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Kiểm tra email của bạn!
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Chúng tôi đã gửi link xác thực đến <span class="font-semibold">{{ form.email }}</span>. 
          Vui lòng kiểm tra hộp thư và nhấp vào link để kích hoạt tài khoản.
        </p>
        <div class="space-y-3">
          <NuxtLink
            to="/resend-verification"
            class="btn-secondary w-full"
          >
            Gửi lại email xác thực
          </NuxtLink>
          <NuxtLink
            to="/login"
            class="btn-primary w-full"
          >
            Đăng nhập
          </NuxtLink>
        </div>
      </div>

      <!-- Signup Form -->
      <div v-else class="card p-8 animate-scale-in">
        <form @submit.prevent="handleSignup" class="space-y-6">
          <!-- Error message -->
          <div
            v-if="error"
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm"
          >
            {{ error }}
          </div>

          <!-- Name field -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Họ và tên
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="input-field"
              placeholder="Nguyễn Văn A"
              autocomplete="name"
            />
          </div>

          <!-- Email field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-field"
              placeholder="email@example.com"
              autocomplete="email"
            />
          </div>

          <!-- Password field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mật khẩu
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="input-field pr-12"
                placeholder="••••••••"
                autocomplete="new-password"
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
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Tối thiểu 6 ký tự
            </p>
          </div>

          <!-- Confirm Password field -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Xác nhận mật khẩu
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="input-field pr-12"
                placeholder="••••••••"
                autocomplete="new-password"
              />
              <button
                type="button"
                @click="toggleConfirmPasswordVisibility"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
              >
                <EyeIcon v-if="!showConfirmPassword" class="h-5 w-5" />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary"
          >
            <span v-if="loading">Đang xử lý...</span>
            <span v-else>Đăng ký</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Hoặc
              </span>
            </div>
          </div>
        </div>

        <!-- Login link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Đã có tài khoản?
            <NuxtLink
              to="/login"
              class="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Đăng nhập
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- Back to home -->
      <div class="text-center">
        <NuxtLink
          to="/"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          ← Quay lại trang chủ
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
