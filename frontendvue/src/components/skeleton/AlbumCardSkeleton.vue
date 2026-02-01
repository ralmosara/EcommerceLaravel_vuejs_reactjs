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
    class="card-punk rounded-lg overflow-hidden"
  >
    <!-- Image skeleton -->
    <div class="aspect-square skeleton bg-punk-black" />

    <!-- Content skeleton -->
    <div class="p-4 space-y-3">
      <!-- Title -->
      <div class="skeleton h-5 w-3/4 bg-punk-black rounded" />

      <!-- Artist -->
      <div class="skeleton h-4 w-1/2 bg-punk-black rounded" />

      <!-- Price row -->
      <div class="flex items-center justify-between pt-2">
        <div class="skeleton h-6 w-20 bg-punk-black rounded" />
        <div class="skeleton h-8 w-8 bg-punk-black rounded-full" />
      </div>
    </div>
  </div>
</template>
