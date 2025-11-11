<script setup lang="ts">
import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  middleware: 'guest',
  pageTransition: {
    name: 'scale',
    mode: 'out-in'
  }
})

const config = useRuntimeConfig()

const form = reactive({
  email: ''
})

const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleResend = async () => {
  error.value = ''
  
  if (!form.email) {
    error.value = 'Vui lòng nhập email'
    return
  }

  loading.value = true

  try {
    await $fetch('/api/auth/resend-verification', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: { email: form.email }
    })

    success.value = true
  } catch (err: any) {
    error.value = err.data?.message || 'Không thể gửi email. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 animate-fade-in">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <EnvelopeIcon class="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 class="text-4xl font-bold mb-2">
          <span class="text-gray-900 dark:text-white">Gửi lại email</span>
          <span class="gradient-text"> xác thực</span>
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          Nhập email của bạn để nhận link xác thực mới
        </p>
      </div>

      <!-- Success State -->
      <div v-if="success" class="card p-8 text-center animate-scale-in">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircleIcon class="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Email đã được gửi!
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Vui lòng kiểm tra hộp thư của bạn và nhấp vào link xác thực.
        </p>
        <div class="space-y-3">
          <button
            @click="success = false; form.email = ''"
            class="btn-secondary w-full"
          >
            Gửi lại cho email khác
          </button>
          <NuxtLink
            to="/login"
            class="btn-primary w-full"
          >
            Đăng nhập
          </NuxtLink>
        </div>
      </div>

      <!-- Form -->
      <div v-else class="card p-8 animate-scale-in">
        <form @submit.prevent="handleResend" class="space-y-6">
          <!-- Error message -->
          <div
            v-if="error"
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm"
          >
            {{ error }}
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

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary w-full"
          >
            <span v-if="loading">Đang gửi...</span>
            <span v-else>Gửi email xác thực</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              hoặc
            </span>
          </div>
        </div>

        <!-- Links -->
        <div class="space-y-2 text-center">
          <NuxtLink
            to="/login"
            class="block text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            Đã có tài khoản? Đăng nhập
          </NuxtLink>
          <NuxtLink
            to="/signup"
            class="block text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            Chưa có tài khoản? Đăng ký
          </NuxtLink>
        </div>
      </div>

      <!-- Help Text -->
      <div class="text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Không nhận được email? Kiểm tra thư mục spam hoặc 
          <NuxtLink to="/feedback" class="text-primary-600 dark:text-primary-400 hover:underline">
            liên hệ hỗ trợ
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
