<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search trademarks...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: []
}>()

const searchQuery = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleSearch = () => {
  emit('search')
}

const handleKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSearch()
  }
}
</script>

<template>
  <div class="relative">
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
      </div>
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        @keyup="handleKeyup"
        class="input-field pl-10 pr-4"
      />
    </div>
    <button
      @click="handleSearch"
      class="absolute right-2 top-1/2 -translate-y-1/2 btn-primary px-4 py-1.5"
    >
      Search
    </button>
  </div>
</template>
