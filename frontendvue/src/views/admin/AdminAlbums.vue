<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-display font-bold text-white uppercase tracking-wider">Albums Management</h2>
        <p class="mt-1 text-gray-400">Manage your album catalog</p>
      </div>
      <button @click="openCreateModal" class="btn-punk py-2 px-4">
        <PlusIcon class="h-5 w-5 mr-2" />
        Add Album
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 mb-6">
      <div class="relative flex-1 min-w-[200px]">
        <MagnifyingGlassIcon class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search albums..."
          class="w-full pl-10 pr-4 py-2 bg-punk-black border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-punk-orange focus:border-punk-orange"
        />
      </div>
      <select
        v-model="formatFilter"
        class="px-4 py-2 bg-punk-black border border-gray-700 rounded-lg text-white text-sm focus:ring-punk-orange focus:border-punk-orange"
      >
        <option value="">All Formats</option>
        <option value="VINYL">Vinyl</option>
        <option value="CD">CD</option>
        <option value="CASSETTE">Cassette</option>
        <option value="DIGITAL">Digital</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-punk-orange"></div>
    </div>

    <!-- Albums Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="album in filteredAlbums"
        :key="album.uuid"
        class="bg-punk-gray rounded-lg border border-gray-700 overflow-hidden group"
      >
        <!-- Album Image -->
        <div class="aspect-square relative overflow-hidden">
          <img
            v-if="album.cover_image"
            :src="album.cover_image"
            :alt="album.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div v-else class="w-full h-full bg-punk-black flex items-center justify-center">
            <MusicalNoteIcon class="h-16 w-16 text-gray-600" />
          </div>

          <!-- Actions Overlay -->
          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              @click="editAlbum(album)"
              class="p-3 bg-punk-orange rounded-full text-white hover:bg-punk-coral transition-colors"
              title="Edit"
            >
              <PencilIcon class="h-5 w-5" />
            </button>
            <button
              @click="confirmDelete(album)"
              class="p-3 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
              title="Delete"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
          </div>

          <!-- Format Badge -->
          <span class="absolute top-2 right-2 px-2 py-1 bg-punk-black/80 text-punk-orange text-xs font-bold uppercase rounded">
            {{ album.format }}
          </span>
        </div>

        <!-- Album Info -->
        <div class="p-4">
          <h3 class="font-semibold text-white truncate">{{ album.title }}</h3>
          <p class="text-sm text-gray-400 truncate">{{ album.artist?.name }}</p>
          <div class="mt-3 flex items-center justify-between">
            <div class="flex items-baseline gap-2">
              <span v-if="album.sale_price" class="text-lg font-bold text-punk-orange">
                ${{ album.sale_price.toFixed(2) }}
              </span>
              <span
                :class="album.sale_price ? 'text-sm text-gray-500 line-through' : 'text-lg font-bold text-white'"
              >
                ${{ album.price.toFixed(2) }}
              </span>
            </div>
            <span
              :class="[
                'text-xs font-medium px-2 py-1 rounded',
                album.inventory?.quantity > 0 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
              ]"
            >
              {{ album.inventory?.quantity || 0 }} in stock
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && filteredAlbums.length === 0" class="text-center py-20">
      <MusicalNoteIcon class="h-16 w-16 mx-auto text-gray-600 mb-4" />
      <h3 class="text-xl font-display font-bold text-white uppercase tracking-wider">No albums found</h3>
      <p class="mt-2 text-gray-400">Try adjusting your search or add a new album</p>
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
          <div class="bg-punk-gray rounded-lg border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-700 flex items-center justify-between">
              <h3 class="text-xl font-bold text-white">
                {{ editingAlbum ? 'Edit Album' : 'Add New Album' }}
              </h3>
              <button @click="closeModal" class="text-gray-400 hover:text-white">
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>
            <form @submit.prevent="saveAlbum" class="p-6 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    v-model="form.title"
                    type="text"
                    required
                    class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white focus:ring-punk-orange focus:border-punk-orange"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Artist</label>
                  <select
                    v-model="form.artist_id"
                    required
                    class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white focus:ring-punk-orange focus:border-punk-orange"
                  >
                    <option value="">Select Artist</option>
                    <option v-for="artist in artists" :key="artist.id" :value="artist.id">
                      {{ artist.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Format</label>
                  <select
                    v-model="form.format"
                    required
                    class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white focus:ring-punk-orange focus:border-punk-orange"
                  >
                    <option value="VINYL">Vinyl</option>
                    <option value="CD">CD</option>
                    <option value="CASSETTE">Cassette</option>
                    <option value="DIGITAL">Digital</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Price</label>
                  <input
                    v-model.number="form.price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white focus:ring-punk-orange focus:border-punk-orange"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Sale Price (optional)</label>
                  <input
                    v-model.number="form.sale_price"
                    type="number"
                    step="0.01"
                    min="0"
                    class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white focus:ring-punk-orange focus:border-punk-orange"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Release Year</label>
                  <input
                    v-model.number="form.release_year"
                    type="number"
                    min="1900"
                    max="2030"
                    class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white focus:ring-punk-orange focus:border-punk-orange"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Label</label>
                  <input
                    v-model="form.label"
                    type="text"
                    class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white focus:ring-punk-orange focus:border-punk-orange"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    v-model="form.description"
                    rows="3"
                    class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white focus:ring-punk-orange focus:border-punk-orange"
                  ></textarea>
                </div>
                <div class="md:col-span-2 flex items-center gap-6">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      v-model="form.is_featured"
                      type="checkbox"
                      class="h-4 w-4 text-punk-orange bg-punk-black border-gray-700 rounded focus:ring-punk-orange"
                    />
                    <span class="text-gray-300">Featured Album</span>
                  </label>
                </div>
              </div>
              <div class="flex gap-4 pt-4 border-t border-gray-700">
                <button type="button" @click="closeModal" class="flex-1 btn-punk-outline py-3">
                  Cancel
                </button>
                <button type="submit" class="flex-1 btn-punk py-3">
                  {{ editingAlbum ? 'Update Album' : 'Create Album' }}
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
        <div v-if="deleteAlbum" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div class="bg-punk-gray rounded-lg border border-gray-700 max-w-md w-full p-6">
            <h3 class="text-xl font-bold text-white mb-4">Delete Album?</h3>
            <p class="text-gray-400 mb-6">
              Are you sure you want to delete "{{ deleteAlbum.title }}"? This action cannot be undone.
            </p>
            <div class="flex gap-4">
              <button @click="deleteAlbum = null" class="flex-1 btn-punk-outline py-2">
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
  MusicalNoteIcon
} from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

interface Album {
  uuid: string
  title: string
  slug: string
  artist?: { id: number; name: string }
  format: string
  price: number
  sale_price?: number
  release_year?: number
  label?: string
  description?: string
  cover_image?: string
  is_featured?: boolean
  inventory?: { quantity: number }
}

interface Artist {
  id: number
  name: string
}

const toast = useToast()

const albums = ref<Album[]>([])
const artists = ref<Artist[]>([])
const isLoading = ref(true)
const searchQuery = ref('')
const formatFilter = ref('')
const showModal = ref(false)
const editingAlbum = ref<Album | null>(null)
const deleteAlbum = ref<Album | null>(null)

const form = reactive({
  title: '',
  artist_id: '',
  format: 'VINYL',
  price: 0,
  sale_price: null as number | null,
  release_year: null as number | null,
  label: '',
  description: '',
  is_featured: false
})

const filteredAlbums = computed(() => {
  let result = albums.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(a =>
      a.title.toLowerCase().includes(query) ||
      a.artist?.name.toLowerCase().includes(query)
    )
  }

  if (formatFilter.value) {
    result = result.filter(a => a.format === formatFilter.value)
  }

  return result
})

