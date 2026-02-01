<template>
  <div>
    <!-- Applied Coupon Display -->
    <div v-if="coupon" class="flex items-center justify-between bg-green-900/30 border border-green-700 rounded-lg p-3 mb-3">
      <div class="flex items-center gap-2">
        <CheckCircleIcon class="h-5 w-5 text-green-400" />
        <div>
          <p class="text-sm font-semibold text-green-400">{{ coupon.code }}</p>
          <p class="text-xs text-green-500">{{ couponDescription }}</p>
        </div>
      </div>
      <button
        @click="handleRemoveCoupon"
        :disabled="loading"
        class="text-green-400 hover:text-green-300 transition-colors disabled:opacity-50"
        aria-label="Remove coupon"
      >
        <XMarkIcon class="h-5 w-5" />
      </button>
    </div>

    <!-- Coupon Input Form -->
    <div v-else class="flex gap-2">
      <input
        v-model="couponCode"
        @keydown.enter="handleApplyCoupon"
        type="text"
        placeholder="Coupon code"
        class="flex-1 px-3 py-2 bg-punk-black border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-punk-orange focus:border-punk-orange transition-colors"
      />
      <button
        @click="handleApplyCoupon"
        :disabled="loading || !couponCode.trim()"
        class="px-4 py-2 bg-punk-black border border-gray-700 text-white text-sm font-medium rounded-lg hover:border-punk-orange hover:text-punk-orange disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {{ loading ? 'Applying...' : 'Apply' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CheckCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useCart } from '@/composables/useCart'

const { coupon, applyCoupon, removeCoupon, loading } = useCart()
const couponCode = ref('')

const couponDescription = computed(() => {
  if (!coupon.value) return ''

  if (coupon.value.type === 'PERCENTAGE') {
    return `${coupon.value.value}% off`
  } else {
    return `$${coupon.value.value} off`
  }
})

const handleApplyCoupon = async () => {
  if (!couponCode.value.trim()) return

  try {
    await applyCoupon(couponCode.value.trim())
    couponCode.value = ''
  } catch (error) {
    console.error('Failed to apply coupon:', error)
  }
}

const handleRemoveCoupon = async () => {
  try {
    await removeCoupon()
  } catch (error) {
    console.error('Failed to remove coupon:', error)
  }
}
</script>
