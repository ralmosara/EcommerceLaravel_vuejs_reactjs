<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useRecentlyViewed } from '@/composables/useRecentlyViewed'
import { albumsApi } from '@/api/endpoints/albums'
import type { Album } from '@/api/types/models'
import AlbumCard from './AlbumCard.vue'

interface Props {
  excludeSlug?: string
}

const props = defineProps<Props>()

const { slugs, hasItems, clearAll } = useRecentlyViewed()
const albums = ref<Album[]>([])
const loading = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)

const fetchAlbums = async () => {
  if (!hasItems.value) return

  loading.value = true
  try {
    // Fetch albums for each slug
    const slugsToFetch = slugs.value
      .filter(slug => slug !== props.excludeSlug)
      .slice(0, 10)

    const albumPromises = slugsToFetch.map(slug =>
      albumsApi.getAlbumBySlug(slug).catch(() => null)
    )

    const results = await Promise.all(albumPromises)
    albums.value = results.filter((album): album is Album => album !== null)
  } catch (error) {
    console.error('Failed to fetch recently viewed albums:', error)
  } finally {
    loading.value = false
  }
}

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -300, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 300, behavior: 'smooth' })
  }
}

const handleClear = () => {
  clearAll()
  albums.value = []
}

watch(slugs, fetchAlbums, { immediate: true })

onMounted(fetchAlbums)
</script>

<template>
  <section v-if="albums.length > 0" class="py-8">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-display text-white uppercase tracking-wider">
        Recently Viewed
      </h2>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="text-sm text-gray-400 hover:text-punk-orange transition-colors"
          @click="handleClear"
        >
          Clear History
        </button>

        <div class="flex gap-1 ml-4">
          <button
            type="button"
            class="p-2 bg-punk-gray rounded-lg text-gray-400 hover:text-white hover:bg-punk-black transition-colors"
            @click="scrollLeft"
          >
            <ChevronLeftIcon class="h-5 w-5" />
          </button>
          <button
            type="button"
            class="p-2 bg-punk-gray rounded-lg text-gray-400 hover:text-white hover:bg-punk-black transition-colors"
            @click="scrollRight"
          >
            <ChevronRightIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex gap-4 overflow-hidden">
      <div
        v-for="n in 5"
        :key="n"
        class="flex-shrink-0 w-48"
      >
        <div class="aspect-square skeleton bg-punk-gray rounded-lg" />
        <div class="mt-2 space-y-2">
          <div class="skeleton h-4 w-3/4 bg-punk-gray rounded" />
          <div class="skeleton h-3 w-1/2 bg-punk-gray rounded" />
        </div>
      </div>
    </div>

    <!-- Albums carousel -->
    <div
      v-else
      ref="scrollContainer"
      class="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
    >
      <div
        v-for="album in albums"
        :key="album.slug"
        class="flex-shrink-0 w-48"
      >
        <AlbumCard :album="album" />
      </div>
    </div>
  </section>
</template>
