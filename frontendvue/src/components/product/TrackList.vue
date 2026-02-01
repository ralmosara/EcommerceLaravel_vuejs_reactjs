<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Track List</h3>

    <div v-if="!tracks || tracks.length === 0" class="text-sm text-gray-500">
      No track information available
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="track in tracks"
        :key="track.id"
        class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
      >
        <div class="flex items-center gap-3">
          <span class="text-sm font-medium text-gray-500 w-6">{{ track.track_number }}</span>
          <span class="text-sm text-gray-900">{{ track.title }}</span>
        </div>
        <span v-if="track.duration" class="text-sm text-gray-500">{{ track.duration }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Track } from '@/api/types/models'

interface Props {
  tracks?: Track[]
}

defineProps<Props>()
</script>
