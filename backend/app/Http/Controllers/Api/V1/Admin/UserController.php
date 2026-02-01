<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    use ApiResponses;

    /**
     * Get all users with filtering
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'role' => ['nullable', 'in:admin,customer'],
            'search' => ['nullable', 'string'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = User::query();

        // Apply filters
        if ($request->filled('role')) {
            $query->where('role', $request->input('role'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $perPage = min($request->input('per_page', 20), 100);
        $users = $query->latest()->paginate($perPage);

        return $this->successResponse([
            'data' => UserResource::collection($users->items()),
            'current_page' => $users->currentPage(),
            'from' => $users->firstItem(),
            'to' => $users->lastItem(),
            'per_page' => $users->perPage(),
            'total' => $users->total(),
            'last_page' => $users->lastPage(),
        ]);
    }

    /**
     * Get a specific user
     */
    public function show(string $uuid): JsonResponse
    {
        $user = User::where('uuid', $uuid)
            ->with(['orders', 'reviews', 'addresses'])
            ->firstOrFail();

        return $this->successResponse([
            'user' => new UserResource($user),
            'stats' => [
                'total_orders' => $user->orders()->count(),
                'total_spent' => $user->orders()->sum('total'),
                'total_reviews' => $user->reviews()->count(),
                'average_rating_given' => $user->reviews()->avg('rating'),
                'member_since' => $user->created_at->diffForHumans(),
            ],
        ]);
    }

    /**
     * Update user role
     */
    public function updateRole(Request $request, string $uuid): JsonResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'in:admin,customer'],
        ]);

        $user = User::where('uuid', $uuid)->firstOrFail();

        // Prevent users from removing their own admin role
        if ($user->id === $request->user()->id && $validated['role'] !== 'admin') {
            return $this->errorResponse('You cannot remove your own admin role', 403);
        }

        $user->update([
            'role' => UserRole::from($validated['role']),
        ]);

        return $this->successResponse(
            new UserResource($user),
            'User role updated successfully'
        );
    }

    /**
     * Delete user
     */
    public function destroy(string $uuid): JsonResponse
    {
        $user = User::where('uuid', $uuid)->firstOrFail();

        // Prevent users from deleting themselves
        if ($user->id === auth()->id()) {
            return $this->errorResponse('You cannot delete your own account', 403);
        }

        // Soft delete
        $user->delete();

        return $this->successResponse(null, 'User deleted successfully');
    }

    /**
     * Get user statistics
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total_users' => User::count(),
            'by_role' => [
                'customers' => User::where('role', UserRole::CUSTOMER)->count(),
                'admins' => User::where('role', UserRole::ADMIN)->count(),
            ],
            'recent_signups' => [
                'today' => User::whereDate('created_at', today())->count(),
                'this_week' => User::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
                'this_month' => User::whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->count(),
            ],
            'top_customers' => User::where('role', UserRole::CUSTOMER)
                ->withCount('orders')
                ->withSum('orders', 'total')
                ->orderByDesc('orders_sum_total')
                ->limit(10)
                ->get()
                ->map(fn($user) => [
                    'uuid' => $user->uuid,
                    'name' => $user->name,
                    'email' => $user->email,
                    'total_orders' => $user->orders_count,
                    'total_spent' => $user->orders_sum_total,
                ]),
        ];

        return $this->successResponse($stats);
    }
}
