<template>
  <div class="min-h-screen bg-punk-dark">
    <div class="flex">
      <!-- Mobile Sidebar Overlay -->
      <Transition
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="sidebarOpen"
          class="fixed inset-0 bg-black/60 z-40 lg:hidden"
          @click="sidebarOpen = false"
        />
      </Transition>

      <!-- Sidebar -->
      <aside
        :class="[
          'fixed inset-y-0 left-0 z-50 w-64 bg-punk-black border-r border-gray-800 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]"
      >
        <!-- Logo -->
        <div class="p-6 border-b border-gray-800">
          <RouterLink to="/admin" class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-punk-orange flex items-center justify-center">
              <div class="w-4 h-4 rounded-full bg-punk-black" />
            </div>
            <div>
              <span class="text-xl font-display font-bold text-white">VINYL</span>
              <span class="block text-xs text-punk-orange uppercase tracking-wider">Admin</span>
            </div>
          </RouterLink>
        </div>

        <!-- Navigation -->
        <nav class="mt-6 px-3">
          <div class="space-y-1">
            <RouterLink
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              @click="sidebarOpen = false"
              :class="[
                'flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all',
                isActive(item.path)
                  ? 'bg-punk-orange text-white'
                  : 'text-gray-400 hover:text-white hover:bg-punk-gray'
              ]"
            >
              <component :is="item.icon" class="h-5 w-5 mr-3" />
              {{ item.name }}
            </RouterLink>
          </div>

          <!-- Divider -->
          <div class="border-t border-gray-800 my-6" />

          <!-- Back to Store -->
          <RouterLink
            to="/"
            class="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-punk-gray transition-all"
          >
            <ArrowLeftIcon class="h-5 w-5 mr-3" />
            Back to Store
          </RouterLink>
        </nav>

        <!-- User Info at Bottom -->
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-punk-gray flex items-center justify-center">
                <UserIcon class="h-4 w-4 text-gray-400" />
              </div>
              <div class="text-sm">
                <p class="text-white font-medium truncate max-w-[120px]">{{ authStore.user?.name }}</p>
                <p class="text-gray-500 text-xs">Administrator</p>
              </div>
            </div>
            <button
              @click="handleLogout"
              class="p-2 text-gray-400 hover:text-punk-orange transition-colors"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <div class="flex-1 min-h-screen">
        <!-- Top Header -->
        <header class="sticky top-0 z-30 bg-punk-dark/95 backdrop-blur border-b border-gray-800">
          <div class="flex items-center justify-between px-4 lg:px-8 py-4">
            <!-- Mobile Menu Button -->
            <button
              @click="sidebarOpen = true"
              class="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Bars3Icon class="h-6 w-6" />
            </button>

            <!-- Page Title -->
            <h1 class="text-xl font-display font-bold text-white uppercase tracking-wider hidden lg:block">
              {{ pageTitle }}
            </h1>

            <!-- Right Side -->
            <div class="flex items-center gap-4">
              <!-- Notifications -->
              <button class="relative p-2 text-gray-400 hover:text-white transition-colors">
                <BellIcon class="h-5 w-5" />
                <span class="absolute top-1 right-1 w-2 h-2 bg-punk-orange rounded-full" />
              </button>

              <!-- User Dropdown (Desktop) -->
              <div class="hidden lg:flex items-center gap-3">
                <span class="text-sm text-gray-400">{{ authStore.user?.email }}</span>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="p-4 lg:p-8">
          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  CubeIcon,
  MusicalNoteIcon,
  UserGroupIcon,
  TagIcon,
  ArrowLeftIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  Bars3Icon,
  BellIcon,
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

const menuItems = [
  { name: 'Dashboard', path: '/admin', icon: HomeIcon },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingBagIcon },
  { name: 'Users', path: '/admin/users', icon: UsersIcon },
  { name: 'Inventory', path: '/admin/inventory', icon: CubeIcon },
  { name: 'Albums', path: '/admin/albums', icon: MusicalNoteIcon },
  { name: 'Artists', path: '/admin/artists', icon: UserGroupIcon },
  { name: 'Genres', path: '/admin/genres', icon: TagIcon },
]

const isActive = (path: string) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/orders': 'Orders',
    '/admin/users': 'Users',
    '/admin/inventory': 'Inventory',
    '/admin/albums': 'Albums',
    '/admin/artists': 'Artists',
    '/admin/genres': 'Genres'
  }
  return titles[route.path] || 'Admin'
})

const handleLogout = () => {
  authStore.logout()
}
</script>
