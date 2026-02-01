<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Find user by email
     */
    public function findByEmail(string $email): ?Model;

    /**
     * Get user with addresses
     */
    public function getWithAddresses(int $userId): ?Model;

    /**
     * Get users by role
     */
    public function getByRole(string $role, int $perPage = 15): LengthAwarePaginator;

    /**
     * Search users
     */
    public function search(string $query, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get users with filters (for admin)
     */
    public function getWithFilters(array $filters, int $perPage = 15): LengthAwarePaginator;

    /**
     * Update password
     */
    public function updatePassword(int $userId, string $hashedPassword): bool;
}
