<template>
  <div class="relative w-full" ref="searchContainer">
    <!-- Search Input -->
    <div class="relative">
      <input
        v-model="localQuery"
        @input="handleInput"
        @focus="handleFocus"
        @keydown.enter="handleSubmit"
        @keydown.escape="handleEscape"
        @keydown.down.prevent="navigateDown"
        @keydown.up.prevent="navigateUp"
        type="text"
        :placeholder="placeholder"
        class="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />

      <!-- Search Icon -->
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Clear Button -->
      <button
        v-if="localQuery"
        @click="handleClear"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Autocomplete Suggestions -->
    <div
      v-if="showSuggestions && suggestions.length > 0"
      class="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
    >
      <div
        v-for="(suggestion, index) in suggestions"
        :key="`${suggestion.type}-${suggestion.id}`"
        @click="handleSuggestionClick(suggestion)"
        @mouseenter="selectedIndex = index"
        :class="[
          'px-4 py-3 cursor-pointer transition-colors',
          selectedIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'
        ]"
      >
        <div class="flex items-center gap-3">
          <!-- Icon based on type -->
          <div class="flex-shrink-0">
            <svg v-if="suggestion.type === 'album'" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <svg v-else class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>

          <!-- Suggestion Content -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ suggestion.title }}</p>
            <p v-if="suggestion.subtitle" class="text-xs text-gray-500 truncate">{{ suggestion.subtitle }}</p>
          </div>

          <!-- Type Badge -->
          <span class="flex-shrink-0 text-xs text-gray-500 uppercase">
            {{ suggestion.type }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { SearchSuggestion } from '@/api/endpoints/search'

interface Props {
  modelValue: string
  suggestions: SearchSuggestion[]
  showSuggestions: boolean
  placeholder?: string
}

interface Emits {
  'update:modelValue': [value: string]
  'search': [query: string]
  'input': [query: string]
  'clear': []
  'hideSuggestions': []
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search albums, artists...'
})

const emit = defineEmits<Emits>()
const router = useRouter()

const localQuery = ref(props.modelValue)
const selectedIndex = ref(-1)
const searchContainer = ref<HTMLElement>()

watch(() => props.modelValue, (newVal) => {
  localQuery.value = newVal
})

const handleInput = () => {
  emit('update:modelValue', localQuery.value)
  emit('input', localQuery.value)
  selectedIndex.value = -1
}

const handleFocus = () => {
  if (localQuery.value) {
    emit('input', localQuery.value)
  }
}

const handleSubmit = () => {
  if (selectedIndex.value >= 0 && props.suggestions[selectedIndex.value]) {
    handleSuggestionClick(props.suggestions[selectedIndex.value])
  } else if (localQuery.value.trim()) {
    emit('search', localQuery.value)
    emit('hideSuggestions')
    router.push({ path: '/search', query: { q: localQuery.value } })
  }
}

const handleClear = () => {
  localQuery.value = ''
  emit('update:modelValue', '')
  emit('clear')
  selectedIndex.value = -1
}

const handleEscape = () => {
  emit('hideSuggestions')
  selectedIndex.value = -1
}

const navigateDown = () => {
  if (selectedIndex.value < props.suggestions.length - 1) {
    selectedIndex.value++
  }
}

const navigateUp = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--
  }
}

const handleSuggestionClick = (suggestion: SearchSuggestion) => {
  emit('hideSuggestions')
  const route = suggestion.type === 'album'
    ? `/albums/${suggestion.slug}`
    : `/artists/${suggestion.slug}`
  router.push(route)
  localQuery.value = ''
  emit('update:modelValue', '')
}

// Close suggestions when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
    emit('hideSuggestions')
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
