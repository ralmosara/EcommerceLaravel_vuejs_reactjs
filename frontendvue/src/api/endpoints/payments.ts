import apiClient from '../client'
import type { Payment } from '../types/models'

export interface PaymentIntentResponse {
  client_secret: string
  payment_intent_id: string
  payment: Payment
}

export interface CreatePaymentIntentData {
  order_uuid: string
}

export const paymentsApi = {
  async createPaymentIntent(data: CreatePaymentIntentData): Promise<PaymentIntentResponse> {
    const { data: response } = await apiClient.post<{ data: PaymentIntentResponse }>('/payments/create-intent', data)
    return response.data  // Extract nested data property from Laravel response
  },

  async getPaymentStatus(orderUuid: string): Promise<Payment> {
    const { data } = await apiClient.get<{ data: Payment }>(`/payments/orders/${orderUuid}`)
    return data.data  // Extract nested data property from Laravel response
  }
}
