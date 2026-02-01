import { ref } from 'vue'
import { loadStripe, type Stripe, type StripeElements, type StripeCardElement, type StripeCardNumberElement, type StripeCardExpiryElement, type StripeCardCvcElement } from '@stripe/stripe-js'

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || ''

let stripePromise: Promise<Stripe | null> | null = null

export function useStripe() {
  const stripe = ref<Stripe | null>(null)
  const elements = ref<StripeElements | null>(null)
  const cardElement = ref<StripeCardElement | null>(null)
  const cardNumberElement = ref<StripeCardNumberElement | null>(null)
  const cardExpiryElement = ref<StripeCardExpiryElement | null>(null)
  const cardCvcElement = ref<StripeCardCvcElement | null>(null)
  const postalCodeElement = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const initializeStripe = async () => {
    try {
      loading.value = true
      error.value = null

      if (!stripePromise) {
        stripePromise = loadStripe(STRIPE_PUBLIC_KEY)
      }

      stripe.value = await stripePromise

      if (!stripe.value) {
        throw new Error('Failed to load Stripe')
      }

      return stripe.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to initialize Stripe'
      console.error('Stripe initialization error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const createElements = () => {
    if (!stripe.value) {
      error.value = 'Stripe not initialized'
      return null
    }

    elements.value = stripe.value.elements()
    return elements.value
  }

  const createCardElement = (elementRef: HTMLElement, options?: any) => {
    if (!elements.value) {
      error.value = 'Elements not created'
      return null
    }

    cardElement.value = elements.value.create('card', {
      style: {
        base: {
          color: '#1f2937',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#9ca3af'
          }
        },
        invalid: {
          color: '#dc2626',
          iconColor: '#dc2626'
        }
      },
      hidePostalCode: true,
      ...options
    })

    cardElement.value.mount(elementRef)

    // Listen for card element changes
    cardElement.value.on('change', (event) => {
      if (event.error) {
        error.value = event.error.message
      } else {
        error.value = null
      }
    })

    return cardElement.value
  }

  const createSplitCardElements = (numberRef: HTMLElement, expiryRef: HTMLElement, cvcRef: HTMLElement, postalRef: HTMLElement) => {
    if (!elements.value) {
      error.value = 'Elements not created'
      return null
    }

    const style = {
      base: {
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#6b7280'
        }
      },
      invalid: {
        color: '#f87171',
        iconColor: '#f87171'
      }
    }

    // Create and mount card number element
    cardNumberElement.value = elements.value.create('cardNumber', {
      style,
      showIcon: true
    })
    cardNumberElement.value.mount(numberRef)

    // Create and mount card expiry element
    cardExpiryElement.value = elements.value.create('cardExpiry', { style })
    cardExpiryElement.value.mount(expiryRef)

    // Create and mount card cvc element
    cardCvcElement.value = elements.value.create('cardCvc', { style })
    cardCvcElement.value.mount(cvcRef)

    // Create and mount postal code element
    postalCodeElement.value = elements.value.create('postalCode', { style })
    postalCodeElement.value.mount(postalRef)

    // Listen for errors on all elements
    const handleChange = (event: any) => {
      if (event.error) {
        error.value = event.error.message
      } else {
        error.value = null
      }
    }

    cardNumberElement.value.on('change', handleChange)
    cardExpiryElement.value.on('change', handleChange)
    cardCvcElement.value.on('change', handleChange)
    postalCodeElement.value.on('change', handleChange)

    return { cardNumberElement, cardExpiryElement, cardCvcElement, postalCodeElement }
  }

  const confirmCardPayment = async (clientSecret: string) => {
    const paymentElement = cardElement.value || cardNumberElement.value
    if (!stripe.value || !paymentElement) {
      throw new Error('Stripe or card element not initialized')
    }

    loading.value = true
    error.value = null

    try {
      const { error: stripeError, paymentIntent } = await stripe.value.confirmCardPayment(clientSecret, {
        payment_method: {
          card: paymentElement
        }
      })

      if (stripeError) {
        error.value = stripeError.message || 'Payment failed'
        throw new Error(error.value)
      }

      return paymentIntent
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Payment failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const destroyElements = () => {
    if (cardElement.value) {
      cardElement.value.destroy()
      cardElement.value = null
    }
    if (cardNumberElement.value) {
      cardNumberElement.value.destroy()
      cardNumberElement.value = null
    }
    if (cardExpiryElement.value) {
      cardExpiryElement.value.destroy()
      cardExpiryElement.value = null
    }
    if (cardCvcElement.value) {
      cardCvcElement.value.destroy()
      cardCvcElement.value = null
    }
    if (postalCodeElement.value) {
      postalCodeElement.value.destroy()
      postalCodeElement.value = null
    }
    elements.value = null
  }

  return {
    stripe,
    elements,
    cardElement,
    cardNumberElement,
    cardExpiryElement,
    cardCvcElement,
    postalCodeElement,
    loading,
    error,
    initializeStripe,
    createElements,
    createCardElement,
    createSplitCardElements,
    confirmCardPayment,
    destroyElements
  }
}
