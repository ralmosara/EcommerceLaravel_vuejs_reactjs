<script setup lang="ts">
import { ref, computed } from 'vue'
import { StarIcon } from '@heroicons/vue/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'
import { reviewsApi } from '@/api/endpoints/reviews'

interface Props {
  albumSlug: string
  existingReview?: {
    rating: number
    title?: string
    body?: string
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'submitted'): void
  (e: 'cancelled'): void
}>()

const toast = useToast()
const isSubmitting = ref(false)
const rating = ref(props.existingReview?.rating ?? 0)
const title = ref(props.existingReview?.title ?? '')
const body = ref(props.existingReview?.body ?? '')
const hoverRating = ref(0)

const isEditing = computed(() => !!props.existingReview)
const bodyLength = computed(() => body.value.length)
const maxBodyLength = 2000

const setRating = (value: number) => {
  rating.value = value
}

const handleSubmit = async () => {
  if (rating.value === 0) {
    toast.error('Please select a rating')
    return
  }

  if (body.value.length > 0 && body.value.length < 10) {
    toast.error('Review must be at least 10 characters')
    return
  }

  isSubmitting.value = true

  try {
    const input = {
      rating: rating.value,
      title: title.value || undefined,
      body: body.value || undefined,
    }

    if (isEditing.value) {
      await reviewsApi.updateReview(props.albumSlug, input)
      toast.success('Review updated successfully')
    } else {
      await reviewsApi.createReview(props.albumSlug, input)
      toast.success('Review submitted successfully')
    }

    emit('submitted')
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Failed to submit review'
    toast.error(message)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  emit('cancelled')
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <!-- Rating -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-2">
        Rating <span class="text-red-500">*</span>
      </label>
      <div class="flex gap-1">
        <button
          v-for="star in 5"
          :key="star"
          type="button"
          class="focus:outline-none transition-transform hover:scale-110"
          @click="setRating(star)"
          @mouseenter="hoverRating = star"
          @mouseleave="hoverRating = 0"
        >
          <StarIcon
            v-if="star <= (hoverRating || rating)"
            class="h-8 w-8 text-punk-orange"
          />
          <StarOutlineIcon
            v-else
            class="h-8 w-8 text-gray-500"
          />
        </button>
      </div>
    </div>

    <!-- Title (optional) -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-2">
        Title (optional)
      </label>
      <input
        v-model="title"
        type="text"
        maxlength="255"
        placeholder="Summarize your review"
        class="w-full bg-punk-black border border-punk-gray rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-punk-orange focus:ring-1 focus:ring-punk-orange"
      />
    </div>

    <!-- Body (optional) -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-2">
        Review (optional)
      </label>
      <textarea
        v-model="body"
        rows="4"
        :maxlength="maxBodyLength"
        placeholder="Share your thoughts about this album..."
        class="w-full bg-punk-black border border-punk-gray rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-punk-orange focus:ring-1 focus:ring-punk-orange resize-none"
      />
      <div class="mt-1 text-right text-xs text-gray-500">
        {{ bodyLength }} / {{ maxBodyLength }}
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex gap-3 pt-2">
      <button
        type="button"
        class="btn-punk-outline flex-1"
        :disabled="isSubmitting"
        @click="handleCancel"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="btn-punk flex-1"
        :disabled="isSubmitting || rating === 0"
      >
        {{ isSubmitting ? 'Submitting...' : isEditing ? 'Update Review' : 'Submit Review' }}
      </button>
    </div>
  </form>
</template>
