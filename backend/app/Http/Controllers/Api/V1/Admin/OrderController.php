<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use ApiResponses;

    public function __construct(
        protected OrderService $orderService
    ) {}

    /**
     * Get all orders with filtering
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'status' => ['nullable', 'in:pending,processing,shipped,delivered,cancelled,refunded'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date'],
            'min_total' => ['nullable', 'numeric', 'min:0'],
            'max_total' => ['nullable', 'numeric', 'min:0'],
            'search' => ['nullable', 'string'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = Order::with(['user', 'items.album', 'payment']);

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }

        if ($request->filled('min_total')) {
            $query->where('total', '>=', $request->input('min_total'));
        }

        if ($request->filled('max_total')) {
            $query->where('total', '<=', $request->input('max_total'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $perPage = min($request->input('per_page', 20), 100);
        $orders = $query->latest()->paginate($perPage);

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
     * Update order status
     */
    public function updateStatus(Request $request, string $orderUuid): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,processing,shipped,delivered,cancelled,refunded'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $order = Order::where('uuid', $orderUuid)->firstOrFail();

        try {
            $status = OrderStatus::from($validated['status']);
            $updatedOrder = $this->orderService->updateOrderStatus($order, $status);

            return $this->successResponse(
                new OrderResource($updatedOrder),
                'Order status updated successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * Get order statistics
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'by_status' => Order::selectRaw('status, COUNT(*) as count, SUM(total) as total')
                ->groupBy('status')
                ->get()
                ->map(fn($stat) => [
                    'status' => $stat->status->value,
                    'count' => $stat->count,
                    'total' => $stat->total,
                ]),

            'recent_trends' => [
                'today' => Order::whereDate('created_at', today())->count(),
                'yesterday' => Order::whereDate('created_at', today()->subDay())->count(),
                'this_week' => Order::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
                'last_week' => Order::whereBetween('created_at', [
                    now()->subWeek()->startOfWeek(),
                    now()->subWeek()->endOfWeek(),
                ])->count(),
                'this_month' => Order::whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->count(),
                'last_month' => Order::whereMonth('created_at', now()->subMonth()->month)
                    ->whereYear('created_at', now()->subMonth()->year)
                    ->count(),
            ],

            'revenue_trends' => [
                'today' => Order::whereDate('created_at', today())
                    ->whereNotIn('status', [OrderStatus::CANCELLED, OrderStatus::REFUNDED])
                    ->sum('total'),
                'this_week' => Order::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
                    ->whereNotIn('status', [OrderStatus::CANCELLED, OrderStatus::REFUNDED])
                    ->sum('total'),
                'this_month' => Order::whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->whereNotIn('status', [OrderStatus::CANCELLED, OrderStatus::REFUNDED])
                    ->sum('total'),
            ],
        ];

        return $this->successResponse($stats);
    }
}
