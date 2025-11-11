<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import type { Feedback } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const { sendFeedback } = useApi()

const form = reactive({
  subject: '',
  message: '',
  screenshot: ''
})

const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    await sendFeedback({
      subject: form.subject,
      message: form.message,
      screenshot: form.screenshot || undefined
    })

    success.value = true
    
    // Reset form
    form.subject = ''
    form.message = ''
    form.screenshot = ''

    // Hide success message after 5 seconds
    setTimeout(() => {
      success.value = false
    }, 5000)
  } catch (err: any) {
    error.value = err.data?.message || 'Không thể gửi phản hồi. Vui lòng thử lại.'
    console.error('Feedback error:', err)
  } finally {
    loading.value = false
  }
}

const subjectOptions = [
  'Báo lỗi',
  'Đề xuất tính năng',
  'Vấn đề dữ liệu',
  'Phản hồi chung',
  'Khác'
]
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Gửi phản hồi
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Giúp chúng tôi cải thiện bằng cách chia sẻ ý kiến, báo lỗi hoặc đề xuất tính năng mới
      </p>
    </div>

    <!-- Success message -->
    <div
      v-if="success"
      class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg mb-6 flex items-center"
    >
      <CheckCircleIcon class="h-5 w-5 mr-2" />
      Thank you for your feedback! We'll review it shortly.
    </div>

    <!-- Error message -->
    <div
      v-if="error"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6"
    >
      {{ error }}
    </div>

    <!-- Feedback form -->
    <div class="card p-8">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Subject -->
        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subject <span class="text-red-500">*</span>
          </label>
          <select
            id="subject"
            v-model="form.subject"
            required
            class="input-field"
          >
            <option value="" disabled>Select a subject</option>
            <option v-for="option in subjectOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>

        <!-- Message -->
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Message <span class="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            v-model="form.message"
            required
            rows="6"
            class="input-field resize-none"
            placeholder="Please provide as much detail as possible..."
          ></textarea>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Minimum 10 characters
          </p>
        </div>

        <!-- Screenshot URL (optional) -->
        <div>
          <label for="screenshot" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Screenshot URL (optional)
          </label>
          <input
            id="screenshot"
            v-model="form.screenshot"
            type="url"
            class="input-field"
            placeholder="https://example.com/screenshot.png"
          />
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Provide a link to a screenshot if applicable
          </p>
        </div>

        <!-- Submit button -->
        <div class="flex items-center justify-end space-x-4">
          <NuxtLink to="/" class="btn-secondary">
            Cancel
          </NuxtLink>
          <button
            type="submit"
            :disabled="loading || form.message.length < 10"
            class="btn-primary"
          >
            <span v-if="loading">Sending...</span>
            <span v-else>Send Feedback</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Info card -->
    <div class="mt-6 card p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <h3 class="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
        What happens next?
      </h3>
      <ul class="space-y-2 text-sm text-blue-800 dark:text-blue-300">
        <li class="flex items-start">
          <span class="mr-2">•</span>
          <span>Our team will review your feedback within 1-2 business days</span>
        </li>
        <li class="flex items-start">
          <span class="mr-2">•</span>
          <span>For urgent issues, we'll prioritize and respond as quickly as possible</span>
        </li>
        <li class="flex items-start">
          <span class="mr-2">•</span>
          <span>You may receive a follow-up email if we need more information</span>
        </li>
      </ul>
    </div>
  </div>
</template>
