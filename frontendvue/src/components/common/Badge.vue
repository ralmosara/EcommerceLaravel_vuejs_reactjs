<script setup lang="ts">
interface Props {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
})

const variantClasses: Record<string, string> = {
  default: 'bg-punk-gray text-gray-300',
  success: 'bg-green-900 text-green-300',
  warning: 'bg-yellow-900 text-yellow-300',
  error: 'bg-red-900 text-red-300',
  info: 'bg-blue-900 text-blue-300',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full font-medium',
      variantClasses[props.variant],
      sizeClasses[props.size],
    ]"
  >
    <slot />
  </span>
</template>
