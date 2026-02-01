<script setup lang="ts">
import { ref, computed } from 'vue'
import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'
import { useLocalStorage } from '@/composables/useLocalStorage'

interface Props {
  variant?: 'inline' | 'card' | 'banner'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'inline',
})

const toast = useToast()
const email = ref('')
const isSubmitting = ref(false)
const [isSubscribed, setIsSubscribed] = useLocalStorage('newsletter_subscribed', false)

const handleSubmit = async () => {
  if (!email.value) {
    toast.error('Please enter your email address')
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    toast.error('Please enter a valid email address')
    return
  }

  isSubmitting.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  setIsSubscribed(true)
  email.value = ''
  isSubmitting.value = false
  toast.success('Successfully subscribed to our newsletter!')
}
</script>

<template>
  <!-- Already subscribed state -->
  <div
    v-if="isSubscribed"
    :class="[
      'flex items-center gap-3',
      props.variant === 'banner' ? 'justify-center' : '',
    ]"
  >
    <CheckCircleIcon class="h-6 w-6 text-green-500" />
    <span class="text-gray-300">You're subscribed to our newsletter!</span>
  </div>

  <!-- Inline variant -->
  <form
    v-else-if="props.variant === 'inline'"
    class="flex gap-2"
    @submit.prevent="handleSubmit"
  >
    <div class="relative flex-1">
      <EnvelopeIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
      <input
        v-model="email"
        type="email"
        placeholder="Enter your email"
        class="w-full pl-10 pr-4 py-2 bg-punk-black border border-punk-gray rounded-lg text-white placeholder-gray-500 focus:border-punk-orange focus:ring-1 focus:ring-punk-orange"
        :disabled="isSubmitting"
      />
    </div>
    <button
      type="submit"
      class="btn-punk whitespace-nowrap"
      :disabled="isSubmitting"
    >
      {{ isSubmitting ? 'Subscribing...' : 'Subscribe' }}
    </button>
  </form>

  <!-- Card variant -->
  <form
    v-else-if="props.variant === 'card'"
    class="bg-punk-gray rounded-lg p-6 space-y-4"
    @submit.prevent="handleSubmit"
  >
    <div class="text-center">
      <h3 class="text-lg font-semibold text-white mb-2">Stay in the Loop</h3>
      <p class="text-gray-400 text-sm">Get the latest releases and exclusive deals.</p>
    </div>
    <div class="relative">
      <EnvelopeIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
      <input
        v-model="email"
        type="email"
        placeholder="Enter your email"
        class="w-full pl-10 pr-4 py-3 bg-punk-black border border-punk-gray rounded-lg text-white placeholder-gray-500 focus:border-punk-orange focus:ring-1 focus:ring-punk-orange"
        :disabled="isSubmitting"
      />
    </div>
    <button
      type="submit"
      class="btn-punk w-full"
      :disabled="isSubmitting"
    >
      {{ isSubmitting ? 'Subscribing...' : 'Subscribe Now' }}
    </button>
  </form>

  <!-- Banner variant -->
  <form
    v-else-if="props.variant === 'banner'"
    class="bg-punk-orange py-12"
    @submit.prevent="handleSubmit"
  >
    <div class="max-w-4xl mx-auto px-4 text-center">
      <h2 class="text-3xl md:text-4xl font-display text-white uppercase tracking-wider mb-4">
        Join the Chaos
      </h2>
      <p class="text-white/90 mb-6 max-w-xl mx-auto">
        Subscribe to our newsletter and be the first to know about new releases, exclusive deals, and punk rock news.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <div class="relative flex-1">
          <EnvelopeIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            class="w-full pl-10 pr-4 py-3 bg-white rounded-lg text-punk-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-punk-black"
            :disabled="isSubmitting"
          />
        </div>
        <button
          type="submit"
          class="px-6 py-3 bg-punk-black text-white font-bold uppercase tracking-wider rounded-lg hover:bg-punk-gray transition-colors disabled:opacity-50"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Subscribing...' : 'Subscribe' }}
        </button>
      </div>
    </div>
  </form>
</template>
