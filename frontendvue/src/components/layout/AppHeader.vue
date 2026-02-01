<template>
  <header class="bg-punk-black border-b border-punk-gray sticky top-0 z-50">
    <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between items-center">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2">
          <!-- Vinyl icon -->
          <div class="w-8 h-8 rounded-full bg-punk-orange flex items-center justify-center">
            <div class="w-3 h-3 rounded-full bg-punk-black" />
          </div>
          <span class="text-2xl font-display font-bold tracking-tight text-white">
            VINYL
          </span>
        </RouterLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex md:items-center md:space-x-8">
          <RouterLink
            to="/albums"
            class="text-sm font-medium text-gray-300 hover:text-punk-orange transition-colors uppercase tracking-wide"
          >
            Shop
          </RouterLink>
          <RouterLink
            to="/albums?is_featured=true"
            class="text-sm font-medium text-gray-300 hover:text-punk-orange transition-colors uppercase tracking-wide"
          >
            Featured
          </RouterLink>
          <RouterLink
            to="/albums?on_sale=true"
            class="text-sm font-medium text-gray-300 hover:text-punk-orange transition-colors uppercase tracking-wide"
          >
            Deals
          </RouterLink>
          <RouterLink
            to="/about"
            class="text-sm font-medium text-gray-300 hover:text-punk-orange transition-colors uppercase tracking-wide"
          >
            About
          </RouterLink>
        </div>

        <!-- Desktop Search -->
        <div class="hidden md:flex flex-1 max-w-md mx-8">
          <SearchBar
            v-model="searchQuery"
            :suggestions="suggestions"
            :show-suggestions="showSuggestions"
            @input="handleSearchInput"
            @search="handleSearch"
            @clear="clearSearch"
            @hide-suggestions="hideSuggestions"
            class="w-full"
          />
        </div>

        <!-- Right side actions -->
        <div class="flex items-center space-x-4">
          <!-- Mobile Search Toggle -->
          <button
            @click="searchOpen = !searchOpen"
            class="md:hidden p-2 text-gray-400 hover:text-punk-orange transition-colors"
            aria-label="Search"
          >
            <MagnifyingGlassIcon class="h-5 w-5" />
          </button>

          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="p-2 text-gray-400 hover:text-punk-orange transition-colors"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <SunIcon v-if="isDark" class="h-5 w-5" />
            <MoonIcon v-else class="h-5 w-5" />
          </button>

          <!-- Wishlist -->
          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/wishlist"
            class="p-2 text-gray-400 hover:text-punk-orange transition-colors"
          >
            <HeartIcon class="h-5 w-5" />
          </RouterLink>

          <!-- Cart -->
          <RouterLink to="/cart" class="relative p-2 text-gray-400 hover:text-punk-orange transition-colors">
            <ShoppingCartIcon class="h-5 w-5" />
            <!-- Cart item count badge -->
            <span
              v-if="itemCount > 0"
              class="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-punk-orange text-white text-xs font-bold rounded-full"
            >
              {{ itemCount > 99 ? '99+' : itemCount }}
            </span>
          </RouterLink>

          <!-- User menu -->
          <div v-if="authStore.isAuthenticated" class="relative group">
            <button class="flex items-center space-x-2 p-2 text-gray-400 hover:text-punk-orange transition-colors">
              <UserIcon class="h-5 w-5" />
            </button>

            <!-- Dropdown menu -->
            <div class="absolute right-0 mt-2 w-48 bg-punk-gray rounded-lg shadow-xl border border-punk-gray opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div class="px-4 py-3 border-b border-gray-700">
                <p class="text-sm font-medium text-white">{{ authStore.user?.name }}</p>
                <p class="text-xs text-gray-400">{{ authStore.user?.email }}</p>
              </div>
              <RouterLink
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-300 hover:bg-punk-black hover:text-punk-orange transition-colors"
              >
                Profile
              </RouterLink>
              <RouterLink
                to="/orders"
                class="block px-4 py-2 text-sm text-gray-300 hover:bg-punk-black hover:text-punk-orange transition-colors"
              >
                My Orders
              </RouterLink>
              <RouterLink
                v-if="authStore.isAdmin"
                to="/admin"
                class="block px-4 py-2 text-sm text-gray-300 hover:bg-punk-black hover:text-punk-orange transition-colors"
              >
                Admin Dashboard
              </RouterLink>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-punk-black hover:text-punk-orange transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          <!-- Login/Register buttons -->
          <div v-else class="hidden md:flex items-center space-x-2">
            <RouterLink
              to="/login"
              class="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/register"
              class="px-4 py-2 text-sm font-bold bg-punk-orange text-white hover:bg-punk-coral transition-colors uppercase tracking-wide"
            >
              Sign Up
            </RouterLink>
          </div>

          <!-- Mobile Menu Toggle -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-gray-400 hover:text-punk-orange transition-colors"
          >
            <XMarkIcon v-if="mobileMenuOpen" class="h-6 w-6" />
            <Bars3Icon v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Search Bar -->
    <div
      v-if="searchOpen"
      class="md:hidden px-4 pb-4 bg-punk-black"
    >
      <SearchBar
        v-model="searchQuery"
        :suggestions="suggestions"
        :show-suggestions="showSuggestions"
        @input="handleSearchInput"
        @search="handleSearch"
        @clear="clearSearch"
        @hide-suggestions="hideSuggestions"
        class="w-full"
      />
    </div>

    <!-- Mobile Menu -->
    <div
      :class="[
        'md:hidden bg-punk-black border-t border-punk-gray transition-all duration-300 overflow-hidden',
        mobileMenuOpen ? 'max-h-96' : 'max-h-0'
      ]"
    >
      <nav class="px-4 py-4 space-y-2">
        <RouterLink
          to="/albums"
          @click="mobileMenuOpen = false"
          class="block py-2 text-gray-300 hover:text-punk-orange transition-colors uppercase tracking-wide font-medium"
        >
          Shop
        </RouterLink>
        <RouterLink
          to="/albums?is_featured=true"
          @click="mobileMenuOpen = false"
          class="block py-2 text-gray-300 hover:text-punk-orange transition-colors uppercase tracking-wide font-medium"
        >
          Featured
        </RouterLink>
        <RouterLink
          to="/albums?on_sale=true"
          @click="mobileMenuOpen = false"
          class="block py-2 text-gray-300 hover:text-punk-orange transition-colors uppercase tracking-wide font-medium"
        >
          Deals
        </RouterLink>
        <RouterLink
          to="/about"
          @click="mobileMenuOpen = false"
          class="block py-2 text-gray-300 hover:text-punk-orange transition-colors uppercase tracking-wide font-medium"
        >
          About
        </RouterLink>

        <div v-if="!authStore.isAuthenticated" class="pt-4 border-t border-punk-gray space-y-2">
          <RouterLink
            to="/login"
            @click="mobileMenuOpen = false"
            class="block py-2 text-gray-300 hover:text-punk-orange transition-colors"
          >
            Login
          </RouterLink>
          <RouterLink
            to="/register"
            @click="mobileMenuOpen = false"
            class="block py-2 px-4 bg-punk-orange text-white text-center font-bold uppercase tracking-wide"
          >
            Sign Up
          </RouterLink>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  MagnifyingGlassIcon,
  HeartIcon,
  ShoppingCartIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useSearch } from '@/composables/useSearch'
import { useCart } from '@/composables/useCart'
import { useTheme } from '@/composables/useTheme'
import SearchBar from '@/components/search/SearchBar.vue'

const authStore = useAuthStore()
const router = useRouter()
const mobileMenuOpen = ref(false)
const searchOpen = ref(false)

// Theme
const { isDark, toggleTheme } = useTheme()

// Initialize cart
const { itemCount, initializeCart } = useCart()

onMounted(() => {
  initializeCart()
})

const {
  query: searchQuery,
  suggestions,
  showSuggestions,
  fetchSuggestions,
  clearSearch: clearSearchComposable,
  hideSuggestions
} = useSearch()

const handleSearchInput = (query: string) => {
  fetchSuggestions(query)
}

const handleSearch = (query: string) => {
  searchOpen.value = false
  router.push({ path: '/search', query: { q: query } })
}

const clearSearch = () => {
  clearSearchComposable()
}

const handleLogout = () => {
  authStore.logout()
}
</script>
