<template>
  <div class="bg-punk-gray rounded-lg p-6 border border-gray-700">
    <h3 class="text-lg font-semibold text-white mb-4">Order Summary</h3>

    <!-- Cart Items -->
    <div class="space-y-3 mb-4">
      <div
        v-for="item in items"
        :key="item.album.uuid"
        class="flex items-center gap-3"
      >
        <div class="w-16 h-16 rounded bg-punk-black flex-shrink-0 overflow-hidden">
          <img
            v-if="item.album.cover_image"
            :src="item.album.cover_image"
            :alt="item.album.title"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">{{ item.album.title }}</p>
          <p class="text-xs text-gray-400 truncate">{{ item.album.artist?.name }}</p>
          <p class="text-xs text-gray-500">Qty: {{ item.quantity }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm font-medium text-white">{{ formatPrice(item.line_total) }}</p>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="border-t border-gray-700 my-4"></div>

    <!-- Order Totals -->
    <div class="space-y-2">
      <!-- Subtotal -->
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-400">Subtotal</span>
        <span class="font-medium text-white">{{ formatPrice(subtotal) }}</span>
      </div>

      <!-- Discount -->
      <div v-if="discountAmount > 0" class="flex items-center justify-between text-sm">
        <span class="text-green-400">Discount</span>
        <span class="font-medium text-green-400">-{{ formatPrice(discountAmount) }}</span>
      </div>

      <!-- Shipping -->
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-400">Shipping</span>
        <span class="font-medium text-white">
          {{ shipping !== null ? formatPrice(shipping) : 'Calculated at next step' }}
        </span>
      </div>

      <!-- Tax -->
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-400">Tax</span>
        <span class="font-medium text-white">
          {{ tax !== null ? formatPrice(tax) : 'Calculated at next step' }}
        </span>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-700 pt-2 mt-2">
        <div class="flex items-center justify-between">
          <span class="text-base font-semibold text-white">Total</span>
          <span class="text-xl font-bold text-punk-orange">{{ formatPrice(total) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCart } from '@/composables/useCart'
import { formatPrice } from '@/utils/formatters'

interface Props {
  shipping?: number | null
  tax?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  shipping: null,
  tax: null
})

const { items, subtotal, discountAmount } = useCart()

const total = computed(() => {
  let amount = Number(subtotal.value) || 0
  amount -= Number(discountAmount.value) || 0

  if (props.shipping !== null && props.shipping !== undefined) {
    amount += Number(props.shipping) || 0
  }

  if (props.tax !== null && props.tax !== undefined) {
    amount += Number(props.tax) || 0
  }

  return amount
})
</script>