const fetchData = async () => {
  isLoading.value = true
  try {
    // Mock data for demonstration
    artists.value = [
      { id: 1, name: 'Pink Floyd' },
      { id: 2, name: 'The Beatles' },
      { id: 3, name: 'Led Zeppelin' },
      { id: 4, name: 'AC/DC' },
      { id: 5, name: 'Fleetwood Mac' }
    ]

    albums.value = [
      {
        uuid: '1',
        title: 'Dark Side of the Moon',
        slug: 'dark-side-of-the-moon',
        artist: { id: 1, name: 'Pink Floyd' },
        format: 'VINYL',
        price: 34.99,
        release_year: 1973,
        label: 'Harvest',
        inventory: { quantity: 25 }
      },
      {
        uuid: '2',
        title: 'Abbey Road',
        slug: 'abbey-road',
        artist: { id: 2, name: 'The Beatles' },
        format: 'VINYL',
        price: 29.99,
        sale_price: 24.99,
        release_year: 1969,
        label: 'Apple',
        is_featured: true,
        inventory: { quantity: 10 }
      },
      {
        uuid: '3',
        title: 'Led Zeppelin IV',
        slug: 'led-zeppelin-iv',
        artist: { id: 3, name: 'Led Zeppelin' },
        format: 'CD',
        price: 14.99,
        release_year: 1971,
        label: 'Atlantic',
        inventory: { quantity: 5 }
      },
      {
        uuid: '4',
        title: 'Back in Black',
        slug: 'back-in-black',
        artist: { id: 4, name: 'AC/DC' },
        format: 'VINYL',
        price: 32.99,
        release_year: 1980,
        label: 'Atlantic',
        inventory: { quantity: 0 }
      }
    ]
  } catch (error) {
    toast.error('Failed to load data')
  } finally {
    isLoading.value = false
  }
}

