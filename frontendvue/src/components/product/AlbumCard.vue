<template>
  <div class="group relative bg-punk-gray rounded-lg overflow-hidden hover:ring-2 hover:ring-punk-orange transition-all duration-200">
    <RouterLink :to="album.slug ? `/albums/${album.slug}` : '#'" class="block">
      <!-- Album Cover -->
      <div class="aspect-square overflow-hidden bg-punk-black relative">
        <img
          v-if="album.cover_image"
          :src="album.cover_image"
          :alt="album.title"
          class="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
        />
        <div v-else class="h-full w-full flex items-center justify-center">
          <MusicalNoteIcon class="h-20 w-20 text-gray-600" />
        </div>

        <!-- Overlay on hover -->
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span class="text-white text-sm font-medium">View Details</span>
        </div>

        <!-- Sale Badge -->
        <div v-if="album.sale_price" class="absolute top-2 right-2 bg-punk-orange text-white px-2 py-1 text-xs font-bold uppercase tracking-wider">
          Sale
        </div>

        <!-- Featured Badge -->
        <div v-if="album.is_featured" class="absolute top-2 left-2 bg-punk-coral text-white px-2 py-1 text-xs font-bold uppercase tracking-wider">
          Featured
        </div>
      </div>

      <!-- Album Info -->
      <div class="p-4">
        <h3 class="text-sm font-semibold text-white line-clamp-1 group-hover:text-punk-orange transition-colors">
          {{ album.title }}
        </h3>

        <p class="mt-1 text-sm text-gray-400">
          {{ album.artist?.name || 'Unknown Artist' }}
        </p>

        <!-- Genres -->
        <div v-if="album.genres && album.genres.length > 0" class="mt-2 flex flex-wrap gap-1">
          <span
            v-for="genre in album.genres.slice(0, 2)"
            :key="genre.id"
            class="inline-block bg-punk-black text-gray-400 px-2 py-0.5 text-xs"
          >
            {{ genre.name }}
          </span>
        </div>

        <!-- Format -->
        <p class="mt-2 text-xs text-punk-orange uppercase tracking-wider">
          {{ formatAlbumFormat(album.format) }}
        </p>

        <!-- Rating -->
        <div class="mt-2">
          <RatingStars
            v-if="album.avg_rating"
            :rating="album.avg_rating"
            :count="album.reviews_count"
            :show-count="true"
          />
          <p v-else class="text-xs text-gray-500">No reviews yet</p>
        </div>

        <!-- Price -->
        <div class="mt-3 flex items-baseline gap-2">
          <span
            v-if="album.sale_price"
            class="text-lg font-bold text-punk-orange"
          >
            {{ formatPrice(album.sale_price) }}
          </span>
          <span
            :class="album.sale_price ? 'text-sm text-gray-500 line-through' : 'text-lg font-bold text-white'"
          >
            {{ formatPrice(album.price) }}
          </span>
        </div>
      </div>
    </RouterLink>

    <!-- Add to Cart Button -->
    <div class="p-4 pt-0">
      <button
        @click.prevent="handleAddToCart"
        class="w-full btn-punk text-sm py-2"
        :disabled="isOutOfStock || loading"
        :class="{ 'opacity-50 cursor-not-allowed': isOutOfStock || loading }"
      >
        <span v-if="isOutOfStock">Out of Stock</span>
        <span v-else-if="loading">Adding...</span>
        <span v-else>Add to Cart</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { MusicalNoteIcon } from '@heroicons/vue/24/outline'
import type { Album } from '@/api/types/models'
import RatingStars from '@/components/common/RatingStars.vue'
import { formatPrice, formatAlbumFormat } from '@/utils/formatters'
import { useCart } from '@/composables/useCart'

interface Props {
  album: Album
}

const props = defineProps<Props>()
const { addAlbumToCart, loading } = useCart()

const isOutOfStock = computed(() => {
  return !props.album.inventory || props.album.inventory.quantity <= 0
})

const handleAddToCart = async () => {
  if (isOutOfStock.value) return

  try {
    await addAlbumToCart(props.album.uuid, 1)
  } catch (error) {
    console.error('Failed to add item to cart:', error)
  }
}
</script>
