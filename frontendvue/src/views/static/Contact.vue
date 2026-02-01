<script setup lang="ts">
import { ref } from 'vue'
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

const toast = useToast()
const isSubmitting = ref(false)

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const handleSubmit = async () => {
  if (!form.value.name || !form.value.email || !form.value.subject || !form.value.message) {
    toast.error('Please fill in all fields')
    return
  }

  isSubmitting.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))

  toast.success('Message sent successfully! We\'ll get back to you soon.')
  form.value = { name: '', email: '', subject: '', message: '' }
  isSubmitting.value = false
}

const contactInfo = [
  {
    icon: EnvelopeIcon,
    label: 'Email',
    value: 'support@vinylstore.com',
    href: 'mailto:support@vinylstore.com',
  },
  {
    icon: PhoneIcon,
    label: 'Phone',
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567',
  },
  {
    icon: MapPinIcon,
    label: 'Address',
    value: '123 Music Street, NY 10001',
    href: null,
  },
]
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl md:text-5xl font-display text-white uppercase tracking-wider text-center mb-12">
      Contact <span class="text-gradient-punk">Us</span>
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Contact Form -->
      <div class="lg:col-span-2">
        <form class="bg-punk-gray rounded-lg p-6 space-y-6" @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full bg-punk-black border border-punk-gray rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-punk-orange focus:ring-1 focus:ring-punk-orange"
                placeholder="Your name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full bg-punk-black border border-punk-gray rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-punk-orange focus:ring-1 focus:ring-punk-orange"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Subject</label>
            <input
              v-model="form.subject"
              type="text"
              required
              class="w-full bg-punk-black border border-punk-gray rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-punk-orange focus:ring-1 focus:ring-punk-orange"
              placeholder="How can we help?"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Message</label>
            <textarea
              v-model="form.message"
              rows="5"
              required
              class="w-full bg-punk-black border border-punk-gray rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-punk-orange focus:ring-1 focus:ring-punk-orange resize-none"
              placeholder="Tell us more..."
            />
          </div>

          <button
            type="submit"
            class="btn-punk w-full"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Sending...' : 'Send Message' }}
          </button>
        </form>
      </div>

      <!-- Contact Info -->
      <div class="space-y-6">
        <div
          v-for="info in contactInfo"
          :key="info.label"
          class="bg-punk-gray rounded-lg p-4"
        >
          <div class="flex items-start gap-3">
            <div class="p-2 bg-punk-orange/20 rounded-lg">
              <component :is="info.icon" class="h-5 w-5 text-punk-orange" />
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-400">{{ info.label }}</h3>
              <a
                v-if="info.href"
                :href="info.href"
                class="text-white hover:text-punk-orange transition-colors"
              >
                {{ info.value }}
              </a>
              <p v-else class="text-white">{{ info.value }}</p>
            </div>
          </div>
        </div>

        <!-- Social Links -->
        <div class="bg-punk-gray rounded-lg p-4">
          <h3 class="text-sm font-medium text-gray-400 mb-3">Follow Us</h3>
          <div class="flex gap-3">
            <a href="#" class="p-2 bg-punk-black rounded-lg text-gray-400 hover:text-white hover:bg-punk-orange transition-colors">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                <circle cx="12" cy="12" r="3.5" />
              </svg>
            </a>
            <a href="#" class="p-2 bg-punk-black rounded-lg text-gray-400 hover:text-white hover:bg-punk-orange transition-colors">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" class="p-2 bg-punk-black rounded-lg text-gray-400 hover:text-white hover:bg-punk-orange transition-colors">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
