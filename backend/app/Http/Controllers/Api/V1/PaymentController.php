<?php

namespace App\Http\Controllers\Api\V1;

use App\Exceptions\PaymentFailedException;
use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Services\OrderService;
use App\Services\PaymentService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    use ApiResponses;

    public function __construct(
        protected PaymentService $paymentService,
        protected OrderService $orderService
    ) {}

    /**
     * Create payment intent for order
     */
    public function createIntent(Request $request): JsonResponse
    {
        $request->validate([
            'order_uuid' => ['required', 'string', 'exists:orders,uuid'],
        ]);

        $order = $this->orderService->getOrderByUuid(
            $request->input('order_uuid'),
            $request->user()->id
        );

        if (!$order) {
            return $this->notFoundResponse('Order not found');
        }

        // Check if order already has a payment
        if ($order->payment && $order->payment->isSuccessful()) {
            return $this->errorResponse('Order has already been paid', 422);
        }

        try {
            $paymentData = $this->paymentService->createPaymentIntent($order);

            return $this->successResponse([
                'client_secret' => $paymentData['client_secret'],
                'payment_intent_id' => $paymentData['payment_intent_id'],
                'payment' => new PaymentResource($paymentData['payment']),
            ], 'Payment intent created successfully');
        } catch (PaymentFailedException $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Get payment status
     */
    public function show(Request $request, string $orderUuid): JsonResponse
    {
        $order = $this->orderService->getOrderByUuid($orderUuid, $request->user()->id);

        if (!$order) {
            return $this->notFoundResponse('Order not found');
        }

        $payment = $this->paymentService->getPaymentByOrder($order);

        if (!$payment) {
            return $this->notFoundResponse('Payment not found');
        }

        return $this->successResponse(
            new PaymentResource($payment)
        );
    }
}
