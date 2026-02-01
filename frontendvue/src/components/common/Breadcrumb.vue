<script setup lang="ts">
import { ChevronRightIcon, HomeIcon } from '@heroicons/vue/24/outline'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface Props {
  items: BreadcrumbItem[]
  showHome?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showHome: true,
})
</script>

<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2">
      <!-- Home link -->
      <li v-if="props.showHome">
        <router-link
          to="/"
          class="text-gray-400 hover:text-punk-orange transition-colors"
        >
          <HomeIcon class="h-5 w-5" />
          <span class="sr-only">Home</span>
        </router-link>
      </li>

      <!-- Breadcrumb items -->
      <li
        v-for="(item, index) in props.items"
        :key="index"
        class="flex items-center"
      >
        <ChevronRightIcon class="h-4 w-4 text-gray-500 mx-2" />

        <!-- Link or text based on whether it's the last item -->
        <router-link
          v-if="item.href && index !== props.items.length - 1"
          :to="item.href"
          class="text-gray-400 hover:text-punk-orange transition-colors text-sm"
        >
          {{ item.label }}
        </router-link>
        <span
          v-else
          class="text-gray-200 text-sm font-medium"
          :aria-current="index === props.items.length - 1 ? 'page' : undefined"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>
