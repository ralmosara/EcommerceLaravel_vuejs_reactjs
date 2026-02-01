<script setup lang="ts">
</script>

<template>
  <div class="animate-pulse">
    <!-- Breadcrumb skeleton -->
    <div class="flex items-center gap-2 mb-6">
      <div class="skeleton h-4 w-16 bg-punk-gray rounded" />
      <div class="skeleton h-4 w-4 bg-punk-gray rounded" />
      <div class="skeleton h-4 w-24 bg-punk-gray rounded" />
      <div class="skeleton h-4 w-4 bg-punk-gray rounded" />
      <div class="skeleton h-4 w-32 bg-punk-gray rounded" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Image skeleton -->
      <div class="aspect-square skeleton bg-punk-gray rounded-lg" />

      <!-- Details skeleton -->
      <div class="space-y-6">
        <!-- Badge -->
        <div class="skeleton h-6 w-20 bg-punk-gray rounded-full" />

        <!-- Title -->
        <div class="skeleton h-10 w-3/4 bg-punk-gray rounded" />

        <!-- Artist -->
        <div class="skeleton h-6 w-1/2 bg-punk-gray rounded" />

        <!-- Rating -->
        <div class="flex items-center gap-2">
          <div class="skeleton h-5 w-28 bg-punk-gray rounded" />
          <div class="skeleton h-4 w-20 bg-punk-gray rounded" />
        </div>

        <!-- Price -->
        <div class="flex items-center gap-4">
          <div class="skeleton h-8 w-24 bg-punk-gray rounded" />
          <div class="skeleton h-6 w-16 bg-punk-gray rounded" />
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <div class="skeleton h-4 w-full bg-punk-gray rounded" />
          <div class="skeleton h-4 w-full bg-punk-gray rounded" />
          <div class="skeleton h-4 w-3/4 bg-punk-gray rounded" />
        </div>

        <!-- Details list -->
        <div class="space-y-3 pt-4">
          <div class="flex justify-between">
            <div class="skeleton h-4 w-20 bg-punk-gray rounded" />
            <div class="skeleton h-4 w-32 bg-punk-gray rounded" />
          </div>
          <div class="flex justify-between">
            <div class="skeleton h-4 w-24 bg-punk-gray rounded" />
            <div class="skeleton h-4 w-16 bg-punk-gray rounded" />
          </div>
          <div class="flex justify-between">
            <div class="skeleton h-4 w-16 bg-punk-gray rounded" />
            <div class="skeleton h-4 w-24 bg-punk-gray rounded" />
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex gap-4 pt-4">
          <div class="skeleton h-12 flex-1 bg-punk-gray rounded" />
          <div class="skeleton h-12 w-12 bg-punk-gray rounded" />
        </div>
      </div>
    </div>

    <!-- Track list skeleton -->
    <div class="mt-12">
      <div class="skeleton h-8 w-32 bg-punk-gray rounded mb-6" />
      <div class="space-y-3">
        <div v-for="n in 8" :key="n" class="flex items-center gap-4 p-3 bg-punk-gray/50 rounded">
          <div class="skeleton h-4 w-8 bg-punk-gray rounded" />
          <div class="skeleton h-4 flex-1 bg-punk-gray rounded" />
          <div class="skeleton h-4 w-12 bg-punk-gray rounded" />
        </div>
      </div>
    </div>
  </div>
</template>
