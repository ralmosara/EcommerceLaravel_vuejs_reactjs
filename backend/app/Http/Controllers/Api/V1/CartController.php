<?php

namespace App\Http\Controllers\Api\V1;

use App\Exceptions\InsufficientStockException;
use App\Exceptions\InvalidCouponException;
use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Models\Album;
use App\Services\CartService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    use ApiResponses;

    public function __construct(
        protected CartService $cartService
    ) {}

    /**
     * Get cart
     */
    public function index(Request $request): JsonResponse
    {
        $sessionId = $request->session()->getId();
        $userId = $request->user()?->id;

        $cart = $this->cartService->getOrCreateCart($userId, $sessionId);

        return $this->successResponse(
            new CartResource($cart)
        );
    }

    /**
     * Add item to cart
     */
    public function addItem(Request $request): JsonResponse
    {
        $request->validate([
            'album_id' => ['required', 'string', 'exists:albums,uuid'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:99'],
        ]);

        $album = Album::where('uuid', $request->input('album_id'))->firstOrFail();

        $sessionId = $request->session()->getId();
        $userId = $request->user()?->id;

        $cart = $this->cartService->getOrCreateCart($userId, $sessionId);

        try {
            $this->cartService->addItem(
                $cart,
                $album->id,
                $request->input('quantity', 1)
            );

            $cart->refresh();

            return $this->successResponse(
                new CartResource($cart),
                'Item added to cart'
            );
        } catch (InsufficientStockException $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * Update cart item quantity
     */
    public function updateItem(Request $request, string $albumId): JsonResponse
    {
        $request->validate([
            'quantity' => ['required', 'integer', 'min:0', 'max:99'],
        ]);

        $album = Album::where('uuid', $albumId)->firstOrFail();

        $sessionId = $request->session()->getId();
        $userId = $request->user()?->id;

        $cart = $this->cartService->getOrCreateCart($userId, $sessionId);

        try {
            $this->cartService->updateItemQuantity(
                $cart,
                $album->id,
                $request->input('quantity')
            );

            $cart->refresh();

            return $this->successResponse(
                new CartResource($cart),
                'Cart updated'
            );
        } catch (InsufficientStockException $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * Remove item from cart
     */
    public function removeItem(Request $request, string $albumId): JsonResponse
    {
        $album = Album::where('uuid', $albumId)->firstOrFail();

        $sessionId = $request->session()->getId();
        $userId = $request->user()?->id;

        $cart = $this->cartService->getOrCreateCart($userId, $sessionId);
        $this->cartService->removeItem($cart, $album->id);

        $cart->refresh();

        return $this->successResponse(
            new CartResource($cart),
            'Item removed from cart'
        );
    }

    /**
     * Clear cart
     */
    public function clear(Request $request): JsonResponse
    {
        $sessionId = $request->session()->getId();
        $userId = $request->user()?->id;

        $cart = $this->cartService->getOrCreateCart($userId, $sessionId);
        $this->cartService->clearCart($cart);

        $cart->refresh();

        return $this->successResponse(
            new CartResource($cart),
            'Cart cleared'
        );
    }

    /**
     * Apply coupon
     */
    public function applyCoupon(Request $request): JsonResponse
    {
        $request->validate([
            'code' => ['required', 'string'],
        ]);

        $sessionId = $request->session()->getId();
        $userId = $request->user()?->id;

        $cart = $this->cartService->getOrCreateCart($userId, $sessionId);

        try {
            $this->cartService->applyCoupon($cart, $request->input('code'));
            $cart->refresh();

            return $this->successResponse(
                new CartResource($cart),
                'Coupon applied successfully'
            );
        } catch (InvalidCouponException $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * Remove coupon
     */
    public function removeCoupon(Request $request): JsonResponse
    {
        $sessionId = $request->session()->getId();
        $userId = $request->user()?->id;

        $cart = $this->cartService->getOrCreateCart($userId, $sessionId);
        $this->cartService->removeCoupon($cart);

        $cart->refresh();

        return $this->successResponse(
            new CartResource($cart),
            'Coupon removed'
        );
    }
}
