<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Exceptions\CartEmptyException;
use App\Exceptions\InsufficientStockException;
use App\Models\Cart;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function __construct(
        protected CartService $cartService
    ) {}

    /**
     * Create order from cart
     */
    public function createFromCart(Cart $cart, User $user, array $data): Order
    {
        if ($cart->isEmpty()) {
            throw new CartEmptyException('Cannot create order from empty cart.');
        }

        // Validate stock availability
        if (!$this->cartService->validateStock($cart)) {
            throw new InsufficientStockException('One or more items in your cart are no longer available.');
        }

        // Sync prices to ensure they're current
        $this->cartService->syncPrices($cart);
        $cart->refresh();

        return DB::transaction(function () use ($cart, $user, $data) {
            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'status' => OrderStatus::PENDING,
                'subtotal' => $cart->getSubtotal(),
                'discount_amount' => $cart->getDiscountAmount(),
                'shipping_amount' => $data['shipping_amount'] ?? 0,
                'tax_amount' => $data['tax_amount'] ?? 0,
                'total' => $cart->getTotal() + ($data['shipping_amount'] ?? 0) + ($data['tax_amount'] ?? 0),
                'shipping_address' => $data['shipping_address'],
                'billing_address' => $data['billing_address'] ?? $data['shipping_address'],
                'shipping_method' => $data['shipping_method'] ?? null,
                'coupon_code' => $cart->coupon?->code,
                'coupon_discount' => $cart->getDiscountAmount(),
                'customer_notes' => $data['customer_notes'] ?? null,
            ]);

            // Create order items from cart items
            foreach ($cart->items as $cartItem) {
                $album = $cartItem->album;

                $order->items()->create([
                    'album_id' => $album->id,
                    'album_title' => $album->title,
                    'artist_name' => $album->artist->name,
                    'format' => $album->format->value,
                    'cover_image' => $album->cover_image,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $cartItem->unit_price,
                    'line_total' => $cartItem->getLineTotal(),
                ]);

                // Reserve inventory
                $inventory = $album->inventory;
                if ($inventory) {
                    $inventory->reserve($cartItem->quantity);
                }
            }

            // Increment coupon usage if applicable
            if ($cart->coupon) {
                $cart->coupon->incrementUsage();
            }

            // Clear the cart
            $this->cartService->clearCart($cart);

            return $order->load(['items', 'payment']);
        });
    }

    /**
     * Get user's orders
     */
    public function getUserOrders(int $userId, int $perPage = 15)
    {
        return Order::where('user_id', $userId)
            ->with(['items.album', 'payment'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get order by UUID
     */
    public function getOrderByUuid(string $uuid, ?int $userId = null)
    {
        $query = Order::where('uuid', $uuid)
            ->with(['items.album', 'payment', 'user']);

        if ($userId) {
            $query->where('user_id', $userId);
        }

        return $query->first();
    }

    /**
     * Cancel order
     */
    public function cancelOrder(Order $order): Order
    {
        if (!$order->canBeCancelled()) {
            throw new \Exception('This order cannot be cancelled.');
        }

        DB::transaction(function () use ($order) {
            // Release reserved inventory
            foreach ($order->items as $item) {
                $inventory = $item->album->inventory;
                if ($inventory) {
                    $inventory->release($item->quantity);
                }
            }

            // Update order status
            $order->update(['status' => OrderStatus::CANCELLED]);
        });

        return $order->fresh();
    }

    /**
     * Update order status
     */
    public function updateOrderStatus(Order $order, OrderStatus $status): Order
    {
        $order->update(['status' => $status]);

        // If shipped, set shipped_at timestamp
        if ($status === OrderStatus::SHIPPED && !$order->shipped_at) {
            $order->update(['shipped_at' => now()]);
        }

        // If delivered, set delivered_at timestamp
        if ($status === OrderStatus::DELIVERED && !$order->delivered_at) {
            $order->update(['delivered_at' => now()]);
        }

        // If processing (payment confirmed), deduct inventory
        if ($status === OrderStatus::PROCESSING) {
            foreach ($order->items as $item) {
                $inventory = $item->album->inventory;
                if ($inventory) {
                    $inventory->deduct($item->quantity);
                }
            }
        }

        return $order->fresh();
    }

    /**
     * Add tracking number to order
     */
    public function addTrackingNumber(Order $order, string $trackingNumber): Order
    {
        $order->update(['tracking_number' => $trackingNumber]);
        return $order->fresh();
    }

    /**
     * Calculate tax (simple placeholder - would be replaced with actual tax service)
     */
    public function calculateTax(float $subtotal, array $address): float
    {
        // Placeholder: 10% tax rate
        // In production, this would integrate with a tax calculation service
        return round($subtotal * 0.10, 2);
    }

    /**
     * Calculate shipping cost (simple placeholder)
     */
    public function calculateShipping(Cart $cart, array $address, ?string $method = 'standard'): float
    {
        // Placeholder logic
        $baseRate = match ($method) {
            'express' => 15.00,
            'priority' => 10.00,
            default => 5.00,
        };

        $itemCount = $cart->getTotalItems();
        $perItemRate = 2.00;

        return round($baseRate + ($perItemRate * max(0, $itemCount - 1)), 2);
    }
}
