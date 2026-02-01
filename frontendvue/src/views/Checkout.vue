<template>
  <div class="min-h-screen bg-punk-dark">
    <div class="mx-auto max-w-7xl px-4 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-display font-bold text-white uppercase tracking-wider">Checkout</h1>
        <p class="mt-2 text-sm text-gray-400">Complete your purchase</p>
      </div>

      <!-- Redirect if cart is empty -->
      <div v-if="isEmpty" class="text-center py-20">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-punk-gray flex items-center justify-center">
          <ShoppingBagIcon class="h-12 w-12 text-gray-500" />
        </div>
        <h3 class="text-xl font-display font-bold text-white uppercase tracking-wider">Your cart is empty</h3>
        <p class="mt-2 text-gray-400">Add some albums before checkout</p>
        <RouterLink
          to="/albums"
          class="mt-6 inline-block btn-punk py-3 px-6"
        >
          Browse Albums
        </RouterLink>
      </div>

      <!-- Checkout Form -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Forms -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Step Indicator -->
          <div class="flex items-center justify-center gap-4 mb-8">
            <div
              :class="[
                'flex items-center gap-2',
                currentStep >= 1 ? 'text-punk-orange' : 'text-gray-500'
              ]"
            >
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors',
                  currentStep >= 1 ? 'bg-punk-orange border-punk-orange text-white' : 'bg-punk-gray border-gray-700 text-gray-400'
                ]"
              >
                <CheckIcon v-if="currentStep > 1" class="h-5 w-5" />
                <span v-else>1</span>
              </div>
              <span class="text-sm font-medium uppercase tracking-wider">Shipping</span>
            </div>
            <div class="h-px w-16 bg-gray-700"></div>
            <div
              :class="[
                'flex items-center gap-2',
                currentStep >= 2 ? 'text-punk-orange' : 'text-gray-500'
              ]"
            >
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors',
                  currentStep >= 2 ? 'bg-punk-orange border-punk-orange text-white' : 'bg-punk-gray border-gray-700 text-gray-400'
                ]"
              >
                2
              </div>
              <span class="text-sm font-medium uppercase tracking-wider">Payment</span>
            </div>
          </div>

          <!-- Step 1: Shipping Address -->
          <div v-if="currentStep === 1" class="bg-punk-gray rounded-lg border border-gray-700 p-6">
            <AddressForm
              v-model="shippingAddress"
              title="Shipping Address"
            />

            <!-- Customer Notes -->
            <div class="mt-6">
              <label for="customerNotes" class="block text-sm font-medium text-gray-300 mb-2">
                Order Notes (Optional)
              </label>
              <textarea
                id="customerNotes"
                v-model="customerNotes"
                rows="3"
                class="w-full px-4 py-3 bg-punk-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-punk-orange focus:border-punk-orange transition-colors"
                placeholder="Any special instructions for your order?"
              ></textarea>
            </div>

            <!-- Next Button -->
            <button
              @click="handleContinueToPayment"
              :disabled="!isShippingValid || loading"
              class="mt-6 w-full btn-punk py-4 text-lg"
              :class="{ 'opacity-50 cursor-not-allowed': !isShippingValid || loading }"
            >
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Processing...
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                Continue to Payment
                <ArrowRightIcon class="h-5 w-5" />
              </span>
            </button>
          </div>

          <!-- Step 2: Payment -->
          <div v-if="currentStep === 2" class="bg-punk-gray rounded-lg border border-gray-700 p-6">
            <!-- Show Shipping Address (Read-only) -->
            <div class="mb-6 pb-6 border-b border-gray-700">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-white uppercase tracking-wider">Shipping Address</h3>
                <button
                  @click="currentStep = 1"
                  class="text-sm text-punk-orange hover:text-punk-coral transition-colors"
                >
                  Edit
                </button>
              </div>
              <div class="text-gray-400 space-y-1">
                <p>{{ shippingAddress.full_name }}</p>
                <p>{{ shippingAddress.address_line1 }}</p>
                <p v-if="shippingAddress.address_line2">{{ shippingAddress.address_line2 }}</p>
                <p>{{ shippingAddress.city }}, {{ shippingAddress.state }} {{ shippingAddress.postal_code }}</p>
                <p>{{ shippingAddress.country }}</p>
              </div>
            </div>

            <!-- Payment Form -->
            <PaymentForm
              ref="paymentFormRef"
              :client-secret="clientSecret"
              @ready="handlePaymentReady"
              @error="handlePaymentError"
            />

            <!-- Action Buttons -->
            <div class="flex gap-4 mt-6">
              <button
                @click="currentStep = 1"
                :disabled="loading"
                class="flex-1 btn-punk-outline py-3 flex items-center justify-center gap-2"
              >
                <ArrowLeftIcon class="h-5 w-5" />
                Back
              </button>
              <button
                @click="handlePlaceOrder"
                :disabled="!paymentReady || loading"
                class="flex-1 btn-punk py-3"
                :class="{ 'opacity-50 cursor-not-allowed': !paymentReady || loading }"
              >
                <span v-if="loading" class="flex items-center justify-center gap-2">
                  <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Processing...
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  <LockClosedIcon class="h-5 w-5" />
                  Place Order
                </span>
              </button>
            </div>
          </div>

          <!-- Security Notice -->
          <div class="flex items-center gap-3 text-gray-500 text-sm">
            <ShieldCheckIcon class="h-5 w-5 text-green-500" />
            <span>Your payment information is encrypted and secure</span>
          </div>
        </div>

        <!-- Right Column - Order Summary -->
        <div class="lg:col-span-1">
          <div class="sticky top-20">
            <OrderSummary :shipping="shippingAmount" :tax="taxAmount" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import {
  ShoppingBagIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  LockClosedIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'
import { useCart } from '@/composables/useCart'
import { ordersApi, type ShippingAddress } from '@/api/endpoints/orders'
import { paymentsApi } from '@/api/endpoints/payments'
import AddressForm from '@/components/checkout/AddressForm.vue'
import PaymentForm from '@/components/checkout/PaymentForm.vue'
import OrderSummary from '@/components/checkout/OrderSummary.vue'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const { isEmpty, clearCart } = useCart()

const currentStep = ref(1)
const loading = ref(false)
const paymentReady = ref(false)
const paymentFormRef = ref()

// Form data
const shippingAddress = ref<ShippingAddress>({
  full_name: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'US'
})

const customerNotes = ref('')
const shippingAmount = ref<number | null>(null)
const taxAmount = ref<number | null>(null)
const createdOrderUuid = ref<string | null>(null)
const clientSecret = ref<string | undefined>(undefined)

const isShippingValid = computed(() => {
  return (
    shippingAddress.value.full_name.trim() !== '' &&
    shippingAddress.value.phone.trim() !== '' &&
    shippingAddress.value.address_line1.trim() !== '' &&
    shippingAddress.value.city.trim() !== '' &&
    shippingAddress.value.postal_code.trim() !== '' &&
    shippingAddress.value.country.trim() !== ''
  )
})

const handleContinueToPayment = async () => {
  if (!isShippingValid.value) {
    toast.error('Please fill in all required fields')
    return
  }

  try {
    loading.value = true

    // Create order on backend
    const order = await ordersApi.createOrder({
      shipping_address: shippingAddress.value,
      customer_notes: customerNotes.value || undefined
    })

    createdOrderUuid.value = order.uuid
    shippingAmount.value = order.shipping_amount
    taxAmount.value = order.tax_amount

    // Create payment intent
    const paymentIntent = await paymentsApi.createPaymentIntent({
      order_uuid: order.uuid
    })

    clientSecret.value = paymentIntent.client_secret

    // Move to payment step
    currentStep.value = 2
    toast.success('Order created! Please complete payment.')
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to create order'
    toast.error(errorMessage)
    console.error('Order creation error:', error)
  } finally {
    loading.value = false
  }
}

const handlePaymentReady = () => {
  paymentReady.value = true
}

const handlePaymentError = (error: string) => {
  toast.error(error)
}

const handlePlaceOrder = async () => {
  if (!clientSecret.value || !createdOrderUuid.value) {
    toast.error('Payment not initialized')
    return
  }

  if (!paymentFormRef.value) {
    toast.error('Payment form not ready')
    return
  }

  try {
    loading.value = true

    // Confirm payment with Stripe via PaymentForm component
    const paymentIntent = await paymentFormRef.value.confirmCardPayment(clientSecret.value)

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Clear cart
      await clearCart()

      // Redirect to success page
      toast.success('Payment successful!')
      router.push({ path: '/payment-success', query: { order: createdOrderUuid.value } })
    }
  } catch (error: any) {
    toast.error(error.message || 'Payment failed. Please try again.')
    console.error('Payment error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Redirect if cart is empty
  if (isEmpty.value) {
    toast.warning('Your cart is empty')
  }
})
</script>
