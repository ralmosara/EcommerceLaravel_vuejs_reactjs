<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div v-for="i in 8" :key="i" class="animate-pulse">
        <div class="aspect-square bg-punk-gray rounded-lg" />
        <div class="mt-4 space-y-2">
          <div class="h-4 bg-punk-gray rounded w-3/4" />
          <div class="h-3 bg-punk-gray rounded w-1/2" />
          <div class="h-4 bg-punk-gray rounded w-1/4" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!albums || albums.length === 0" class="text-center py-20">
      <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-punk-gray flex items-center justify-center">
        <MusicalNoteIcon class="h-10 w-10 text-gray-500" />
      </div>
      <h3 class="text-xl font-display font-bold text-white uppercase tracking-wider">
        No albums found
      </h3>
      <p class="mt-2 text-gray-400">Try adjusting your filters or search criteria</p>
    </div>

    <!-- Albums Grid -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AlbumCard v-for="album in albums" :key="album.uuid" :album="album" />
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.last_page > 1" class="mt-8 flex justify-center">
      <nav class="flex items-center gap-2">
        <button
          @click="$emit('page-change', pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="px-4 py-2 rounded-lg bg-punk-gray border border-gray-700 text-sm font-medium text-gray-400 hover:text-white hover:border-punk-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon class="h-5 w-5" />
        </button>

        <div class="flex items-center gap-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="$emit('page-change', page)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              page === pagination.current_page
                ? 'bg-punk-orange text-white'
                : 'bg-punk-gray border border-gray-700 text-gray-400 hover:text-white hover:border-punk-orange'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="$emit('page-change', pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="px-4 py-2 rounded-lg bg-punk-gray border border-gray-700 text-sm font-medium text-gray-400 hover:text-white hover:border-punk-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRightIcon class="h-5 w-5" />
        </button>
      </nav>
    </div>

    <!-- Page Info -->
    <div v-if="pagination" class="mt-4 text-center text-sm text-gray-500">
      Showing {{ pagination.from || 0 }} - {{ pagination.to || 0 }} of {{ pagination.total || 0 }} albums
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MusicalNoteIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import type { Album, PaginationMeta } from '@/api/types/models'
import AlbumCard from './AlbumCard.vue'

interface Props {
  albums?: Album[]
  pagination?: PaginationMeta
  loading?: boolean
}

const props = defineProps<Props>()

defineEmits<{
  'page-change': [page: number]
}>()

const visiblePages = computed(() => {
  if (!props.pagination) return []

  const current = props.pagination.current_page
  const last = props.pagination.last_page
  const delta = 2
  const pages: number[] = []

  for (let i = Math.max(1, current - delta); i <= Math.min(last, current + delta); i++) {
    pages.push(i)
  }

  return pages
})
</script>
