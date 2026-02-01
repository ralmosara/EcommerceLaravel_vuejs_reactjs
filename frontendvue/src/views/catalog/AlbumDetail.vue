<template>
  <div class="min-h-screen bg-punk-dark">
    <div class="mx-auto max-w-7xl px-4 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-punk-orange" />
      </div>

      <div v-else-if="album">
        <!-- Breadcrumb -->
        <nav class="mb-6">
          <ol class="flex items-center space-x-2 text-sm">
            <li>
              <RouterLink to="/" class="text-gray-400 hover:text-punk-orange transition-colors">Home</RouterLink>
            </li>
            <li><ChevronRightIcon class="h-4 w-4 text-gray-600" /></li>
            <li>
              <RouterLink to="/albums" class="text-gray-400 hover:text-punk-orange transition-colors">Albums</RouterLink>
            </li>
            <li><ChevronRightIcon class="h-4 w-4 text-gray-600" /></li>
            <li class="text-white font-medium truncate max-w-[200px]">{{ album.title }}</li>
          </ol>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <!-- Album Cover -->
          <div class="relative">
            <div class="aspect-square overflow-hidden rounded-lg bg-punk-gray">
              <img
                v-if="album.cover_image"
                :src="album.cover_image"
                :alt="album.title"
                class="h-full w-full object-cover object-center"
              />
              <div v-else class="h-full w-full flex items-center justify-center">
                <MusicalNoteIcon class="h-32 w-32 text-gray-600" />
              </div>
            </div>

            <!-- Sale Badge -->
            <div v-if="album.sale_price" class="absolute top-4 left-4 bg-punk-orange text-white px-3 py-1 text-sm font-bold uppercase tracking-wider">
              Sale
            </div>

            <!-- Featured Badge -->
            <div v-if="album.is_featured" class="absolute top-4 right-4 bg-punk-coral text-white px-3 py-1 text-sm font-bold uppercase tracking-wider">
              Featured
            </div>
          </div>

          <!-- Album Info -->
          <div>
            <div class="mb-6">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h1 class="text-3xl lg:text-4xl font-display font-bold text-white uppercase tracking-wider">
                    {{ album.title }}
                  </h1>
                  <RouterLink
                    :to="`/artists/${album.artist?.slug}`"
                    class="mt-2 inline-block text-xl text-punk-orange hover:text-punk-coral transition-colors"
                  >
                    {{ album.artist?.name }}
                  </RouterLink>
                </div>

                <!-- Wishlist Button -->
                <button
                  v-if="authStore.isAuthenticated"
                  @click="toggleWishlist"
                  class="p-3 rounded-lg bg-punk-gray border border-gray-700 hover:border-punk-orange transition-colors"
                  :title="isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'"
                >
                  <HeartIcon
                    :class="[
                      'h-6 w-6 transition-colors',
                      isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
                    ]"
                  />
                </button>
              </div>

              <!-- Rating -->
              <div class="mt-4">
                <RatingStars
                  v-if="album.avg_rating"
                  :rating="album.avg_rating"
                  :count="album.reviews_count"
                  :show-count="true"
                />
                <p v-else class="text-sm text-gray-500">No reviews yet</p>
              </div>

              <!-- Genres -->
              <div v-if="album.genres && album.genres.length > 0" class="mt-4 flex flex-wrap gap-2">
                <RouterLink
                  v-for="genre in album.genres"
                  :key="genre.id"
                  :to="`/genres/${genre.slug}`"
                  class="inline-block bg-punk-gray border border-gray-700 text-gray-300 px-3 py-1 text-sm hover:border-punk-orange hover:text-punk-orange transition-colors"
                >
                  {{ genre.name }}
                </RouterLink>
              </div>
            </div>

            <!-- Details -->
            <div class="bg-punk-gray rounded-lg p-6 border border-gray-700 space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-400">Format</span>
                <span class="font-medium text-punk-orange uppercase tracking-wider">
                  {{ formatAlbumFormat(album.format) }}
                </span>
              </div>
              <div v-if="album.release_year" class="flex items-center justify-between text-sm">
                <span class="text-gray-400">Release Year</span>
                <span class="font-medium text-white">{{ album.release_year }}</span>
              </div>
              <div v-if="album.label" class="flex items-center justify-between text-sm">
                <span class="text-gray-400">Label</span>
                <span class="font-medium text-white">{{ album.label }}</span>
              </div>
              <div v-if="album.catalog_number" class="flex items-center justify-between text-sm">
                <span class="text-gray-400">Catalog #</span>
                <span class="font-medium text-white">{{ album.catalog_number }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-400">Availability</span>
                <span
                  :class="[
                    'font-medium',
                    isInStock ? 'text-green-400' : 'text-red-400'
                  ]"
                >
                  {{ isInStock ? `In Stock (${album.inventory?.quantity} available)` : 'Out of Stock' }}
                </span>
              </div>
            </div>

            <!-- Description -->
            <div v-if="album.description" class="mt-6">
              <h3 class="text-sm font-semibold text-white mb-2 uppercase tracking-wider">About this album</h3>
              <p class="text-gray-400 leading-relaxed">{{ album.description }}</p>
            </div>

            <!-- Price & Actions -->
            <div class="mt-8">
              <div class="flex items-baseline gap-3 mb-4">
                <span
                  v-if="album.sale_price"
                  class="text-4xl font-bold text-punk-orange"
                >
                  {{ formatPrice(album.sale_price) }}
                </span>
                <span
                  :class="album.sale_price ? 'text-xl text-gray-500 line-through' : 'text-4xl font-bold text-white'"
                >
                  {{ formatPrice(album.price) }}
                </span>
                <span v-if="album.sale_price" class="text-sm text-green-400">
                  Save {{ formatPrice(album.price - album.sale_price) }}
                </span>
              </div>

              <!-- Quantity Selector -->
              <div class="flex items-center gap-4 mb-4">
                <span class="text-sm text-gray-400">Quantity:</span>
                <div class="flex items-center gap-2">
                  <button
                    @click="quantity > 1 && quantity--"
                    class="w-10 h-10 flex items-center justify-center bg-punk-gray border border-gray-700 rounded-lg text-white hover:border-punk-orange transition-colors"
                  >
                    <MinusIcon class="h-4 w-4" />
                  </button>
                  <span class="w-12 text-center text-white font-medium">{{ quantity }}</span>
                  <button
                    @click="quantity++"
                    class="w-10 h-10 flex items-center justify-center bg-punk-gray border border-gray-700 rounded-lg text-white hover:border-punk-orange transition-colors"
                  >
                    <PlusIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                @click="handleAddToCart"
                :disabled="!isInStock || cartLoading"
                class="w-full btn-punk py-4 text-lg"
                :class="{ 'opacity-50 cursor-not-allowed': !isInStock || cartLoading }"
              >
                <ShoppingCartIcon class="h-5 w-5 mr-2 inline" />
                <span v-if="!isInStock">Out of Stock</span>
                <span v-else-if="cartLoading">Adding to Cart...</span>
                <span v-else>Add to Cart</span>
              </button>

              <!-- Share Buttons -->
              <div class="mt-4 flex items-center gap-4">
                <span class="text-sm text-gray-400">Share:</span>
                <div class="flex gap-2">
                  <button class="p-2 bg-punk-gray rounded-lg text-gray-400 hover:text-white transition-colors">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </button>
                  <button class="p-2 bg-punk-gray rounded-lg text-gray-400 hover:text-white transition-colors">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </button>
                  <button class="p-2 bg-punk-gray rounded-lg text-gray-400 hover:text-white transition-colors">
                    <LinkIcon class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Track List -->
        <div v-if="album?.tracks && album.tracks.length > 0" class="mt-12">
          <h2 class="text-2xl font-display font-bold text-white uppercase tracking-wider mb-6">Track List</h2>
          <TrackList :tracks="album.tracks" />
        </div>

        <!-- Reviews Section -->
        <div class="mt-12">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-display font-bold text-white uppercase tracking-wider">
              Customer Reviews
            </h2>
            <button
              v-if="authStore.isAuthenticated"
              @click="showReviewForm = !showReviewForm"
              class="btn-punk-outline py-2 px-4 text-sm"
            >
              {{ showReviewForm ? 'Cancel' : 'Write a Review' }}
            </button>
          </div>

          <!-- Review Form -->
          <ReviewForm
            v-if="showReviewForm && authStore.isAuthenticated"
            :album-id="album.uuid"
            @submitted="handleReviewSubmitted"
            class="mb-8"
          />

          <!-- Reviews List -->
          <ReviewList :album-slug="album.slug" />
        </div>

        <!-- Recently Viewed -->
        <RecentlyViewed :exclude-slug="album.slug" class="mt-12" />
      </div>

      <!-- Not Found -->
      <div v-else class="text-center py-20">
        <MusicalNoteIcon class="h-16 w-16 mx-auto text-gray-600 mb-4" />
        <h2 class="text-2xl font-display font-bold text-white mb-2">Album Not Found</h2>
        <p class="text-gray-400 mb-6">The album you're looking for doesn't exist or has been removed.</p>
        <RouterLink to="/albums" class="btn-punk">Browse Albums</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import {
  MusicalNoteIcon,
  HeartIcon,
  ChevronRightIcon,
  ShoppingCartIcon,
  MinusIcon,
  PlusIcon,
  LinkIcon,
} from '@heroicons/vue/24/outline'
import { albumsApi } from '@/api/endpoints/albums'
import type { Album } from '@/api/types/models'
import RatingStars from '@/components/common/RatingStars.vue'
import TrackList from '@/components/product/TrackList.vue'
import ReviewForm from '@/components/product/ReviewForm.vue'
import ReviewList from '@/components/product/ReviewList.vue'
import RecentlyViewed from '@/components/product/RecentlyViewed.vue'
import { formatPrice, formatAlbumFormat } from '@/utils/formatters'
import { useAuthStore } from '@/stores/auth'
import { useCart } from '@/composables/useCart'
import { useRecentlyViewed } from '@/composables/useRecentlyViewed'

const route = useRoute()
const authStore = useAuthStore()
const { addAlbumToCart, loading: cartLoading } = useCart()
const { addItem: addToRecentlyViewed } = useRecentlyViewed()

const album = ref<Album>()
const quantity = ref(1)
const showReviewForm = ref(false)
const isInWishlist = ref(false)

const { data, isLoading } = useQuery({
  queryKey: ['album', route.params.slug],
  queryFn: () => albumsApi.getAlbumBySlug(route.params.slug as string)
})

watch(data, (newData) => {
  if (newData) {
    album.value = newData
    // Add to recently viewed
    addToRecentlyViewed(newData.slug)
  }
})

const isInStock = computed(() => {
  return album.value?.inventory?.quantity && album.value.inventory.quantity > 0
})

const handleAddToCart = async () => {
  if (!album.value || !isInStock.value) return

  try {
    await addAlbumToCart(album.value.id, quantity.value)
    quantity.value = 1
  } catch (error) {
    console.error('Failed to add item to cart:', error)
  }
}

const toggleWishlist = () => {
  isInWishlist.value = !isInWishlist.value
  // TODO: Implement wishlist API call
}

const handleReviewSubmitted = () => {
  showReviewForm.value = false
  // Refresh reviews
}
</script>
