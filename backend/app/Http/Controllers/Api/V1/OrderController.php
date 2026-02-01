<?php

namespace App\Http\Controllers\Api\V1;

use App\Exceptions\CartEmptyException;
use App\Exceptions\InsufficientStockException;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Services\CartService;
use App\Services\OrderService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use ApiResponses;

    public function __construct(
        protected OrderService $orderService,
        protected CartService $cartService
    ) {}

    /**
     * Get user's orders
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = min($request->input('per_page', 15), 100);
        $orders = $this->orderService->getUserOrders($request->user()->id, $perPage);

        return $this->successResponse([
            'data' => OrderResource::collection($orders->items()),
            'current_page' => $orders->currentPage(),
            'from' => $orders->firstItem(),
            'to' => $orders->lastItem(),
            'per_page' => $orders->perPage(),
            'total' => $orders->total(),
            'last_page' => $orders->lastPage(),
        ]);
    }

    /**
     * Get single order
     */
    public function show(Request $request, string $uuid): JsonResponse
    {
        $order = $this->orderService->getOrderByUuid($uuid, $request->user()->id);

        if (!$order) {
            return $this->notFoundResponse('Order not found');
        }

        return $this->successResponse(
            new OrderResource($order)
        );
    }

    /**
     * Create order from cart
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'shipping_address' => ['required', 'array'],
            'shipping_address.full_name' => ['required', 'string'],
            'shipping_address.phone' => ['required', 'string'],
            'shipping_address.address_line1' => ['required', 'string'],
            'shipping_address.address_line2' => ['nullable', 'string'],
            'shipping_address.city' => ['required', 'string'],
            'shipping_address.state' => ['nullable', 'string'],
            'shipping_address.postal_code' => ['required', 'string'],
            'shipping_address.country' => ['required', 'string', 'size:2'],
            'billing_address' => ['nullable', 'array'],
            'shipping_method' => ['nullable', 'string'],
            'customer_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $sessionId = $request->session()->getId();
        $user = $request->user();
        $cart = $this->cartService->getOrCreateCart($user->id, $sessionId);

        try {
            // Calculate shipping and tax
            $shippingAmount = $this->orderService->calculateShipping(
                $cart,
                $validated['shipping_address'],
                $validated['shipping_method'] ?? 'standard'
            );

            $taxAmount = $this->orderService->calculateTax(
                $cart->getSubtotal(),
                $validated['shipping_address']
            );

            $validated['shipping_amount'] = $shippingAmount;
            $validated['tax_amount'] = $taxAmount;

            $order = $this->orderService->createFromCart($cart, $user, $validated);

            return $this->createdResponse(
                new OrderResource($order),
                'Order created successfully'
            );
        } catch (CartEmptyException $e) {
            return $this->errorResponse($e->getMessage(), 422);
        } catch (InsufficientStockException $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * Cancel order
     */
    public function cancel(Request $request, string $uuid): JsonResponse
    {
        $order = $this->orderService->getOrderByUuid($uuid, $request->user()->id);

        if (!$order) {
            return $this->notFoundResponse('Order not found');
        }

        try {
            $cancelledOrder = $this->orderService->cancelOrder($order);

            return $this->successResponse(
                new OrderResource($cancelledOrder),
                'Order cancelled successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }
}
