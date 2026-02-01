<?php

namespace App\Services;

use App\Exceptions\InsufficientStockException;
use App\Exceptions\InvalidCouponException;
use App\Models\Album;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;

class CartService
{
    /**
     * Get or create cart for user or session
     */
    public function getOrCreateCart(?int $userId, ?string $sessionId = null): Cart
    {
        $userCart = null;
        $sessionCart = null;

        // If user is logged in, find their user cart
        if ($userId) {
            $userCart = Cart::where('user_id', $userId)
                ->with(['items.album.inventory', 'items.album.artist', 'coupon'])
                ->first();
        }

        // If we have a session, also look for session cart
        if ($sessionId) {
            $sessionCart = Cart::where('session_id', $sessionId)
                ->whereNull('user_id')
                ->with(['items.album.inventory', 'items.album.artist', 'coupon'])
                ->first();
        }

        // If both carts exist and session cart has items, merge them
        if ($userCart && $sessionCart && $sessionCart->items->isNotEmpty()) {
            foreach ($sessionCart->items as $sessionItem) {
                $existingItem = $userCart->items()
                    ->where('album_id', $sessionItem->album_id)
                    ->first();

                if ($existingItem) {
                    $existingItem->update([
                        'quantity' => $existingItem->quantity + $sessionItem->quantity
                    ]);
                } else {
                    $userCart->items()->create([
                        'album_id' => $sessionItem->album_id,
                        'quantity' => $sessionItem->quantity,
                        'unit_price' => $sessionItem->unit_price,
                    ]);
                }
            }
            // Delete the session cart after merging
            $sessionCart->delete();
            $userCart->refresh();
            $userCart->load(['items.album.inventory', 'items.album.artist', 'coupon']);
            return $userCart;
        }

        // If only session cart exists and user is logged in, assign it to user
        if (!$userCart && $sessionCart && $userId) {
            $sessionCart->update(['user_id' => $userId]);
            return $sessionCart;
        }

        // Return user cart if it exists
        if ($userCart) {
            return $userCart;
        }

        // Return session cart if it exists
        if ($sessionCart) {
            return $sessionCart;
        }

        // Create a new cart
        $cart = Cart::create([
            'user_id' => $userId,
            'session_id' => $sessionId,
            'expires_at' => now()->addDays(7),
        ]);
        $cart->load(['items.album.inventory', 'items.album.artist', 'coupon']);

        return $cart;
    }

    /**
     * Add item to cart
     */
    public function addItem(Cart $cart, int $albumId, int $quantity = 1): CartItem
    {
        $album = Album::with('inventory')->findOrFail($albumId);

        if (!$album->inventory || !$album->inventory->hasAvailableQuantity($quantity)) {
            throw new InsufficientStockException('Insufficient stock for this album.');
        }

        $existingItem = $cart->items()->where('album_id', $albumId)->first();

        if ($existingItem) {
            $newQuantity = $existingItem->quantity + $quantity;

            if (!$album->inventory->hasAvailableQuantity($newQuantity)) {
                throw new InsufficientStockException('Insufficient stock for requested quantity.');
            }

            $existingItem->update(['quantity' => $newQuantity]);
            return $existingItem->fresh('album.inventory');
        }

        $cartItem = $cart->items()->create([
            'album_id' => $albumId,
            'quantity' => $quantity,
            'unit_price' => $album->getEffectivePrice(),
        ]);

        return $cartItem->load('album.inventory');
    }

    /**
     * Update item quantity
     */
    public function updateItemQuantity(Cart $cart, int $albumId, int $quantity): ?CartItem
    {
        if ($quantity <= 0) {
            return $this->removeItem($cart, $albumId);
        }

        $cartItem = $cart->items()->where('album_id', $albumId)->firstOrFail();
        $album = Album::with('inventory')->findOrFail($albumId);

        if (!$album->inventory || !$album->inventory->hasAvailableQuantity($quantity)) {
            throw new InsufficientStockException('Insufficient stock for requested quantity.');
        }

        $cartItem->update(['quantity' => $quantity]);
        return $cartItem->fresh('album.inventory');
    }

    /**
     * Remove item from cart
     */
    public function removeItem(Cart $cart, int $albumId): ?CartItem
    {
        $cartItem = $cart->items()->where('album_id', $albumId)->first();

        if ($cartItem) {
            $cartItem->delete();
        }

        return null;
    }

    /**
     * Clear cart
     */
    public function clearCart(Cart $cart): void
    {
        $cart->items()->delete();
        $cart->update(['coupon_id' => null]);
    }

    /**
     * Apply coupon to cart
     */
    public function applyCoupon(Cart $cart, string $couponCode): Coupon
    {
        $coupon = Coupon::where('code', $couponCode)->first();

        if (!$coupon) {
            throw new InvalidCouponException('Invalid coupon code.');
        }

        $subtotal = $cart->getSubtotal();

        if (!$coupon->canApplyTo($subtotal)) {
            if (!$coupon->isValid()) {
                throw new InvalidCouponException('This coupon has expired or is no longer valid.');
            }

            if ($coupon->min_order_amount && $subtotal < $coupon->min_order_amount) {
                throw new InvalidCouponException(
                    "Minimum order amount of {$coupon->min_order_amount} required for this coupon."
                );
            }

            throw new InvalidCouponException('This coupon cannot be applied to your cart.');
        }

        $cart->update(['coupon_id' => $coupon->id]);
        return $coupon;
    }

    /**
     * Remove coupon from cart
     */
    public function removeCoupon(Cart $cart): void
    {
        $cart->update(['coupon_id' => null]);
    }

    /**
     * Migrate guest cart to user account
     */
    public function migrateGuestCart(?string $sessionId, int $userId): void
    {
        if (!$sessionId) {
            return;
        }

        // Find guest cart by session
        $guestCart = Cart::where('session_id', $sessionId)
            ->whereNull('user_id')
            ->first();

        if (!$guestCart) {
            return;
        }

        // Check if user already has a cart
        $userCart = Cart::where('user_id', $userId)->first();

        if ($userCart) {
            // Merge guest cart items into user cart
            foreach ($guestCart->items as $guestItem) {
                $existingItem = $userCart->items()
                    ->where('album_id', $guestItem->album_id)
                    ->first();

                if ($existingItem) {
                    // Update quantity if item exists
                    $existingItem->update([
                        'quantity' => $existingItem->quantity + $guestItem->quantity
                    ]);
                } else {
                    // Move item to user cart
                    $guestItem->update(['cart_id' => $userCart->id]);
                }
            }

            // Delete the guest cart
            $guestCart->delete();
        } else {
            // Assign guest cart to user
            $guestCart->update(['user_id' => $userId]);
        }
    }

    /**
     * Sync cart prices with current album prices
     */
    public function syncPrices(Cart $cart): void
    {
        foreach ($cart->items as $item) {
            $album = $item->album;
            $currentPrice = $album->getEffectivePrice();

            if ($item->unit_price != $currentPrice) {
                $item->update(['unit_price' => $currentPrice]);
            }
        }
    }

    /**
     * Validate cart items have sufficient stock
     */
    public function validateStock(Cart $cart): bool
    {
        foreach ($cart->items as $item) {
            $inventory = $item->album->inventory;

            if (!$inventory || !$inventory->hasAvailableQuantity($item->quantity)) {
                return false;
            }
        }

        return true;
    }
}
