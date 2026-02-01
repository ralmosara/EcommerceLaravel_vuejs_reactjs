<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  XMarkIcon,
  FunnelIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/outline'
import { AlbumFormat, type Genre } from '@/api/types/models'
import { ALBUM_FORMAT_LABELS } from '@/utils/constants'

interface Props {
  genres?: Genre[]
  modelValue: {
    genre?: string
    format?: string
    minPrice?: number
    maxPrice?: number
    sort?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  genres: () => [],
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Props['modelValue']): void
  (e: 'clear'): void
}>()

const isOpen = ref(false)
const localFilters = ref({ ...props.modelValue })

const sortOptions = [
  { value: '', label: 'Default' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'title', label: 'Title A-Z' },
  { value: 'rating', label: 'Highest Rated' },
]

const formatOptions = Object.entries(ALBUM_FORMAT_LABELS).map(([value, label]) => ({
  value,
  label,
}))

const activeFiltersCount = computed(() => {
  let count = 0
  if (localFilters.value.genre) count++
  if (localFilters.value.format) count++
  if (localFilters.value.minPrice) count++
  if (localFilters.value.maxPrice) count++
  if (localFilters.value.sort) count++
  return count
})

watch(
  () => props.modelValue,
  (newVal) => {
    localFilters.value = { ...newVal }
  },
  { deep: true }
)

const applyFilters = () => {
  emit('update:modelValue', { ...localFilters.value })
  isOpen.value = false
}

const clearFilters = () => {
  localFilters.value = {}
  emit('update:modelValue', {})
  emit('clear')
}

const toggleMobileFilters = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div>
    <!-- Mobile filter button -->
    <button
      type="button"
      class="lg:hidden flex items-center gap-2 px-4 py-2 bg-punk-gray rounded-lg text-white hover:bg-punk-black transition-colors"
      @click="toggleMobileFilters"
    >
      <FunnelIcon class="h-5 w-5" />
      Filters
      <span
        v-if="activeFiltersCount > 0"
        class="ml-1 px-2 py-0.5 bg-punk-orange rounded-full text-xs"
      >
        {{ activeFiltersCount }}
      </span>
    </button>

    <!-- Mobile filter drawer -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isOpen"
          class="lg:hidden fixed inset-0 z-50 bg-black/70"
          @click="isOpen = false"
        />
      </Transition>

      <Transition
        enter-active-class="transition-transform duration-300"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-300"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div
          v-if="isOpen"
          class="lg:hidden fixed right-0 top-0 bottom-0 w-80 max-w-full bg-punk-dark z-50 overflow-y-auto"
        >
          <div class="p-4">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-semibold text-white">Filters</h2>
              <button
                type="button"
                class="text-gray-400 hover:text-white"
                @click="isOpen = false"
              >
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>

            <!-- Filter content (shared) -->
            <div class="space-y-6">
              <slot name="filters" :filters="localFilters" />
            </div>

            <!-- Mobile apply buttons -->
            <div class="mt-6 flex gap-3">
              <button
                type="button"
                class="flex-1 btn-punk-outline text-sm"
                @click="clearFilters"
              >
                Clear All
              </button>
              <button
                type="button"
                class="flex-1 btn-punk text-sm"
                @click="applyFilters"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Desktop sidebar filters -->
    <div class="hidden lg:block space-y-6">
      <!-- Sort -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
        <select
          v-model="localFilters.sort"
          class="w-full bg-punk-black border border-punk-gray rounded-lg px-3 py-2 text-white focus:border-punk-orange focus:ring-1 focus:ring-punk-orange"
          @change="applyFilters"
        >
          <option
            v-for="option in sortOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Genre -->
      <div v-if="props.genres.length > 0">
        <label class="block text-sm font-medium text-gray-300 mb-2">Genre</label>
        <select
          v-model="localFilters.genre"
          class="w-full bg-punk-black border border-punk-gray rounded-lg px-3 py-2 text-white focus:border-punk-orange focus:ring-1 focus:ring-punk-orange"
          @change="applyFilters"
        >
          <option value="">All Genres</option>
          <option
            v-for="genre in props.genres"
            :key="genre.slug"
            :value="genre.slug"
          >
            {{ genre.name }}
          </option>
        </select>
      </div>

      <!-- Format -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Format</label>
        <select
          v-model="localFilters.format"
          class="w-full bg-punk-black border border-punk-gray rounded-lg px-3 py-2 text-white focus:border-punk-orange focus:ring-1 focus:ring-punk-orange"
          @change="applyFilters"
        >
          <option value="">All Formats</option>
          <option
            v-for="format in formatOptions"
            :key="format.value"
            :value="format.value"
          >
            {{ format.label }}
          </option>
        </select>
      </div>

      <!-- Price Range -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
        <div class="flex items-center gap-2">
          <input
            v-model.number="localFilters.minPrice"
            type="number"
            min="0"
            placeholder="Min"
            class="w-full bg-punk-black border border-punk-gray rounded-lg px-3 py-2 text-white focus:border-punk-orange focus:ring-1 focus:ring-punk-orange"
            @change="applyFilters"
          />
          <span class="text-gray-500">-</span>
          <input
            v-model.number="localFilters.maxPrice"
            type="number"
            min="0"
            placeholder="Max"
            class="w-full bg-punk-black border border-punk-gray rounded-lg px-3 py-2 text-white focus:border-punk-orange focus:ring-1 focus:ring-punk-orange"
            @change="applyFilters"
          />
        </div>
      </div>

      <!-- Clear filters -->
      <button
        v-if="activeFiltersCount > 0"
        type="button"
        class="w-full text-sm text-punk-orange hover:text-punk-coral transition-colors"
        @click="clearFilters"
      >
        Clear all filters ({{ activeFiltersCount }})
      </button>
    </div>
  </div>
</template>
