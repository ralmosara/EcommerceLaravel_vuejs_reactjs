<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-display font-bold text-white uppercase tracking-wider">Artists Management</h2>
        <p class="mt-1 text-gray-400">Manage artist profiles</p>
      </div>
      <button @click="openCreateModal" class="btn-punk py-2 px-4">
        <PlusIcon class="h-5 w-5 mr-2" />
        Add Artist
      </button>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <div class="relative max-w-md">
        <MagnifyingGlassIcon class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search artists..."
          class="w-full pl-10 pr-4 py-2 bg-punk-black border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-punk-orange focus:border-punk-orange"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-punk-orange"></div>
    </div>

    <!-- Artists Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="artist in filteredArtists"
        :key="artist.id"
        class="bg-punk-gray rounded-lg border border-gray-700 overflow-hidden group"
      >
        <!-- Artist Image -->
        <div class="aspect-square relative overflow-hidden">
          <img
            v-if="artist.profile_image"
            :src="artist.profile_image"
            :alt="artist.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div v-else class="w-full h-full bg-punk-black flex items-center justify-center">
            <UserIcon class="h-16 w-16 text-gray-600" />
          </div>

          <!-- Actions Overlay -->
          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              @click="editArtist(artist)"
              class="p-3 bg-punk-orange rounded-full text-white hover:bg-punk-coral transition-colors"
              title="Edit"
            >
              <PencilIcon class="h-5 w-5" />
            </button>
            <button
              @click="confirmDelete(artist)"
              class="p-3 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
              title="Delete"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
          </div>
        </div>

        <!-- Artist Info -->
        <div class="p-4">
          <h3 class="font-semibold text-white truncate">{{ artist.name }}</h3>
          <p v-if="artist.origin" class="text-sm text-gray-400 truncate">{{ artist.origin }}</p>
          <div class="mt-3 flex items-center justify-between">
            <span class="text-sm text-punk-orange">
              {{ artist.albums_count || 0 }} albums
            </span>
            <span v-if="artist.formed_year" class="text-xs text-gray-500">
              Est. {{ artist.formed_year }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && filteredArtists.length === 0" class="text-center py-20">
      <UserGroupIcon class="h-16 w-16 mx-auto text-gray-600 mb-4" />
      <h3 class="text-xl font-display font-bold text-white uppercase tracking-wider">No artists found</h3>
      <p class="mt-2 text-gray-400">Try adjusting your search or add a new artist</p>
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
          <div class="bg-punk-gray rounded-lg border border-gray-700 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-700 flex items-center justify-between">
              <h3 class="text-xl font-bold text-white">
                {{ editingArtist ? 'Edit Artist' : 'Add New Artist' }}
              </h3>
              <button @click="closeModal" class="text-gray-400 hover:text-white">
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>
            <form @submit.prevent="saveArtist" class="p-6 space-y-6">
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
                <label class="block text-sm font-medium text-gray-300 mb-2">Origin</label>
                <input
                  v-model="form.origin"
                  type="text"
                  placeholder="e.g., London, UK"
                  class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white focus:ring-punk-orange focus:border-punk-orange"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Formed Year</label>
                <input
                  v-model.number="form.formed_year"
                  type="number"
                  min="1900"
                  max="2030"
                  class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white focus:ring-punk-orange focus:border-punk-orange"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Biography</label>
                <textarea
                  v-model="form.biography"
                  rows="4"
                  class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white focus:ring-punk-orange focus:border-punk-orange"
                ></textarea>
              </div>
              <div class="flex gap-4 pt-4 border-t border-gray-700">
                <button type="button" @click="closeModal" class="flex-1 btn-punk-outline py-3">
                  Cancel
                </button>
                <button type="submit" class="flex-1 btn-punk py-3">
                  {{ editingArtist ? 'Update Artist' : 'Create Artist' }}
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
        <div v-if="deleteArtist" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div class="bg-punk-gray rounded-lg border border-gray-700 max-w-md w-full p-6">
            <h3 class="text-xl font-bold text-white mb-4">Delete Artist?</h3>
            <p class="text-gray-400 mb-6">
              Are you sure you want to delete "{{ deleteArtist.name }}"? This will also affect associated albums.
            </p>
            <div class="flex gap-4">
              <button @click="deleteArtist = null" class="flex-1 btn-punk-outline py-2">
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
import { ref, reactive, computed, onMounted } from 'vue'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  UserIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

interface Artist {
  id: number
  name: string
  slug: string
  origin?: string
  formed_year?: number
  biography?: string
  profile_image?: string
  albums_count?: number
}

const toast = useToast()

const artists = ref<Artist[]>([])
const isLoading = ref(true)
const searchQuery = ref('')
const showModal = ref(false)
const editingArtist = ref<Artist | null>(null)
const deleteArtist = ref<Artist | null>(null)

const form = reactive({
  name: '',
  origin: '',
  formed_year: null as number | null,
  biography: ''
})

const filteredArtists = computed(() => {
  if (!searchQuery.value) return artists.value

  const query = searchQuery.value.toLowerCase()
  return artists.value.filter(a =>
    a.name.toLowerCase().includes(query) ||
    a.origin?.toLowerCase().includes(query)
  )
})

const fetchArtists = async () => {
  isLoading.value = true
  try {
    // Mock data for demonstration
    artists.value = [
      {
        id: 1,
        name: 'Pink Floyd',
        slug: 'pink-floyd',
        origin: 'London, UK',
        formed_year: 1965,
        biography: 'English rock band formed in London in 1965.',
        albums_count: 15
      },
      {
        id: 2,
        name: 'The Beatles',
        slug: 'the-beatles',
        origin: 'Liverpool, UK',
        formed_year: 1960,
        biography: 'English rock band formed in Liverpool in 1960.',
        albums_count: 13
      },
      {
        id: 3,
        name: 'Led Zeppelin',
        slug: 'led-zeppelin',
        origin: 'London, UK',
        formed_year: 1968,
        biography: 'English rock band formed in London in 1968.',
        albums_count: 9
      },
      {
        id: 4,
        name: 'AC/DC',
        slug: 'ac-dc',
        origin: 'Sydney, Australia',
        formed_year: 1973,
        biography: 'Australian rock band formed by brothers Malcolm and Angus Young.',
        albums_count: 17
      },
      {
        id: 5,
        name: 'Fleetwood Mac',
        slug: 'fleetwood-mac',
        origin: 'London, UK',
        formed_year: 1967,
        biography: 'British-American rock band formed in London in 1967.',
        albums_count: 18
      }
    ]
  } catch (error) {
    toast.error('Failed to load artists')
  } finally {
    isLoading.value = false
  }
}

const openCreateModal = () => {
  editingArtist.value = null
  resetForm()
  showModal.value = true
}

const editArtist = (artist: Artist) => {
  editingArtist.value = artist
  form.name = artist.name
  form.origin = artist.origin || ''
  form.formed_year = artist.formed_year || null
  form.biography = artist.biography || ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingArtist.value = null
  resetForm()
}

const resetForm = () => {
  form.name = ''
  form.origin = ''
  form.formed_year = null
  form.biography = ''
}

const saveArtist = async () => {
  try {
    if (editingArtist.value) {
      // Update existing artist (mock)
      const index = artists.value.findIndex(a => a.id === editingArtist.value?.id)
      if (index !== -1) {
        artists.value[index] = {
          ...artists.value[index],
          name: form.name,
          origin: form.origin,
          formed_year: form.formed_year || undefined,
          biography: form.biography
        }
      }
      toast.success('Artist updated')
    } else {
      // Create new artist (mock)
      artists.value.push({
        id: Date.now(),
        name: form.name,
        slug: form.name.toLowerCase().replace(/\s+/g, '-'),
        origin: form.origin,
        formed_year: form.formed_year || undefined,
        biography: form.biography,
        albums_count: 0
      })
      toast.success('Artist created')
    }
    closeModal()
  } catch (error) {
    toast.error('Failed to save artist')
  }
}

const confirmDelete = (artist: Artist) => {
  deleteArtist.value = artist
}

const handleDelete = async () => {
  if (!deleteArtist.value) return

  try {
    artists.value = artists.value.filter(a => a.id !== deleteArtist.value?.id)
    toast.success('Artist deleted')
    deleteArtist.value = null
  } catch (error) {
    toast.error('Failed to delete artist')
  }
}

onMounted(() => {
  fetchArtists()
})
</script>
