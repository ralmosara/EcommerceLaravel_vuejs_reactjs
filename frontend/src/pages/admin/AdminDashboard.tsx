import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Album as AlbumIcon,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  useAdminDashboardStats,
  useAdminSalesChart,
  useAdminLowStockAlerts
} from '@/hooks/api/admin/useAdminDashboard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';

type ChartPeriod = 'week' | 'month' | 'year';

export function AdminDashboard() {
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('month');

  const { data: stats, isLoading: statsLoading } = useAdminDashboardStats();
  const { data: salesChart, isLoading: chartLoading } = useAdminSalesChart(chartPeriod);
  const { data: lowStock } = useAdminLowStockAlerts();

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Sales',
      value: `$${(stats?.total_sales ?? 0).toLocaleString()}`,
      icon: DollarSign,
      trend: stats?.revenue_this_month || 0,
      trendLabel: 'This month',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: 'Total Orders',
      value: (stats?.total_orders ?? 0).toLocaleString(),
      icon: ShoppingCart,
      trend: stats?.pending_orders_count || 0,
      trendLabel: 'Pending',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'Total Users',
      value: (stats?.total_users ?? 0).toLocaleString(),
      icon: Users,
      trend: 0,
      trendLabel: 'Active',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      title: 'Total Albums',
      value: (stats?.total_albums ?? 0).toLocaleString(),
      icon: AlbumIcon,
      trend: stats?.low_stock_count || 0,
      trendLabel: 'Low stock',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
  ];

  // Transform chart data
  const chartData = salesChart?.labels?.map((label, index) => ({
    name: label,
    revenue: salesChart?.revenue?.[index] ?? 0,
    orders: salesChart?.sales?.[index] ?? 0,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome to your admin dashboard</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                {card.trend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-gray-400 mr-1" />
                )}
                <span className="text-gray-600 dark:text-gray-400">
                  {card.trend} {card.trendLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sales Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Sales Overview</h2>
          <div className="flex space-x-2">
            {(['week', 'month', 'year'] as ChartPeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setChartPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  chartPeriod === period
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {period === 'week' ? 'Last 7 Days' : period === 'month' ? 'Last 30 Days' : 'Last Year'}
              </button>
            ))}
          </div>
        </div>

        {chartLoading ? (
          <div className="flex items-center justify-center h-80">
            <LoadingSpinner />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis
                dataKey="name"
                className="text-sm text-gray-600 dark:text-gray-400"
              />
              <YAxis className="text-sm text-gray-600 dark:text-gray-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#374151' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                name="Revenue ($)"
                dot={{ fill: '#10b981' }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Orders"
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Low Stock Alerts</h2>
            <Link to="/admin/inventory?filter=low-stock">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>

          {lowStock?.data && lowStock.data.length > 0 ? (
            <div className="space-y-3">
              {lowStock.data.slice(0, 5).map((album) => (
                <div
                  key={album.uuid}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {album.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {album.artist?.name || 'Unknown Artist'} - {album.format_label || 'Unknown Format'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="warning" size="sm">
                      {album.inventory?.available_quantity || 0} left
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No low stock items
            </p>
          )}
        </div>

        {/* Best Selling Albums */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Best Selling Albums
          </h2>

          {stats?.best_selling_albums && stats?.best_selling_albums.length > 0 ? (
            <div className="space-y-3">
              {stats.best_selling_albums.slice(0, 5).map((item, index) => (
                <div
                  key={item.album?.uuid || `album-${index}`}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                      #{index + 1}
                    </span>
                  </div>
                  {item.album?.cover_image && (
                    <img
                      src={item.album.cover_image}
                      alt={item.album?.title || 'Album'}
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {item.album?.title || 'Unknown Album'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {item.album?.artist?.name || 'Unknown Artist'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      ${(item.total_revenue ?? 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {item.total_quantity ?? 0} sold
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No sales data available
            </p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Average Rating
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {(stats?.average_rating ?? 0).toFixed(1)} / 5.0
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            From {stats?.total_reviews || 0} reviews
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Revenue This Year
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ${(stats?.revenue_this_year ?? 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {stats?.total_orders || 0} total orders
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Out of Stock
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats?.out_of_stock_count || 0}
          </p>
          <Link to="/admin/inventory?filter=out-of-stock">
            <Button variant="ghost" size="sm" className="mt-2">
              <Eye className="h-4 w-4 mr-1" />
              View Items
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
