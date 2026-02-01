<?php

namespace App\Repositories\Eloquent;

use App\Models\Address;
use App\Repositories\Contracts\AddressRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class AddressRepository extends BaseRepository implements AddressRepositoryInterface
{
    public function __construct(Address $model)
    {
        parent::__construct($model);
    }

    public function getByUserId(int $userId): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->orderBy('is_default_shipping', 'desc')
            ->orderBy('is_default_billing', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getDefaultShipping(int $userId): ?Model
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('is_default_shipping', true)
            ->first();
    }

    public function getDefaultBilling(int $userId): ?Model
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('is_default_billing', true)
            ->first();
    }

    public function setDefaultShipping(int $userId, int $addressId): bool
    {
        $this->clearDefaultShipping($userId, $addressId);

        return $this->model
            ->where('id', $addressId)
            ->where('user_id', $userId)
            ->update(['is_default_shipping' => true]);
    }

    public function setDefaultBilling(int $userId, int $addressId): bool
    {
        $this->clearDefaultBilling($userId, $addressId);

        return $this->model
            ->where('id', $addressId)
            ->where('user_id', $userId)
            ->update(['is_default_billing' => true]);
    }

    public function clearDefaultShipping(int $userId, ?int $exceptAddressId = null): void
    {
        $query = $this->model
            ->where('user_id', $userId)
            ->where('is_default_shipping', true);

        if ($exceptAddressId) {
            $query->where('id', '!=', $exceptAddressId);
        }

        $query->update(['is_default_shipping' => false]);
    }

    public function clearDefaultBilling(int $userId, ?int $exceptAddressId = null): void
    {
        $query = $this->model
            ->where('user_id', $userId)
            ->where('is_default_billing', true);

        if ($exceptAddressId) {
            $query->where('id', '!=', $exceptAddressId);
        }

        $query->update(['is_default_billing' => false]);
    }

    public function belongsToUser(int $addressId, int $userId): bool
    {
        return $this->model
            ->where('id', $addressId)
            ->where('user_id', $userId)
            ->exists();
    }
}
