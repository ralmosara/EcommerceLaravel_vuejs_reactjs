<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-display font-bold text-white uppercase tracking-wider">User Management</h2>
        <p class="mt-1 text-gray-400">Manage registered users and their roles</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative">
          <MagnifyingGlassIcon class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users..."
            class="pl-10 pr-4 py-2 bg-punk-black border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-punk-orange focus:border-punk-orange w-64"
          />
        </div>
        <select
          v-model="roleFilter"
          class="px-4 py-2 bg-punk-black border border-gray-700 rounded-lg text-white text-sm focus:ring-punk-orange focus:border-punk-orange"
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="CUSTOMER">Customer</option>
        </select>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-punk-gray rounded-lg border border-gray-700 p-4">
        <p class="text-sm text-gray-400">Total Users</p>
        <p class="text-2xl font-bold text-white mt-1">{{ stats.total }}</p>
      </div>
      <div class="bg-punk-gray rounded-lg border border-gray-700 p-4">
        <p class="text-sm text-gray-400">Admins</p>
        <p class="text-2xl font-bold text-punk-orange mt-1">{{ stats.admins }}</p>
      </div>
      <div class="bg-punk-gray rounded-lg border border-gray-700 p-4">
        <p class="text-sm text-gray-400">Customers</p>
        <p class="text-2xl font-bold text-blue-400 mt-1">{{ stats.customers }}</p>
      </div>
      <div class="bg-punk-gray rounded-lg border border-gray-700 p-4">
        <p class="text-sm text-gray-400">New This Month</p>
        <p class="text-2xl font-bold text-green-400 mt-1">{{ stats.newThisMonth }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-punk-orange"></div>
    </div>

    <!-- Users Table -->
    <div v-else class="bg-punk-gray rounded-lg border border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-punk-black">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Orders
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Total Spent
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Joined
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-punk-black/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-punk-black border border-gray-700 flex items-center justify-center">
                    <UserIcon class="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-white">{{ user.name }}</p>
                    <p class="text-xs text-gray-500">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    user.role === 'ADMIN' ? 'bg-punk-orange/20 text-punk-orange' : 'bg-blue-900/50 text-blue-400'
                  ]"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ user.orders_count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                ${{ user.total_spent.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="viewUser(user)"
                    class="p-1.5 text-gray-400 hover:text-white transition-colors"
                    title="View Details"
                  >
                    <EyeIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click="openRoleModal(user)"
                    class="p-1.5 text-gray-400 hover:text-punk-orange transition-colors"
                    title="Change Role"
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
      <div v-if="filteredUsers.length === 0" class="text-center py-12">
        <UsersIcon class="h-12 w-12 mx-auto text-gray-600 mb-4" />
        <p class="text-gray-400">No users found</p>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.last_page > 1" class="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
        <p class="text-sm text-gray-400">
          Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} users
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

    <!-- User Details Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div v-if="selectedUser" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div class="bg-punk-gray rounded-lg border border-gray-700 max-w-lg w-full">
            <div class="p-6 border-b border-gray-700 flex items-center justify-between">
              <h3 class="text-xl font-bold text-white">User Details</h3>
              <button @click="selectedUser = null" class="text-gray-400 hover:text-white">
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-full bg-punk-black border-2 border-gray-700 flex items-center justify-center">
                  <UserIcon class="h-8 w-8 text-gray-500" />
                </div>
                <div>
                  <h4 class="text-lg font-bold text-white">{{ selectedUser.name }}</h4>
                  <p class="text-gray-400">{{ selectedUser.email }}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 mt-6">
                <div class="bg-punk-black rounded-lg p-4">
                  <p class="text-sm text-gray-500">Role</p>
                  <p class="text-white font-medium">{{ selectedUser.role }}</p>
                </div>
                <div class="bg-punk-black rounded-lg p-4">
                  <p class="text-sm text-gray-500">Phone</p>
                  <p class="text-white font-medium">{{ selectedUser.phone || 'N/A' }}</p>
                </div>
                <div class="bg-punk-black rounded-lg p-4">
                  <p class="text-sm text-gray-500">Total Orders</p>
                  <p class="text-white font-medium">{{ selectedUser.orders_count }}</p>
                </div>
                <div class="bg-punk-black rounded-lg p-4">
                  <p class="text-sm text-gray-500">Total Spent</p>
                  <p class="text-punk-orange font-medium">${{ selectedUser.total_spent.toFixed(2) }}</p>
                </div>
              </div>

              <div class="bg-punk-black rounded-lg p-4">
                <p class="text-sm text-gray-500">Member Since</p>
                <p class="text-white font-medium">{{ formatDate(selectedUser.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Change Role Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div v-if="roleModalUser" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div class="bg-punk-gray rounded-lg border border-gray-700 max-w-md w-full p-6">
            <h3 class="text-xl font-bold text-white mb-4">Change User Role</h3>
            <p class="text-gray-400 mb-4">{{ roleModalUser.name }} ({{ roleModalUser.email }})</p>
            <select
              v-model="newRole"
              class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white focus:ring-punk-orange focus:border-punk-orange mb-4"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
            </select>
            <div class="flex gap-4">
              <button @click="roleModalUser = null" class="flex-1 btn-punk-outline py-2">
                Cancel
              </button>
              <button @click="updateUserRole" class="flex-1 btn-punk py-2">
                Update Role
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
  UserIcon,
  UsersIcon,
  EyeIcon,
  PencilIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

interface User {
  id: number
  name: string
  email: string
  phone?: string
  role: string
  orders_count: number
  total_spent: number
  created_at: string
}

interface PaginationMeta {
  current_page: number
  last_page: number
  from: number
  to: number
  total: number
}

const toast = useToast()

const users = ref<User[]>([])
const pagination = ref<PaginationMeta>()
const isLoading = ref(true)
const currentPage = ref(1)
const searchQuery = ref('')
const roleFilter = ref('')
const selectedUser = ref<User | null>(null)
const roleModalUser = ref<User | null>(null)
const newRole = ref('')

const stats = computed(() => ({
  total: users.value.length,
  admins: users.value.filter(u => u.role === 'ADMIN').length,
  customers: users.value.filter(u => u.role === 'CUSTOMER').length,
  newThisMonth: users.value.filter(u => {
    const created = new Date(u.created_at)
    const now = new Date()
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
  }).length
}))

const filteredUsers = computed(() => {
  let result = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(u =>
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    )
  }

  if (roleFilter.value) {
    result = result.filter(u => u.role === roleFilter.value)
  }

  return result
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const fetchUsers = async () => {
  isLoading.value = true
  try {
    // Mock data for demonstration
    users.value = [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '+1 555-0100',
        role: 'ADMIN',
        orders_count: 0,
        total_spent: 0,
        created_at: new Date(Date.now() - 30 * 86400000).toISOString()
      },
      {
        id: 2,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 555-0101',
        role: 'CUSTOMER',
        orders_count: 5,
        total_spent: 249.95,
        created_at: new Date(Date.now() - 60 * 86400000).toISOString()
      },
      {
        id: 3,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'CUSTOMER',
        orders_count: 12,
        total_spent: 589.88,
        created_at: new Date(Date.now() - 90 * 86400000).toISOString()
      },
      {
        id: 4,
        name: 'Bob Wilson',
        email: 'bob@example.com',
        role: 'CUSTOMER',
        orders_count: 3,
        total_spent: 134.97,
        created_at: new Date(Date.now() - 5 * 86400000).toISOString()
      },
      {
        id: 5,
        name: 'Alice Brown',
        email: 'alice@example.com',
        role: 'ADMIN',
        orders_count: 0,
        total_spent: 0,
        created_at: new Date(Date.now() - 15 * 86400000).toISOString()
      }
    ]
    pagination.value = {
      current_page: 1,
      last_page: 1,
      from: 1,
      to: 5,
      total: 5
    }
  } catch (error) {
    toast.error('Failed to load users')
  } finally {
    isLoading.value = false
  }
}

const viewUser = (user: User) => {
  selectedUser.value = user
}

const openRoleModal = (user: User) => {
  roleModalUser.value = user
  newRole.value = user.role
}

const updateUserRole = async () => {
  if (!roleModalUser.value) return

  try {
    // Update user role locally (mock)
    const user = users.value.find(u => u.id === roleModalUser.value?.id)
    if (user) {
      user.role = newRole.value
    }
    toast.success('User role updated')
    roleModalUser.value = null
  } catch (error) {
    toast.error('Failed to update user role')
  }
}

watch(currentPage, () => {
  fetchUsers()
})

onMounted(() => {
  fetchUsers()
})
</script>
