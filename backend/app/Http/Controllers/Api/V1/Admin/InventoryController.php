<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\InventoryResource;
use App\Models\Album;
use App\Models\Inventory;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    use ApiResponses;

    /**
     * Get all inventory with filtering
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'low_stock' => ['nullable', 'boolean'],
            'out_of_stock' => ['nullable', 'boolean'],
            'search' => ['nullable', 'string'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = Inventory::with(['album.artist']);

        // Apply filters
        if ($request->boolean('low_stock')) {
            $query->whereRaw('quantity <= low_stock_threshold')
                ->where('quantity', '>', 0);
        }

        if ($request->boolean('out_of_stock')) {
            $query->where('quantity', 0);
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('sku', 'like', "%{$search}%")
                    ->orWhereHas('album', function ($q) use ($search) {
                        $q->where('title', 'like', "%{$search}%")
                            ->orWhereHas('artist', function ($q) use ($search) {
                                $q->where('name', 'like', "%{$search}%");
                            });
                    });
            });
        }

        $perPage = min($request->input('per_page', 20), 100);
        $inventory = $query->latest()->paginate($perPage);

        return $this->successResponse([
            'data' => InventoryResource::collection($inventory->items()),
            'current_page' => $inventory->currentPage(),
            'from' => $inventory->firstItem(),
            'to' => $inventory->lastItem(),
            'per_page' => $inventory->perPage(),
            'total' => $inventory->total(),
            'last_page' => $inventory->lastPage(),
        ]);
    }

    /**
     * Update inventory stock
     */
    public function updateStock(Request $request, string $albumSlug): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:0'],
            'low_stock_threshold' => ['nullable', 'integer', 'min:0'],
        ]);

        $album = Album::where('slug', $albumSlug)->firstOrFail();
        $inventory = Inventory::where('album_id', $album->id)->firstOrFail();

        $inventory->update([
            'quantity' => $validated['quantity'],
            'low_stock_threshold' => $validated['low_stock_threshold'] ?? $inventory->low_stock_threshold,
        ]);

        return $this->successResponse(
            new InventoryResource($inventory->load('album.artist')),
            'Inventory updated successfully'
        );
    }

    /**
     * Add stock to inventory
     */
    public function addStock(Request $request, string $albumSlug): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $album = Album::where('slug', $albumSlug)->firstOrFail();
        $inventory = Inventory::where('album_id', $album->id)->firstOrFail();

        $inventory->addStock($validated['quantity']);

        return $this->successResponse(
            new InventoryResource($inventory->load('album.artist')),
            'Stock added successfully'
        );
    }

    /**
     * Get low stock alerts
     */
    public function lowStockAlerts(): JsonResponse
    {
        $lowStock = Inventory::with(['album.artist'])
            ->whereRaw('quantity <= low_stock_threshold')
            ->where('quantity', '>', 0)
            ->orderBy('quantity')
            ->get();

        return $this->successResponse([
            'alerts' => InventoryResource::collection($lowStock),
            'count' => $lowStock->count(),
        ]);
    }

    /**
     * Get out of stock items
     */
    public function outOfStock(): JsonResponse
    {
        $outOfStock = Inventory::with(['album.artist'])
            ->where('quantity', 0)
            ->get();

        return $this->successResponse([
            'items' => InventoryResource::collection($outOfStock),
            'count' => $outOfStock->count(),
        ]);
    }

    /**
     * Get inventory statistics
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total_items' => Inventory::sum('quantity'),
            'total_reserved' => Inventory::sum('reserved_quantity'),
            'total_available' => Inventory::selectRaw('SUM(quantity - reserved_quantity) as available')->value('available'),
            'low_stock_count' => Inventory::whereRaw('quantity <= low_stock_threshold')
                ->where('quantity', '>', 0)
                ->count(),
            'out_of_stock_count' => Inventory::where('quantity', 0)->count(),
            'by_format' => Album::join('inventories', 'albums.id', '=', 'inventories.album_id')
                ->selectRaw('albums.format, SUM(inventories.quantity) as total_quantity')
                ->groupBy('albums.format')
                ->get()
                ->map(fn($stat) => [
                    'format' => $stat->format->value,
                    'quantity' => $stat->total_quantity,
                ]),
        ];

        return $this->successResponse($stats);
    }
}
