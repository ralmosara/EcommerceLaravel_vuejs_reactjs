<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold text-white">Dashboard</h1>
      <p class="text-gray-400 mt-1">Welcome to your admin dashboard</p>
    </div>

    <!-- Loading State -->
    <div v-if="statsLoading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-punk-orange" />
    </div>

    <template v-else>
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(card, index) in statCards"
          :key="index"
          class="bg-punk-gray rounded-lg p-6 border border-gray-700"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-400">{{ card.title }}</p>
              <p class="text-2xl font-bold text-white mt-2">{{ card.value }}</p>
            </div>
            <div :class="[card.bgColor, 'p-3 rounded-lg']">
              <component :is="card.icon" :class="['h-6 w-6', card.color]" />
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <ArrowTrendingUpIcon
              v-if="card.trend > 0"
              class="h-4 w-4 text-green-400 mr-1"
            />
            <ArrowTrendingDownIcon
              v-else
              class="h-4 w-4 text-gray-500 mr-1"
            />
            <span class="text-gray-400">
              {{ card.trend }} {{ card.trendLabel }}
            </span>
          </div>
        </div>
      </div>

      <!-- Sales Chart -->
      <div class="bg-punk-gray rounded-lg p-6 border border-gray-700">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 class="text-xl font-bold text-white">Sales Overview</h2>
          <div class="flex space-x-2">
            <button
              v-for="period in chartPeriods"
              :key="period.value"
              @click="chartPeriod = period.value"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                chartPeriod === period.value
                  ? 'bg-punk-orange text-white'
                  : 'bg-punk-black text-gray-300 hover:bg-punk-dark'
              ]"
            >
              {{ period.label }}
            </button>
          </div>
        </div>

        <div v-if="chartLoading" class="flex items-center justify-center h-80">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-punk-orange" />
        </div>
        <div v-else class="h-80">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Two Column Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Low Stock Alerts -->
        <div class="bg-punk-gray rounded-lg p-6 border border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-white">Low Stock Alerts</h2>
            <RouterLink
              to="/admin/inventory?filter=low-stock"
              class="text-sm text-punk-orange hover:text-punk-coral transition-colors"
            >
              View All
            </RouterLink>
          </div>

          <div v-if="lowStock?.data && lowStock.data.length > 0" class="space-y-3">
            <div
              v-for="album in lowStock.data.slice(0, 5)"
              :key="album.uuid"
              class="flex items-center justify-between p-3 bg-punk-black rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <ExclamationTriangleIcon class="h-5 w-5 text-orange-500" />
                <div>
                  <p class="text-sm font-medium text-white">{{ album.title }}</p>
                  <p class="text-xs text-gray-400">
                    {{ album.artist?.name || 'Unknown Artist' }} - {{ formatLabel(album.format) }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-900/50 text-orange-400">
                  {{ album.inventory?.quantity || 0 }} left
                </span>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500 text-center py-8">No low stock items</p>
        </div>

        <!-- Best Selling Albums -->
        <div class="bg-punk-gray rounded-lg p-6 border border-gray-700">
          <h2 class="text-xl font-bold text-white mb-4">Best Selling Albums</h2>

          <div v-if="stats?.best_selling_albums && stats.best_selling_albums.length > 0" class="space-y-3">
            <div
              v-for="(item, index) in stats.best_selling_albums.slice(0, 5)"
              :key="item.album?.uuid || `album-${index}`"
              class="flex items-center space-x-3 p-3 bg-punk-black rounded-lg"
            >
              <div class="flex-shrink-0 w-8 h-8 bg-punk-orange/20 rounded-full flex items-center justify-center">
                <span class="text-sm font-bold text-punk-orange">#{{ index + 1 }}</span>
              </div>
              <img
                v-if="item.album?.cover_image"
                :src="item.album.cover_image"
                :alt="item.album?.title || 'Album'"
                class="w-12 h-12 rounded object-cover"
              />
              <div v-else class="w-12 h-12 rounded bg-punk-gray flex items-center justify-center">
                <MusicalNoteIcon class="h-6 w-6 text-gray-600" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-white truncate">
                  {{ item.album?.title || 'Unknown Album' }}
                </p>
                <p class="text-xs text-gray-400 truncate">
                  {{ item.album?.artist?.name || 'Unknown Artist' }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-white">
                  ${{ (item.total_revenue ?? 0).toLocaleString() }}
                </p>
                <p class="text-xs text-gray-400">{{ item.total_quantity ?? 0 }} sold</p>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500 text-center py-8">No sales data available</p>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-punk-gray rounded-lg p-6 border border-gray-700">
          <h3 class="text-sm font-medium text-gray-400 mb-2">Average Rating</h3>
          <p class="text-2xl font-bold text-white">
            {{ (stats?.average_rating ?? 0).toFixed(1) }} / 5.0
          </p>
          <p class="text-sm text-gray-400 mt-1">
            From {{ stats?.total_reviews || 0 }} reviews
          </p>
        </div>

        <div class="bg-punk-gray rounded-lg p-6 border border-gray-700">
          <h3 class="text-sm font-medium text-gray-400 mb-2">Revenue This Year</h3>
          <p class="text-2xl font-bold text-white">
            ${{ (stats?.revenue_this_year ?? 0).toLocaleString() }}
          </p>
          <p class="text-sm text-gray-400 mt-1">
            {{ stats?.total_orders || 0 }} total orders
          </p>
        </div>

        <div class="bg-punk-gray rounded-lg p-6 border border-gray-700">
          <h3 class="text-sm font-medium text-gray-400 mb-2">Out of Stock</h3>
          <p class="text-2xl font-bold text-white">
            {{ stats?.out_of_stock_count || 0 }}
          </p>
          <RouterLink
            to="/admin/inventory?filter=out-of-stock"
            class="inline-flex items-center mt-2 text-sm text-punk-orange hover:text-punk-coral transition-colors"
          >
            <EyeIcon class="h-4 w-4 mr-1" />
            View Items
          </RouterLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Line
} from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
  MusicalNoteIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  EyeIcon,
} from '@heroicons/vue/24/outline'
import { adminDashboardApi, type ChartPeriod } from '@/api/endpoints/admin/dashboard'
import { adminInventoryApi } from '@/api/endpoints/admin/inventory'
import type { DashboardStats, SalesChartData, Album, PaginatedResponse } from '@/api/types/models'
import { FORMAT_LABELS } from '@/utils/constants'
import type { AlbumFormat } from '@/api/types/models'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// State
const stats = ref<DashboardStats | null>(null)
const salesChart = ref<SalesChartData | null>(null)
const lowStock = ref<PaginatedResponse<Album> | null>(null)
const statsLoading = ref(true)
const chartLoading = ref(false)
const chartPeriod = ref<ChartPeriod>('month')

