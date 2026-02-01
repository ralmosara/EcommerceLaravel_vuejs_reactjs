<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Artist;
use App\Models\Inventory;
use App\Models\Order;
use App\Models\Review;
use App\Models\User;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    use ApiResponses;

    /**
     * Get dashboard statistics
     */
    public function stats(): JsonResponse
    {
        // Get best selling albums with full album data
        $bestSellers = DB::table('order_items')
            ->join('albums', 'order_items.album_id', '=', 'albums.id')
            ->select(
                'albums.id',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.quantity * order_items.unit_price) as total_revenue')
            )
            ->groupBy('albums.id')
            ->orderByDesc('total_quantity')
            ->limit(10)
            ->get();

        $bestSellingAlbums = $bestSellers->map(function ($item) {
            $album = Album::with('artist')->find($item->id);
            return [
                'album' => $album ? [
                    'uuid' => $album->uuid,
                    'title' => $album->title,
                    'slug' => $album->slug,
                    'cover_image' => $album->cover_image_url,
                    'artist' => $album->artist ? [
                        'uuid' => $album->artist->uuid,
                        'name' => $album->artist->name,
                    ] : null,
                ] : null,
                'total_quantity' => (int) $item->total_quantity,
                'total_revenue' => (float) $item->total_revenue,
            ];
        });

        $stats = [
            'total_sales' => (float) Order::whereNotIn('status', [OrderStatus::CANCELLED, OrderStatus::REFUNDED])
                ->sum('total'),
            'total_orders' => Order::count(),
            'total_users' => User::where('role', 'customer')->count(),
            'total_albums' => Album::count(),
            'total_reviews' => Review::count(),
            'average_rating' => (float) (Review::avg('rating') ?? 0),
            'low_stock_count' => Inventory::whereRaw('quantity <= low_stock_threshold')
                ->where('quantity', '>', 0)
                ->count(),
            'out_of_stock_count' => Inventory::where('quantity', 0)->count(),
            'pending_orders_count' => Order::where('status', OrderStatus::PENDING)->count(),
            'revenue_today' => (float) Order::whereDate('created_at', today())
                ->whereNotIn('status', [OrderStatus::CANCELLED, OrderStatus::REFUNDED])
                ->sum('total'),
            'revenue_this_month' => (float) Order::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->whereNotIn('status', [OrderStatus::CANCELLED, OrderStatus::REFUNDED])
                ->sum('total'),
            'revenue_this_year' => (float) Order::whereYear('created_at', now()->year)
                ->whereNotIn('status', [OrderStatus::CANCELLED, OrderStatus::REFUNDED])
                ->sum('total'),
            'best_selling_albums' => $bestSellingAlbums,
        ];

        return $this->successResponse($stats);
    }

    /**
     * Get recent activity
     */
    public function recentActivity(): JsonResponse
    {
        $activity = [
            'recent_orders' => Order::with('user')
                ->latest()
                ->limit(10)
                ->get()
                ->map(fn($order) => [
                    'uuid' => $order->uuid,
                    'order_number' => $order->order_number,
                    'customer' => $order->user->name,
                    'total' => $order->total,
                    'status' => $order->status->value,
                    'created_at' => $order->created_at->toIso8601String(),
                ]),

            'recent_reviews' => Review::with(['user', 'album.artist'])
                ->latest()
                ->limit(10)
                ->get()
                ->map(fn($review) => [
                    'id' => $review->id,
                    'customer' => $review->user->name,
                    'album' => $review->album->title,
                    'artist' => $review->album->artist->name,
                    'rating' => $review->rating,
                    'title' => $review->title,
                    'created_at' => $review->created_at->toIso8601String(),
                ]),

            'recent_users' => User::where('role', 'customer')
                ->latest()
                ->limit(10)
                ->get()
                ->map(fn($user) => [
                    'uuid' => $user->uuid,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at->toIso8601String(),
                ]),
        ];

        return $this->successResponse($activity);
    }

    /**
     * Get sales chart data
     */
    public function salesChart(string $period = 'week'): JsonResponse
    {
        $startDate = match ($period) {
            'day' => now()->startOfDay(),
            'week' => now()->subDays(6)->startOfDay(),
            'month' => now()->subDays(29)->startOfDay(),
            'year' => now()->startOfYear(),
            default => now()->subDays(6)->startOfDay(),
        };

        $format = match ($period) {
            'day' => '%Y-%m-%d %H:00',
            'week' => '%Y-%m-%d',
            'month' => '%Y-%m-%d',
            'year' => '%Y-%m',
            default => '%Y-%m-%d',
        };

        $labelFormat = match ($period) {
            'day' => 'H:i',
            'week' => 'M d',
            'month' => 'M d',
            'year' => 'M Y',
            default => 'M d',
        };

        $data = Order::where('created_at', '>=', $startDate)
            ->whereNotIn('status', [OrderStatus::CANCELLED, OrderStatus::REFUNDED])
            ->selectRaw("DATE_FORMAT(created_at, '{$format}') as period, COUNT(*) as orders, SUM(total) as revenue")
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->keyBy('period');

        // Generate all labels for the period
        $labels = [];
        $sales = [];
        $revenue = [];

        $current = $startDate->copy();
        $end = now();

        while ($current <= $end) {
            $key = $current->format(match ($period) {
                'day' => 'Y-m-d H:00',
                'year' => 'Y-m',
                default => 'Y-m-d',
            });
            $label = $current->format($labelFormat);

            $labels[] = $label;
            $sales[] = isset($data[$key]) ? (int) $data[$key]->orders : 0;
            $revenue[] = isset($data[$key]) ? (float) $data[$key]->revenue : 0;

            match ($period) {
                'day' => $current->addHour(),
                'year' => $current->addMonth(),
                default => $current->addDay(),
            };
        }

        return $this->successResponse([
            'labels' => $labels,
            'sales' => $sales,
            'revenue' => $revenue,
        ]);
    }
}
