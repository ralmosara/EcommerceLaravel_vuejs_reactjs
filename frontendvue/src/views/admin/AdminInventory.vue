<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-display font-bold text-white uppercase tracking-wider">Inventory Management</h2>
        <p class="mt-1 text-gray-400">Track and manage stock levels</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative">
          <MagnifyingGlassIcon class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search albums..."
            class="pl-10 pr-4 py-2 bg-punk-black border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-punk-orange focus:border-punk-orange w-64"
          />
        </div>
        <select
          v-model="stockFilter"
          class="px-4 py-2 bg-punk-black border border-gray-700 rounded-lg text-white text-sm focus:ring-punk-orange focus:border-punk-orange"
        >
          <option value="">All Stock Levels</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
          <option value="in">In Stock</option>
        </select>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-punk-gray rounded-lg border border-gray-700 p-4">
        <p class="text-sm text-gray-400">Total Products</p>
        <p class="text-2xl font-bold text-white mt-1">{{ stats.total }}</p>
      </div>
      <div class="bg-punk-gray rounded-lg border border-gray-700 p-4">
        <p class="text-sm text-gray-400">In Stock</p>
        <p class="text-2xl font-bold text-green-400 mt-1">{{ stats.inStock }}</p>
      </div>
      <div class="bg-punk-gray rounded-lg border border-gray-700 p-4">
        <p class="text-sm text-gray-400">Low Stock</p>
        <p class="text-2xl font-bold text-yellow-400 mt-1">{{ stats.lowStock }}</p>
      </div>
      <div class="bg-punk-gray rounded-lg border border-gray-700 p-4">
        <p class="text-sm text-gray-400">Out of Stock</p>
        <p class="text-2xl font-bold text-red-400 mt-1">{{ stats.outOfStock }}</p>
      </div>
    </div>

    <!-- Low Stock Alerts -->
    <div v-if="lowStockItems.length > 0" class="bg-yellow-900/20 border border-yellow-900/50 rounded-lg p-4 mb-6">
      <div class="flex items-start gap-3">
        <ExclamationTriangleIcon class="h-6 w-6 text-yellow-400 flex-shrink-0" />
        <div>
          <h3 class="text-yellow-400 font-medium">Low Stock Alert</h3>
          <p class="text-sm text-yellow-400/70 mt-1">
            {{ lowStockItems.length }} items need restocking soon
          </p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-punk-orange"></div>
    </div>

    <!-- Inventory Table -->
    <div v-else class="bg-punk-gray rounded-lg border border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-punk-black">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Album
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Format
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                SKU
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Quantity
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Last Updated
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="item in filteredInventory" :key="item.id" class="hover:bg-punk-black/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <img
                    v-if="item.album?.cover_image"
                    :src="item.album.cover_image"
                    class="w-10 h-10 rounded object-cover"
                  />
                  <div v-else class="w-10 h-10 rounded bg-punk-black flex items-center justify-center">
                    <MusicalNoteIcon class="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-white">{{ item.album?.title }}</p>
                    <p class="text-xs text-gray-500">{{ item.album?.artist?.name }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-punk-orange uppercase">{{ item.album?.format }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ item.sku }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'text-sm font-medium',
                    getQuantityColor(item.quantity)
                  ]"
                >
                  {{ item.quantity }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStockStatusColor(item.quantity)
                  ]"
                >
                  {{ getStockStatus(item.quantity) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ formatDate(item.updated_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openUpdateModal(item)"
                    class="p-1.5 text-gray-400 hover:text-punk-orange transition-colors"
                    title="Update Stock"
                  >
                    <PencilIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click="openAddStockModal(item)"
                    class="p-1.5 text-gray-400 hover:text-green-400 transition-colors"
                    title="Add Stock"
                  >
                    <PlusIcon class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredInventory.length === 0" class="text-center py-12">
        <CubeIcon class="h-12 w-12 mx-auto text-gray-600 mb-4" />
        <p class="text-gray-400">No inventory items found</p>
      </div>
    </div>

    <!-- Update Stock Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div v-if="updateModalItem" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div class="bg-punk-gray rounded-lg border border-gray-700 max-w-md w-full p-6">
            <h3 class="text-xl font-bold text-white mb-4">Update Stock</h3>
            <p class="text-gray-400 mb-4">{{ updateModalItem.album?.title }}</p>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-300 mb-2">Current Quantity</label>
              <input
                v-model.number="newQuantity"
                type="number"
                min="0"
                class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white focus:ring-punk-orange focus:border-punk-orange"
              />
            </div>
            <div class="flex gap-4">
              <button @click="updateModalItem = null" class="flex-1 btn-punk-outline py-2">
                Cancel
              </button>
              <button @click="updateStock" class="flex-1 btn-punk py-2">
                Update
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Add Stock Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div v-if="addStockModalItem" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div class="bg-punk-gray rounded-lg border border-gray-700 max-w-md w-full p-6">
            <h3 class="text-xl font-bold text-white mb-4">Add Stock</h3>
            <p class="text-gray-400 mb-2">{{ addStockModalItem.album?.title }}</p>
            <p class="text-sm text-gray-500 mb-4">Current quantity: {{ addStockModalItem.quantity }}</p>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-300 mb-2">Quantity to Add</label>
              <input
                v-model.number="addQuantity"
                type="number"
                min="1"
                class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white focus:ring-punk-orange focus:border-punk-orange"
              />
            </div>
            <div class="flex gap-4">
              <button @click="addStockModalItem = null" class="flex-1 btn-punk-outline py-2">
                Cancel
              </button>
              <button @click="addStock" class="flex-1 btn-punk py-2">
                Add Stock
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  CubeIcon,
  MusicalNoteIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

interface InventoryItem {
  id: number
  album?: {
    title: string
    artist?: { name: string }
    cover_image?: string
    format: string
  }
  sku: string
  quantity: number
  updated_at: string
}

const toast = useToast()

const inventory = ref<InventoryItem[]>([])
const isLoading = ref(true)
const searchQuery = ref('')
const stockFilter = ref('')
const updateModalItem = ref<InventoryItem | null>(null)
const addStockModalItem = ref<InventoryItem | null>(null)
const newQuantity = ref(0)
const addQuantity = ref(10)

const LOW_STOCK_THRESHOLD = 5

const stats = computed(() => ({
  total: inventory.value.length,
  inStock: inventory.value.filter(i => i.quantity > LOW_STOCK_THRESHOLD).length,
  lowStock: inventory.value.filter(i => i.quantity > 0 && i.quantity <= LOW_STOCK_THRESHOLD).length,
  outOfStock: inventory.value.filter(i => i.quantity === 0).length
}))

const lowStockItems = computed(() =>
  inventory.value.filter(i => i.quantity > 0 && i.quantity <= LOW_STOCK_THRESHOLD)
)

const filteredInventory = computed(() => {
  let result = inventory.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(i =>
      i.album?.title.toLowerCase().includes(query) ||
      i.album?.artist?.name.toLowerCase().includes(query) ||
      i.sku.toLowerCase().includes(query)
    )
  }

  if (stockFilter.value === 'low') {
    result = result.filter(i => i.quantity > 0 && i.quantity <= LOW_STOCK_THRESHOLD)
  } else if (stockFilter.value === 'out') {
    result = result.filter(i => i.quantity === 0)
  } else if (stockFilter.value === 'in') {
    result = result.filter(i => i.quantity > LOW_STOCK_THRESHOLD)
  }

  return result
})

const getQuantityColor = (quantity: number) => {
  if (quantity === 0) return 'text-red-400'
  if (quantity <= LOW_STOCK_THRESHOLD) return 'text-yellow-400'
  return 'text-green-400'
}

const getStockStatus = (quantity: number) => {
  if (quantity === 0) return 'Out of Stock'
  if (quantity <= LOW_STOCK_THRESHOLD) return 'Low Stock'
  return 'In Stock'
}

const getStockStatusColor = (quantity: number) => {
  if (quantity === 0) return 'bg-red-900/50 text-red-400'
  if (quantity <= LOW_STOCK_THRESHOLD) return 'bg-yellow-900/50 text-yellow-400'
  return 'bg-green-900/50 text-green-400'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const fetchInventory = async () => {
  isLoading.value = true
  try {
    // Mock data for demonstration
    inventory.value = [
      {
        id: 1,
        album: { title: 'Dark Side of the Moon', artist: { name: 'Pink Floyd' }, format: 'VINYL' },
        sku: 'VNL-001',
        quantity: 25,
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        album: { title: 'Abbey Road', artist: { name: 'The Beatles' }, format: 'VINYL' },
        sku: 'VNL-002',
        quantity: 3,
        updated_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 3,
        album: { title: 'Thriller', artist: { name: 'Michael Jackson' }, format: 'CD' },
        sku: 'CD-001',
        quantity: 0,
        updated_at: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 4,
        album: { title: 'Back in Black', artist: { name: 'AC/DC' }, format: 'VINYL' },
        sku: 'VNL-003',
        quantity: 12,
        updated_at: new Date(Date.now() - 259200000).toISOString()
      },
      {
        id: 5,
        album: { title: 'Rumours', artist: { name: 'Fleetwood Mac' }, format: 'VINYL' },
        sku: 'VNL-004',
        quantity: 2,
        updated_at: new Date(Date.now() - 345600000).toISOString()
      },
      {
        id: 6,
        album: { title: 'Hotel California', artist: { name: 'Eagles' }, format: 'CASSETTE' },
        sku: 'CAS-001',
        quantity: 8,
        updated_at: new Date(Date.now() - 432000000).toISOString()
      }
    ]
  } catch (error) {
    toast.error('Failed to load inventory')
  } finally {
    isLoading.value = false
  }
}

const openUpdateModal = (item: InventoryItem) => {
  updateModalItem.value = item
  newQuantity.value = item.quantity
}

const openAddStockModal = (item: InventoryItem) => {
  addStockModalItem.value = item
  addQuantity.value = 10
}

const updateStock = async () => {
  if (!updateModalItem.value) return

  try {
    const item = inventory.value.find(i => i.id === updateModalItem.value?.id)
    if (item) {
      item.quantity = newQuantity.value
      item.updated_at = new Date().toISOString()
    }
    toast.success('Stock updated')
    updateModalItem.value = null
  } catch (error) {
    toast.error('Failed to update stock')
  }
}

const addStock = async () => {
  if (!addStockModalItem.value) return

  try {
    const item = inventory.value.find(i => i.id === addStockModalItem.value?.id)
    if (item) {
      item.quantity += addQuantity.value
      item.updated_at = new Date().toISOString()
    }
    toast.success(`Added ${addQuantity.value} units to stock`)
    addStockModalItem.value = null
  } catch (error) {
    toast.error('Failed to add stock')
  }
}

onMounted(() => {
  fetchInventory()
})
</script>
