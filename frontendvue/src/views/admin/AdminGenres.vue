<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-display font-bold text-white uppercase tracking-wider">Genres Management</h2>
        <p class="mt-1 text-gray-400">Manage music genres</p>
      </div>
      <button @click="openCreateModal" class="btn-punk py-2 px-4">
        <PlusIcon class="h-5 w-5 mr-2" />
        Add Genre
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-punk-orange"></div>
    </div>

    <!-- Genres Table -->
    <div v-else class="bg-punk-gray rounded-lg border border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-punk-black">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Genre
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Slug
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Albums
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="genre in genres" :key="genre.id" class="hover:bg-punk-black/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center"
                    :style="{ backgroundColor: genre.color || '#FF6B35' }"
                  >
                    <TagIcon class="h-5 w-5 text-white" />
                  </div>
                  <span class="text-sm font-medium text-white">{{ genre.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ genre.slug }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-punk-orange">{{ genre.albums_count || 0 }}</span>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-400 truncate max-w-xs">
                  {{ genre.description || 'No description' }}
                </p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="editGenre(genre)"
                    class="p-1.5 text-gray-400 hover:text-punk-orange transition-colors"
                    title="Edit"
                  >
                    <PencilIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click="confirmDelete(genre)"
                    class="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="genres.length === 0" class="text-center py-12">
        <TagIcon class="h-12 w-12 mx-auto text-gray-600 mb-4" />
        <p class="text-gray-400">No genres found</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div v-if="showModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div class="bg-punk-gray rounded-lg border border-gray-700 max-w-lg w-full">
            <div class="p-6 border-b border-gray-700 flex items-center justify-between">
              <h3 class="text-xl font-bold text-white">
                {{ editingGenre ? 'Edit Genre' : 'Add New Genre' }}
              </h3>
              <button @click="closeModal" class="text-gray-400 hover:text-white">
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>
            <form @submit.prevent="saveGenre" class="p-6 space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white focus:ring-punk-orange focus:border-punk-orange"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white focus:ring-punk-orange focus:border-punk-orange"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Color</label>
                <div class="flex items-center gap-3">
                  <input
                    v-model="form.color"
                    type="color"
                    class="w-12 h-12 rounded-lg cursor-pointer border-0"
                  />
                  <input
                    v-model="form.color"
                    type="text"
                    placeholder="#FF6B35"
                    class="flex-1 px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white focus:ring-punk-orange focus:border-punk-orange"
                  />
                </div>
              </div>
              <div class="flex gap-4 pt-4 border-t border-gray-700">
                <button type="button" @click="closeModal" class="flex-1 btn-punk-outline py-3">
                  Cancel
                </button>
                <button type="submit" class="flex-1 btn-punk py-3">
                  {{ editingGenre ? 'Update Genre' : 'Create Genre' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div v-if="deleteGenre" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div class="bg-punk-gray rounded-lg border border-gray-700 max-w-md w-full p-6">
            <h3 class="text-xl font-bold text-white mb-4">Delete Genre?</h3>
            <p class="text-gray-400 mb-6">
              Are you sure you want to delete "{{ deleteGenre.name }}"? Albums will be unlinked from this genre.
            </p>
            <div class="flex gap-4">
              <button @click="deleteGenre = null" class="flex-1 btn-punk-outline py-2">
                Cancel
              </button>
              <button @click="handleDelete" class="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  TagIcon
} from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

interface Genre {
  id: number
  name: string
  slug: string
  description?: string
  color?: string
  albums_count?: number
}

const toast = useToast()

const genres = ref<Genre[]>([])
const isLoading = ref(true)
const showModal = ref(false)
const editingGenre = ref<Genre | null>(null)
const deleteGenre = ref<Genre | null>(null)

const form = reactive({
  name: '',
  description: '',
  color: '#FF6B35'
})

const fetchGenres = async () => {
  isLoading.value = true
  try {
    // Mock data for demonstration
    genres.value = [
      {
        id: 1,
        name: 'Rock',
        slug: 'rock',
        description: 'Rock music is a broad genre that originated as "rock and roll" in the United States in the late 1940s and early 1950s.',
        color: '#E63946',
        albums_count: 45
      },
      {
        id: 2,
        name: 'Jazz',
        slug: 'jazz',
        description: 'Jazz is a music genre that originated in the African-American communities of New Orleans in the late 19th and early 20th centuries.',
        color: '#2A9D8F',
        albums_count: 28
      },
      {
        id: 3,
        name: 'Blues',
        slug: 'blues',
        description: 'Blues is a music genre and musical form that originated in the Deep South of the United States around the 1860s.',
        color: '#264653',
        albums_count: 19
      },
      {
        id: 4,
        name: 'Electronic',
        slug: 'electronic',
        description: 'Electronic music is music that employs electronic musical instruments, digital instruments, or circuitry-based music technology.',
        color: '#9B5DE5',
        albums_count: 32
      },
      {
        id: 5,
        name: 'Classical',
        slug: 'classical',
        description: 'Classical music is art music produced or rooted in the traditions of Western culture.',
        color: '#F4A261',
        albums_count: 15
      },
      {
        id: 6,
        name: 'Hip Hop',
        slug: 'hip-hop',
        description: 'Hip hop music is a genre of popular music developed in the United States by inner-city African Americans and Latino Americans in the Bronx.',
        color: '#E9C46A',
        albums_count: 38
      }
    ]
  } catch (error) {
    toast.error('Failed to load genres')
  } finally {
    isLoading.value = false
  }
}

const openCreateModal = () => {
  editingGenre.value = null
  resetForm()
  showModal.value = true
}

const editGenre = (genre: Genre) => {
  editingGenre.value = genre
  form.name = genre.name
  form.description = genre.description || ''
  form.color = genre.color || '#FF6B35'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingGenre.value = null
  resetForm()
}

const resetForm = () => {
  form.name = ''
  form.description = ''
  form.color = '#FF6B35'
}

const saveGenre = async () => {
  try {
    if (editingGenre.value) {
      // Update existing genre (mock)
      const index = genres.value.findIndex(g => g.id === editingGenre.value?.id)
      if (index !== -1) {
        genres.value[index] = {
          ...genres.value[index],
          name: form.name,
          description: form.description,
          color: form.color
        }
      }
      toast.success('Genre updated')
    } else {
      // Create new genre (mock)
      genres.value.push({
        id: Date.now(),
        name: form.name,
        slug: form.name.toLowerCase().replace(/\s+/g, '-'),
        description: form.description,
        color: form.color,
        albums_count: 0
      })
      toast.success('Genre created')
    }
    closeModal()
  } catch (error) {
    toast.error('Failed to save genre')
  }
}

const confirmDelete = (genre: Genre) => {
  deleteGenre.value = genre
}

const handleDelete = async () => {
  if (!deleteGenre.value) return

  try {
    genres.value = genres.value.filter(g => g.id !== deleteGenre.value?.id)
    toast.success('Genre deleted')
    deleteGenre.value = null
  } catch (error) {
    toast.error('Failed to delete genre')
  }
}

onMounted(() => {
  fetchGenres()
})
</script>
