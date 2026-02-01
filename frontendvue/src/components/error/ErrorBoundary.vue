<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

interface Props {
  fallbackMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  fallbackMessage: 'Something went wrong. Please try again.',
})

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((err: Error) => {
  hasError.value = true
  errorMessage.value = err.message || props.fallbackMessage
  console.error('ErrorBoundary caught:', err)
  return false // Stop error propagation
})

const reset = () => {
  hasError.value = false
  errorMessage.value = ''
}
</script>

<template>
  <div v-if="hasError" class="flex flex-col items-center justify-center p-8 text-center">
    <div class="w-16 h-16 rounded-full bg-red-900/50 flex items-center justify-center mb-4">
      <ExclamationTriangleIcon class="h-8 w-8 text-red-400" />
    </div>

    <h3 class="text-lg font-semibold text-white mb-2">
      Oops! Something went wrong
    </h3>

    <p class="text-gray-400 mb-4 max-w-md">
      {{ errorMessage || props.fallbackMessage }}
    </p>

    <button
      type="button"
      class="btn-punk flex items-center gap-2"
      @click="reset"
    >
      <ArrowPathIcon class="h-5 w-5" />
      Try Again
    </button>
  </div>

  <slot v-else />
</template>