// Chart periods
const chartPeriods = [
  { value: 'week' as ChartPeriod, label: 'Last 7 Days' },
  { value: 'month' as ChartPeriod, label: 'Last 30 Days' },
  { value: 'year' as ChartPeriod, label: 'Last Year' },
]

// Format label helper
const formatLabel = (format: AlbumFormat): string => {
  return FORMAT_LABELS[format] || format
}

// Stat cards computed
const statCards = computed(() => [
  {
    title: 'Total Sales',
    value: `$${(stats.value?.total_sales ?? 0).toLocaleString()}`,
    icon: CurrencyDollarIcon,
    trend: stats.value?.revenue_this_month || 0,
    trendLabel: 'This month',
    color: 'text-green-400',
    bgColor: 'bg-green-900/50',
  },
  {
    title: 'Total Orders',
    value: (stats.value?.total_orders ?? 0).toLocaleString(),
    icon: ShoppingCartIcon,
    trend: stats.value?.pending_orders_count || 0,
    trendLabel: 'Pending',
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/50',
  },
  {
    title: 'Total Users',
    value: (stats.value?.total_users ?? 0).toLocaleString(),
    icon: UsersIcon,
    trend: 0,
    trendLabel: 'Active',
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/50',
  },
  {
    title: 'Total Albums',
    value: (stats.value?.total_albums ?? 0).toLocaleString(),
    icon: MusicalNoteIcon,
    trend: stats.value?.low_stock_count || 0,
    trendLabel: 'Low stock',
    color: 'text-orange-400',
    bgColor: 'bg-orange-900/50',
  },
])

// Chart data
const chartData = computed(() => ({
  labels: salesChart.value?.labels || [],
  datasets: [
    {
      label: 'Revenue ($)',
      data: salesChart.value?.revenue || [],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#10b981',
    },
    {
      label: 'Orders',
      data: salesChart.value?.sales || [],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#3b82f6',
    },
  ],
}))

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#9ca3af',
      },
    },
    tooltip: {
      backgroundColor: 'rgba(42, 42, 42, 0.95)',
      titleColor: '#fff',
      bodyColor: '#9ca3af',
      borderColor: '#4b5563',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(75, 85, 99, 0.3)',
      },
      ticks: {
        color: '#9ca3af',
      },
    },
    y: {
      grid: {
        color: 'rgba(75, 85, 99, 0.3)',
      },
      ticks: {
        color: '#9ca3af',
      },
    },
  },
}

// Mock data for when API is not available
const mockStats: DashboardStats = {
  total_sales: 125890,
  total_orders: 1247,
  total_users: 3842,
  total_albums: 156,
  revenue_this_month: 12500,
  revenue_this_year: 125890,
  pending_orders_count: 23,
  low_stock_count: 8,
  out_of_stock_count: 3,
  average_rating: 4.6,
  total_reviews: 892,
  best_selling_albums: []
}

const mockChartData: SalesChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  revenue: [12500, 15200, 18900, 14300, 21000, 19500, 24200],
  sales: [125, 152, 189, 143, 210, 195, 242]
}

// Fetch functions
const fetchStats = async () => {
  try {
    const data = await adminDashboardApi.getStats()
    stats.value = data
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    // Use mock data as fallback
    stats.value = mockStats
  } finally {
    statsLoading.value = false
  }
}

const fetchSalesChart = async () => {
  chartLoading.value = true
  try {
    const data = await adminDashboardApi.getSalesChart(chartPeriod.value)
    // Handle both array and object response formats
    if (Array.isArray(data)) {
      // Transform array format to object format
      salesChart.value = {
        labels: data.map(item => item.date || ''),
        revenue: data.map(item => item.revenue || 0),
        sales: data.map(item => item.orders || 0),
      }
    } else {
      salesChart.value = data
    }
  } catch (error) {
    console.error('Failed to fetch sales chart:', error)
    // Use mock data as fallback
    salesChart.value = mockChartData
  } finally {
    chartLoading.value = false
  }
}

const fetchLowStock = async () => {
  try {
    lowStock.value = await adminInventoryApi.getLowStockAlerts()
  } catch (error) {
    console.error('Failed to fetch low stock alerts:', error)
    // Set empty data on error
    lowStock.value = { data: [], links: { first: '', last: '', prev: null, next: null }, meta: { current_page: 1, from: 0, last_page: 1, path: '', per_page: 10, to: 0, total: 0 } }
  }
}

// Watch chart period changes
import { watch } from 'vue'
watch(chartPeriod, () => {
  fetchSalesChart()
})

// Initialize
onMounted(async () => {
  await Promise.all([
    fetchStats(),
    fetchSalesChart(),
    fetchLowStock(),
  ])
})
</script>
