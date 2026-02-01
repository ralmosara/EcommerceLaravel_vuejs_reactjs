<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService
    ) {}

    /**
     * Handle Stripe webhook events
     */
    public function handle(Request $request): Response
    {
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature');
        $webhookSecret = config('services.stripe.webhook_secret');

        try {
            // Verify webhook signature
            $event = Webhook::constructEvent(
                $payload,
                $signature,
                $webhookSecret
            );
        } catch (\UnexpectedValueException $e) {
            \Log::error('Stripe webhook invalid payload: ' . $e->getMessage());
            return response('Invalid payload', 400);
        } catch (SignatureVerificationException $e) {
            \Log::error('Stripe webhook signature verification failed: ' . $e->getMessage());
            return response('Invalid signature', 400);
        }

        // Handle the event
        try {
            switch ($event->type) {
                case 'payment_intent.succeeded':
                    $this->handlePaymentIntentSucceeded($event->data->object);
                    break;

                case 'payment_intent.payment_failed':
                    $this->handlePaymentIntentFailed($event->data->object);
                    break;

                case 'payment_intent.canceled':
                    $this->handlePaymentIntentCanceled($event->data->object);
                    break;

                case 'charge.refunded':
                    $this->handleChargeRefunded($event->data->object);
                    break;

                default:
                    \Log::info("Unhandled Stripe webhook event type: {$event->type}");
            }
        } catch (\Exception $e) {
            \Log::error('Error processing Stripe webhook: ' . $e->getMessage());
            return response('Webhook handler failed', 500);
        }

        return response('Webhook handled', 200);
    }

    /**
     * Handle payment intent succeeded event
     */
    protected function handlePaymentIntentSucceeded($paymentIntent): void
    {
        $this->paymentService->handlePaymentSucceeded(
            $paymentIntent->id,
            $paymentIntent->toArray()
        );

        \Log::info("Payment succeeded for PaymentIntent: {$paymentIntent->id}");
    }

    /**
     * Handle payment intent failed event
     */
    protected function handlePaymentIntentFailed($paymentIntent): void
    {
        $this->paymentService->handlePaymentFailed(
            $paymentIntent->id,
            $paymentIntent->toArray()
        );

        \Log::warning("Payment failed for PaymentIntent: {$paymentIntent->id}");
    }

    /**
     * Handle payment intent canceled event
     */
    protected function handlePaymentIntentCanceled($paymentIntent): void
    {
        $this->paymentService->handlePaymentCanceled($paymentIntent->id);

        \Log::info("Payment canceled for PaymentIntent: {$paymentIntent->id}");
    }

    /**
     * Handle charge refunded event
     */
    protected function handleChargeRefunded($charge): void
    {
        \Log::info("Charge refunded: {$charge->id}");
        // Additional refund handling logic if needed
    }
}
