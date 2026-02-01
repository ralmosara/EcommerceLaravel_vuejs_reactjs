<?php

use App\Http\Controllers\Api\V1\Admin\AlbumController as AdminAlbumController;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\InventoryController as AdminInventoryController;
use App\Http\Controllers\Api\V1\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\V1\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\V1\AddressController;
use App\Http\Controllers\Api\V1\AlbumController;
use App\Http\Controllers\Api\V1\ArtistController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CartController;
use App\Http\Controllers\Api\V1\GenreController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\SearchController;
use App\Http\Controllers\Api\V1\StripeWebhookController;
use App\Http\Controllers\Api\V1\WishlistController;
use App\Http\Middleware\ForceJsonResponse;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->middleware([ForceJsonResponse::class])->group(function () {
    // Stripe Webhook (no auth required, signature verified in controller)
    Route::post('webhooks/stripe', [StripeWebhookController::class, 'handle'])->withoutMiddleware([ForceJsonResponse::class]);

    // Public routes
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
    });

    // Search routes
    Route::prefix('search')->group(function () {
        Route::get('/', [SearchController::class, 'search']);
        Route::get('artists', [SearchController::class, 'searchArtists']);
        Route::get('albums', [SearchController::class, 'searchAlbums']);
        Route::get('suggestions', [SearchController::class, 'suggestions']);
    });

    // Public artist routes
    Route::get('artists', [ArtistController::class, 'index']);
    Route::get('artists/{slug}', [ArtistController::class, 'show']);

    // Public genre routes
    Route::get('genres', [GenreController::class, 'index']);
    Route::get('genres/{slug}', [GenreController::class, 'show']);

    // Public album routes
    Route::get('albums', [AlbumController::class, 'index']);
    Route::get('albums/featured', [AlbumController::class, 'featured']);
    Route::get('albums/on-sale', [AlbumController::class, 'onSale']);
    Route::get('albums/new-releases', [AlbumController::class, 'newReleases']);
    Route::get('albums/{slug}', [AlbumController::class, 'show']);

    // Public review routes
    Route::get('albums/{slug}/reviews', [ReviewController::class, 'index']);

    // Cart routes (accessible to both guests and authenticated users)
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('items', [CartController::class, 'addItem']);
        Route::put('items/{albumId}', [CartController::class, 'updateItem']);
        Route::delete('items/{albumId}', [CartController::class, 'removeItem']);
        Route::delete('/', [CartController::class, 'clear']);
        Route::post('coupon', [CartController::class, 'applyCoupon']);
        Route::delete('coupon', [CartController::class, 'removeCoupon']);
    });

    // Protected routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        // Auth routes
        Route::prefix('auth')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
            Route::put('me', [AuthController::class, 'updateProfile']);
            Route::post('change-password', [AuthController::class, 'changePassword']);
        });

        // Address routes
        Route::prefix('addresses')->group(function () {
            Route::get('/', [AddressController::class, 'index']);
            Route::post('/', [AddressController::class, 'store']);
            Route::get('{addressId}', [AddressController::class, 'show']);
            Route::put('{addressId}', [AddressController::class, 'update']);
            Route::delete('{addressId}', [AddressController::class, 'destroy']);
            Route::post('{addressId}/set-default', [AddressController::class, 'setDefault']);
        });

        // Admin routes
        Route::middleware('admin')->prefix('admin')->group(function () {
            // Dashboard
            Route::get('dashboard/stats', [DashboardController::class, 'stats']);
            Route::get('dashboard/activity', [DashboardController::class, 'recentActivity']);
            Route::get('dashboard/sales-chart/{period?}', [DashboardController::class, 'salesChart']);

            // Order Management
            Route::prefix('orders')->group(function () {
                Route::get('/', [AdminOrderController::class, 'index']);
                Route::put('{orderUuid}/status', [AdminOrderController::class, 'updateStatus']);
                Route::get('statistics', [AdminOrderController::class, 'statistics']);
            });

            // User Management
            Route::prefix('users')->group(function () {
                Route::get('/', [AdminUserController::class, 'index']);
                Route::get('{uuid}', [AdminUserController::class, 'show']);
                Route::put('{uuid}/role', [AdminUserController::class, 'updateRole']);
                Route::delete('{uuid}', [AdminUserController::class, 'destroy']);
                Route::get('statistics', [AdminUserController::class, 'statistics']);
            });

            // Inventory Management
            Route::prefix('inventory')->group(function () {
                Route::get('/', [AdminInventoryController::class, 'index']);
                Route::put('{albumSlug}/stock', [AdminInventoryController::class, 'updateStock']);
                Route::post('{albumSlug}/add-stock', [AdminInventoryController::class, 'addStock']);
                Route::get('low-stock', [AdminInventoryController::class, 'lowStockAlerts']);
                Route::get('out-of-stock', [AdminInventoryController::class, 'outOfStock']);
                Route::get('statistics', [AdminInventoryController::class, 'statistics']);
            });

            // Artists
            Route::post('artists', [ArtistController::class, 'store']);
            Route::put('artists/{slug}', [ArtistController::class, 'update']);
            Route::delete('artists/{slug}', [ArtistController::class, 'destroy']);

            // Genres
            Route::post('genres', [GenreController::class, 'store']);
            Route::put('genres/{slug}', [GenreController::class, 'update']);
            Route::delete('genres/{slug}', [GenreController::class, 'destroy']);

            // Album Management
            Route::prefix('albums')->group(function () {
                Route::get('/', [AdminAlbumController::class, 'index']);
                Route::post('/', [AdminAlbumController::class, 'store']);
                Route::get('statistics', [AdminAlbumController::class, 'statistics']);
                Route::get('{slug}', [AdminAlbumController::class, 'show']);
                Route::put('{slug}', [AdminAlbumController::class, 'update']);
                Route::delete('{slug}', [AdminAlbumController::class, 'destroy']);

                // Image management
                Route::post('{slug}/cover', [AdminAlbumController::class, 'uploadCover']);
                Route::delete('{slug}/cover', [AdminAlbumController::class, 'deleteCover']);

                // Bulk operations
                Route::post('bulk/update', [AdminAlbumController::class, 'bulkUpdate']);
                Route::post('bulk/delete', [AdminAlbumController::class, 'bulkDelete']);
                Route::post('bulk/toggle-featured', [AdminAlbumController::class, 'bulkToggleFeatured']);
            });
        });

        // Order routes
        Route::prefix('orders')->group(function () {
            Route::get('/', [OrderController::class, 'index']);
            Route::post('/', [OrderController::class, 'store']);
            Route::get('{uuid}', [OrderController::class, 'show']);
            Route::post('{uuid}/cancel', [OrderController::class, 'cancel']);
        });

        // Payment routes
        Route::prefix('payments')->group(function () {
            Route::post('create-intent', [PaymentController::class, 'createIntent']);
            Route::get('orders/{orderUuid}', [PaymentController::class, 'show']);
        });

        // Review routes
        Route::get('reviews', [ReviewController::class, 'myReviews']);
        Route::post('albums/{slug}/reviews', [ReviewController::class, 'store']);
        Route::put('albums/{slug}/reviews', [ReviewController::class, 'update']);
        Route::delete('albums/{slug}/reviews', [ReviewController::class, 'destroy']);

        // Wishlist routes
        Route::prefix('wishlist')->group(function () {
            Route::get('/', [WishlistController::class, 'index']);
            Route::post('/', [WishlistController::class, 'store']);
            Route::delete('{albumSlug}', [WishlistController::class, 'destroy']);
            Route::delete('/', [WishlistController::class, 'clear']);
            Route::get('check/{albumSlug}', [WishlistController::class, 'check']);
        });

        // More protected routes will be added here
    });
});
