<?php

namespace App\Services;

use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Contracts\AddressRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    public function __construct(
        protected UserRepositoryInterface $userRepository,
        protected AddressRepositoryInterface $addressRepository
    ) {}

    /**
     * Get customer profile with addresses
     */
    public function getProfile(int $userId): ?Model
    {
        return $this->userRepository->getWithAddresses($userId);
    }

    /**
     * Update customer profile
     */
    public function updateProfile(int $userId, array $data): Model
    {
        return $this->userRepository->update($userId, $data);
    }

    /**
     * Change customer password
     */
    public function changePassword(int $userId, string $currentPassword, string $newPassword): bool
    {
        $user = $this->userRepository->find($userId);

        if (!$user || !Hash::check($currentPassword, $user->password)) {
            return false;
        }

        return $this->userRepository->updatePassword($userId, Hash::make($newPassword));
    }

    /**
     * Get all addresses for a customer
     */
    public function getAddresses(int $userId): Collection
    {
        return $this->addressRepository->getByUserId($userId);
    }

    /**
     * Create a new address for a customer
     */
    public function createAddress(int $userId, array $data): Model
    {
        $data['user_id'] = $userId;

        return DB::transaction(function () use ($userId, $data) {
            // Handle default shipping flag
            if (!empty($data['is_default_shipping'])) {
                $this->addressRepository->clearDefaultShipping($userId);
            }

            // Handle default billing flag
            if (!empty($data['is_default_billing'])) {
                $this->addressRepository->clearDefaultBilling($userId);
            }

            // If this is the first address, make it default
            $existingAddresses = $this->addressRepository->getByUserId($userId);
            if ($existingAddresses->isEmpty()) {
                $data['is_default_shipping'] = true;
                $data['is_default_billing'] = true;
            }

            return $this->addressRepository->create($data);
        });
    }

    /**
     * Update an address
     */
    public function updateAddress(int $userId, int $addressId, array $data): ?Model
    {
        if (!$this->addressRepository->belongsToUser($addressId, $userId)) {
            return null;
        }

        return DB::transaction(function () use ($userId, $addressId, $data) {
            // Handle default shipping flag
            if (!empty($data['is_default_shipping'])) {
                $this->addressRepository->clearDefaultShipping($userId, $addressId);
            }

            // Handle default billing flag
            if (!empty($data['is_default_billing'])) {
                $this->addressRepository->clearDefaultBilling($userId, $addressId);
            }

            return $this->addressRepository->update($addressId, $data);
        });
    }

    /**
     * Delete an address
     */
    public function deleteAddress(int $userId, int $addressId): bool
    {
        if (!$this->addressRepository->belongsToUser($addressId, $userId)) {
            return false;
        }

        $address = $this->addressRepository->find($addressId);
        $wasDefaultShipping = $address->is_default_shipping;
        $wasDefaultBilling = $address->is_default_billing;

        $deleted = $this->addressRepository->delete($addressId);

        // If deleted address was default, set another one as default
        if ($deleted) {
            $remainingAddresses = $this->addressRepository->getByUserId($userId);
            if ($remainingAddresses->isNotEmpty()) {
                $firstAddress = $remainingAddresses->first();
                if ($wasDefaultShipping && !$this->addressRepository->getDefaultShipping($userId)) {
                    $this->addressRepository->setDefaultShipping($userId, $firstAddress->id);
                }
                if ($wasDefaultBilling && !$this->addressRepository->getDefaultBilling($userId)) {
                    $this->addressRepository->setDefaultBilling($userId, $firstAddress->id);
                }
            }
        }

        return $deleted;
    }

    /**
     * Set an address as default shipping
     */
    public function setDefaultShippingAddress(int $userId, int $addressId): bool
    {
        if (!$this->addressRepository->belongsToUser($addressId, $userId)) {
            return false;
        }

        return $this->addressRepository->setDefaultShipping($userId, $addressId);
    }

    /**
     * Set an address as default billing
     */
    public function setDefaultBillingAddress(int $userId, int $addressId): bool
    {
        if (!$this->addressRepository->belongsToUser($addressId, $userId)) {
            return false;
        }

        return $this->addressRepository->setDefaultBilling($userId, $addressId);
    }

    /**
     * Get a specific address for a customer
     */
    public function getAddress(int $userId, int $addressId): ?Model
    {
        if (!$this->addressRepository->belongsToUser($addressId, $userId)) {
            return null;
        }

        return $this->addressRepository->find($addressId);
    }
}
