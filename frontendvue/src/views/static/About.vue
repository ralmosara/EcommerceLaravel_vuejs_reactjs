<script setup lang="ts">
import { MusicalNoteIcon, ShieldCheckIcon, UsersIcon, HeartIcon } from '@heroicons/vue/24/outline'

const features = [
  {
    icon: MusicalNoteIcon,
    title: 'Wide Selection',
    description: 'From rare vinyl pressings to classic CDs, we have the music you love.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Quality Guaranteed',
    description: 'Every record is inspected and graded to ensure the best listening experience.',
  },
  {
    icon: UsersIcon,
    title: 'Community Driven',
    description: 'Join thousands of music lovers who share your passion for great sound.',
  },
  {
    icon: HeartIcon,
    title: 'Passion for Music',
    description: "We're not just a store, we're fellow collectors who understand the love.",
  },
]
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Hero Section -->
    <div class="text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-display text-white uppercase tracking-wider mb-6">
        About <span class="text-gradient-punk">Vinyl</span>
      </h1>
      <p class="text-xl text-gray-400 max-w-2xl mx-auto">
        Where music meets passion. We're dedicated to bringing you the finest vinyl records,
        CDs, and digital releases from across the musical spectrum.
      </p>
    </div>

    <!-- Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="card-punk p-6 rounded-lg"
      >
        <div class="flex items-start gap-4">
          <div class="p-3 bg-punk-orange/20 rounded-lg">
            <component :is="feature.icon" class="h-6 w-6 text-punk-orange" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-white mb-2">{{ feature.title }}</h3>
            <p class="text-gray-400">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Our Story Section -->
    <div class="bg-punk-gray rounded-lg p-8 mb-16">
      <h2 class="text-2xl font-display text-white uppercase tracking-wider mb-6">Our Story</h2>
      <div class="space-y-4 text-gray-300">
        <p>
          Founded by a group of passionate music collectors, Vinyl started as a small
          record shop in the heart of the city. What began as a weekend hobby quickly
          grew into something much bigger.
        </p>
        <p>
          Today, we're proud to serve music lovers worldwide, offering an extensive
          collection of vinyl records, CDs, cassettes, and digital downloads. Our team
          personally curates every album in our catalog, ensuring that each piece meets
          our high standards for quality and authenticity.
        </p>
        <p>
          We believe that music is more than just sound—it's an experience. That's why
          we go the extra mile to provide detailed information about each release,
          including pressing details, sound quality ratings, and collector insights.
        </p>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="text-center">
      <h2 class="text-2xl font-display text-white uppercase tracking-wider mb-4">
        Ready to Start Your Collection?
      </h2>
      <p class="text-gray-400 mb-6">
        Browse our extensive catalog and discover your next favorite album.
      </p>
      <router-link to="/albums" class="btn-punk">
        Browse Albums
      </router-link>
    </div>
  </div>
</template>
