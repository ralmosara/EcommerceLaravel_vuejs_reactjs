<template>
  <div class="min-h-screen bg-punk-dark">
    <!-- Hero Section -->
    <section class="relative bg-punk-black overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5">
        <div
          class="absolute inset-0"
          :style="{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255,107,53,0.1) 10px,
              rgba(255,107,53,0.1) 20px
            )`
          }"
        />
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <!-- Left Side - Album Info -->
          <div class="order-2 lg:order-1 text-center lg:text-left">
            <span class="inline-block px-4 py-1 bg-punk-orange text-white text-xs font-bold uppercase tracking-wider mb-4">
              Featured Release
            </span>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight">
              {{ heroAlbum?.title || 'MODERN NOSTALGIA' }}
            </h1>
            <p class="text-xl text-punk-orange font-medium mb-2">
              {{ heroAlbum?.artist?.name || 'The Echoes' }}
            </p>
            <p class="text-gray-400 mb-6 max-w-md mx-auto lg:mx-0">
              {{ heroAlbum?.description || 'A groundbreaking fusion of classic punk energy with modern production, featuring explosive riffs and anthemic choruses.' }}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <RouterLink
                :to="heroAlbum ? `/albums/${heroAlbum.slug}` : '/albums'"
                class="btn-punk text-center inline-flex items-center justify-center"
              >
                Shop Now
                <ArrowRightIcon class="ml-2 h-4 w-4" />
              </RouterLink>
              <button class="btn-punk-outline flex items-center justify-center">
                <PlayIcon class="mr-2 h-4 w-4" />
                Preview
              </button>
            </div>
          </div>

          <!-- Right Side - Album Cover -->
          <div class="order-1 lg:order-2 relative">
            <div class="relative mx-auto w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              <!-- Vinyl Record Behind -->
              <div class="absolute right-0 top-1/2 -translate-y-1/2 w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 vinyl-record animate-spin-slow" />

              <!-- Album Cover -->
              <div class="relative z-10 w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-punk-gray shadow-2xl">
                <img
                  v-if="heroAlbum?.cover_image"
                  :src="heroAlbum.cover_image"
                  :alt="heroAlbum.title"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-punk-gray to-punk-black">
                  <span class="text-6xl font-display font-bold text-punk-orange opacity-50">
                    VINYL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Divider -->
    <div class="section-divider" />

    <!-- New Drops Section -->
    <section class="bg-punk-dark py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-3xl sm:text-4xl font-display font-bold text-white">
              NEW DROPS
            </h2>
            <div class="w-20 h-1 bg-punk-orange mt-2" />
          </div>
          <div class="flex items-center gap-4">
            <button
              @click="scrollLeft"
              class="p-2 border border-gray-600 text-gray-400 hover:border-punk-orange hover:text-punk-orange transition-colors"
            >
              <ChevronLeftIcon class="h-5 w-5" />
            </button>
            <button
              @click="scrollRight"
              class="p-2 border border-gray-600 text-gray-400 hover:border-punk-orange hover:text-punk-orange transition-colors"
            >
              <ChevronRightIcon class="h-5 w-5" />
            </button>
            <RouterLink
              to="/albums?sort=newest"
              class="hidden sm:flex items-center text-punk-orange hover:text-punk-coral transition-colors font-medium"
            >
              View All
              <ArrowRightIcon class="ml-2 h-4 w-4" />
            </RouterLink>
          </div>
        </div>

        <!-- Albums Horizontal Scroll -->
        <div v-if="newReleasesLoading" class="flex gap-6 overflow-hidden">
          <div v-for="i in 5" :key="i" class="flex-shrink-0 w-48 animate-pulse">
            <div class="aspect-square bg-punk-gray mb-4" />
            <div class="h-4 bg-punk-gray w-3/4 mb-2" />
            <div class="h-3 bg-punk-gray w-1/2" />
          </div>
        </div>
        <div
          v-else
          ref="newDropsScroll"
          class="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
        >
          <div
            v-for="album in newReleases"
            :key="album.uuid"
            class="flex-shrink-0 w-48 sm:w-56"
          >
            <AlbumCard :album="album" />
          </div>
        </div>
      </div>
    </section>

    <!-- Section Divider -->
    <div class="section-divider" />

    <!-- Vinyl Exclusives Section -->
    <section class="bg-punk-black py-16 lg:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left - Text Content -->
          <div>
            <span class="inline-block px-3 py-1 border border-punk-orange text-punk-orange text-xs font-bold uppercase tracking-wider mb-4">
              Limited Edition
            </span>
            <h2 class="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              VINYL<br />
              <span class="text-gradient-punk">EXCLUSIVES</span>
            </h2>
            <p class="text-gray-400 text-lg mb-8 max-w-md">
              Discover our hand-picked collection of rare pressings, colored vinyl,
              and limited edition releases. Each piece is a unique addition to any
              collector's library.
            </p>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center text-gray-300">
                <span class="w-2 h-2 bg-punk-orange mr-3" />
                Hand-numbered limited editions
              </li>
              <li class="flex items-center text-gray-300">
                <span class="w-2 h-2 bg-punk-orange mr-3" />
                Exclusive colored vinyl variants
              </li>
              <li class="flex items-center text-gray-300">
                <span class="w-2 h-2 bg-punk-orange mr-3" />
                Premium packaging & inserts
              </li>
            </ul>
            <RouterLink
              to="/albums?format=VINYL"
              class="btn-punk inline-flex items-center"
            >
              Explore Collection
              <ArrowRightIcon class="ml-2 h-4 w-4" />
            </RouterLink>
          </div>

          <!-- Right - Featured Albums Grid -->
          <div class="relative">
            <div v-if="featuredLoading" class="grid grid-cols-2 gap-4">
              <div v-for="i in 4" :key="i" class="aspect-square bg-punk-gray animate-pulse" />
            </div>
            <div v-else-if="featuredAlbums.length > 0" class="grid grid-cols-2 gap-4">
              <RouterLink
                v-for="(album, index) in featuredAlbums.slice(0, 4)"
                :key="album.uuid"
                :to="`/albums/${album.slug}`"
                :class="[
                  'group relative aspect-square overflow-hidden bg-punk-gray',
                  activeIndex === index ? 'ring-2 ring-punk-orange' : ''
                ]"
                @mouseenter="activeIndex = index"
              >
                <img
                  v-if="album.cover_image"
                  :src="album.cover_image"
                  :alt="album.title"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <span class="text-2xl font-bold text-punk-orange opacity-50">
                    {{ album.title.charAt(0) }}
                  </span>
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="absolute bottom-0 left-0 right-0 p-4">
                    <p class="text-white font-bold truncate">{{ album.title }}</p>
                    <p class="text-punk-orange text-sm">{{ album.artist?.name }}</p>
                  </div>
                </div>
              </RouterLink>
            </div>
            <div v-else class="text-center text-gray-400 py-12">
              No exclusive albums available at the moment.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Divider -->
    <div class="section-divider" />

    <!-- Shop by Genre Section -->
    <section class="bg-punk-dark py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
            SHOP BY GENRE
          </h2>
          <div class="w-20 h-1 bg-punk-orange mx-auto" />
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <RouterLink
            v-for="category in categories"
            :key="category.slug"
            :to="`/genres/${category.slug}`"
            class="group relative aspect-square overflow-hidden bg-punk-gray"
          >
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
            <div class="absolute inset-0 flex items-center justify-center z-20">
              <span class="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-white group-hover:text-punk-orange transition-colors uppercase">
                {{ category.name }}
              </span>
            </div>
            <div class="absolute inset-0 bg-punk-orange/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Section Divider -->
    <div class="section-divider" />

    <!-- On Sale Section -->
    <section class="bg-punk-black py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-3xl sm:text-4xl font-display font-bold text-white">
              HOT DEALS
            </h2>
            <div class="w-20 h-1 bg-punk-orange mt-2" />
          </div>
          <RouterLink
            to="/albums?on_sale=true"
            class="flex items-center text-punk-orange hover:text-punk-coral transition-colors font-medium"
          >
            View All
            <ArrowRightIcon class="ml-2 h-4 w-4" />
          </RouterLink>
        </div>

        <!-- Albums Grid -->
        <div v-if="onSaleLoading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          <div v-for="i in 4" :key="i" class="animate-pulse">
            <div class="aspect-square bg-punk-gray mb-4" />
            <div class="h-4 bg-punk-gray w-3/4 mb-2" />
            <div class="h-3 bg-punk-gray w-1/2" />
          </div>
        </div>
        <div v-else-if="onSaleAlbums.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          <AlbumCard
            v-for="album in onSaleAlbums.slice(0, 4)"
            :key="album.uuid"
            :album="album"
          />
        </div>
        <div v-else class="text-center text-gray-400 py-12">
          No albums on sale at the moment. Check back soon!
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <NewsletterSignup variant="banner" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ArrowRightIcon,
  PlayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'
import { albumsApi } from '@/api/endpoints/albums'
import type { Album } from '@/api/types/models'
import AlbumCard from '@/components/product/AlbumCard.vue'
import NewsletterSignup from '@/components/newsletter/NewsletterSignup.vue'

// Data
const featuredAlbums = ref<Album[]>([])
const newReleases = ref<Album[]>([])
const onSaleAlbums = ref<Album[]>([])

// Loading states
const featuredLoading = ref(true)
const newReleasesLoading = ref(true)
const onSaleLoading = ref(true)

// Active index for vinyl exclusives
const activeIndex = ref(0)

// Scroll ref
const newDropsScroll = ref<HTMLElement | null>(null)

// Hero album is the first featured album
const heroAlbum = computed(() => featuredAlbums.value[0])

// Categories
const categories = [
  { name: 'Punk Rock', slug: 'punk' },
  { name: 'Alternative', slug: 'alternative' },
  { name: 'Indie', slug: 'indie' },
  { name: 'Metal', slug: 'metal' },
]

// Scroll functions
const scrollLeft = () => {
  if (newDropsScroll.value) {
    newDropsScroll.value.scrollBy({ left: -300, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (newDropsScroll.value) {
    newDropsScroll.value.scrollBy({ left: 300, behavior: 'smooth' })
  }
}

// Fetch data
onMounted(async () => {
  // Fetch featured albums
  try {
    const featured = await albumsApi.getFeaturedAlbums()
    featuredAlbums.value = featured
  } catch (error) {
    console.error('Failed to fetch featured albums:', error)
  } finally {
    featuredLoading.value = false
  }

  // Fetch new releases
  try {
    const releases = await albumsApi.getNewReleases()
    newReleases.value = releases
  } catch (error) {
    console.error('Failed to fetch new releases:', error)
  } finally {
    newReleasesLoading.value = false
  }

  // Fetch on sale albums
  try {
    const onSale = await albumsApi.getOnSaleAlbums()
    onSaleAlbums.value = onSale
  } catch (error) {
    console.error('Failed to fetch on sale albums:', error)
  } finally {
    onSaleLoading.value = false
  }
})
</script>
