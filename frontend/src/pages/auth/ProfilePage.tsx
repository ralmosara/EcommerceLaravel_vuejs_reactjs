import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { updateProfileSchema, type UpdateProfileFormData } from '@/utils/validators';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/endpoints/auth';
import { ordersApi } from '@/api/endpoints/orders';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';
import type { Order } from '@/api/types';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  // Load user's recent orders
  useEffect(() => {
    loadRecentOrders();
  }, []);

  // Update form when user changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
      });
    }
  }, [user, reset]);

  const loadRecentOrders = async () => {
    try {
      const response = await ordersApi.getOrders({ per_page: 5, page: 1 });
      setRecentOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      const updatedUser = await authApi.updateProfile(data);
      updateUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      console.error('Update profile error:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleCancelEdit = () => {
    reset({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-900/50 text-yellow-400 border border-yellow-600',
      processing: 'bg-blue-900/50 text-blue-400 border border-blue-600',
      shipped: 'bg-purple-900/50 text-purple-400 border border-purple-600',
      delivered: 'bg-green-900/50 text-green-400 border border-green-600',
      cancelled: 'bg-red-900/50 text-red-400 border border-red-600',
      refunded: 'bg-gray-800 text-gray-400 border border-gray-600',
    };
    return colors[status] || colors.pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-punk-dark py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider">My Account</h1>
          <p className="mt-2 text-sm text-gray-400">
            Manage your profile and view your order history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-punk-gray border border-punk-black p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white uppercase tracking-wider">
                  Profile Information
                </h2>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>

              {!isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Name
                    </label>
                    <p className="mt-1 text-lg text-white">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="mt-1 text-lg text-white">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Phone
                    </label>
                    <p className="mt-1 text-lg text-white">
                      {user.phone || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Role
                    </label>
                    <p className="mt-1">
                      <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-punk-orange text-white">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Member Since
                    </label>
                    <p className="mt-1 text-lg text-white">
                      {formatDate(user.created_at)}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      autoComplete="name"
                      className="w-full px-3 py-2 border border-punk-black bg-punk-black text-white placeholder-gray-500 focus:outline-none focus:border-punk-orange transition-colors"
                      {...register('name')}
                    />
                    {errors.name?.message && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
                    <input
                      type="email"
                      autoComplete="email"
                      className="w-full px-3 py-2 border border-punk-black bg-punk-black text-white placeholder-gray-500 focus:outline-none focus:border-punk-orange transition-colors"
                      {...register('email')}
                    />
                    {errors.email?.message && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone (Optional)</label>
                    <input
                      type="tel"
                      autoComplete="tel"
                      className="w-full px-3 py-2 border border-punk-black bg-punk-black text-white placeholder-gray-500 focus:outline-none focus:border-punk-orange transition-colors"
                      {...register('phone')}
                    />
                    {errors.phone?.message && <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCancelEdit}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Recent Orders */}
            <div className="mt-6 bg-punk-gray border border-punk-black p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white uppercase tracking-wider">
                  Recent Orders
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/orders')}
                >
                  View All
                </Button>
              </div>

              {isLoadingOrders ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-punk-orange mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-400">
                    Loading orders...
                  </p>
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No orders yet</p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-4"
                    onClick={() => navigate('/albums')}
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.uuid}
                      className="border border-punk-black p-4 hover:bg-punk-black transition-colors cursor-pointer"
                      onClick={() => navigate(`/orders/${order.uuid}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-white">
                            Order #{order.order_number}
                          </p>
                          <p className="text-sm text-gray-400">
                            {formatDate(order.created_at)} • {order.items.length} item(s)
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-punk-orange">
                            {formatCurrency(order.total)}
                          </p>
                          <span
                            className={`inline-block mt-1 px-2 py-1 text-xs font-medium ${getStatusBadgeColor(
                              order.status
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-punk-gray border border-punk-black p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => navigate('/orders')}
                >
                  View All Orders
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => navigate('/wishlist')}
                >
                  My Wishlist
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => navigate('/albums')}
                >
                  Browse Albums
                </Button>
                {user.role === 'admin' && (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate('/admin')}
                  >
                    Admin Dashboard
                  </Button>
                )}
                <hr className="border-punk-black" />
                <Button
                  variant="danger"
                  fullWidth
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
