import axiosInstance, { unwrapResponse } from '../axios.config';
import type { Payment, ApiResponse } from '../types';

export interface CreatePaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
}

export const paymentsApi = {
  /**
   * Create Stripe payment intent for order
   */
  async createIntent(orderUuid: string): Promise<CreatePaymentIntentResponse> {
    const response = await axiosInstance.post<ApiResponse<CreatePaymentIntentResponse>>(
      '/payments/create-intent',
      { order_uuid: orderUuid }
    );
    return unwrapResponse(response);
  },

  /**
   * Get payment status for order
   */
  async getPaymentStatus(orderUuid: string): Promise<Payment> {
    const response = await axiosInstance.get<ApiResponse<Payment>>(`/payments/orders/${orderUuid}`);
    return unwrapResponse(response);
  },
};
