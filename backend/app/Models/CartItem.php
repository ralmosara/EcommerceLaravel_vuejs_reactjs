<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_id',
        'album_id',
        'quantity',
        'unit_price',
    ];

    protected $hidden = [
        'id',
        'cart_id',
        'album_id',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'decimal:2',
        ];
    }

    /**
     * Get line total (quantity * unit_price)
     */
    public function getLineTotal(): float
    {
        return $this->quantity * (float) $this->unit_price;
    }

    /**
     * Relationships
     */
    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function album()
    {
        return $this->belongsTo(Album::class);
    }
}
