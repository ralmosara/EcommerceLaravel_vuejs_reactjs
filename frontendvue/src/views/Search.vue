<template>
  <div class="min-h-screen bg-punk-dark">
    <div class="mx-auto max-w-7xl px-4 py-8">
      <!-- Search Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-display font-bold text-white uppercase tracking-wider mb-6">Search Results</h1>

        <!-- Search Bar -->
        <div class="max-w-2xl">
          <SearchBar
            v-model="searchQuery"
            :suggestions="suggestions"
            :show-suggestions="showSuggestions"
            @input="handleSearchInput"
            @search="handleSearch"
            @clear="handleClear"
            @hide-suggestions="hideSuggestions"
            placeholder="Search for albums, artists..."
          />
        </div>

        <p v-if="currentQuery" class="mt-4 text-gray-400">
          Showing results for: <span class="font-semibold text-punk-orange">"{{ currentQuery }}"</span>
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isSearching" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-punk-orange"></div>
      </div>

      <!-- Search Results -->
      <div v-else-if="results">
        <!-- No Results -->
        <div v-if="!hasResults" class="text-center py-20">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-punk-gray flex items-center justify-center">
            <MagnifyingGlassIcon class="h-10 w-10 text-gray-500" />
          </div>
          <h3 class="text-xl font-display font-bold text-white uppercase tracking-wider">No results found</h3>
          <p class="mt-2 text-gray-400">Try adjusting your search query</p>
        </div>

        <!-- Results Found -->
        <div v-else class="space-y-12">
          <!-- Albums Section -->
          <div v-if="results.albums && results.albums.length > 0">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-display font-bold text-white uppercase tracking-wider">Albums</h2>
              <span class="text-sm text-gray-400 bg-punk-gray px-3 py-1 rounded-full">
                {{ results.albums.length }} found
              </span>
            </div>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AlbumCard v-for="album in results.albums" :key="album.uuid" :album="album" />
            </div>
          </div>

          <!-- Artists Section -->
          <div v-if="results.artists && results.artists.length > 0">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-display font-bold text-white uppercase tracking-wider">Artists</h2>
              <span class="text-sm text-gray-400 bg-punk-gray px-3 py-1 rounded-full">
                {{ results.artists.length }} found
              </span>
            </div>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <RouterLink
                v-for="artist in results.artists"
                :key="artist.id"
                :to="`/artists/${artist.slug}`"
                class="group block bg-punk-gray rounded-lg border border-gray-700 hover:border-punk-orange transition-all p-6"
              >
                <div class="flex items-center gap-4">
                  <div class="h-16 w-16 rounded-full bg-punk-black border-2 border-gray-700 group-hover:border-punk-orange transition-colors flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img
                      v-if="artist.profile_image"
                      :src="artist.profile_image"
                      :alt="artist.name"
                      class="h-16 w-16 rounded-full object-cover"
                    />
                    <UserIcon v-else class="h-8 w-8 text-gray-500" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-semibold text-white group-hover:text-punk-orange transition-colors truncate">
                      {{ artist.name }}
                    </h3>
                    <p v-if="artist.origin" class="text-sm text-gray-400">{{ artist.origin }}</p>
                    <p v-if="artist.albums_count" class="text-xs text-gray-500 mt-1">
                      {{ artist.albums_count }} album{{ artist.albums_count !== 1 ? 's' : '' }}
                    </p>
                  </div>
                  <ChevronRightIcon class="h-5 w-5 text-gray-600 group-hover:text-punk-orange transition-colors" />
                </div>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Initial State (no search performed) -->
      <div v-else class="text-center py-20">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-punk-gray flex items-center justify-center">
          <MagnifyingGlassIcon class="h-12 w-12 text-gray-500" />
        </div>
        <h3 class="text-xl font-display font-bold text-white uppercase tracking-wider">
          Search for albums and artists
        </h3>
        <p class="mt-2 text-gray-400">Enter a search term above to get started</p>

        <!-- Popular Searches -->
        <div class="mt-8">
          <p class="text-sm text-gray-500 mb-3">Popular searches:</p>
          <div class="flex flex-wrap justify-center gap-2">
            <button
              v-for="term in popularSearches"
              :key="term"
              @click="handleSearch(term)"
              class="px-4 py-2 bg-punk-gray border border-gray-700 rounded-full text-sm text-gray-400 hover:text-white hover:border-punk-orange transition-colors"
            >
              {{ term }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { MagnifyingGlassIcon, UserIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { useSearch } from '@/composables/useSearch'
import SearchBar from '@/components/search/SearchBar.vue'
import AlbumCard from '@/components/product/AlbumCard.vue'

const route = useRoute()
const {
  query: searchQuery,
  results,
  suggestions,
  isSearching,
  showSuggestions,
  hasResults,
  performSearch,
  fetchSuggestions,
  clearSearch,
  hideSuggestions
} = useSearch()

const currentQuery = ref('')
const popularSearches = ['Vinyl', 'Rock', 'Jazz', 'Limited Edition', 'Box Set']

const handleSearchInput = (query: string) => {
  searchQuery.value = query
  fetchSuggestions(query)
}

const handleSearch = async (query: string) => {
  currentQuery.value = query
  searchQuery.value = query
  await performSearch(query)
}

const handleClear = () => {
  clearSearch()
  currentQuery.value = ''
}

// Perform search from URL query parameter
watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery && typeof newQuery === 'string') {
      searchQuery.value = newQuery
      handleSearch(newQuery)
    }
  },
  { immediate: true }
)

onMounted(() => {
  const urlQuery = route.query.q
  if (urlQuery && typeof urlQuery === 'string') {
    searchQuery.value = urlQuery
    handleSearch(urlQuery)
  }
})
</script>
