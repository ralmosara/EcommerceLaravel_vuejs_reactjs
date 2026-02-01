<script setup lang="ts">
import { ref, computed } from 'vue'
import { LinkIcon, CheckIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

interface Props {
  url: string
  title: string
  description?: string
}

const props = defineProps<Props>()

const toast = useToast()
const copied = ref(false)

const encodedUrl = computed(() => encodeURIComponent(props.url))
const encodedTitle = computed(() => encodeURIComponent(props.title))
const encodedDescription = computed(() => encodeURIComponent(props.description || ''))

const shareLinks = computed(() => ({
  twitter: `https://twitter.com/intent/tweet?text=${encodedTitle.value}&url=${encodedUrl.value}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl.value}`,
  pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl.value}&description=${encodedTitle.value}`,
  email: `mailto:?subject=${encodedTitle.value}&body=${encodedDescription.value}%0A%0A${encodedUrl.value}`,
}))

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.url)
    copied.value = true
    toast.success('Link copied to clipboard!')
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    toast.error('Failed to copy link')
  }
}

const openShareWindow = (url: string) => {
  window.open(url, '_blank', 'width=600,height=400')
}
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-sm text-gray-400 mr-2">Share:</span>

    <!-- Twitter/X -->
    <button
      type="button"
      class="p-2 bg-punk-gray rounded-lg text-gray-400 hover:text-white hover:bg-[#1DA1F2] transition-colors"
      title="Share on Twitter"
      @click="openShareWindow(shareLinks.twitter)"
    >
      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </button>

    <!-- Facebook -->
    <button
      type="button"
      class="p-2 bg-punk-gray rounded-lg text-gray-400 hover:text-white hover:bg-[#1877F2] transition-colors"
      title="Share on Facebook"
      @click="openShareWindow(shareLinks.facebook)"
    >
      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    </button>

    <!-- Pinterest -->
    <button
      type="button"
      class="p-2 bg-punk-gray rounded-lg text-gray-400 hover:text-white hover:bg-[#E60023] transition-colors"
      title="Share on Pinterest"
      @click="openShareWindow(shareLinks.pinterest)"
    >
      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
      </svg>
    </button>

    <!-- Email -->
    <a
      :href="shareLinks.email"
      class="p-2 bg-punk-gray rounded-lg text-gray-400 hover:text-white hover:bg-punk-orange transition-colors"
      title="Share via Email"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </a>

    <!-- Copy Link -->
    <button
      type="button"
      class="p-2 bg-punk-gray rounded-lg transition-colors"
      :class="copied ? 'text-green-500 bg-green-900/50' : 'text-gray-400 hover:text-white hover:bg-punk-black'"
      title="Copy Link"
      @click="copyToClipboard"
    >
      <CheckIcon v-if="copied" class="h-5 w-5" />
      <LinkIcon v-else class="h-5 w-5" />
    </button>
  </div>
</template>
