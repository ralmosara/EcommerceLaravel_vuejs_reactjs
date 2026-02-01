<template>
  <div class="flex items-center gap-1">
    <div class="flex">
      <svg
        v-for="star in 5"
        :key="star"
        class="h-5 w-5"
        :class="star <= Math.round(Number(rating) || 0) ? 'text-yellow-400' : 'text-gray-300'"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </div>
    <span v-if="showRating" class="text-sm text-gray-600 ml-1">
      {{ Number(rating || 0).toFixed(1) }}
    </span>
    <span v-if="showCount && count !== undefined" class="text-sm text-gray-500">
      ({{ count }})
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  rating: number | string
  showRating?: boolean
  showCount?: boolean
  count?: number
}

withDefaults(defineProps<Props>(), {
  showRating: true,
  showCount: false
})
</script>
