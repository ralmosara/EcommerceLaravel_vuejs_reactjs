<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Exceptions\PaymentFailedException;
use App\Models\Order;
use App\Models\Payment;
use Stripe\Exception\ApiErrorException;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class PaymentService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Create Stripe PaymentIntent for order
     */
    public function createPaymentIntent(Order $order): array
    {
        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => (int) ($order->total * 100), // Convert to cents
                'currency' => 'usd',
                'metadata' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'user_id' => $order->user_id,
                ],
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);

            // Create payment record
            $payment = Payment::create([
                'order_id' => $order->id,
                'stripe_payment_intent_id' => $paymentIntent->id,
                'amount' => $order->total,
                'currency' => 'USD',
                'status' => PaymentStatus::PENDING,
            ]);

            return [
                'client_secret' => $paymentIntent->client_secret,
                'payment_intent_id' => $paymentIntent->id,
                'payment' => $payment,
            ];
        } catch (ApiErrorException $e) {
            throw new PaymentFailedException('Failed to create payment intent: ' . $e->getMessage());
        }
    }

    /**
     * Handle successful payment
     */
    public function handlePaymentSucceeded(string $paymentIntentId, array $paymentIntentData): void
    {
        $payment = Payment::where('stripe_payment_intent_id', $paymentIntentId)->first();

        if (!$payment) {
            \Log::warning("Payment not found for PaymentIntent: {$paymentIntentId}");
            return;
        }

        $payment->update([
            'status' => PaymentStatus::SUCCEEDED,
            'payment_method' => $paymentIntentData['payment_method_types'][0] ?? null,
            'card_brand' => $paymentIntentData['charges']['data'][0]['payment_method_details']['card']['brand'] ?? null,
            'card_last4' => $paymentIntentData['charges']['data'][0]['payment_method_details']['card']['last4'] ?? null,
            'paid_at' => now(),
            'metadata' => $paymentIntentData,
        ]);

        // Update order status to processing
        $order = $payment->order;
        if ($order && $order->status === OrderStatus::PENDING) {
            app(OrderService::class)->updateOrderStatus($order, OrderStatus::PROCESSING);
        }
    }

    /**
     * Handle failed payment
     */
    public function handlePaymentFailed(string $paymentIntentId, array $paymentIntentData): void
    {
        $payment = Payment::where('stripe_payment_intent_id', $paymentIntentId)->first();

        if (!$payment) {
            \Log::warning("Payment not found for PaymentIntent: {$paymentIntentId}");
            return;
        }

        $payment->update([
            'status' => PaymentStatus::FAILED,
            'metadata' => $paymentIntentData,
        ]);

        // Optionally cancel the order or notify the user
    }

    /**
     * Handle payment cancellation
     */
    public function handlePaymentCanceled(string $paymentIntentId): void
    {
        $payment = Payment::where('stripe_payment_intent_id', $paymentIntentId)->first();

        if (!$payment) {
            return;
        }

        $payment->update([
            'status' => PaymentStatus::CANCELLED,
        ]);
    }

    /**
     * Refund payment
     */
    public function refundPayment(Payment $payment, ?float $amount = null): bool
    {
        if (!$payment->isSuccessful()) {
            throw new PaymentFailedException('Cannot refund a payment that was not successful.');
        }

        try {
            $refundAmount = $amount ? (int) ($amount * 100) : null;

            \Stripe\Refund::create([
                'payment_intent' => $payment->stripe_payment_intent_id,
                'amount' => $refundAmount,
            ]);

            $payment->update([
                'status' => PaymentStatus::REFUNDED,
            ]);

            // Update order status
            $order = $payment->order;
            if ($order) {
                app(OrderService::class)->updateOrderStatus($order, OrderStatus::REFUNDED);
            }

            return true;
        } catch (ApiErrorException $e) {
            throw new PaymentFailedException('Failed to refund payment: ' . $e->getMessage());
        }
    }

    /**
     * Get payment by order
     */
    public function getPaymentByOrder(Order $order): ?Payment
    {
        return $order->payment;
    }
}
