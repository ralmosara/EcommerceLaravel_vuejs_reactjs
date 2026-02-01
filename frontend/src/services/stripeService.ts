import { loadStripe } from '@stripe/stripe-js';
import type { Stripe, StripeCardElement } from '@stripe/stripe-js';
import { STRIPE_PUBLISHABLE_KEY } from '@/utils/constants';

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get Stripe instance
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * Confirm card payment
 */
export const confirmCardPayment = async (
  clientSecret: string,
  cardElement: StripeCardElement,
  billingDetails?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  }
) => {
  const stripe = await getStripe();

  if (!stripe) {
    throw new Error('Stripe failed to load');
  }

  const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: cardElement,
      billing_details: billingDetails,
    },
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.paymentIntent;
};

/**
 * Create payment method
 */
export const createPaymentMethod = async (
  cardElement: StripeCardElement,
  billingDetails?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  }
) => {
  const stripe = await getStripe();

  if (!stripe) {
    throw new Error('Stripe failed to load');
  }

  const result = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
    billing_details: billingDetails,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.paymentMethod;
};
