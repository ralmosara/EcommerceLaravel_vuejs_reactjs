<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface AddressRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get addresses for a specific user
     */
    public function getByUserId(int $userId): Collection;

    /**
     * Get default shipping address for a user
     */
    public function getDefaultShipping(int $userId): ?Model;

    /**
     * Get default billing address for a user
     */
    public function getDefaultBilling(int $userId): ?Model;

    /**
     * Set address as default shipping
     */
    public function setDefaultShipping(int $userId, int $addressId): bool;

    /**
     * Set address as default billing
     */
    public function setDefaultBilling(int $userId, int $addressId): bool;

    /**
     * Clear default shipping for user (except specified address)
     */
    public function clearDefaultShipping(int $userId, ?int $exceptAddressId = null): void;

    /**
     * Clear default billing for user (except specified address)
     */
    public function clearDefaultBilling(int $userId, ?int $exceptAddressId = null): void;

    /**
     * Check if address belongs to user
     */
    public function belongsToUser(int $addressId, int $userId): bool;
}
