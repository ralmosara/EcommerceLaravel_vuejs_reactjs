<template>
  <div class="min-h-screen bg-punk-dark">
    <div class="mx-auto max-w-7xl px-4 py-8">
      <!-- Page Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-display font-bold text-white uppercase tracking-wider">My Wishlist</h1>
          <p class="mt-2 text-gray-400">
            {{ wishlistItems.length }} item{{ wishlistItems.length !== 1 ? 's' : '' }} saved
          </p>
        </div>
        <button
          v-if="wishlistItems.length > 0"
          @click="handleClearWishlist"
          class="btn-punk-outline py-2 px-4 text-sm"
        >
          <TrashIcon class="h-4 w-4 mr-2" />
          Clear All
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-punk-orange"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="wishlistItems.length === 0" class="text-center py-20">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-punk-gray flex items-center justify-center">
          <HeartIcon class="h-12 w-12 text-gray-500" />
        </div>
        <h3 class="text-xl font-display font-bold text-white uppercase tracking-wider">
          Your wishlist is empty
        </h3>
        <p class="mt-2 text-gray-400 max-w-md mx-auto">
          Start adding albums you love to your wishlist. Click the heart icon on any album to save it for later.
        </p>
        <RouterLink to="/albums" class="mt-6 inline-block btn-punk py-3 px-6">
          Browse Albums
        </RouterLink>
      </div>

      <!-- Wishlist Grid -->
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="item in wishlistItems"
          :key="item.album.uuid"
          class="group relative bg-punk-gray rounded-lg border border-gray-700 overflow-hidden"
        >
          <!-- Album Image -->
          <RouterLink :to="`/albums/${item.album.slug}`" class="block aspect-square overflow-hidden">
            <img
              v-if="item.album.cover_image"
              :src="item.album.cover_image"
              :alt="item.album.title"
              class="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
            <div v-else class="h-full w-full flex items-center justify-center bg-punk-black">
              <MusicalNoteIcon class="h-20 w-20 text-gray-600" />
            </div>
          </RouterLink>

          <!-- Remove Button -->
          <button
            @click="handleRemoveItem(item.album.uuid)"
            class="absolute top-3 right-3 p-2 bg-punk-black/80 rounded-full text-red-400 hover:text-red-500 hover:bg-punk-black transition-colors"
            title="Remove from wishlist"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>

          <!-- Sale Badge -->
          <div v-if="item.album.sale_price" class="absolute top-3 left-3 bg-punk-orange text-white px-2 py-1 text-xs font-bold uppercase tracking-wider">
            Sale
          </div>

          <!-- Album Info -->
          <div class="p-4">
            <RouterLink :to="`/albums/${item.album.slug}`">
              <h3 class="font-semibold text-white group-hover:text-punk-orange transition-colors truncate">
                {{ item.album.title }}
              </h3>
            </RouterLink>
            <RouterLink
              v-if="item.album.artist"
              :to="`/artists/${item.album.artist.slug}`"
              class="text-sm text-gray-400 hover:text-punk-orange transition-colors truncate block"
            >
              {{ item.album.artist.name }}
            </RouterLink>

            <!-- Price & Add to Cart -->
            <div class="mt-4 flex items-center justify-between">
              <div class="flex items-baseline gap-2">
                <span v-if="item.album.sale_price" class="text-lg font-bold text-punk-orange">
                  ${{ item.album.sale_price.toFixed(2) }}
                </span>
                <span
                  :class="item.album.sale_price ? 'text-sm text-gray-500 line-through' : 'text-lg font-bold text-white'"
                >
                  ${{ item.album.price.toFixed(2) }}
                </span>
              </div>
              <button
                @click="handleAddToCart(item.album)"
                :disabled="!isInStock(item.album)"
                class="p-2 rounded-lg bg-punk-orange text-white hover:bg-punk-coral disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                :title="isInStock(item.album) ? 'Add to cart' : 'Out of stock'"
              >
                <ShoppingCartIcon class="h-5 w-5" />
              </button>
            </div>

            <!-- Stock Status -->
            <p
              :class="[
                'mt-2 text-xs font-medium',
                isInStock(item.album) ? 'text-green-400' : 'text-red-400'
              ]"
            >
              {{ isInStock(item.album) ? 'In Stock' : 'Out of Stock' }}
            </p>

            <!-- Added Date -->
            <p class="mt-2 text-xs text-gray-500">
              Added {{ formatDate(item.added_at) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Continue Shopping -->
      <div v-if="wishlistItems.length > 0" class="mt-12 text-center">
        <RouterLink
          to="/albums"
          class="inline-flex items-center gap-2 text-punk-orange hover:text-punk-coral transition-colors"
        >
          <ArrowLeftIcon class="h-5 w-5" />
          Continue Shopping
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  HeartIcon,
  TrashIcon,
  XMarkIcon,
  ShoppingCartIcon,
  MusicalNoteIcon,
  ArrowLeftIcon
} from '@heroicons/vue/24/outline'
import { useCart } from '@/composables/useCart'
import { useToast } from 'vue-toastification'
import type { Album } from '@/api/types/models'

interface WishlistItem {
  album: Album
  added_at: string
}

const toast = useToast()
const { addAlbumToCart } = useCart()

const wishlistItems = ref<WishlistItem[]>([])
const isLoading = ref(true)

// Load wishlist from localStorage
const loadWishlist = () => {
  try {
    const stored = localStorage.getItem('wishlist')
    if (stored) {
      wishlistItems.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load wishlist:', error)
  } finally {
    isLoading.value = false
  }
}

// Save wishlist to localStorage
const saveWishlist = () => {
  localStorage.setItem('wishlist', JSON.stringify(wishlistItems.value))
}

const isInStock = (album: Album) => {
  return album.inventory?.quantity && album.inventory.quantity > 0
}

const handleRemoveItem = (albumUuid: string) => {
  wishlistItems.value = wishlistItems.value.filter(item => item.album.uuid !== albumUuid)
  saveWishlist()
  toast.success('Removed from wishlist')
}

const handleClearWishlist = () => {
  wishlistItems.value = []
  saveWishlist()
  toast.success('Wishlist cleared')
}

const handleAddToCart = async (album: Album) => {
  if (!isInStock(album)) return

  try {
    await addAlbumToCart(album.id, 1)
    toast.success(`${album.title} added to cart`)
  } catch (error) {
    toast.error('Failed to add to cart')
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'today'
  if (diffInDays === 1) return 'yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

onMounted(() => {
  loadWishlist()
})
</script>
