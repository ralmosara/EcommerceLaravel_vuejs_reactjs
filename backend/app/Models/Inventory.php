<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'album_id',
        'sku',
        'quantity',
        'reserved_quantity',
        'low_stock_threshold',
    ];

    protected $hidden = [
        'id',
        'album_id',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'reserved_quantity' => 'integer',
            'low_stock_threshold' => 'integer',
        ];
    }

    /**
     * Get available quantity (total - reserved)
     */
    public function getAvailableQuantity(): int
    {
        return max(0, $this->quantity - $this->reserved_quantity);
    }

    /**
     * Check if item is in stock
     */
    public function isInStock(): bool
    {
        return $this->getAvailableQuantity() > 0;
    }

    /**
     * Check if stock is low
     */
    public function isLowStock(): bool
    {
        return $this->quantity > 0 && $this->quantity <= $this->low_stock_threshold;
    }

    /**
     * Check if quantity is available
     */
    public function hasAvailableQuantity(int $quantity): bool
    {
        return $this->getAvailableQuantity() >= $quantity;
    }

    /**
     * Reserve quantity for an order
     */
    public function reserve(int $quantity): bool
    {
        if (!$this->hasAvailableQuantity($quantity)) {
            return false;
        }

        $this->reserved_quantity += $quantity;
        return $this->save();
    }

    /**
     * Release reserved quantity
     */
    public function release(int $quantity): bool
    {
        $this->reserved_quantity = max(0, $this->reserved_quantity - $quantity);
        return $this->save();
    }

    /**
     * Deduct quantity (when order is fulfilled)
     */
    public function deduct(int $quantity): bool
    {
        if ($this->quantity < $quantity) {
            return false;
        }

        $this->quantity -= $quantity;
        $this->reserved_quantity = max(0, $this->reserved_quantity - $quantity);
        return $this->save();
    }

    /**
     * Add stock
     */
    public function addStock(int $quantity): bool
    {
        $this->quantity += $quantity;
        return $this->save();
    }

    /**
     * Relationships
     */
    public function album()
    {
        return $this->belongsTo(Album::class);
    }
}
