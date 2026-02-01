<template>
  <footer class="bg-punk-black border-t border-punk-gray">
    <!-- Main Footer Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
        <!-- Brand Column -->
        <div class="col-span-2 md:col-span-4 lg:col-span-1">
          <RouterLink to="/" class="inline-flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-full bg-punk-orange flex items-center justify-center">
              <div class="w-3 h-3 rounded-full bg-punk-black" />
            </div>
            <span class="text-2xl font-display font-bold text-white">
              VINYL
            </span>
          </RouterLink>
          <p class="text-gray-400 text-sm mb-6 max-w-xs">
            Your destination for rare vinyl, limited editions, and punk rock essentials.
            Curated for collectors, by collectors.
          </p>
          <!-- Social Links -->
          <div class="flex items-center gap-4">
            <a
              href="#"
              class="p-2 bg-punk-gray text-gray-400 hover:bg-punk-orange hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                <circle cx="12" cy="12" r="3.5" />
              </svg>
            </a>
            <a
              href="#"
              class="p-2 bg-punk-gray text-gray-400 hover:bg-punk-orange hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#"
              class="p-2 bg-punk-gray text-gray-400 hover:bg-punk-orange hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </a>
            <a
              href="#"
              class="p-2 bg-punk-gray text-gray-400 hover:bg-punk-orange hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Shop Column -->
        <div>
          <h3 class="text-white font-bold uppercase tracking-wider mb-4">
            Shop
          </h3>
          <ul class="space-y-3">
            <li>
              <RouterLink
                to="/albums"
                class="text-gray-400 hover:text-punk-orange transition-colors text-sm"
              >
                All Albums
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/albums?is_featured=true"
                class="text-gray-400 hover:text-punk-orange transition-colors text-sm"
              >
                Featured
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/albums?on_sale=true"
                class="text-gray-400 hover:text-punk-orange transition-colors text-sm"
              >
                On Sale
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/albums?format=VINYL"
                class="text-gray-400 hover:text-punk-orange transition-colors text-sm"
              >
                Vinyl Only
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/albums?sort=newest"
                class="text-gray-400 hover:text-punk-orange transition-colors text-sm"
              >
                New Arrivals
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Account Column -->
        <div>
          <h3 class="text-white font-bold uppercase tracking-wider mb-4">
            Account
          </h3>
          <ul class="space-y-3">
            <li>
              <RouterLink
                to="/profile"
                class="text-gray-400 hover:text-punk-orange transition-colors text-sm"
              >
                My Profile
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/orders"
                class="text-gray-400 hover:text-punk-orange transition-colors text-sm"
              >
                Order History
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/wishlist"
                class="text-gray-400 hover:text-punk-orange transition-colors text-sm"
              >
                Wishlist
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/cart"
                class="text-gray-400 hover:text-punk-orange transition-colors text-sm"
              >
                Shopping Cart
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Support Column -->
        <div>
          <h3 class="text-white font-bold uppercase tracking-wider mb-4">
            Support
          </h3>
          <ul class="space-y-3">
            <li>
              <RouterLink
                to="/contact"
                class="text-gray-400 hover:text-punk-orange transition-colors text-sm"
              >
                Contact Us
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/shipping"
                class="text-gray-400 hover:text-punk-orange transition-colors text-sm"
              >
                Shipping Info
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/returns"
                class="text-gray-400 hover:text-punk-orange transition-colors text-sm"
              >
                Returns & Refunds
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/faq"
                class="text-gray-400 hover:text-punk-orange transition-colors text-sm"
              >
                FAQ
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Info Column -->
        <div>
          <h3 class="text-white font-bold uppercase tracking-wider mb-4">
            Info
          </h3>
          <ul class="space-y-3">
            <li>
              <RouterLink
                to="/about"
                class="text-gray-400 hover:text-punk-orange transition-colors text-sm"
              >
                About Us
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/terms"
                class="text-gray-400 hover:text-punk-orange transition-colors text-sm"
              >
                Terms of Service
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/privacy"
                class="text-gray-400 hover:text-punk-orange transition-colors text-sm"
              >
                Privacy Policy
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-punk-gray">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-gray-500 text-sm">
            &copy; {{ currentYear }} VINYL. All rights reserved.
          </p>
          <div class="flex items-center gap-6">
            <!-- Payment Icons -->
            <div class="flex items-center gap-2">
              <div class="w-10 h-6 bg-punk-gray rounded flex items-center justify-center">
                <span class="text-[8px] text-gray-400 font-bold">VISA</span>
              </div>
              <div class="w-10 h-6 bg-punk-gray rounded flex items-center justify-center">
                <span class="text-[8px] text-gray-400 font-bold">MC</span>
              </div>
              <div class="w-10 h-6 bg-punk-gray rounded flex items-center justify-center">
                <span class="text-[8px] text-gray-400 font-bold">AMEX</span>
              </div>
              <div class="w-10 h-6 bg-punk-gray rounded flex items-center justify-center">
                <span class="text-[8px] text-gray-400 font-bold">PP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const currentYear = computed(() => new Date().getFullYear())
</script>
