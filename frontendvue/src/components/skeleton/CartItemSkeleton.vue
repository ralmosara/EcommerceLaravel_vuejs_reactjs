<script setup lang="ts">
interface Props {
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 1,
})
</script>

<template>
  <div
    v-for="n in props.count"
    :key="n"
    class="flex gap-4 p-4 bg-punk-gray rounded-lg animate-pulse"
  >
    <!-- Image skeleton -->
    <div class="skeleton h-24 w-24 bg-punk-black rounded-lg flex-shrink-0" />

    <!-- Content skeleton -->
    <div class="flex-1 space-y-2">
      <!-- Title -->
      <div class="skeleton h-5 w-3/4 bg-punk-black rounded" />

      <!-- Artist -->
      <div class="skeleton h-4 w-1/2 bg-punk-black rounded" />

      <!-- Format -->
      <div class="skeleton h-5 w-16 bg-punk-black rounded-full" />
    </div>

    <!-- Price and controls skeleton -->
    <div class="flex flex-col items-end justify-between">
      <!-- Price -->
      <div class="skeleton h-6 w-16 bg-punk-black rounded" />

      <!-- Quantity controls -->
      <div class="flex items-center gap-2">
        <div class="skeleton h-8 w-8 bg-punk-black rounded" />
        <div class="skeleton h-6 w-8 bg-punk-black rounded" />
        <div class="skeleton h-8 w-8 bg-punk-black rounded" />
      </div>

      <!-- Remove button -->
      <div class="skeleton h-4 w-16 bg-punk-black rounded" />
    </div>
  </div>
</template>
