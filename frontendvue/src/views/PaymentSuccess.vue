<template>
  <div class="min-h-screen bg-punk-dark">
    <div class="mx-auto max-w-3xl px-4 py-12">
      <!-- Loading state -->
      <LoadingSpinner v-if="loading" />

      <!-- Success Content -->
      <div v-else-if="order" class="text-center">
        <!-- Success Icon -->
        <div class="mx-auto w-20 h-20 bg-green-900/30 border-2 border-green-500 rounded-full flex items-center justify-center mb-6">
          <svg class="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <!-- Success Message -->
        <h1 class="text-3xl font-display font-bold text-punk-orange uppercase tracking-wider mb-2">Payment Successful!</h1>
        <p class="text-lg text-gray-400 mb-8">Thank you for your order. We've sent a confirmation email with your order details.</p>

        <!-- Order Details Card -->
        <div class="bg-punk-gray rounded-lg border border-gray-700 p-6 text-left mb-6">
          <h2 class="text-lg font-semibold text-white uppercase tracking-wider mb-4">Order Details</h2>

          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Order Number:</span>
              <span class="font-medium text-punk-orange">{{ order.order_number }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Order Date:</span>
              <span class="font-medium text-white">{{ formatDate(order.created_at, 'long') }}</span>
            </div>
            <div class="flex justify-between text-sm items-center">
              <span class="text-gray-400">Status:</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-punk-orange/20 text-punk-orange border border-punk-orange/30">
                {{ formatOrderStatus(order.status) }}
              </span>
            </div>
            <div class="border-t border-gray-700 pt-3 mt-3">
              <div class="flex justify-between items-center">
                <span class="text-base font-semibold text-white">Total Paid:</span>
                <span class="text-2xl font-bold text-punk-orange">{{ formatPrice(order.total) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="bg-punk-gray rounded-lg border border-gray-700 p-6 text-left mb-6">
          <h2 class="text-lg font-semibold text-white uppercase tracking-wider mb-4">Items Ordered</h2>
          <div class="space-y-4">
            <div
              v-for="item in order.items"
              :key="item.album.id"
              class="flex items-center gap-4 pb-4 border-b border-gray-700 last:border-b-0 last:pb-0"
            >
              <div class="w-16 h-16 rounded-lg bg-punk-black flex-shrink-0 overflow-hidden">
                <img
                  v-if="item.album.cover_image"
                  :src="item.album.cover_image"
                  :alt="item.album.title"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-white truncate">{{ item.album.title }}</p>
                <p class="text-xs text-gray-400 truncate">{{ item.album.artist.name }}</p>
                <p class="text-xs text-punk-orange mt-1">Qty: {{ item.quantity }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-white">{{ formatPrice(item.price * item.quantity) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Shipping Address -->
        <div class="bg-punk-gray rounded-lg border border-gray-700 p-6 text-left mb-6">
          <h2 class="text-lg font-semibold text-white uppercase tracking-wider mb-4">Shipping Address</h2>
          <div class="text-sm text-gray-300 space-y-1">
            <p class="font-medium text-white">{{ order.shipping_address.full_name }}</p>
            <p>{{ order.shipping_address.address_line1 }}</p>
            <p v-if="order.shipping_address.address_line2">{{ order.shipping_address.address_line2 }}</p>
            <p>
              {{ order.shipping_address.city }}, {{ order.shipping_address.state }} {{ order.shipping_address.postal_code }}
            </p>
            <p>{{ order.shipping_address.country }}</p>
          </div>
        </div>

        <!-- Confirmation Email Notice -->
        <div class="bg-punk-orange/10 border border-punk-orange/30 rounded-lg p-4 mb-8">
          <div class="flex items-start gap-3">
            <svg class="h-5 w-5 text-punk-orange mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div class="flex-1">
              <p class="text-sm font-semibold text-punk-orange">Order confirmation sent</p>
              <p class="text-sm text-gray-300 mt-1">
                We've sent an order confirmation email with tracking information once your order ships.
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink
            to="/orders"
            class="btn-punk px-8 py-3 text-center"
          >
            View All Orders
          </RouterLink>
          <RouterLink
            to="/albums"
            class="btn-punk-outline px-8 py-3 text-center"
          >
            Continue Shopping
          </RouterLink>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <div class="mx-auto w-20 h-20 bg-red-900/30 border-2 border-red-500 rounded-full flex items-center justify-center mb-6">
          <svg class="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-display font-bold text-white uppercase tracking-wider">Order not found</h3>
        <p class="mt-2 text-gray-400">We couldn't find the order you're looking for</p>
        <RouterLink
          to="/"
          class="mt-6 inline-block btn-punk px-8 py-3"
        >
          Go Home
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { ordersApi } from '@/api/endpoints/orders'
import type { Order } from '@/api/types/models'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { formatPrice, formatDate, formatOrderStatus } from '@/utils/formatters'
import { useToast } from 'vue-toastification'

const route = useRoute()
const toast = useToast()

const loading = ref(true)
const order = ref<Order | null>(null)

onMounted(async () => {
  const orderUuid = route.query.order as string

  if (!orderUuid) {
    loading.value = false
    toast.error('No order ID provided')
    return
  }

  try {
    order.value = await ordersApi.getOrderByUuid(orderUuid)
  } catch (error) {
    console.error('Failed to load order:', error)
    toast.error('Failed to load order details')
  } finally {
    loading.value = false
  }
})
</script>
