<template>
  <div class="min-h-screen bg-punk-dark">
    <div class="mx-auto max-w-7xl px-4 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-display font-bold text-white uppercase tracking-wider">Shopping Cart</h1>
        <p v-if="!isEmpty" class="mt-2 text-gray-400">
          {{ itemCount }} item{{ itemCount !== 1 ? 's' : '' }} in your cart
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="!initialized && loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-punk-orange" />
      </div>

      <!-- Cart Content -->
      <div v-else-if="!isEmpty" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2">
          <div class="bg-punk-gray rounded-lg border border-gray-700">
            <!-- Cart Header -->
            <div class="px-6 py-4 border-b border-gray-700">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-white">Items</h2>
                <button
                  @click="handleClearCart"
                  :disabled="loading"
                  class="text-sm text-punk-orange hover:text-punk-coral transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            <!-- Cart Items List -->
            <div class="px-6">
              <CartItem
                v-for="item in items"
                :key="item.album.id"
                :item="item"
              />
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="lg:col-span-1">
          <div class="sticky top-20">
            <CartSummary />
          </div>
        </div>
      </div>

      <!-- Empty Cart State -->
      <div v-else class="text-center py-20">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-punk-gray flex items-center justify-center">
          <ShoppingCartIcon class="h-12 w-12 text-gray-500" />
        </div>
        <h3 class="text-2xl font-display font-bold text-white uppercase tracking-wider">
          Your cart is empty
        </h3>
        <p class="mt-3 text-gray-400 max-w-md mx-auto">
          Looks like you haven't added any albums to your cart yet. Browse our collection and find something you'll love.
        </p>
        <RouterLink
          to="/albums"
          class="mt-8 inline-flex items-center btn-punk"
        >
          <MusicalNoteIcon class="h-5 w-5 mr-2" />
          Browse Albums
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { ShoppingCartIcon, MusicalNoteIcon } from '@heroicons/vue/24/outline'
import { useCart } from '@/composables/useCart'
import CartItem from '@/components/cart/CartItem.vue'
import CartSummary from '@/components/cart/CartSummary.vue'

const {
  items,
  isEmpty,
  itemCount,
  loading,
  initialized,
  initializeCart,
  clearCart
} = useCart()

onMounted(() => {
  initializeCart()
})

const handleClearCart = async () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    try {
      await clearCart()
    } catch (error) {
      console.error('Failed to clear cart:', error)
    }
  }
}
</script>
