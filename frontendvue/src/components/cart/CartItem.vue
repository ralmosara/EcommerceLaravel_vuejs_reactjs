<template>
  <div class="flex items-center gap-4 py-4 border-b border-gray-700 last:border-b-0">
    <!-- Album Cover -->
    <RouterLink
      :to="item.album.slug ? `/albums/${item.album.slug}` : '#'"
      class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-punk-black"
    >
      <img
        v-if="item.album.cover_image"
        :src="item.album.cover_image"
        :alt="item.album.title"
        class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <MusicalNoteIcon class="h-8 w-8 text-gray-600" />
      </div>
    </RouterLink>

    <!-- Item Details -->
    <div class="flex-1 min-w-0">
      <RouterLink
        :to="item.album.slug ? `/albums/${item.album.slug}` : '#'"
        class="block text-sm font-semibold text-white hover:text-punk-orange transition-colors truncate"
      >
        {{ item.album.title }}
      </RouterLink>
      <p class="text-sm text-gray-400 truncate">{{ item.album.artist?.name }}</p>
      <p class="text-xs text-punk-orange uppercase tracking-wider mt-1">
        {{ formatAlbumFormat(item.album.format) }}
      </p>
      <p class="text-sm font-medium text-white mt-1">{{ formatPrice(item.unit_price) }}</p>
    </div>

    <!-- Quantity Controls -->
    <div class="flex items-center gap-2">
      <button
        @click="handleDecrement"
        :disabled="loading"
        class="w-8 h-8 flex items-center justify-center rounded bg-punk-black border border-gray-700 text-gray-400 hover:text-white hover:border-punk-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MinusIcon class="h-4 w-4" />
      </button>
      <span class="w-8 text-center text-sm font-medium text-white">{{ item.quantity }}</span>
      <button
        @click="handleIncrement"
        :disabled="loading"
        class="w-8 h-8 flex items-center justify-center rounded bg-punk-black border border-gray-700 text-gray-400 hover:text-white hover:border-punk-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PlusIcon class="h-4 w-4" />
      </button>
    </div>

    <!-- Line Total -->
    <div class="text-right w-24">
      <p class="text-sm font-semibold text-white">{{ formatPrice(item.line_total) }}</p>
    </div>

    <!-- Remove Button -->
    <button
      @click="handleRemove"
      :disabled="loading"
      class="text-gray-500 hover:text-punk-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Remove item"
    >
      <TrashIcon class="h-5 w-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { MusicalNoteIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import type { CartItem } from '@/api/types/models'
import { useCart } from '@/composables/useCart'
import { formatPrice, formatAlbumFormat } from '@/utils/formatters'

interface Props {
  item: CartItem
}

const props = defineProps<Props>()
const { incrementQuantity, decrementQuantity, removeItem, loading } = useCart()

const handleIncrement = async () => {
  try {
    await incrementQuantity(props.item.album.uuid, props.item.quantity)
  } catch (error) {
    console.error('Failed to increment quantity:', error)
  }
}

const handleDecrement = async () => {
  try {
    await decrementQuantity(props.item.album.uuid, props.item.quantity)
  } catch (error) {
    console.error('Failed to decrement quantity:', error)
  }
}

const handleRemove = async () => {
  try {
    await removeItem(props.item.album.uuid)
  } catch (error) {
    console.error('Failed to remove item:', error)
  }
}
</script>
