import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

// Layouts (will be created later)
import { MainLayout } from '@/components/layout/MainLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';

// Auth Pages (will be created later)
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ProfilePage } from '@/pages/auth/ProfilePage';

// Catalog Pages (will be created later)
import { HomePage } from '@/pages/catalog/HomePage';
import { AlbumsPage } from '@/pages/catalog/AlbumsPage';
import { AlbumDetailsPage } from '@/pages/catalog/AlbumDetailsPage';
import { ArtistPage } from '@/pages/catalog/ArtistPage';
import { GenrePage } from '@/pages/catalog/GenrePage';
import { SearchResultsPage } from '@/pages/catalog/SearchResultsPage';

// Cart & Checkout Pages (will be created later)
import { CartPage } from '@/pages/cart/CartPage';
import { CheckoutPage } from '@/pages/checkout/CheckoutPage';
import { PaymentSuccessPage } from '@/pages/checkout/PaymentSuccessPage';

// Order Pages (will be created later)
import { OrdersPage } from '@/pages/orders/OrdersPage';
import { OrderDetailsPage } from '@/pages/orders/OrderDetailsPage';

// Wishlist Page (will be created later)
import { WishlistPage } from '@/pages/wishlist/WishlistPage';

// Admin Pages (will be created later)
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminInventoryPage } from '@/pages/admin/AdminInventoryPage';
import { AdminAlbumsPage } from '@/pages/admin/AdminAlbumsPage';
import { AdminArtistsPage } from '@/pages/admin/AdminArtistsPage';
import { AdminGenresPage } from '@/pages/admin/AdminGenresPage';

// Error Page
import { ErrorPage } from '@/pages/ErrorPage';

// Static Pages
import { AboutPage } from '@/pages/static/AboutPage';
import { ContactPage } from '@/pages/static/ContactPage';
import { FAQPage } from '@/pages/static/FAQPage';
import { ShippingPage } from '@/pages/static/ShippingPage';
import { ReturnsPage } from '@/pages/static/ReturnsPage';
import { TermsPage } from '@/pages/static/TermsPage';
import { PrivacyPage } from '@/pages/static/PrivacyPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Album Routes */}
        <Route path="albums">
          <Route index element={<AlbumsPage />} />
          <Route path=":slug" element={<AlbumDetailsPage />} />
        </Route>

        {/* Artist & Genre Routes */}
        <Route path="artists/:slug" element={<ArtistPage />} />
        <Route path="genres/:slug" element={<GenrePage />} />
        <Route path="search" element={<SearchResultsPage />} />

        {/* Cart (accessible to all) */}
        <Route path="cart" element={<CartPage />} />

        {/* Static Pages */}
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="shipping" element={<ShippingPage />} />
        <Route path="returns" element={<ReturnsPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage />} />

          {/* Order Routes */}
          <Route path="orders">
            <Route index element={<OrdersPage />} />
            <Route path=":uuid" element={<OrderDetailsPage />} />
          </Route>

          {/* Wishlist */}
          <Route path="wishlist" element={<WishlistPage />} />

          {/* Checkout */}
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
        </Route>
      </Route>

      {/* Admin Routes with AdminLayout */}
      <Route path="admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="inventory" element={<AdminInventoryPage />} />
          <Route path="albums" element={<AdminAlbumsPage />} />
          <Route path="artists" element={<AdminArtistsPage />} />
          <Route path="genres" element={<AdminGenresPage />} />
        </Route>
      </Route>

      {/* Error Routes */}
      <Route path="404" element={<ErrorPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
