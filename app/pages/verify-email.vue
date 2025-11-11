<script setup lang="ts">
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  middleware: 'guest',
  pageTransition: {
    name: 'fade',
    mode: 'out-in'
  }
})

const route = useRoute()
const config = useRuntimeConfig()

const verifying = ref(true)
const success = ref(false)
const error = ref('')
const message = ref('')

// Verify email on mount
onMounted(async () => {
  const token = route.query.token as string
  
  if (!token) {
    error.value = 'Token xác thực không hợp lệ'
    verifying.value = false
    return
  }

  try {
    const response = await $fetch<{ message: string }>('/api/auth/verify-email', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: { token }
    })

    success.value = true
    message.value = response.message || 'Email đã được xác thực thành công!'
  } catch (err: any) {
    success.value = false
    error.value = err.data?.message || 'Xác thực email thất bại. Token có thể đã hết hạn.'
  } finally {
    verifying.value = false
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-md w-full">
      <!-- Verifying State -->
      <div v-if="verifying" class="card p-8 text-center animate-pulse">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <div class="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Đang xác thực...
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          Vui lòng đợi trong giây lát
        </p>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="card p-8 text-center animate-scale-in">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircleIcon class="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Xác thực thành công!
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ message }}
        </p>
        <div class="space-y-3">
          <NuxtLink
            to="/login"
            class="btn-primary w-full"
          >
            Đăng nhập ngay
          </NuxtLink>
          <NuxtLink
            to="/"
            class="btn-secondary w-full"
          >
            Về trang chủ
          </NuxtLink>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="card p-8 text-center animate-scale-in">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <XCircleIcon class="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Xác thực thất bại
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ error }}
        </p>
        <div class="space-y-3">
          <NuxtLink
            to="/signup"
            class="btn-primary w-full"
          >
            Đăng ký lại
          </NuxtLink>
          <NuxtLink
            to="/"
            class="btn-secondary w-full"
          >
            Về trang chủ
          </NuxtLink>
        </div>
      </div>

      <!-- Help Text -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Cần hỗ trợ? 
          <NuxtLink to="/feedback" class="text-primary-600 dark:text-primary-400 hover:underline">
            Liên hệ với chúng tôi
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
