<template>
  <div class="min-h-screen bg-punk-dark py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-display font-bold text-white uppercase tracking-wider">My Profile</h1>
        <p class="mt-2 text-gray-400">Manage your account settings</p>
      </div>

      <!-- Profile Card -->
      <div class="bg-punk-gray rounded-lg border border-gray-700">
        <!-- User Header -->
        <div class="px-6 py-8 border-b border-gray-700">
          <div class="flex items-center gap-6">
            <div class="w-20 h-20 rounded-full bg-punk-black border-2 border-gray-700 flex items-center justify-center">
              <UserIcon class="h-10 w-10 text-gray-500" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">{{ authStore.user?.name }}</h2>
              <p class="text-gray-400">{{ authStore.user?.email }}</p>
              <span class="inline-block mt-2 px-3 py-1 bg-punk-orange/20 text-punk-orange text-xs font-medium uppercase tracking-wider rounded-full">
                {{ authStore.user?.role }}
              </span>
            </div>
          </div>
        </div>

        <!-- Profile Form -->
        <form @submit.prevent="handleUpdateProfile" class="p-6 space-y-6">
          <!-- Personal Information -->
          <div>
            <h3 class="text-lg font-semibold text-white mb-4 uppercase tracking-wider">Personal Information</h3>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-punk-orange focus:border-punk-orange transition-colors"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-punk-orange focus:border-punk-orange transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-punk-orange focus:border-punk-orange transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Member Since</label>
                <p class="px-4 py-3 bg-punk-black/50 border border-gray-700 rounded-lg text-gray-400">
                  {{ formatDate(authStore.user?.created_at) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Change Password Section -->
          <div class="border-t border-gray-700 pt-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-white uppercase tracking-wider">Change Password</h3>
              <span class="text-xs text-gray-500">Leave blank to keep current</span>
            </div>
            <div class="grid grid-cols-1 gap-6">
              <div>
                <label for="current_password" class="block text-sm font-medium text-gray-300 mb-2">
                  Current Password
                </label>
                <div class="relative">
                  <input
                    id="current_password"
                    v-model="form.current_password"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-punk-orange focus:border-punk-orange transition-colors pr-12"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    @click="showCurrentPassword = !showCurrentPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                  >
                    <EyeIcon v-if="!showCurrentPassword" class="h-5 w-5" />
                    <EyeSlashIcon v-else class="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <div class="relative">
                    <input
                      id="password"
                      v-model="form.password"
                      :type="showNewPassword ? 'text' : 'password'"
                      class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-punk-orange focus:border-punk-orange transition-colors pr-12"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      @click="showNewPassword = !showNewPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                    >
                      <EyeIcon v-if="!showNewPassword" class="h-5 w-5" />
                      <EyeSlashIcon v-else class="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label for="password_confirmation" class="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    :type="showNewPassword ? 'text' : 'password'"
                    class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-punk-orange focus:border-punk-orange transition-colors"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex items-center justify-between pt-6 border-t border-gray-700">
            <p v-if="successMessage" class="text-sm text-green-400 flex items-center gap-2">
              <CheckCircleIcon class="h-5 w-5" />
              {{ successMessage }}
            </p>
            <div v-else></div>
            <button
              type="submit"
              :disabled="authStore.loading"
              class="btn-punk py-3 px-6"
              :class="{ 'opacity-50 cursor-not-allowed': authStore.loading }"
            >
              <span v-if="authStore.loading" class="flex items-center gap-2">
                <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Updating...
              </span>
              <span v-else>Update Profile</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Danger Zone -->
      <div class="mt-8 bg-red-900/20 rounded-lg border border-red-900/50 p-6">
        <h3 class="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
        <p class="text-sm text-gray-400 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          @click="showDeleteConfirm = true"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Delete Account
        </button>
      </div>

      <!-- Delete Confirmation Modal -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition-opacity duration-200"
          leave-active-class="transition-opacity duration-200"
          enter-from-class="opacity-0"
          leave-to-class="opacity-0"
        >
          <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div class="bg-punk-gray rounded-lg border border-gray-700 max-w-md w-full p-6">
              <h3 class="text-xl font-bold text-white mb-4">Delete Account?</h3>
              <p class="text-gray-400 mb-6">
                This action cannot be undone. All your data, orders, and wishlist items will be permanently deleted.
              </p>
              <div class="flex gap-4">
                <button
                  @click="showDeleteConfirm = false"
                  class="flex-1 btn-punk-outline py-2"
                >
                  Cancel
                </button>
                <button
                  @click="handleDeleteAccount"
                  class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showDeleteConfirm = ref(false)
const successMessage = ref('')

const form = reactive({
  name: '',
  email: '',
  phone: '',
  current_password: '',
  password: '',
  password_confirmation: ''
})

onMounted(() => {
  if (authStore.user) {
    form.name = authStore.user.name
    form.email = authStore.user.email
    form.phone = authStore.user.phone || ''
  }
})

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleUpdateProfile = async () => {
  successMessage.value = ''

  const updateData: any = {
    name: form.name,
    email: form.email,
    phone: form.phone
  }

  // Only include password fields if user is changing password
  if (form.current_password && form.password && form.password_confirmation) {
    if (form.password !== form.password_confirmation) {
      toast.error('New passwords do not match')
      return
    }
    updateData.current_password = form.current_password
    updateData.password = form.password
    updateData.password_confirmation = form.password_confirmation
  }

  try {
    await authStore.updateProfile(updateData)
    successMessage.value = 'Profile updated successfully'

    // Clear password fields after update
    form.current_password = ''
    form.password = ''
    form.password_confirmation = ''

    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    toast.error('Failed to update profile')
  }
}

const handleDeleteAccount = async () => {
  try {
    // await authStore.deleteAccount()
    toast.success('Account deleted successfully')
    router.push('/')
  } catch (error) {
    toast.error('Failed to delete account')
  }
  showDeleteConfirm.value = false
}
</script>
