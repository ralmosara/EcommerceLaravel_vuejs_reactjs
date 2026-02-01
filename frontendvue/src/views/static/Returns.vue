<script setup lang="ts">
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/vue/24/outline'

const steps = [
  {
    number: 1,
    title: 'Initiate Return',
    description: 'Log into your account, go to Orders, and click "Request Return" on the item you wish to return.',
  },
  {
    number: 2,
    title: 'Print Label',
    description: 'Download and print the prepaid return shipping label. For defective items, return shipping is free.',
  },
  {
    number: 3,
    title: 'Pack & Ship',
    description: 'Securely pack the item in its original packaging and drop it off at any authorized shipping location.',
  },
  {
    number: 4,
    title: 'Receive Refund',
    description: 'Once we receive and inspect the item, your refund will be processed within 5-7 business days.',
  },
]
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl md:text-5xl font-display text-white uppercase tracking-wider text-center mb-12">
      Returns & <span class="text-gradient-punk">Refunds</span>
    </h1>

    <!-- Return Policy Overview -->
    <section class="mb-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-punk-gray rounded-lg p-6 text-center">
          <div class="w-12 h-12 rounded-full bg-punk-orange/20 flex items-center justify-center mx-auto mb-4">
            <ClockIcon class="h-6 w-6 text-punk-orange" />
          </div>
          <h3 class="font-medium text-white mb-1">30-Day Returns</h3>
          <p class="text-sm text-gray-400">Return unopened items within 30 days of delivery</p>
        </div>

        <div class="bg-punk-gray rounded-lg p-6 text-center">
          <div class="w-12 h-12 rounded-full bg-punk-orange/20 flex items-center justify-center mx-auto mb-4">
            <ArrowPathIcon class="h-6 w-6 text-punk-orange" />
          </div>
          <h3 class="font-medium text-white mb-1">Free Returns</h3>
          <p class="text-sm text-gray-400">Free return shipping for defective products</p>
        </div>

        <div class="bg-punk-gray rounded-lg p-6 text-center">
          <div class="w-12 h-12 rounded-full bg-punk-orange/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon class="h-6 w-6 text-punk-orange" />
          </div>
          <h3 class="font-medium text-white mb-1">Full Refund</h3>
          <p class="text-sm text-gray-400">Get your money back, no questions asked</p>
        </div>
      </div>
    </section>

    <!-- Return Process Steps -->
    <section class="mb-12">
      <h2 class="text-2xl font-display text-white uppercase tracking-wider mb-6">
        How to Return
      </h2>
      <div class="space-y-4">
        <div
          v-for="step in steps"
          :key="step.number"
          class="bg-punk-gray rounded-lg p-6 flex items-start gap-4"
        >
          <div class="w-10 h-10 rounded-full bg-punk-orange flex items-center justify-center flex-shrink-0">
            <span class="font-bold text-white">{{ step.number }}</span>
          </div>
          <div>
            <h3 class="font-medium text-white mb-1">{{ step.title }}</h3>
            <p class="text-gray-400">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Eligible vs Non-Eligible -->
    <section class="mb-12">
      <h2 class="text-2xl font-display text-white uppercase tracking-wider mb-6">
        Return Eligibility
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-punk-gray rounded-lg p-6">
          <div class="flex items-center gap-2 mb-4">
            <CheckCircleIcon class="h-6 w-6 text-green-500" />
            <h3 class="font-medium text-white">Eligible for Return</h3>
          </div>
          <ul class="space-y-2 text-gray-400">
            <li class="flex items-start gap-2">
              <span class="text-green-500">•</span>
              Unopened items in original packaging
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-500">•</span>
              Defective or damaged products
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-500">•</span>
              Wrong item received
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-500">•</span>
              Items with manufacturer defects
            </li>
          </ul>
        </div>

        <div class="bg-punk-gray rounded-lg p-6">
          <div class="flex items-center gap-2 mb-4">
            <XCircleIcon class="h-6 w-6 text-red-500" />
            <h3 class="font-medium text-white">Not Eligible</h3>
          </div>
          <ul class="space-y-2 text-gray-400">
            <li class="flex items-start gap-2">
              <span class="text-red-500">•</span>
              Opened vinyl records or CDs
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-500">•</span>
              Digital downloads (after download)
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-500">•</span>
              Items returned after 30 days
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-500">•</span>
              Items without proof of purchase
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Refund Information -->
    <section>
      <h2 class="text-2xl font-display text-white uppercase tracking-wider mb-6">
        Refund Information
      </h2>
      <div class="bg-punk-gray rounded-lg p-6 space-y-4">
        <div>
          <h3 class="font-medium text-white mb-1">Processing Time</h3>
          <p class="text-gray-400">
            Refunds are processed within 5-7 business days after we receive and inspect the returned item.
            You'll receive an email confirmation once your refund has been processed.
          </p>
        </div>
        <div>
          <h3 class="font-medium text-white mb-1">Refund Method</h3>
          <p class="text-gray-400">
            Refunds are issued to the original payment method. Credit card refunds may take an additional
            3-5 business days to appear on your statement.
          </p>
        </div>
        <div>
          <h3 class="font-medium text-white mb-1">Partial Refunds</h3>
          <p class="text-gray-400">
            Items returned in non-original condition or with missing components may be subject to a
            restocking fee of up to 20% of the purchase price.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
