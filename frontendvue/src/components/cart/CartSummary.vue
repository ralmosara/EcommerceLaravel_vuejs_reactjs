<template>
  <div class="bg-punk-gray rounded-lg p-6 border border-gray-700">
    <h2 class="text-lg font-display font-bold text-white uppercase tracking-wider mb-4">
      Order Summary
    </h2>

    <!-- Coupon Input -->
    <CouponInput class="mb-6" />

    <!-- Summary Details -->
    <div class="space-y-3">
      <!-- Subtotal -->
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-400">Subtotal ({{ itemCount }} items)</span>
        <span class="font-medium text-white">{{ formatPrice(subtotal) }}</span>
      </div>

      <!-- Discount -->
      <div v-if="discountAmount > 0" class="flex items-center justify-between text-sm">
        <span class="text-green-400">Discount</span>
        <span class="font-medium text-green-400">-{{ formatPrice(discountAmount) }}</span>
      </div>

      <!-- Shipping Notice -->
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-400">Shipping</span>
        <span class="text-gray-400">Calculated at checkout</span>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-700 pt-3">
        <div class="flex items-center justify-between">
          <span class="text-base font-semibold text-white">Total</span>
          <span class="text-xl font-bold text-punk-orange">{{ formatPrice(total) }}</span>
        </div>
      </div>
    </div>

    <!-- Checkout Button -->
    <RouterLink
      to="/checkout"
      class="mt-6 w-full block text-center btn-punk py-3"
    >
      Proceed to Checkout
    </RouterLink>

    <!-- Continue Shopping Link -->
    <RouterLink
      to="/albums"
      class="mt-3 w-full block text-center text-sm text-gray-400 hover:text-punk-orange transition-colors"
    >
      Continue Shopping
    </RouterLink>

    <!-- Secure Checkout Notice -->
    <div class="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
      <LockClosedIcon class="h-4 w-4" />
      <span>Secure checkout</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { LockClosedIcon } from '@heroicons/vue/24/outline'
import { useCart } from '@/composables/useCart'
import { formatPrice } from '@/utils/formatters'
import CouponInput from './CouponInput.vue'

const { itemCount, subtotal, discountAmount, total } = useCart()
</script>
