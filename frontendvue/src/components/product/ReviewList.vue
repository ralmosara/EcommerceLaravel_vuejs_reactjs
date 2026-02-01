<script setup lang="ts">
import { ref, computed } from 'vue'
import { StarIcon } from '@heroicons/vue/24/solid'
import { PencilIcon, TrashIcon, CheckBadgeIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'
import type { Review } from '@/api/types/models'
import { reviewsApi } from '@/api/endpoints/reviews'
import { useAuthStore } from '@/stores/auth'
import Modal from '@/components/common/Modal.vue'
import ReviewForm from './ReviewForm.vue'

interface Props {
  reviews: Review[]
  albumSlug: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const toast = useToast()
const authStore = useAuthStore()
const editingReview = ref<Review | null>(null)
const showEditModal = ref(false)
const deletingReviewId = ref<number | null>(null)

const currentUserId = computed(() => authStore.user?.uuid)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const handleEdit = (review: Review) => {
  editingReview.value = review
  showEditModal.value = true
}

const handleDelete = async (review: Review) => {
  if (!confirm('Are you sure you want to delete this review?')) return

  deletingReviewId.value = review.id

  try {
    await reviewsApi.deleteReview(props.albumSlug)
    toast.success('Review deleted successfully')
    emit('refresh')
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Failed to delete review'
    toast.error(message)
  } finally {
    deletingReviewId.value = null
  }
}

const handleEditSubmitted = () => {
  showEditModal.value = false
  editingReview.value = null
  emit('refresh')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Loading state -->
    <div v-if="props.loading" class="space-y-4">
      <div v-for="n in 3" :key="n" class="animate-pulse">
        <div class="flex gap-4">
          <div class="h-10 w-10 rounded-full bg-punk-gray" />
          <div class="flex-1 space-y-2">
            <div class="h-4 w-1/4 bg-punk-gray rounded" />
            <div class="h-4 w-1/3 bg-punk-gray rounded" />
            <div class="h-16 w-full bg-punk-gray rounded" />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="props.reviews.length === 0"
      class="text-center py-8 text-gray-400"
    >
      <p>No reviews yet. Be the first to review this album!</p>
    </div>

    <!-- Reviews list -->
    <div v-else class="space-y-6">
      <article
        v-for="review in props.reviews"
        :key="review.id"
        class="bg-punk-gray/50 rounded-lg p-4"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-3">
            <!-- Avatar -->
            <div class="h-10 w-10 rounded-full bg-punk-orange flex items-center justify-center text-white font-semibold">
              {{ review.user.name.charAt(0).toUpperCase() }}
            </div>

            <div>
              <!-- User name and verified badge -->
              <div class="flex items-center gap-2">
                <span class="font-medium text-white">{{ review.user.name }}</span>
                <CheckBadgeIcon
                  class="h-4 w-4 text-green-500"
                  title="Verified Purchase"
                />
              </div>

              <!-- Rating and date -->
              <div class="flex items-center gap-2 mt-1">
                <div class="flex">
                  <StarIcon
                    v-for="star in 5"
                    :key="star"
                    :class="[
                      'h-4 w-4',
                      star <= review.rating ? 'text-punk-orange' : 'text-gray-600',
                    ]"
                  />
                </div>
                <span class="text-xs text-gray-500">
                  {{ formatDate(review.created_at) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Edit/Delete buttons for own reviews -->
          <div
            v-if="currentUserId && review.user_id === currentUserId"
            class="flex gap-2"
          >
            <button
              type="button"
              class="p-1 text-gray-400 hover:text-punk-orange transition-colors"
              title="Edit review"
              @click="handleEdit(review)"
            >
              <PencilIcon class="h-4 w-4" />
            </button>
            <button
              type="button"
              class="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete review"
              :disabled="deletingReviewId === review.id"
              @click="handleDelete(review)"
            >
              <TrashIcon class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Review content -->
        <div class="mt-3 pl-13">
          <p class="text-gray-300 whitespace-pre-wrap">{{ review.comment }}</p>
        </div>
      </article>
    </div>

    <!-- Edit modal -->
    <Modal
      v-model="showEditModal"
      title="Edit Review"
      size="md"
    >
      <ReviewForm
        v-if="editingReview"
        :album-slug="props.albumSlug"
        :existing-review="{
          rating: editingReview.rating,
          body: editingReview.comment,
        }"
        @submitted="handleEditSubmitted"
        @cancelled="showEditModal = false"
      />
    </Modal>
  </div>
</template>
