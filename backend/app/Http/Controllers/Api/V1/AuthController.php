<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Services\CustomerService;
use App\Services\CartService;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    use ApiResponses;

    public function __construct(
        protected CustomerService $customerService,
        protected CartService $cartService
    ) {}

    /**
     * Register a new user
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => UserRole::CUSTOMER,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->createdResponse([
            'user' => new UserResource($user),
            'token' => $token,
            'token_type' => 'Bearer',
        ], 'Registration successful');
    }

    /**
     * Login a user
     */
    public function login(LoginRequest $request): JsonResponse
    {
        // Get session ID before login for cart migration
        $sessionId = $request->session()->getId();

        if (!Auth::attempt($request->only('email', 'password'))) {
            return $this->errorResponse('Invalid credentials', 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        // Migrate guest cart to user
        $this->cartService->migrateGuestCart($sessionId, $user->id);

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'user' => new UserResource($user),
            'token' => $token,
            'token_type' => 'Bearer',
        ], 'Login successful');
    }

    /**
     * Logout the authenticated user
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse(null, 'Logged out successfully');
    }

    /**
     * Get the authenticated user's profile
     */
    public function me(Request $request): JsonResponse
    {
        return $this->successResponse(
            new UserResource($request->user()),
            'Profile retrieved successfully'
        );
    }

    /**
     * Update the authenticated user's profile
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        $user->update($request->validated());

        return $this->successResponse(
            new UserResource($user->fresh()),
            'Profile updated successfully'
        );
    }

    /**
     * Change the authenticated user's password
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $result = $this->customerService->changePassword(
            $request->user()->id,
            $request->current_password,
            $request->password
        );

        if (!$result) {
            return $this->errorResponse('Current password is incorrect', 422);
        }

        return $this->successResponse(null, 'Password changed successfully');
    }
}
