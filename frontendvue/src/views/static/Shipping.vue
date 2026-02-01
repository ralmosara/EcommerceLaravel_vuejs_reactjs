<script setup lang="ts">
import { TruckIcon, GlobeAltIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/vue/24/outline'
import { SHIPPING_METHODS, COUNTRIES } from '@/utils/constants'

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl md:text-5xl font-display text-white uppercase tracking-wider text-center mb-12">
      Shipping <span class="text-gradient-punk">Information</span>
    </h1>

    <!-- Shipping Methods -->
    <section class="mb-12">
      <h2 class="text-2xl font-display text-white uppercase tracking-wider mb-6">
        Shipping Methods
      </h2>
      <div class="bg-punk-gray rounded-lg overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="border-b border-punk-black">
              <th class="text-left p-4 text-gray-400 font-medium">Method</th>
              <th class="text-left p-4 text-gray-400 font-medium">Delivery Time</th>
              <th class="text-right p-4 text-gray-400 font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="method in SHIPPING_METHODS"
              :key="method.id"
              class="border-b border-punk-black last:border-0"
            >
              <td class="p-4">
                <div class="font-medium text-white">{{ method.name }}</div>
              </td>
              <td class="p-4 text-gray-400">{{ method.description }}</td>
              <td class="p-4 text-right text-punk-orange font-medium">
                {{ formatPrice(method.price) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-4 text-sm text-gray-500">
        * Free standard shipping on orders over $50
      </p>
    </section>

    <!-- Features Grid -->
    <section class="mb-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-punk-gray rounded-lg p-6">
          <div class="flex items-start gap-4">
            <div class="p-3 bg-punk-orange/20 rounded-lg">
              <TruckIcon class="h-6 w-6 text-punk-orange" />
            </div>
            <div>
              <h3 class="font-medium text-white mb-1">Careful Handling</h3>
              <p class="text-sm text-gray-400">
                All records are securely packaged in protective mailers to prevent damage during transit.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-punk-gray rounded-lg p-6">
          <div class="flex items-start gap-4">
            <div class="p-3 bg-punk-orange/20 rounded-lg">
              <ShieldCheckIcon class="h-6 w-6 text-punk-orange" />
            </div>
            <div>
              <h3 class="font-medium text-white mb-1">Shipping Insurance</h3>
              <p class="text-sm text-gray-400">
                Orders over $100 include complimentary shipping insurance for peace of mind.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-punk-gray rounded-lg p-6">
          <div class="flex items-start gap-4">
            <div class="p-3 bg-punk-orange/20 rounded-lg">
              <ClockIcon class="h-6 w-6 text-punk-orange" />
            </div>
            <div>
              <h3 class="font-medium text-white mb-1">Same Day Processing</h3>
              <p class="text-sm text-gray-400">
                Orders placed before 2 PM EST are processed and shipped the same business day.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-punk-gray rounded-lg p-6">
          <div class="flex items-start gap-4">
            <div class="p-3 bg-punk-orange/20 rounded-lg">
              <GlobeAltIcon class="h-6 w-6 text-punk-orange" />
            </div>
            <div>
              <h3 class="font-medium text-white mb-1">Worldwide Shipping</h3>
              <p class="text-sm text-gray-400">
                We ship to over 20 countries. International rates calculated at checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- International Shipping -->
    <section class="mb-12">
      <h2 class="text-2xl font-display text-white uppercase tracking-wider mb-6">
        International Shipping
      </h2>
      <div class="bg-punk-gray rounded-lg p-6">
        <p class="text-gray-300 mb-4">
          We currently ship to the following countries. International shipping rates and delivery
          times vary based on destination and are calculated at checkout.
        </p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="country in COUNTRIES"
            :key="country.code"
            class="px-3 py-1 bg-punk-black rounded-full text-sm text-gray-400"
          >
            {{ country.name }}
          </span>
        </div>
      </div>
    </section>

    <!-- Important Notes -->
    <section>
      <h2 class="text-2xl font-display text-white uppercase tracking-wider mb-6">
        Important Notes
      </h2>
      <div class="bg-punk-gray rounded-lg p-6 space-y-4">
        <div>
          <h3 class="font-medium text-white mb-1">Customs & Duties</h3>
          <p class="text-sm text-gray-400">
            International orders may be subject to customs fees and import duties. These charges
            are the responsibility of the recipient and are not included in our shipping prices.
          </p>
        </div>
        <div>
          <h3 class="font-medium text-white mb-1">P.O. Boxes</h3>
          <p class="text-sm text-gray-400">
            We cannot ship to P.O. Box addresses. Please provide a physical street address for delivery.
          </p>
        </div>
        <div>
          <h3 class="font-medium text-white mb-1">Delivery Confirmation</h3>
          <p class="text-sm text-gray-400">
            All shipments include tracking information. You'll receive an email with tracking
            details once your order ships.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
