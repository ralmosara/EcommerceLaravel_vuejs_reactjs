import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, adminGuard, guestGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/components/layout/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/Home.vue')
        },
        {
          path: 'albums',
          name: 'albums',
          component: () => import('@/views/catalog/Albums.vue')
        },
        {
          path: 'albums/:slug',
          name: 'album-detail',
          component: () => import('@/views/catalog/AlbumDetail.vue')
        },
        {
          path: 'artists',
          name: 'artists',
          component: () => import('@/views/catalog/Artists.vue')
        },
        {
          path: 'artists/:slug',
          name: 'artist-detail',
          component: () => import('@/views/catalog/ArtistDetail.vue')
        },
        {
          path: 'genres',
          name: 'genres',
          component: () => import('@/views/catalog/Genres.vue')
        },
        {
          path: 'genres/:slug',
          name: 'genre-detail',
          component: () => import('@/views/catalog/GenreDetail.vue')
        },
        {
          path: 'search',
          name: 'search',
          component: () => import('@/views/Search.vue')
        },
        {
          path: 'cart',
          name: 'cart',
          component: () => import('@/views/Cart.vue')
        },
        {
          path: 'wishlist',
          name: 'wishlist',
          component: () => import('@/views/Wishlist.vue'),
          beforeEnter: authGuard
        },
        {
          path: 'checkout',
          name: 'checkout',
          component: () => import('@/views/Checkout.vue'),
          beforeEnter: authGuard
        },
        {
          path: 'payment-success',
          name: 'payment-success',
          component: () => import('@/views/PaymentSuccess.vue'),
          beforeEnter: authGuard
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/views/orders/Orders.vue'),
          beforeEnter: authGuard
        },
        {
          path: 'orders/:uuid',
          name: 'order-detail',
          component: () => import('@/views/orders/OrderDetail.vue'),
          beforeEnter: authGuard
        },
        // Static pages
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/static/About.vue')
        },
        {
          path: 'contact',
          name: 'contact',
          component: () => import('@/views/static/Contact.vue')
        },
        {
          path: 'faq',
          name: 'faq',
          component: () => import('@/views/static/FAQ.vue')
        },
        {
          path: 'shipping',
          name: 'shipping',
          component: () => import('@/views/static/Shipping.vue')
        },
        {
          path: 'returns',
          name: 'returns',
          component: () => import('@/views/static/Returns.vue')
        },
        {
          path: 'terms',
          name: 'terms',
          component: () => import('@/views/static/Terms.vue')
        },
        {
          path: 'privacy',
          name: 'privacy',
          component: () => import('@/views/static/Privacy.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/Login.vue'),
      beforeEnter: guestGuard
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/Register.vue'),
      beforeEnter: guestGuard
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/auth/Profile.vue'),
      beforeEnter: authGuard
    },
    {
      path: '/admin',
      component: () => import('@/components/layout/AdminLayout.vue'),
      beforeEnter: adminGuard,
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/Dashboard.vue')
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('@/views/admin/AdminOrders.vue')
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/views/admin/AdminUsers.vue')
        },
        {
          path: 'inventory',
          name: 'admin-inventory',
          component: () => import('@/views/admin/AdminInventory.vue')
        },
        {
          path: 'albums',
          name: 'admin-albums',
          component: () => import('@/views/admin/AdminAlbums.vue')
        },
        {
          path: 'artists',
          name: 'admin-artists',
          component: () => import('@/views/admin/AdminArtists.vue')
        },
        {
          path: 'genres',
          name: 'admin-genres',
          component: () => import('@/views/admin/AdminGenres.vue')
        }
      ]
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
