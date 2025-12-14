<script setup lang="ts">
import {
    DocumentTextIcon,
    XMarkIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    BookmarkIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth'

interface Props {
    trademark: any
    isFavorite: boolean
}

const props = defineProps<Props>()
const authStore = useAuthStore()
const { createReport } = useApi()

// State
const showReportModal = ref(false)
const reportContent = ref('')
const isSubmitting = ref(false)
const showSuccessMessage = ref(false)
const showErrorMessage = ref(false)
const errorMessage = ref('')

// Computed
const canSubmitReport = computed(() => {
    return reportContent.value.trim().length >= 10 && !isSubmitting.value
})

// Methods
const openReportModal = () => {
    if (!authStore.isAuthenticated) {
        navigateTo('/login')
        return
    }
    showReportModal.value = true
    reportContent.value = ''
    showSuccessMessage.value = false
    showErrorMessage.value = false
}

const closeReportModal = () => {
    showReportModal.value = false
    reportContent.value = ''
    showSuccessMessage.value = false
    showErrorMessage.value = false
}

const submitReport = async () => {
    if (!canSubmitReport.value || !authStore.user) {
        return
    }

    try {
        isSubmitting.value = true
        showErrorMessage.value = false

        const response = await createReport({
            report_content: reportContent.value.trim(),
            user_data: authStore.user.id,
            trademark: parseInt(props.trademark.id)
        })

        if (response.status) {
            showSuccessMessage.value = true
            reportContent.value = ''

            // Close modal after 2 seconds
            setTimeout(() => {
                closeReportModal()
            }, 2000)
        } else {
            showErrorMessage.value = true
            errorMessage.value = response.message || 'Không thể gửi yêu cầu'
        }
    } catch (error: any) {
        console.error('Failed to submit report:', error)
        showErrorMessage.value = true
        errorMessage.value = error.data?.message || error.message || 'Có lỗi xảy ra khi gửi yêu cầu'
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="relative">
        <!-- Report Button (Enabled for favorited trademarks) -->
        <button v-if="isFavorite" @click="openReportModal" class="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 
                 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-200 shadow-sm 
                 hover:shadow-md text-sm font-medium group">
            <DocumentTextIcon
                class="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
            <span class="hidden sm:inline">Tạo yêu cầu</span>
            <span class="sm:hidden">Báo cáo</span>
        </button>

        <!-- Alert Box for non-favorited trademarks -->
        <div v-else class="space-y-3">
            <!-- Disabled Button -->
            <button disabled class="inline-flex items-center gap-2.5 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 
                       text-amber-700 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-600 
                       rounded-lg cursor-not-allowed font-medium w-full sm:w-auto">
                <ExclamationTriangleIcon class="h-6 w-6" />
                <span class="text-base">Cần lưu đơn trước</span>
            </button>
        </div>

        <!-- Report Modal -->
        <Teleport to="body">
            <Transition enter-active-class="transition-opacity duration-200 ease-out" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-active-class="transition-opacity duration-150 ease-in"
                leave-from-class="opacity-100" leave-to-class="opacity-0">
                <div v-if="showReportModal"
                    class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
                    @click.self="closeReportModal">
                    <Transition enter-active-class="transition-all duration-200 ease-out"
                        enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                        leave-active-class="transition-all duration-150 ease-in"
                        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                        <div v-if="showReportModal" class="relative w-full max-w-lg my-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl 
                     border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[90vh] flex flex-col"
                            @click.stop>
                            <!-- Header -->
                            <div
                                class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-800">
                                <div class="flex items-center gap-2 flex-1 min-w-0">
                                    <div class="p-1.5 bg-primary-500 rounded-lg flex-shrink-0">
                                        <DocumentTextIcon class="h-5 w-5 text-white" />
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <h3
                                            class="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                                            Tạo yêu cầu báo cáo
                                        </h3>
                                        <p class="text-xs text-gray-600 dark:text-gray-400 truncate">
                                            <span class="font-medium">{{ trademark?.name }}</span>
                                        </p>
                                    </div>
                                </div>
                                <button @click="closeReportModal" class="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
                         hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0 ml-2">
                                    <XMarkIcon class="h-5 w-5" />
                                </button>
                            </div>

                            <!-- Body - Scrollable -->
                            <div class="p-4 space-y-3 overflow-y-auto flex-1">
                                <!-- Trademark Info -->
                                <div
                                    class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div class="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                                        <div>
                                            <span class="text-gray-600 dark:text-gray-400">Số đơn:</span>
                                            <span
                                                class="ml-1 font-semibold text-gray-900 dark:text-gray-100 block sm:inline">{{
                                                    trademark?.so_don }}</span>
                                        </div>
                                        <div>
                                            <span class="text-gray-600 dark:text-gray-400">Trạng thái:</span>
                                            <span
                                                class="ml-1 font-semibold text-gray-900 dark:text-gray-100 block sm:inline">{{
                                                    trademark?.status }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Success Message -->
                                <Transition enter-active-class="transition-all duration-200 ease-out"
                                    enter-from-class="opacity-0 -translate-y-2"
                                    enter-to-class="opacity-100 translate-y-0"
                                    leave-active-class="transition-all duration-150 ease-in"
                                    leave-from-class="opacity-100 translate-y-0"
                                    leave-to-class="opacity-0 -translate-y-2">
                                    <div v-if="showSuccessMessage"
                                        class="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                        <CheckCircleIcon
                                            class="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                        <div class="flex-1 min-w-0">
                                            <p class="font-semibold text-sm text-green-900 dark:text-green-100">Gửi yêu
                                                cầu thành công!</p>
                                            <p class="text-xs text-green-700 dark:text-green-300 mt-0.5">Yêu cầu của bạn
                                                đã được gửi đến quản trị viên.</p>
                                        </div>
                                    </div>
                                </Transition>

                                <!-- Error Message -->
                                <Transition enter-active-class="transition-all duration-200 ease-out"
                                    enter-from-class="opacity-0 -translate-y-2"
                                    enter-to-class="opacity-100 translate-y-0"
                                    leave-active-class="transition-all duration-150 ease-in"
                                    leave-from-class="opacity-100 translate-y-0"
                                    leave-to-class="opacity-0 -translate-y-2">
                                    <div v-if="showErrorMessage"
                                        class="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                        <ExclamationTriangleIcon
                                            class="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                        <div class="flex-1 min-w-0">
                                            <p class="font-semibold text-sm text-red-900 dark:text-red-100">Có lỗi xảy
                                                ra</p>
                                            <p class="text-xs text-red-700 dark:text-red-300 mt-0.5 break-words">{{
                                                errorMessage }}</p>
                                        </div>
                                    </div>
                                </Transition>

                                <!-- Report Content Input -->
                                <div v-if="!showSuccessMessage">
                                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                        Nội dung yêu cầu <span class="text-red-500">*</span>
                                    </label>
                                    <textarea v-model="reportContent" rows="4"
                                        placeholder="Nhập nội dung yêu cầu báo cáo (tối thiểu 10 ký tự)..." class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                           transition-all resize-none" :disabled="isSubmitting" />
                                    <div class="flex items-center justify-between mt-1.5">
                                        <p class="text-xs text-gray-500 dark:text-gray-400">
                                            {{ reportContent.length }} ký tự
                                        </p>
                                        <p v-if="reportContent.length > 0 && reportContent.length < 10"
                                            class="text-xs text-red-500 dark:text-red-400">
                                            Cần {{ 10 - reportContent.length }} ký tự
                                        </p>
                                    </div>
                                </div>

                                <!-- Info Note -->
                                <div v-if="!showSuccessMessage"
                                    class="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <ExclamationTriangleIcon
                                        class="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div class="text-xs text-blue-900 dark:text-blue-100 flex-1 min-w-0">
                                        <p class="font-semibold mb-1">Lưu ý:</p>
                                        <ul class="list-disc list-inside space-y-0.5 text-blue-800 dark:text-blue-200">
                                            <li>Chỉ gửi 1 yêu cầu/người dùng</li>
                                            <li>Mô tả rõ lý do yêu cầu</li>
                                            <li>Admin sẽ xem xét yêu cầu</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <!-- Footer -->
                            <div v-if="!showSuccessMessage"
                                class="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
                                <button @click="closeReportModal" :disabled="isSubmitting" class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 
                         border border-gray-300 dark:border-gray-600 rounded-lg 
                         hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium
                         disabled:opacity-50 disabled:cursor-not-allowed">
                                    Hủy
                                </button>
                                <button @click="submitReport" :disabled="!canSubmitReport" class="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg 
                         hover:bg-primary-700 transition-all font-medium shadow-lg shadow-primary-500/30
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                         flex items-center gap-1.5">
                                    <span v-if="!isSubmitting">Gửi yêu cầu</span>
                                    <span v-else class="flex items-center gap-1.5">
                                        <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                                            fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                            </path>
                                        </svg>
                                        Đang gửi...
                                    </span>
                                </button>
                            </div>
                        </div>
                    </Transition>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<style scoped>
@keyframes slide-down {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slide-down {
    animation: slide-down 0.3s ease-out;
}
</style>
