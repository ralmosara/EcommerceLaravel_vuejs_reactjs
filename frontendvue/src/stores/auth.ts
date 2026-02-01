import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/api/types/models'
import { authApi } from '@/api/endpoints/auth'
import type { LoginCredentials, RegisterData } from '@/api/endpoints/auth'
import { useToast } from 'vue-toastification'
import router from '@/router'

const toast = useToast()

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const initialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isCustomer = computed(() => user.value?.role === 'customer')

  // Actions
  async function login(credentials: LoginCredentials) {
    try {
      loading.value = true
      const response = await authApi.login(credentials)

      // Validate response structure
      if (!response || !response.token || !response.user) {
        console.error('Invalid response structure:', response)
        toast.error('Login failed: Invalid response from server')
        throw new Error('Invalid response structure from login API')
      }

      token.value = response.token
      user.value = response.user

      // Persist to localStorage
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      toast.success(`Welcome back, ${response.user.name}!`)

      // Redirect to intended page or home
      const redirect = router.currentRoute.value.query.redirect as string
      router.push(redirect || '/')

      return response
    } catch (error: any) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors
        const firstError = Object.values(errors)[0] as string[]
        toast.error(firstError[0])
      } else if (error.response?.status === 401) {
        toast.error('Invalid email or password')
      } else if (error.message && error.message.includes('Invalid response structure')) {
        // Already showed toast above
      } else {
        toast.error('Login failed. Please try again.')
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  async function register(userData: RegisterData) {
    try {
      loading.value = true
      const response = await authApi.register(userData)

      token.value = response.token
      user.value = response.user

      // Persist to localStorage
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      toast.success(`Welcome, ${response.user.name}! Your account has been created.`)
      router.push('/')

      return response
    } catch (error: any) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors
        const firstError = Object.values(errors)[0] as string[]
        toast.error(firstError[0])
      } else {
        toast.error('Registration failed. Please try again.')
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      loading.value = true
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear state regardless of API result
      token.value = null
      user.value = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      loading.value = false

      toast.info('You have been logged out')
      router.push('/login')
    }
  }

  async function fetchUser() {
    try {
      loading.value = true
      const userData = await authApi.getMe()
      user.value = userData
      localStorage.setItem('user', JSON.stringify(userData))
      return userData
    } catch (error) {
      // Token is invalid, clear auth
      token.value = null
      user.value = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(profileData: any) {
    try {
      loading.value = true
      const userData = await authApi.updateProfile(profileData)
      user.value = userData
      localStorage.setItem('user', JSON.stringify(userData))
      toast.success('Profile updated successfully')
      return userData
    } catch (error: any) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors
        const firstError = Object.values(errors)[0] as string[]
        toast.error(firstError[0])
      } else {
        toast.error('Failed to update profile')
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  function initializeAuth() {
    if (initialized.value) return

    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      token.value = storedToken
      try {
        user.value = JSON.parse(storedUser)
        // Optionally fetch fresh user data
        fetchUser().catch(() => {
          // If fetching fails, the token might be invalid
          console.warn('Failed to fetch user data, token might be invalid')
        })
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('auth_token')
      }
    }

    initialized.value = true
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    isCustomer,
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
    initializeAuth
  }
})
