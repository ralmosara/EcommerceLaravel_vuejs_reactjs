<template>
  <div class="min-h-screen bg-punk-dark">
    <div class="mx-auto max-w-7xl px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-display font-bold text-white uppercase tracking-wider">Albums</h1>
          <p class="mt-2 text-gray-400">
            {{ pagination?.total || 0 }} albums found
          </p>
        </div>
        <!-- Mobile Filter Toggle -->
        <button
          @click="showMobileFilters = true"
          class="lg:hidden btn-punk-outline py-2 px-4 text-sm"
        >
          <AdjustmentsHorizontalIcon class="h-5 w-5 mr-2" />
          Filters
        </button>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar (Desktop) -->
        <aside class="hidden lg:block lg:w-64 flex-shrink-0">
          <div class="bg-punk-gray rounded-lg border border-gray-700 p-6 sticky top-20">
            <h2 class="text-lg font-display font-bold text-white uppercase tracking-wider mb-4">
              Filters
            </h2>

            <!-- Format Filter -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-300 mb-3">Format</h3>
              <div class="space-y-2">
                <label
                  v-for="format in formats"
                  :key="format.value"
                  class="flex items-center cursor-pointer group"
                >
                  <input
                    v-model="filters.format"
                    type="radio"
                    :value="format.value"
                    class="h-4 w-4 text-punk-orange bg-punk-black border-gray-700 focus:ring-punk-orange focus:ring-offset-punk-gray"
                  />
                  <span class="ml-2 text-sm text-gray-400 group-hover:text-white transition-colors">
                    {{ format.label }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-300 mb-3">Price Range</h3>
              <div class="space-y-2">
                <input
                  v-model.number="filters.min_price"
                  type="number"
                  placeholder="Min price"
                  class="w-full px-3 py-2 bg-punk-black border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-punk-orange focus:ring-1 focus:ring-punk-orange transition-colors"
                  min="0"
                />
                <input
                  v-model.number="filters.max_price"
                  type="number"
                  placeholder="Max price"
                  class="w-full px-3 py-2 bg-punk-black border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-punk-orange focus:ring-1 focus:ring-punk-orange transition-colors"
                  min="0"
                />
              </div>
            </div>

            <!-- Sort By -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-300 mb-3">Sort By</h3>
              <select
                v-model="filters.sort"
                class="w-full px-3 py-2 bg-punk-black border border-gray-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-punk-orange focus:border-punk-orange transition-colors"
              >
                <option value="">Default</option>
                <option value="title">Title (A-Z)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <!-- On Sale Filter -->
            <div class="mb-6">
              <label class="flex items-center cursor-pointer group">
                <input
                  v-model="filters.on_sale"
                  type="checkbox"
                  class="h-4 w-4 text-punk-orange bg-punk-black border-gray-700 rounded focus:ring-punk-orange focus:ring-offset-punk-gray"
                />
                <span class="ml-2 text-sm text-gray-400 group-hover:text-white transition-colors">
                  On Sale Only
                </span>
              </label>
            </div>

            <!-- Clear Filters -->
            <button
              @click="clearFilters"
              class="w-full btn-punk-outline text-sm py-2"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        <!-- Mobile Filters Drawer -->
        <Teleport to="body">
          <Transition
            enter-active-class="transition-opacity duration-300"
            leave-active-class="transition-opacity duration-300"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
          >
            <div
              v-if="showMobileFilters"
              class="fixed inset-0 bg-black/60 z-40 lg:hidden"
              @click="showMobileFilters = false"
            />
          </Transition>

          <Transition
            enter-active-class="transition-transform duration-300"
            leave-active-class="transition-transform duration-300"
            enter-from-class="-translate-x-full"
            leave-to-class="-translate-x-full"
          >
            <div
              v-if="showMobileFilters"
              class="fixed inset-y-0 left-0 w-80 max-w-full bg-punk-gray z-50 lg:hidden overflow-y-auto"
            >
              <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-lg font-display font-bold text-white uppercase tracking-wider">
                    Filters
                  </h2>
                  <button
                    @click="showMobileFilters = false"
                    class="text-gray-400 hover:text-white transition-colors"
                  >
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </div>

                <!-- Mobile Format Filter -->
                <div class="mb-6">
                  <h3 class="text-sm font-medium text-gray-300 mb-3">Format</h3>
                  <div class="space-y-2">
                    <label
                      v-for="format in formats"
                      :key="format.value"
                      class="flex items-center cursor-pointer"
                    >
                      <input
                        v-model="filters.format"
                        type="radio"
                        :value="format.value"
                        class="h-4 w-4 text-punk-orange bg-punk-black border-gray-700 focus:ring-punk-orange"
                      />
                      <span class="ml-2 text-sm text-gray-400">{{ format.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- Mobile Price Range -->
                <div class="mb-6">
                  <h3 class="text-sm font-medium text-gray-300 mb-3">Price Range</h3>
                  <div class="flex gap-2">
                    <input
                      v-model.number="filters.min_price"
                      type="number"
                      placeholder="Min"
                      class="flex-1 px-3 py-2 bg-punk-black border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500"
                      min="0"
                    />
                    <input
                      v-model.number="filters.max_price"
                      type="number"
                      placeholder="Max"
                      class="flex-1 px-3 py-2 bg-punk-black border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500"
                      min="0"
                    />
                  </div>
                </div>

                <!-- Mobile Sort -->
                <div class="mb-6">
                  <h3 class="text-sm font-medium text-gray-300 mb-3">Sort By</h3>
                  <select
                    v-model="filters.sort"
                    class="w-full px-3 py-2 bg-punk-black border border-gray-700 rounded-lg text-sm text-white"
                  >
                    <option value="">Default</option>
                    <option value="title">Title (A-Z)</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                <!-- Mobile Actions -->
                <div class="flex gap-2">
                  <button
                    @click="clearFilters"
                    class="flex-1 btn-punk-outline py-2 text-sm"
                  >
                    Clear
                  </button>
                  <button
                    @click="showMobileFilters = false"
                    class="flex-1 btn-punk py-2 text-sm"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </Teleport>

        <!-- Albums Grid -->
        <main class="flex-1">
          <AlbumGrid
            :albums="albums"
            :pagination="pagination"
            :loading="isLoading"
            @page-change="handlePageChange"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { albumsApi } from '@/api/endpoints/albums'
import type { AlbumsQueryParams } from '@/api/endpoints/albums'
import type { Album, PaginationMeta } from '@/api/types/models'
import AlbumGrid from '@/components/product/AlbumGrid.vue'

const showMobileFilters = ref(false)

const formats = [
  { label: 'All Formats', value: '' },
  { label: 'Vinyl LP', value: 'VINYL' },
  { label: 'CD', value: 'CD' },
  { label: 'Cassette', value: 'CASSETTE' },
  { label: 'Digital', value: 'DIGITAL' }
]

const filters = reactive<AlbumsQueryParams>({
  page: 1,
  per_page: 12,
  format: '',
  min_price: undefined,
  max_price: undefined,
  sort: '',
  on_sale: false
})

const albums = ref<Album[]>([])
const pagination = ref<PaginationMeta>()

const { data, isLoading, refetch } = useQuery({
  queryKey: ['albums', filters],
  queryFn: async () => {
    const params: AlbumsQueryParams = {
      page: filters.page,
      per_page: filters.per_page
    }

    if (filters.format) params.format = filters.format
    if (filters.min_price) params.min_price = filters.min_price
    if (filters.max_price) params.max_price = filters.max_price
    if (filters.sort) params.sort = filters.sort
    if (filters.on_sale) params.on_sale = filters.on_sale

    return await albumsApi.getAlbums(params)
  }
})

watch(data, (newData) => {
  if (newData) {
    albums.value = newData.data
    pagination.value = newData.meta
  }
})

watch(
  () => [filters.format, filters.min_price, filters.max_price, filters.sort, filters.on_sale],
  () => {
    filters.page = 1 // Reset to first page when filters change
  }
)

const handlePageChange = (page: number) => {
  filters.page = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const clearFilters = () => {
  filters.format = ''
  filters.min_price = undefined
  filters.max_price = undefined
  filters.sort = ''
  filters.on_sale = false
  filters.page = 1
}

onMounted(() => {
  refetch()
})
</script>
