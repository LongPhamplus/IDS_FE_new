<script setup lang="ts">
import { XMarkIcon, MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon } from '@heroicons/vue/24/outline'

interface Props {
    show: boolean
    imageUrl?: string
    trademarkName?: string
    trademarkClass?: string
    trademarkStatus?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
    close: []
}>()

const zoom = ref(1)

const zoomIn = () => {
    if (zoom.value < 3) {
        zoom.value += 0.25
    }
}

const zoomOut = () => {
    if (zoom.value > 0.5) {
        zoom.value -= 0.25
    }
}

watch(() => props.show, (newVal) => {
    if (newVal) {
        zoom.value = 1
    }
})
</script>

<template>
    <Teleport to="body">
        <Transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="show && imageUrl"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                @click.self="emit('close')">
                <div class="relative w-full h-full flex items-center justify-center p-4">
                    <!-- Close button -->
                    <button @click="emit('close')"
                        class="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors z-10"
                        title="Đóng">
                        <XMarkIcon class="h-6 w-6 text-white" />
                    </button>

                    <!-- Zoom controls -->
                    <div class="absolute top-4 left-4 flex gap-2 z-10">
                        <button @click="zoomOut" :disabled="zoom <= 0.5"
                            class="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Thu nhỏ">
                            <MagnifyingGlassMinusIcon class="h-6 w-6 text-white" />
                        </button>
                        <button @click="zoomIn" :disabled="zoom >= 3"
                            class="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Phóng to">
                            <MagnifyingGlassPlusIcon class="h-6 w-6 text-white" />
                        </button>
                        <div class="px-4 py-3 bg-white/10 backdrop-blur-md rounded-full text-white font-medium">
                            {{ Math.round(zoom * 100) }}%
                        </div>
                    </div>

                    <!-- Image info -->
                    <div
                        class="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-lg p-4 text-white">
                        <h3 class="text-xl font-bold mb-1">{{ trademarkName }}</h3>
                        <p class="text-sm text-white/80">Mã nhóm: {{ trademarkClass }} • {{ trademarkStatus }}</p>
                    </div>

                    <!-- Image -->
                    <div class="overflow-auto max-w-full max-h-full">
                        <img :src="imageUrl" :alt="trademarkName" class="transition-transform duration-300 select-none"
                            :style="{ transform: `scale(${zoom})` }" draggable="false" />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
