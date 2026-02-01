<template>
  <div class="min-h-screen flex items-center justify-center bg-punk-dark py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <RouterLink to="/" class="inline-flex items-center gap-2 mb-6">
          <div class="w-10 h-10 rounded-full bg-punk-orange flex items-center justify-center">
            <div class="w-4 h-4 rounded-full bg-punk-black" />
          </div>
          <span class="text-2xl font-display font-bold text-white">VINYL</span>
        </RouterLink>
        <h2 class="text-3xl font-display font-bold text-white uppercase tracking-wider">
          Create Account
        </h2>
        <p class="mt-2 text-gray-400">
          Already have an account?
          <RouterLink to="/login" class="text-punk-orange hover:text-punk-coral transition-colors font-medium">
            Sign in
          </RouterLink>
        </p>
      </div>

      <!-- Form Card -->
      <div class="bg-punk-gray rounded-lg p-8 border border-gray-700">
        <form class="space-y-5" @submit.prevent="handleRegister">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              autocomplete="name"
              class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-punk-orange focus:ring-1 focus:ring-punk-orange transition-colors"
              placeholder="John Doe"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-punk-orange focus:ring-1 focus:ring-punk-orange transition-colors"
              placeholder="john@example.com"
            />
          </div>

          <!-- Phone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-300 mb-2">
              Phone <span class="text-gray-500">(Optional)</span>
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              autocomplete="tel"
              class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-punk-orange focus:ring-1 focus:ring-punk-orange transition-colors"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              autocomplete="new-password"
              class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-punk-orange focus:ring-1 focus:ring-punk-orange transition-colors"
              placeholder="At least 8 characters"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              required
              autocomplete="new-password"
              class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-punk-orange focus:ring-1 focus:ring-punk-orange transition-colors"
              placeholder="Repeat your password"
            />
          </div>

          <!-- Terms -->
          <div class="flex items-start">
            <input
              id="terms"
              v-model="form.terms"
              type="checkbox"
              required
              class="mt-1 w-4 h-4 rounded border-gray-700 bg-punk-black text-punk-orange focus:ring-punk-orange focus:ring-offset-punk-gray"
            />
            <label for="terms" class="ml-2 text-sm text-gray-400">
              I agree to the
              <RouterLink to="/terms" class="text-punk-orange hover:text-punk-coral transition-colors">
                Terms of Service
              </RouterLink>
              and
              <RouterLink to="/privacy" class="text-punk-orange hover:text-punk-coral transition-colors">
                Privacy Policy
              </RouterLink>
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full btn-punk py-3 text-base"
            :class="{ 'opacity-50 cursor-not-allowed': authStore.loading }"
          >
            <span v-if="!authStore.loading">Create Account</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-punk-gray text-gray-500">Or sign up with</span>
          </div>
        </div>

        <!-- Social Login -->
        <div class="grid grid-cols-2 gap-4">
          <button
            type="button"
            class="flex items-center justify-center px-4 py-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-punk-black transition-colors"
          >
            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            class="flex items-center justify-center px-4 py-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-punk-black transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  terms: false
})

const handleRegister = async () => {
  await authStore.register(form)
}
</script>
