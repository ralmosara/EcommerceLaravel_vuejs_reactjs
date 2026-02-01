<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-white">{{ title }}</h3>

    <!-- Full Name -->
    <div>
      <label for="fullName" class="block text-sm font-medium text-gray-300 mb-1">
        Full Name *
      </label>
      <input
        id="fullName"
        v-model="localAddress.full_name"
        @blur="emitUpdate"
        type="text"
        required
        class="w-full px-3 py-2 bg-punk-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-punk-orange focus:border-punk-orange"
        placeholder="John Doe"
      />
    </div>

    <!-- Phone -->
    <div>
      <label for="phone" class="block text-sm font-medium text-gray-300 mb-1">
        Phone *
      </label>
      <input
        id="phone"
        v-model="localAddress.phone"
        @blur="emitUpdate"
        type="tel"
        required
        class="w-full px-3 py-2 bg-punk-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-punk-orange focus:border-punk-orange"
        placeholder="+1 (555) 123-4567"
      />
    </div>

    <!-- Address Line 1 -->
    <div>
      <label for="addressLine1" class="block text-sm font-medium text-gray-300 mb-1">
        Address Line 1 *
      </label>
      <input
        id="addressLine1"
        v-model="localAddress.address_line1"
        @blur="emitUpdate"
        type="text"
        required
        class="w-full px-3 py-2 bg-punk-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-punk-orange focus:border-punk-orange"
        placeholder="123 Main Street"
      />
    </div>

    <!-- Address Line 2 -->
    <div>
      <label for="addressLine2" class="block text-sm font-medium text-gray-300 mb-1">
        Address Line 2
      </label>
      <input
        id="addressLine2"
        v-model="localAddress.address_line2"
        @blur="emitUpdate"
        type="text"
        class="w-full px-3 py-2 bg-punk-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-punk-orange focus:border-punk-orange"
        placeholder="Apt 4B"
      />
    </div>

    <!-- City, State, Postal Code Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label for="city" class="block text-sm font-medium text-gray-300 mb-1">
          City *
        </label>
        <input
          id="city"
          v-model="localAddress.city"
          @blur="emitUpdate"
          type="text"
          required
          class="w-full px-3 py-2 bg-punk-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-punk-orange focus:border-punk-orange"
          placeholder="New York"
        />
      </div>

      <div>
        <label for="state" class="block text-sm font-medium text-gray-300 mb-1">
          State/Province
        </label>
        <input
          id="state"
          v-model="localAddress.state"
          @blur="emitUpdate"
          type="text"
          class="w-full px-3 py-2 bg-punk-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-punk-orange focus:border-punk-orange"
          placeholder="NY"
        />
      </div>

      <div>
        <label for="postalCode" class="block text-sm font-medium text-gray-300 mb-1">
          Postal Code *
        </label>
        <input
          id="postalCode"
          v-model="localAddress.postal_code"
          @blur="emitUpdate"
          type="text"
          required
          class="w-full px-3 py-2 bg-punk-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-punk-orange focus:border-punk-orange"
          placeholder="10001"
        />
      </div>
    </div>

    <!-- Country -->
    <div>
      <label for="country" class="block text-sm font-medium text-gray-300 mb-1">
        Country *
      </label>
      <select
        id="country"
        v-model="localAddress.country"
        @change="emitUpdate"
        required
        class="w-full px-3 py-2 bg-punk-black border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-punk-orange focus:border-punk-orange"
      >
        <option value="">Select a country</option>
        <option value="US">United States</option>
        <option value="CA">Canada</option>
        <option value="GB">United Kingdom</option>
        <option value="AU">Australia</option>
        <option value="NZ">New Zealand</option>
        <option value="DE">Germany</option>
        <option value="FR">France</option>
        <option value="ES">Spain</option>
        <option value="IT">Italy</option>
        <option value="JP">Japan</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ShippingAddress } from '@/api/endpoints/orders'

interface Props {
  modelValue: ShippingAddress
  title: string
}

interface Emits {
  'update:modelValue': [value: ShippingAddress]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localAddress = ref<ShippingAddress>({ ...props.modelValue })

watch(() => props.modelValue, (newVal) => {
  localAddress.value = { ...newVal }
}, { deep: true })

const emitUpdate = () => {
  emit('update:modelValue', { ...localAddress.value })
}
</script>
