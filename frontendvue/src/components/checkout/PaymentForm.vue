<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-white">Payment Information</h3>

    <!-- Card Details Label -->
    <label class="block text-sm font-medium text-gray-300">
      Card Details *
    </label>

    <!-- Stripe Card Elements Container -->
    <div class="bg-punk-black border border-gray-700 rounded-lg overflow-hidden">
      <div class="flex items-center">
        <!-- Card Number -->
        <div
          ref="cardNumberRef"
          class="flex-1 p-3 border-r border-gray-700"
        ></div>
        <!-- Expiry -->
        <div
          ref="cardExpiryRef"
          class="w-24 p-3 border-r border-gray-700"
        ></div>
        <!-- CVC -->
        <div
          ref="cardCvcRef"
          class="w-20 p-3 border-r border-gray-700"
        ></div>
        <!-- ZIP -->
        <div
          ref="cardPostalRef"
          class="w-24 p-3"
        ></div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="stripeError" class="bg-red-900/30 border border-red-700 rounded-lg p-3">
      <div class="flex items-center gap-2">
        <svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm text-red-300">{{ stripeError }}</p>
      </div>
    </div>

    <!-- Test Card Info -->
    <div class="bg-punk-orange/10 border border-punk-orange/30 rounded-lg p-4">
      <p class="text-sm font-semibold text-punk-orange mb-2">Test Mode</p>
      <p class="text-xs text-gray-300">
        Use test card: <code class="bg-punk-black px-1 py-0.5 rounded text-punk-orange">4242 4242 4242 4242</code>
      </p>
      <p class="text-xs text-gray-400 mt-1">
        Any future date, any CVC, any postal code
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useStripe } from '@/composables/useStripe'

interface Props {
  clientSecret?: string
}

interface Emits {
  ready: []
  error: [error: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {
  stripe,
  error: stripeError,
  initializeStripe,
  createElements,
  createSplitCardElements,
  confirmCardPayment,
  destroyElements
} = useStripe()

const cardNumberRef = ref<HTMLElement>()
const cardExpiryRef = ref<HTMLElement>()
const cardCvcRef = ref<HTMLElement>()
const cardPostalRef = ref<HTMLElement>()
const isReady = ref(false)

const setupCardElements = () => {
  if (!cardNumberRef.value || !cardExpiryRef.value || !cardCvcRef.value || !cardPostalRef.value || !stripe.value) {
    return
  }

  // Create Stripe elements
  createElements()

  // Mount split card elements
  createSplitCardElements(cardNumberRef.value, cardExpiryRef.value, cardCvcRef.value, cardPostalRef.value)

  isReady.value = true
  emit('ready')
}

watch(stripe, (newStripe) => {
  if (newStripe && cardNumberRef.value && !isReady.value) {
    setupCardElements()
  }
})

watch(stripeError, (error) => {
  if (error) {
    emit('error', error)
  }
})

onMounted(async () => {
  // Initialize Stripe first
  await initializeStripe()

  // Then setup card elements if refs are ready
  if (stripe.value && cardNumberRef.value) {
    setupCardElements()
  }
})

onUnmounted(() => {
  destroyElements()
})

defineExpose({
  isReady,
  confirmCardPayment
})
</script>
