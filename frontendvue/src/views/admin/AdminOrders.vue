<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-display font-bold text-white uppercase tracking-wider">Manage Orders</h2>
        <p class="mt-1 text-gray-400">View and manage customer orders</p>
      </div>
      <div class="flex items-center gap-3">
        <select
          v-model="statusFilter"
          class="px-4 py-2 bg-punk-black border border-gray-700 rounded-lg text-white text-sm focus:ring-punk-orange focus:border-punk-orange"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-punk-gray rounded-lg border border-gray-700 p-4">
        <p class="text-sm text-gray-400">Total Orders</p>
        <p class="text-2xl font-bold text-white mt-1">{{ stats.total }}</p>
      </div>
      <div class="bg-punk-gray rounded-lg border border-gray-700 p-4">
        <p class="text-sm text-gray-400">Pending</p>
        <p class="text-2xl font-bold text-yellow-400 mt-1">{{ stats.pending }}</p>
      </div>
      <div class="bg-punk-gray rounded-lg border border-gray-700 p-4">
        <p class="text-sm text-gray-400">Processing</p>
        <p class="text-2xl font-bold text-blue-400 mt-1">{{ stats.processing }}</p>
      </div>
      <div class="bg-punk-gray rounded-lg border border-gray-700 p-4">
        <p class="text-sm text-gray-400">Completed</p>
        <p class="text-2xl font-bold text-green-400 mt-1">{{ stats.completed }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-punk-orange"></div>
    </div>

    <!-- Orders Table -->
    <div v-else class="bg-punk-gray rounded-lg border border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-punk-black">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Order ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Items
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Total
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="order in orders" :key="order.uuid" class="hover:bg-punk-black/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-punk-orange">#{{ order.order_number }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <p class="text-sm font-medium text-white">{{ order.user?.name }}</p>
                  <p class="text-xs text-gray-500">{{ order.user?.email }}</p>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-400">{{ order.items_count }} items</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-white">${{ order.total_amount.toFixed(2) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusColor(order.status)
                  ]"
                >
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ formatDate(order.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="viewOrder(order)"
                    class="p-1.5 text-gray-400 hover:text-white transition-colors"
                    title="View Details"
                  >
                    <EyeIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click="openStatusModal(order)"
                    class="p-1.5 text-gray-400 hover:text-punk-orange transition-colors"
                    title="Update Status"
                  >
                    <PencilIcon class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="orders.length === 0" class="text-center py-12">
        <ShoppingBagIcon class="h-12 w-12 mx-auto text-gray-600 mb-4" />
        <p class="text-gray-400">No orders found</p>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.last_page > 1" class="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
        <p class="text-sm text-gray-400">
          Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} orders
        </p>
        <div class="flex gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 bg-punk-black border border-gray-700 rounded text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="currentPage++"
            :disabled="currentPage === pagination.last_page"
            class="px-3 py-1 bg-punk-black border border-gray-700 rounded text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div v-if="selectedOrder" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div class="bg-punk-gray rounded-lg border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-700 flex items-center justify-between">
              <h3 class="text-xl font-bold text-white">Order #{{ selectedOrder.order_number }}</h3>
              <button @click="selectedOrder = null" class="text-gray-400 hover:text-white">
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>
            <div class="p-6 space-y-6">
              <!-- Order Items -->
              <div>
                <h4 class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Items</h4>
                <div class="space-y-3">
                  <div
                    v-for="item in selectedOrder.items"
                    :key="item.id"
                    class="flex items-center gap-4 bg-punk-black rounded-lg p-3"
                  >
                    <img
                      v-if="item.album?.cover_image"
                      :src="item.album.cover_image"
                      class="w-12 h-12 rounded object-cover"
                    />
                    <div class="flex-1">
                      <p class="text-white font-medium">{{ item.album?.title }}</p>
                      <p class="text-sm text-gray-500">Qty: {{ item.quantity }} x ${{ item.price.toFixed(2) }}</p>
                    </div>
                    <p class="text-punk-orange font-medium">${{ (item.quantity * item.price).toFixed(2) }}</p>
                  </div>
                </div>
              </div>

              <!-- Shipping Address -->
              <div>
                <h4 class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Shipping Address</h4>
                <div class="bg-punk-black rounded-lg p-4 text-gray-300">
                  <p>{{ selectedOrder.shipping_address?.full_name }}</p>
                  <p>{{ selectedOrder.shipping_address?.address_line1 }}</p>
                  <p v-if="selectedOrder.shipping_address?.address_line2">
                    {{ selectedOrder.shipping_address.address_line2 }}
                  </p>
                  <p>
                    {{ selectedOrder.shipping_address?.city }}, {{ selectedOrder.shipping_address?.state }}
                    {{ selectedOrder.shipping_address?.postal_code }}
                  </p>
                </div>
              </div>

              <!-- Order Summary -->
              <div>
                <h4 class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Summary</h4>
                <div class="bg-punk-black rounded-lg p-4 space-y-2">
                  <div class="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>${{ selectedOrder.subtotal?.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span>${{ selectedOrder.shipping_amount?.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between text-gray-400">
                    <span>Tax</span>
                    <span>${{ selectedOrder.tax_amount?.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between text-white font-bold pt-2 border-t border-gray-700">
                    <span>Total</span>
                    <span class="text-punk-orange">${{ selectedOrder.total_amount?.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Update Status Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div v-if="statusModalOrder" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div class="bg-punk-gray rounded-lg border border-gray-700 max-w-md w-full p-6">
            <h3 class="text-xl font-bold text-white mb-4">Update Order Status</h3>
            <p class="text-gray-400 mb-4">Order #{{ statusModalOrder.order_number }}</p>
            <select
              v-model="newStatus"
              class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white focus:ring-punk-orange focus:border-punk-orange mb-4"
            >
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <div class="flex gap-4">
              <button @click="statusModalOrder = null" class="flex-1 btn-punk-outline py-2">
                Cancel
              </button>
              <button @click="updateOrderStatus" class="flex-1 btn-punk py-2">
                Update Status
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
  EyeIcon,
  PencilIcon,
  XMarkIcon,
  ShoppingBagIcon
} from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

interface Order {
  uuid: string
  order_number: string
  user?: { name: string; email: string }
  items_count: number
  total_amount: number
  subtotal?: number
  shipping_amount?: number
  tax_amount?: number
  status: string
  created_at: string
  items?: any[]
  shipping_address?: any
}

interface PaginationMeta {
  current_page: number
  last_page: number
  from: number
  to: number
  total: number
}

const toast = useToast()

const orders = ref<Order[]>([])
const pagination = ref<PaginationMeta>()
const isLoading = ref(true)
const currentPage = ref(1)
const statusFilter = ref('')
const selectedOrder = ref<Order | null>(null)
const statusModalOrder = ref<Order | null>(null)
const newStatus = ref('')

const stats = computed(() => ({
  total: orders.value.length,
  pending: orders.value.filter(o => o.status === 'PENDING').length,
  processing: orders.value.filter(o => o.status === 'PROCESSING').length,
  completed: orders.value.filter(o => o.status === 'DELIVERED').length
}))

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-900/50 text-yellow-400',
    PROCESSING: 'bg-blue-900/50 text-blue-400',
    SHIPPED: 'bg-purple-900/50 text-purple-400',
    DELIVERED: 'bg-green-900/50 text-green-400',
    CANCELLED: 'bg-red-900/50 text-red-400'
  }
  return colors[status] || 'bg-gray-900/50 text-gray-400'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const fetchOrders = async () => {
  isLoading.value = true
  try {
    // Mock data for demonstration
    orders.value = [
      {
        uuid: '1',
        order_number: 'ORD-001',
        user: { name: 'John Doe', email: 'john@example.com' },
        items_count: 3,
        total_amount: 89.99,
        subtotal: 79.99,
        shipping_amount: 5.00,
        tax_amount: 5.00,
        status: 'PENDING',
        created_at: new Date().toISOString(),
        items: [
          { id: 1, album: { title: 'Dark Side of the Moon', cover_image: null }, quantity: 1, price: 29.99 },
          { id: 2, album: { title: 'Abbey Road', cover_image: null }, quantity: 2, price: 25.00 }
        ],
        shipping_address: {
          full_name: 'John Doe',
          address_line1: '123 Main St',
          city: 'New York',
          state: 'NY',
          postal_code: '10001'
        }
      },
      {
        uuid: '2',
        order_number: 'ORD-002',
        user: { name: 'Jane Smith', email: 'jane@example.com' },
        items_count: 1,
        total_amount: 34.99,
        status: 'PROCESSING',
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        uuid: '3',
        order_number: 'ORD-003',
        user: { name: 'Bob Wilson', email: 'bob@example.com' },
        items_count: 5,
        total_amount: 149.99,
        status: 'SHIPPED',
        created_at: new Date(Date.now() - 172800000).toISOString()
      },
      {
        uuid: '4',
        order_number: 'ORD-004',
        user: { name: 'Alice Brown', email: 'alice@example.com' },
        items_count: 2,
        total_amount: 59.99,
        status: 'DELIVERED',
        created_at: new Date(Date.now() - 259200000).toISOString()
      }
    ]
    pagination.value = {
      current_page: 1,
      last_page: 1,
      from: 1,
      to: 4,
      total: 4
    }
  } catch (error) {
    toast.error('Failed to load orders')
  } finally {
    isLoading.value = false
  }
}

const viewOrder = (order: Order) => {
  selectedOrder.value = order
}

const openStatusModal = (order: Order) => {
  statusModalOrder.value = order
  newStatus.value = order.status
}

const updateOrderStatus = async () => {
  if (!statusModalOrder.value) return

  try {
    // Update order status locally (mock)
    const order = orders.value.find(o => o.uuid === statusModalOrder.value?.uuid)
    if (order) {
      order.status = newStatus.value
    }
    toast.success('Order status updated')
    statusModalOrder.value = null
  } catch (error) {
    toast.error('Failed to update order status')
  }
}

watch([currentPage, statusFilter], () => {
  fetchOrders()
})

onMounted(() => {
  fetchOrders()
})
</script>