const openCreateModal = () => {
  editingAlbum.value = null
  resetForm()
  showModal.value = true
}

const editAlbum = (album: Album) => {
  editingAlbum.value = album
  form.title = album.title
  form.artist_id = album.artist?.id?.toString() || ''
  form.format = album.format
  form.price = album.price
  form.sale_price = album.sale_price || null
  form.release_year = album.release_year || null
  form.label = album.label || ''
  form.description = album.description || ''
  form.is_featured = album.is_featured || false
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingAlbum.value = null
  resetForm()
}

const resetForm = () => {
  form.title = ''
  form.artist_id = ''
  form.format = 'VINYL'
  form.price = 0
  form.sale_price = null
  form.release_year = null
  form.label = ''
  form.description = ''
  form.is_featured = false
}

const saveAlbum = async () => {
  try {
    if (editingAlbum.value) {
      // Update existing album (mock)
      const index = albums.value.findIndex(a => a.uuid === editingAlbum.value?.uuid)
      if (index !== -1) {
        albums.value[index] = {
          ...albums.value[index],
          title: form.title,
          format: form.format,
          price: form.price,
          sale_price: form.sale_price || undefined,
          release_year: form.release_year || undefined,
          label: form.label,
          description: form.description,
          is_featured: form.is_featured
        }
      }
      toast.success('Album updated')
    } else {
      // Create new album (mock)
      const artist = artists.value.find(a => a.id.toString() === form.artist_id)
      albums.value.push({
        uuid: Date.now().toString(),
        title: form.title,
        slug: form.title.toLowerCase().replace(/\s+/g, '-'),
        artist: artist,
        format: form.format,
        price: form.price,
        sale_price: form.sale_price || undefined,
        release_year: form.release_year || undefined,
        label: form.label,
        description: form.description,
        is_featured: form.is_featured,
        inventory: { quantity: 0 }
      })
      toast.success('Album created')
    }
    closeModal()
  } catch (error) {
    toast.error('Failed to save album')
  }
}

const confirmDelete = (album: Album) => {
  deleteAlbum.value = album
}

const handleDelete = async () => {
  if (!deleteAlbum.value) return

  try {
    albums.value = albums.value.filter(a => a.uuid !== deleteAlbum.value?.uuid)
    toast.success('Album deleted')
    deleteAlbum.value = null
  } catch (error) {
    toast.error('Failed to delete album')
  }
}

onMounted(() => {
  fetchData()
})
</script>
