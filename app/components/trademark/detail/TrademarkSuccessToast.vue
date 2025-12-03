<script setup lang="ts">
import { CheckCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
    show: boolean
    message: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
    close: []
}>()
</script>

<template>
    <Teleport to="body">
        <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
            <div v-if="show"
                class="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm">
                <div class="flex items-center gap-3">
                    <div
                        class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircleIcon class="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {{ message }}
                    </p>
                    <button @click="emit('close')"
                        class="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <XMarkIcon class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
